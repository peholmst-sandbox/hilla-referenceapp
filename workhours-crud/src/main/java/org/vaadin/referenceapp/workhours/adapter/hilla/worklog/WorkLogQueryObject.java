package org.vaadin.referenceapp.workhours.adapter.hilla.worklog;

import dev.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.vaadin.referenceapp.workhours.domain.model.WorkLogEntry;
import org.vaadin.referenceapp.workhours.domain.model.WorkLogEntryRepository;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;

@BrowserCallable
@RolesAllowed("ROLE_EMPLOYEE") // Replace with constant
class WorkLogQueryObject {

    private static final Map<String, Sort.Order> ORDERS = Map.of(
            "project.name", WorkLogEntryRepository.ORDER_BY_PROJECT_NAME,
            "contract.name", WorkLogEntryRepository.ORDER_BY_CONTRACT_NAME,
            "date", WorkLogEntryRepository.ORDER_BY_START_TIME
    );
    private static final Sort.Order DEFAULT_ORDER = WorkLogEntryRepository.ORDER_BY_START_TIME;

    private final WorkLogEntryRepository workLogEntryRepository;

    WorkLogQueryObject(WorkLogEntryRepository workLogEntryRepository) {
        this.workLogEntryRepository = workLogEntryRepository;
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
            specs.add(WorkLogEntryRepository.withProjectId(request.project().id()));
        }
        if (request.contract() != null) {
            specs.add(WorkLogEntryRepository.withContractId(request.contract().id()));
        }
        if (request.fromDate() != null) {
            specs.add(WorkLogEntryRepository.startingOnOrAfter(request.fromDate().atStartOfDay(ZoneId.systemDefault()))); // TODO Use user's time zone
        }
        if (request.toDate() != null) {
            specs.add(WorkLogEntryRepository.endingBefore(request.toDate().plusDays(1).atStartOfDay(ZoneId.systemDefault()))); // TODO Use user's time zone
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
                        Optional.ofNullable(ORDERS.get(incomingOrder.getProperty()))
                                .map(outgoingOrder -> outgoingOrder.with(incomingOrder.getDirection())).stream())
                .toList());
        if (sanitized.isEmpty()) {
            return Sort.by(DEFAULT_ORDER);
        }
        return sanitized;
    }
}
