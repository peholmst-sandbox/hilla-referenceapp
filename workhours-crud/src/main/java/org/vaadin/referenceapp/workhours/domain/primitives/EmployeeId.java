package org.vaadin.referenceapp.workhours.domain.primitives;

public final class EmployeeId extends BaseLongId {

    public static final EmployeeId NONE = new EmployeeId(-1L);

    private EmployeeId(long id) {
        super(id);
    }

    public static EmployeeId fromLong(long employeeId) {
        if (employeeId < 0) {
            throw new IllegalArgumentException("EmployeeId must be positive");
        }
        return new EmployeeId(employeeId);
    }

    public static EmployeeId fromString(String employeeId) {
        return fromLong(Long.parseLong(employeeId, 10));
    }
}
