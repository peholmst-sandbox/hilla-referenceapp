package org.vaadin.referenceapp.workhours.domain.primitives.hibernate;

import org.vaadin.referenceapp.workhours.domain.primitives.EmployeeId;

public class EmployeeIdJavaType extends BaseLongIdJavaType<EmployeeId> {
    public EmployeeIdJavaType() {
        super(EmployeeId.class, EmployeeId::fromString, EmployeeId::fromLong);
    }
}
