package org.vaadin.referenceapp.workhours.adapter.hilla.worklog;

import dev.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.vaadin.referenceapp.workhours.domain.model.Employee;
import org.vaadin.referenceapp.workhours.domain.model.EmployeeRepository;
import org.vaadin.referenceapp.workhours.domain.model.WorkLogEntry;
import org.vaadin.referenceapp.workhours.domain.model.WorkLogEntryRepository;
import org.vaadin.referenceapp.workhours.domain.primitives.EmployeeId;
import org.vaadin.referenceapp.workhours.domain.security.CurrentUser;
import org.vaadin.referenceapp.workhours.domain.security.Roles;

import java.util.*;

@BrowserCallable
@RolesAllowed(Roles.EMPLOYEE)
class WorkLogQueryObject {

    private static final Map<String, List<Sort.Order>> ORDERS = Map.of(
            "employee.name", List.of(WorkLogEntryRepository.ORDER_BY_EMPLOYEE_FIRST_NAME,
                    WorkLogEntryRepository.ORDER_BY_EMPLOYEE_LAST_NAME),
            "project.name", List.of(WorkLogEntryRepository.ORDER_BY_PROJECT_NAME),
            "contract.name", List.of(WorkLogEntryRepository.ORDER_BY_CONTRACT_NAME),
            "date", List.of(WorkLogEntryRepository.ORDER_BY_START_TIME)
    );
    private static final Sort.Order DEFAULT_ORDER = WorkLogEntryRepository.ORDER_BY_START_TIME;

    private final WorkLogEntryRepository workLogEntryRepository;
    private final EmployeeRepository employeeRepository;
    private final CurrentUser currentUser;

    WorkLogQueryObject(WorkLogEntryRepository workLogEntryRepository,
                       EmployeeRepository employeeRepository, CurrentUser currentUser) {
        this.workLogEntryRepository = workLogEntryRepository;
        this.employeeRepository = employeeRepository;
        this.currentUser = currentUser;
    }

    public WorkLogQueryResponse find(WorkLogQueryRequest request) {
        return toResponse(workLogEntryRepository.findAll(toSpecification(request), toPageable(request)));
    }

    private WorkLogQueryResponse toResponse(Page<WorkLogEntry> page) {
        return new WorkLogQueryResponse(page.map(WorkLogQueryRecord::fromEntity).toList(), page.getTotalElements());
    }

    private Specification<WorkLogEntry> toSpecification(WorkLogQueryRequest request) {
        var specs = new ArrayList<Specification<WorkLogEntry>>();
        if (request.project() != null) {
            specs.add(WorkLogEntryRepository.withProjectId(request.project().projectId()));
        }
        if (request.contract() != null) {
            specs.add(WorkLogEntryRepository.withContractId(request.contract().contractId()));
        }
        if (request.fromDate() != null) {
            specs.add(WorkLogEntryRepository.startingOnOrAfter(request.fromDate().atStartOfDay(currentUser.timeZone())));
        }
        if (request.toDate() != null) {
            specs.add(WorkLogEntryRepository.endingBefore(request.toDate().plusDays(1).atStartOfDay(currentUser.timeZone())));
        }
        if (currentUser.hasRole(Roles.MANAGER)) {
            if (request.employee() != null) {
                specs.add(WorkLogEntryRepository.withEmployeeId(request.employee().employeeId()));
            }
        } else {
            specs.add(WorkLogEntryRepository.withEmployeeId(employeeRepository.findByUser(currentUser.id()).map(Employee::nullSafeId).orElse(EmployeeId.NONE)));
        }
        return Specification.allOf(specs);
    }

    private Pageable toPageable(WorkLogQueryRequest request) {
        return PageRequest
                .of(request.pageable().getPageNumber(), request.pageable().getPageSize())
                .withSort(sanitizeSort(request.pageable().getSort()));
    }

    private Sort sanitizeSort(Sort sort) {
        var sanitized = Sort.by(sort
                .flatMap(incomingOrder ->
                        Optional.ofNullable(ORDERS.get(incomingOrder.getProperty())).orElse(Collections.emptyList())
                                .stream()
                                .map(outgoingOrder -> outgoingOrder.with(incomingOrder.getDirection())))
                .toList());
        if (sanitized.isEmpty()) {
            return Sort.by(DEFAULT_ORDER);
        }
        return sanitized;
    }
}
