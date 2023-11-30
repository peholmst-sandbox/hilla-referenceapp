package org.vaadin.referenceapp.workhours.domain.model;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.vaadin.referenceapp.workhours.domain.base.BaseRepository;
import org.vaadin.referenceapp.workhours.domain.base.OrderBuilder;
import org.vaadin.referenceapp.workhours.domain.primitives.ContractId;
import org.vaadin.referenceapp.workhours.domain.primitives.EmployeeId;
import org.vaadin.referenceapp.workhours.domain.primitives.ProjectId;
import org.vaadin.referenceapp.workhours.domain.primitives.WorkLogEntryId;

import java.time.ZonedDateTime;

public interface WorkLogEntryRepository extends BaseRepository<WorkLogEntry, WorkLogEntryId>, JpaSpecificationExecutor<WorkLogEntry> {

    Sort.Order ORDER_BY_EMPLOYEE_FIRST_NAME = OrderBuilder.of(WorkLogEntry_.employee).then(Employee_.firstName).asc();
    Sort.Order ORDER_BY_EMPLOYEE_LAST_NAME = OrderBuilder.of(WorkLogEntry_.employee).then(Employee_.lastName).asc();
    Sort.Order ORDER_BY_PROJECT_NAME = OrderBuilder.of(WorkLogEntry_.project).then(Project_.name).asc();
    Sort.Order ORDER_BY_CONTRACT_NAME = OrderBuilder.of(WorkLogEntry_.contract).then(Contract_.name).asc();
    Sort.Order ORDER_BY_START_TIME = OrderBuilder.of(WorkLogEntry_.startTime).desc();

    static Specification<WorkLogEntry> withProjectId(ProjectId projectId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(WorkLogEntry_.project).get(Project_.id), projectId);
    }

    static Specification<WorkLogEntry> withContractId(ContractId contractId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(WorkLogEntry_.contract).get(Contract_.id), contractId);
    }

    static Specification<WorkLogEntry> withEmployeeId(EmployeeId employeeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(WorkLogEntry_.employee).get(Employee_.id), employeeId);
    }

    static Specification<WorkLogEntry> startingOnOrAfter(ZonedDateTime startTime) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThanOrEqualTo(root.get(WorkLogEntry_.startTime), startTime);
    }

    static Specification<WorkLogEntry> endingBefore(ZonedDateTime endTime) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.lessThan(root.get(WorkLogEntry_.endTime), endTime);
    }
}
