package org.vaadin.referenceapp.workhours.adapter.hilla.worklog;

import java.util.List;

import static java.util.Objects.requireNonNull;

public record WorkLogQueryResponse(
        List<WorkLogQueryRecord> items,
        long count
) {

    public WorkLogQueryResponse {
        requireNonNull(items, "items must not be null");
        if (count < 0) {
            throw new IllegalArgumentException("count must be >= 0");
        }
    }
}
