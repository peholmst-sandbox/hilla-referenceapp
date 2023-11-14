package org.vaadin.referenceapp.workhours.adapter.hilla.reference;

import org.vaadin.referenceapp.workhours.domain.model.Project;

public record ProjectReference(
        Long id,
        String name
) {

    public static ProjectReference fromEntity(Project entity) {
        return new ProjectReference(entity.nullSafeId(), entity.getName());
    }
}
