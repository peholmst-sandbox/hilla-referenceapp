package org.vaadin.referenceapp.workhours.adapter.hilla.reference;

import org.vaadin.referenceapp.workhours.domain.model.HourCategory;

public record HourCategoryReference(
        long id,
        String name
) {

    public static HourCategoryReference fromEntity(HourCategory hourCategory) {
        return new HourCategoryReference(hourCategory.nullSafeId(), hourCategory.getName());
    }
}
