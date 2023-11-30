package org.vaadin.referenceapp.workhours.adapter.hilla.reference;

import org.vaadin.referenceapp.workhours.domain.model.Employee;
import org.vaadin.referenceapp.workhours.domain.primitives.EmployeeId;

public record EmployeeReference(
        Long id,
        String name
) {

    public EmployeeId employeeId() {
        return EmployeeId.fromLong(id());
    }

    public static EmployeeReference fromEntity(Employee entity) {
        return new EmployeeReference(entity.nullSafeId().toLong(), entity.getFullName());
    }
}
