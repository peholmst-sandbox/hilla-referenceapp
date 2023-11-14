package org.vaadin.referenceapp.workhours.domain.base;

import jakarta.persistence.MappedSuperclass;
import org.springframework.data.domain.Persistable;
import org.springframework.data.util.ProxyUtils;

import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;

@MappedSuperclass
public abstract class BaseEntity<ID extends Serializable> implements Persistable<ID> {

    @Override
    public boolean isNew() {
        return getId() == null;
    }

    public ID nullSafeId() {
        return Optional.ofNullable(getId()).orElseThrow(() -> new IllegalStateException("Entity has no ID"));
    }

    @Override
    public boolean equals(Object obj) {
        if (null == obj) {
            return false;
        } else if (this == obj) {
            return true;
        } else if (!this.getClass().equals(ProxyUtils.getUserClass(obj))) {
            return false;
        } else {
            var that = (BaseEntity<?>) obj;
            return null != this.getId() && this.getId().equals(that.getId());
        }
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }
}
