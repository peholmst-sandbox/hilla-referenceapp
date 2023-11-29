package org.vaadin.referenceapp.workhours.domain.primitives;

import java.io.Serializable;
import java.util.Objects;

public final class EmployeeId implements Serializable {

    private final long id;

    public EmployeeId(long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "EmployeeId(" + id + ")";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EmployeeId that = (EmployeeId) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
