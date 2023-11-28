package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.Nullable;
import org.vaadin.referenceapp.workhours.domain.base.LookupFunction;
import org.vaadin.referenceapp.workhours.domain.model.Employee;
import org.vaadin.referenceapp.workhours.domain.primitives.UserId;

import java.time.Instant;
import java.util.Optional;

record EmployeeDTO(
        @Nullable Long id,
        String firstName,
        String lastName,
        @Nullable String user,
        @Nullable String createdBy,
        @Nullable Instant createdOn,
        @Nullable String modifiedBy,
        @Nullable Instant modifiedOn
) {

    static EmployeeDTO fromEntity(Employee entity) {
        return new EmployeeDTO(
                entity.nullSafeId(),
                entity.getFirstName(),
                entity.getLastName(),
                Optional.ofNullable(entity.getUser()).map(UserId::toString).orElse(null),
                entity.getCreatedBy().map(UserId::toString).orElse(null),
                entity.getCreatedOn().orElse(null),
                entity.getModifiedBy().map(UserId::toString).orElse(null),
                entity.getModifiedOn().orElse(null)
        );
    }

    Employee toEntity(LookupFunction<Long, Employee> entityLookup) {
        var entity = Optional.ofNullable(id()).flatMap(entityLookup::findById).orElseGet(Employee::new);
        entity.setFirstName(firstName());
        entity.setLastName(lastName());
        entity.setUser(UserId.fromString(user()));
        return entity;
    }
}
