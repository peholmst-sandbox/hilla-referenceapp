package org.vaadin.referenceapp.workhours.adapter.hilla.reference;

import org.vaadin.referenceapp.workhours.domain.model.Project;
import org.vaadin.referenceapp.workhours.domain.primitives.ProjectId;

public record ProjectReference(
        Long id,
        String name
) {

    public ProjectId projectId() {
        return ProjectId.fromLong(id());
    }
    public static ProjectReference fromEntity(Project entity) {
        return new ProjectReference(entity.nullSafeId().toLong(), entity.getName());
    }
}
