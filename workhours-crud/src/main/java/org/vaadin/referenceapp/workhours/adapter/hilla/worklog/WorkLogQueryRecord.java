package org.vaadin.referenceapp.workhours.adapter.hilla.worklog;


import dev.hilla.Nullable;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ContractReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.EmployeeReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.HourCategoryReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ProjectReference;
import org.vaadin.referenceapp.workhours.domain.model.WorkLogEntry;

import java.time.Duration;
import java.time.LocalDate;


public record WorkLogQueryRecord(
        Long id,
        EmployeeReference employee,
        ProjectReference project,
        ContractReference contract,
        LocalDate date,
        Long durationInSeconds,
        @Nullable String description,
        HourCategoryReference hourCategory
) {

    static WorkLogQueryRecord fromEntity(WorkLogEntry entity) {
        return new WorkLogQueryRecord(
                entity.nullSafeId().toLong(),
                EmployeeReference.fromEntity(entity.getEmployee()),
                ProjectReference.fromEntity(entity.getProject()),
                ContractReference.fromEntity(entity.getContract()),
                entity.getStartTime().toLocalDate(),
                Duration.between(entity.getStartTime(), entity.getEndTime()).toSeconds(),
                entity.getDescription(),
                HourCategoryReference.fromEntity(entity.getHourCategory())
        );
    }
}
