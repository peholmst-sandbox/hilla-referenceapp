package org.vaadin.referenceapp.workhours.adapter.hilla.worklog;


import dev.hilla.Nullable;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ContractReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.HourCategoryReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ProjectReference;
import org.vaadin.referenceapp.workhours.domain.base.LookupFunction;
import org.vaadin.referenceapp.workhours.domain.model.Contract;
import org.vaadin.referenceapp.workhours.domain.model.HourCategory;
import org.vaadin.referenceapp.workhours.domain.model.Project;
import org.vaadin.referenceapp.workhours.domain.model.WorkLogEntry;
import org.vaadin.referenceapp.workhours.domain.primitives.UserId;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
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
                entity.nullSafeId(),
                ProjectReference.fromEntity(entity.getProject()),
                ContractReference.fromEntity(entity.getContract()),
                entity.getDate(), entity.getStartTime(),
                entity.getEndTime(),
                entity.getDescription(),
                HourCategoryReference.fromEntity(entity.getHourCategory()),
                entity.getCreatedBy().map(UserId::toString).orElse(null),
                entity.getCreatedOn().orElse(null),
                entity.getModifiedBy().map(UserId::toString).orElse(null),
                entity.getModifiedOn().orElse(null)
        );
    }

    public WorkLogEntry toEntity(LookupFunction<Long, WorkLogEntry> workLogEntryLookup,
                                 LookupFunction<Long, Project> projectLookup,
                                 LookupFunction<Long, Contract> contractLookup,
                                 LookupFunction<Long, HourCategory> hourCategoryLookup) {
        var entity = Optional.ofNullable(id()).flatMap(workLogEntryLookup::findById).orElseGet(WorkLogEntry::new);
        entity.setProject(projectLookup.getById(requireNonNull(project()).id()));
        entity.setContract(contractLookup.getById(requireNonNull(contract()).id()));
        entity.setHourCategory(hourCategoryLookup.getById(requireNonNull(hourCategory()).id()));
        entity.setDate(date());
        entity.setStartTime(startTime());
        entity.setEndTime(endTime());
        entity.setDescription(description());
        return entity;
    }
}
