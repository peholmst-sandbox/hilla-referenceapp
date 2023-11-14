package org.vaadin.referenceapp.workhours.adapter.hilla.worklog;


import dev.hilla.Nullable;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ContractReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.HourCategoryReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ProjectReference;
import org.vaadin.referenceapp.workhours.domain.model.WorkLogEntry;

import java.time.LocalDate;
import java.time.LocalTime;


public record WorkLogListEntryDTO(
        Long id,
        ProjectReference project,
        ContractReference contract,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        @Nullable String description,
        HourCategoryReference hourCategory
) {

    static WorkLogListEntryDTO fromEntity(WorkLogEntry entity) {
        return new WorkLogListEntryDTO(
                entity.nullSafeId(),
                ProjectReference.fromEntity(entity.getProject()),
                ContractReference.fromEntity(entity.getContract()),
                entity.getDate(),
                entity.getStartTime(),
                entity.getEndTime(),
                entity.getDescription(),
                HourCategoryReference.fromEntity(entity.getHourCategory())
        );
    }
}
