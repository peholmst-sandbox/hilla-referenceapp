package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.Nullable;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.HourCategoryReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ProjectReference;
import org.vaadin.referenceapp.workhours.domain.base.LookupFunction;
import org.vaadin.referenceapp.workhours.domain.model.Contract;
import org.vaadin.referenceapp.workhours.domain.model.HourCategory;
import org.vaadin.referenceapp.workhours.domain.model.Project;
import org.vaadin.referenceapp.workhours.domain.primitives.ContractId;
import org.vaadin.referenceapp.workhours.domain.primitives.HourCategoryId;
import org.vaadin.referenceapp.workhours.domain.primitives.ProjectId;
import org.vaadin.referenceapp.workhours.domain.primitives.UserId;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;

record ContractDTO(
        @Nullable Long id,
        String name,
        ProjectReference project,
        Set<HourCategoryReference> allowedHourCategories,
        @Nullable String createdBy,
        @Nullable Instant createdOn,
        @Nullable String modifiedBy,
        @Nullable Instant modifiedOn
) {

    static ContractDTO fromEntity(Contract entity) {
        return new ContractDTO(
                entity.nullSafeId().toLong(),
                entity.getName(),
                ProjectReference.fromEntity(entity.getProject()),
                HourCategoryReference.fromEntities(entity.getAllowedHourCategories()),
                entity.getCreatedBy().map(UserId::toString).orElse(null),
                entity.getCreatedOn().orElse(null),
                entity.getModifiedBy().map(UserId::toString).orElse(null),
                entity.getModifiedOn().orElse(null)
        );
    }

    Contract toEntity(LookupFunction<ContractId, Contract> contractLookup,
                      LookupFunction<ProjectId, Project> projectLookup,
                      LookupFunction<HourCategoryId, HourCategory> hourCategoryLookup) {
        var entity = Optional.ofNullable(id()).map(ContractId::fromLong).flatMap(contractLookup::findById).orElseGet(Contract::new);
        entity.setProject(projectLookup.getById(project.projectId()));
        entity.setName(name());
        entity.setAllowedHourCategories(hourCategoryLookup.findByReferences(allowedHourCategories(), HourCategoryReference::hourCategoryId));
        return entity;
    }
}
