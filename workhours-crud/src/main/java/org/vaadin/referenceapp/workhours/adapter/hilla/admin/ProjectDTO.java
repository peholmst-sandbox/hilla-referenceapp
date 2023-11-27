package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.Nullable;
import org.vaadin.referenceapp.workhours.domain.base.LookupFunction;
import org.vaadin.referenceapp.workhours.domain.model.Project;
import org.vaadin.referenceapp.workhours.domain.primitives.UserId;

import java.time.Instant;
import java.util.Optional;

public record ProjectDTO(
        @Nullable Long id,
        String name,
        @Nullable String createdBy,
        @Nullable Instant createdOn,
        @Nullable String modifiedBy,
        @Nullable Instant modifiedOn
) {

    public static ProjectDTO fromEntity(Project entity) {
        return new ProjectDTO(
                entity.nullSafeId(),
                entity.getName(),
                entity.getCreatedBy().map(UserId::toString).orElse(null),
                entity.getCreatedOn().orElse(null),
                entity.getModifiedBy().map(UserId::toString).orElse(null),
                entity.getModifiedOn().orElse(null)
        );
    }

    public Project toEntity(LookupFunction<Long, Project> entityLookup) {
        var entity = Optional.ofNullable(id()).flatMap(entityLookup::findById).orElseGet(Project::new);
        entity.setName(name());
        return entity;
    }
}
