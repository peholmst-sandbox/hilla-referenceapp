package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.Nullable;
import org.vaadin.referenceapp.workhours.domain.model.HourCategory;

import java.util.Optional;
import java.util.function.Function;

public record HourCategoryDTO(
        @Nullable Long id,
        String name
) {

    public static HourCategoryDTO fromEntity(HourCategory entity) {
        return new HourCategoryDTO(entity.nullSafeId(), entity.getName());
    }

    public HourCategory toEntity(Function<Long, Optional<HourCategory>> entityLookup) {
        var entity = Optional.ofNullable(id()).flatMap(entityLookup).orElseGet(HourCategory::new);
        entity.setName(name());
        return entity;
    }
}
