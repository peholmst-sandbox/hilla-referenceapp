package org.vaadin.referenceapp.workhours.domain.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JavaType;
import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.BigIntJdbcType;
import org.vaadin.referenceapp.workhours.domain.base.BaseAuditedEntity;
import org.vaadin.referenceapp.workhours.domain.primitives.ProjectId;
import org.vaadin.referenceapp.workhours.domain.primitives.hibernate.ProjectIdJavaType;

@Entity
@Table(name = "projects")
public class Project extends BaseAuditedEntity<ProjectId> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JavaType(ProjectIdJavaType.class)
    @JdbcType(BigIntJdbcType.class)
    private ProjectId id;

    @Column(name = "project_name", unique = true, nullable = false)
    private String name;

    @Override
    public ProjectId getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
