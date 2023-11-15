package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.Nullable;
import org.vaadin.referenceapp.workhours.domain.base.LookupFunction;
import org.vaadin.referenceapp.workhours.domain.model.Project;

import java.util.Optional;

public record ProjectDTO(
        @Nullable Long id,
        String name
) {

    public static ProjectDTO fromEntity(Project entity) {
        return new ProjectDTO(entity.nullSafeId(), entity.getName());
    }

    public Project toEntity(LookupFunction<Long, Project> entityLookup) {
        var entity = Optional.ofNullable(id()).flatMap(entityLookup::findById).orElseGet(Project::new);
        entity.setName(name());
        return entity;
    }
}
