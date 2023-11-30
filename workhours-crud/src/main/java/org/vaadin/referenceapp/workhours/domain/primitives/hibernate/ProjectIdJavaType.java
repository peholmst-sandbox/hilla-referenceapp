package org.vaadin.referenceapp.workhours.domain.primitives.hibernate;

import org.vaadin.referenceapp.workhours.domain.primitives.ProjectId;

public class ProjectIdJavaType extends BaseLongIdJavaType<ProjectId> {

    public ProjectIdJavaType() {
        super(ProjectId.class, ProjectId::fromString, ProjectId::fromLong);
    }
}
