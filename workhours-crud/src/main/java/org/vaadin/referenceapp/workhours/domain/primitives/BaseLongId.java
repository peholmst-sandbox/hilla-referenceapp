package org.vaadin.referenceapp.workhours.domain.primitives;

import java.io.Serializable;
import java.util.Objects;

public abstract class BaseLongId implements Serializable {

    private final long id;

    protected BaseLongId(long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return Long.toString(id, 10);
    }

    public Long toLong() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BaseLongId that = (BaseLongId) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
