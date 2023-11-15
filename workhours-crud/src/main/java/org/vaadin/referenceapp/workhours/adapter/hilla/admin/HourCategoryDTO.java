package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.Nullable;
import org.vaadin.referenceapp.workhours.domain.base.LookupFunction;
import org.vaadin.referenceapp.workhours.domain.model.HourCategory;

import java.util.Optional;

public record HourCategoryDTO(
        @Nullable Long id,
        String name
) {

    public static HourCategoryDTO fromEntity(HourCategory entity) {
        return new HourCategoryDTO(entity.nullSafeId(), entity.getName());
    }

    public HourCategory toEntity(LookupFunction<Long, HourCategory> entityLookup) {
        var entity = Optional.ofNullable(id()).flatMap(entityLookup::findById).orElseGet(HourCategory::new);
        entity.setName(name());
        return entity;
    }
}
