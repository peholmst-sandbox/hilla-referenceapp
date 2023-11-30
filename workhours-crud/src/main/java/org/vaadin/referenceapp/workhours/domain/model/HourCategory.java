package org.vaadin.referenceapp.workhours.domain.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JavaType;
import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.BigIntJdbcType;
import org.vaadin.referenceapp.workhours.domain.base.BaseAuditedEntity;
import org.vaadin.referenceapp.workhours.domain.primitives.HourCategoryId;
import org.vaadin.referenceapp.workhours.domain.primitives.hibernate.HourCategoryIdJavaType;

@Entity
@Table(name = "hour_categories")
public class HourCategory extends BaseAuditedEntity<HourCategoryId> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JavaType(HourCategoryIdJavaType.class)
    @JdbcType(BigIntJdbcType.class)
    private HourCategoryId id;

    @Column(name = "hour_category_name")
    private String name;

    @Override
    public HourCategoryId getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
