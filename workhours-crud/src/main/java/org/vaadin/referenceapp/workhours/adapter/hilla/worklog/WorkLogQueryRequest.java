package org.vaadin.referenceapp.workhours.adapter.hilla.worklog;

import dev.hilla.Nullable;
import org.springframework.data.domain.Pageable;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ContractReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.EmployeeReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ProjectReference;

import java.time.LocalDate;

public record WorkLogQueryRequest(
        @Nullable ProjectReference project,
        @Nullable ContractReference contract,
        @Nullable EmployeeReference employee,
        @Nullable LocalDate fromDate,
        @Nullable LocalDate toDate,
        Pageable pageable
) {

}
