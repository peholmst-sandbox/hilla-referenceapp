package org.vaadin.referenceapp.workhours.adapter.hilla.reference;

import org.vaadin.referenceapp.workhours.domain.model.Employee;

public record EmployeeReference(
        Long id,
        String name
) {

    public static EmployeeReference fromEntity(Employee entity) {
        return new EmployeeReference(entity.nullSafeId(), entity.getFullName());
    }
}
