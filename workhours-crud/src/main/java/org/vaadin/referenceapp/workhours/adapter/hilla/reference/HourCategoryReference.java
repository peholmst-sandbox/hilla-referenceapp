package org.vaadin.referenceapp.workhours.adapter.hilla.reference;

import org.vaadin.referenceapp.workhours.domain.model.HourCategory;
import org.vaadin.referenceapp.workhours.domain.primitives.HourCategoryId;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public record HourCategoryReference(
        long id,
        String name
) {

    public HourCategoryId hourCategoryId() {
        return HourCategoryId.fromLong(id);
    }

    public static HourCategoryReference fromEntity(HourCategory entity) {
        return new HourCategoryReference(entity.nullSafeId().toLong(), entity.getName());
    }

    public static Set<HourCategoryReference> fromEntities(Collection<HourCategory> entities) {
        return entities.stream().map(HourCategoryReference::fromEntity).collect(Collectors.toSet());
    }
}
