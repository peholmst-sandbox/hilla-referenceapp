package org.vaadin.referenceapp.workhours.domain.primitives.hibernate;

import org.vaadin.referenceapp.workhours.domain.primitives.WorkLogEntryId;

public class WorkLogEntryIdJavaType extends BaseLongIdJavaType<WorkLogEntryId> {

    public WorkLogEntryIdJavaType() {
        super(WorkLogEntryId.class, WorkLogEntryId::fromString, WorkLogEntryId::fromLong);
    }
}
