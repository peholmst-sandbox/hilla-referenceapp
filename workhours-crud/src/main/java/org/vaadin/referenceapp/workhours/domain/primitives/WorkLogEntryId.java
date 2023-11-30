package org.vaadin.referenceapp.workhours.domain.primitives;

public final class WorkLogEntryId extends BaseLongId {

    public static final WorkLogEntryId NONE = new WorkLogEntryId(-1L);

    private WorkLogEntryId(long id) {
        super(id);
    }

    public static WorkLogEntryId fromLong(long workLogEntryId) {
        if (workLogEntryId < 0) {
            throw new IllegalArgumentException("WorkLogEntryId must be positive");
        }
        return new WorkLogEntryId(workLogEntryId);
    }

    public static WorkLogEntryId fromString(String workLogEntryId) {
        return fromLong(Long.parseLong(workLogEntryId, 10));
    }
}
