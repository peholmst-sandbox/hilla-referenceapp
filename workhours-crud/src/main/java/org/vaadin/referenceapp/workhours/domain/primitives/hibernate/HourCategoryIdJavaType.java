package org.vaadin.referenceapp.workhours.domain.primitives.hibernate;

import org.vaadin.referenceapp.workhours.domain.primitives.HourCategoryId;

public class HourCategoryIdJavaType extends BaseLongIdJavaType<HourCategoryId> {

    public HourCategoryIdJavaType() {
        super(HourCategoryId.class, HourCategoryId::fromString, HourCategoryId::fromLong);
    }
}
