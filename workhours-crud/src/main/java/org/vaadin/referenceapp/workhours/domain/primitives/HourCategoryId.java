package org.vaadin.referenceapp.workhours.domain.primitives;

public final class HourCategoryId extends BaseLongId {

    public static final HourCategoryId NONE = new HourCategoryId(-1L);

    private HourCategoryId(long id) {
        super(id);
    }

    public static HourCategoryId fromLong(long hourCategoryId) {
        if (hourCategoryId < 0) {
            throw new IllegalArgumentException("HourCategoryId must be positive");
        }
        return new HourCategoryId(hourCategoryId);
    }

    public static HourCategoryId fromString(String hourCategoryId) {
        return fromLong(Long.parseLong(hourCategoryId, 10));
    }
}
