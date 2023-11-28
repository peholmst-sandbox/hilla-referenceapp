package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.Nullable;
import org.vaadin.referenceapp.workhours.domain.base.LookupFunction;
import org.vaadin.referenceapp.workhours.domain.model.HourCategory;
import org.vaadin.referenceapp.workhours.domain.primitives.UserId;

import java.time.Instant;
import java.util.Optional;

record HourCategoryDTO(
        @Nullable Long id,
        String name,
        @Nullable String createdBy,
        @Nullable Instant createdOn,
        @Nullable String modifiedBy,
        @Nullable Instant modifiedOn
) {

    static HourCategoryDTO fromEntity(HourCategory entity) {
        return new HourCategoryDTO(
                entity.nullSafeId(),
                entity.getName(),
                entity.getCreatedBy().map(UserId::toString).orElse(null),
                entity.getCreatedOn().orElse(null),
                entity.getModifiedBy().map(UserId::toString).orElse(null),
                entity.getModifiedOn().orElse(null)
        );
    }

    HourCategory toEntity(LookupFunction<Long, HourCategory> entityLookup) {
        var entity = Optional.ofNullable(id()).flatMap(entityLookup::findById).orElseGet(HourCategory::new);
        entity.setName(name());
        return entity;
    }
}
