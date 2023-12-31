package org.vaadin.referenceapp.workhours.adapter.hilla.worklog;


import dev.hilla.Nullable;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ContractReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.EmployeeReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.HourCategoryReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ProjectReference;
import org.vaadin.referenceapp.workhours.domain.base.LookupFunction;
import org.vaadin.referenceapp.workhours.domain.model.*;
import org.vaadin.referenceapp.workhours.domain.primitives.*;

import java.time.*;
import java.util.Optional;

import static java.util.Objects.requireNonNull;

// TODO Is there a smarter way to handle the annotations here?

// I have to mark all the fields here as @Nullable because otherwise the form will not work as expected
// on the client side. The fields are actually required, but I'm dealing with the validation manually both
// on the client and the server side.
public record WorkLogEntryFormDTO(
        @Nullable Long id,
        @Nullable ProjectReference project,
        @Nullable ContractReference contract,
        @Nullable EmployeeReference employee,
        @Nullable LocalDate date,
        @Nullable LocalTime startTime,
        @Nullable LocalTime endTime,
        @Nullable String description,
        @Nullable HourCategoryReference hourCategory,
        @Nullable String createdBy,
        @Nullable Instant createdOn,
        @Nullable String modifiedBy,
        @Nullable Instant modifiedOn
) {

    static WorkLogEntryFormDTO fromEntity(WorkLogEntry entity) {
        return new WorkLogEntryFormDTO(
                entity.nullSafeId().toLong(),
                ProjectReference.fromEntity(entity.getProject()),
                ContractReference.fromEntity(entity.getContract()),
                EmployeeReference.fromEntity(entity.getEmployee()),
                entity.getStartTime().toLocalDate(),
                entity.getStartTime().toLocalTime(),
                entity.getEndTime().toLocalTime(),
                entity.getDescription(),
                HourCategoryReference.fromEntity(entity.getHourCategory()),
                entity.getCreatedBy().map(UserId::toString).orElse(null),
                entity.getCreatedOn().orElse(null),
                entity.getModifiedBy().map(UserId::toString).orElse(null),
                entity.getModifiedOn().orElse(null)
        );
    }

    public WorkLogEntry toEntity(LookupFunction<WorkLogEntryId, WorkLogEntry> workLogEntryLookup,
                                 LookupFunction<ProjectId, Project> projectLookup,
                                 LookupFunction<ContractId, Contract> contractLookup,
                                 LookupFunction<HourCategoryId, HourCategory> hourCategoryLookup,
                                 LookupFunction<EmployeeId, Employee> employeeLookup) {
        requireNonNull(project(), "Project is required");
        requireNonNull(contract(), "Contract is required");
        requireNonNull(hourCategory(), "Hour category is required");
        requireNonNull(employee(), "Employee is required");
        requireNonNull(date(), "Date is required");
        requireNonNull(startTime(), "Start time is required");
        requireNonNull(endTime(), "End time is required");

        var entity = Optional.ofNullable(id()).map(WorkLogEntryId::fromLong).flatMap(workLogEntryLookup::findById).orElseGet(WorkLogEntry::new);

        var startTime = ZonedDateTime.of(date(), startTime(), ZoneId.systemDefault()); // TODO Use user's time zone
        var endTime = endTime().isBefore(startTime())
                ? ZonedDateTime.of(date().plusDays(1), endTime(), ZoneId.systemDefault())
                : ZonedDateTime.of(date(), endTime(), ZoneId.systemDefault());

        entity.setProject(projectLookup.getById(project().projectId()));
        entity.setContract(contractLookup.getById(contract().contractId()));
        entity.setHourCategory(hourCategoryLookup.getById(hourCategory().hourCategoryId()));
        entity.setEmployee(employeeLookup.getById(employee().employeeId()));
        entity.setStartTime(startTime);
        entity.setEndTime(endTime);
        entity.setDescription(description());
        return entity;
    }
}
