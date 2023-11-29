package org.vaadin.referenceapp.workhours.domain.primitives.hibernate;

import org.hibernate.type.descriptor.WrapperOptions;
import org.hibernate.type.descriptor.java.AbstractClassJavaType;
import org.vaadin.referenceapp.workhours.domain.primitives.EmployeeId;

public class EmployeeIdJavaType extends AbstractClassJavaType<EmployeeId> {

    protected EmployeeIdJavaType() {
        super(EmployeeId.class);
    }

    @Override
    public <X> X unwrap(EmployeeId employeeId, Class<X> aClass, WrapperOptions wrapperOptions) {
        return null;
    }

    @Override
    public <X> EmployeeId wrap(X x, WrapperOptions wrapperOptions) {
        return null;
    }
}
