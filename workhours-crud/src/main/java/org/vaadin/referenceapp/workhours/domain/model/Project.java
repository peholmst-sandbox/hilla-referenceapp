package org.vaadin.referenceapp.workhours.domain.model;

import jakarta.persistence.*;
import org.vaadin.referenceapp.workhours.domain.base.BaseEntity;

@Entity
@Table(name = "projects")
public class Project extends BaseEntity<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_name", unique = true, nullable = false)
    private String name;

    @Override
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
