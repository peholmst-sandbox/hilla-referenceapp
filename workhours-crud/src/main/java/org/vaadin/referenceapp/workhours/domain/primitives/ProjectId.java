package org.vaadin.referenceapp.workhours.domain.primitives;

public final class ProjectId extends BaseLongId {

    public static final ProjectId NONE = new ProjectId(-1L);

    private ProjectId(long id) {
        super(id);
    }

    public static ProjectId fromLong(long projectId) {
        if (projectId < 0) {
            throw new IllegalArgumentException("ProjectId must be positive");
        }
        return new ProjectId(projectId);
    }

    public static ProjectId fromString(String projectId) {
        return fromLong(Long.parseLong(projectId, 10));
    }
}
