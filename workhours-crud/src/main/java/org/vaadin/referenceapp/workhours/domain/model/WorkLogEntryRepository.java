package org.vaadin.referenceapp.workhours.domain.model;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.vaadin.referenceapp.workhours.domain.base.BaseRepository;

import java.time.ZonedDateTime;

public interface WorkLogEntryRepository extends BaseRepository<WorkLogEntry, Long>, JpaSpecificationExecutor<WorkLogEntry> {

    static Specification<WorkLogEntry> withProjectId(long projectId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(WorkLogEntry_.project).get(Project_.id), projectId);
    }

    static Specification<WorkLogEntry> withContractId(long contractId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(WorkLogEntry_.contract).get(Contract_.id), contractId);
    }

    static Specification<WorkLogEntry> startingOnOrAfter(ZonedDateTime startTime) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThanOrEqualTo(root.get(WorkLogEntry_.startTime), startTime);
    }

    static Specification<WorkLogEntry> endingBefore(ZonedDateTime endTime) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.lessThan(root.get(WorkLogEntry_.endTime), endTime);
    }
}
