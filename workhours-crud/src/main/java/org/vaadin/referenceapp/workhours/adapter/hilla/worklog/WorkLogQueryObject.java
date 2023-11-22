package org.vaadin.referenceapp.workhours.adapter.hilla.worklog;

import dev.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.vaadin.referenceapp.workhours.domain.model.WorkLogEntry;
import org.vaadin.referenceapp.workhours.domain.model.WorkLogEntryRepository;

import java.time.ZoneId;
import java.util.ArrayList;

@BrowserCallable
@RolesAllowed("ROLE_EMPLOYEE") // Replace with constant
class WorkLogQueryObject {

    private final WorkLogEntryRepository workLogEntryRepository;

    WorkLogQueryObject(WorkLogEntryRepository workLogEntryRepository) {
        this.workLogEntryRepository = workLogEntryRepository;
    }

    public WorkLogQueryResponse find(WorkLogQueryRequest request) {
        // TODO Validate and convert sort order
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
        return request.pageable(); // TODO Validate and convert sort order
    }
}
