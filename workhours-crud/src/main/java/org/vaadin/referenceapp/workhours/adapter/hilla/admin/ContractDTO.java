package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.Nullable;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.HourCategoryReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ProjectReference;
import org.vaadin.referenceapp.workhours.domain.base.LookupFunction;
import org.vaadin.referenceapp.workhours.domain.model.Contract;
import org.vaadin.referenceapp.workhours.domain.model.HourCategory;
import org.vaadin.referenceapp.workhours.domain.model.Project;

import java.util.Optional;
import java.util.Set;

public record ContractDTO(
        @Nullable Long id,
        String name,
        ProjectReference project,
        Set<HourCategoryReference> allowedHourCategories
) {

    public static ContractDTO fromEntity(Contract entity) {
        return new ContractDTO(
                entity.nullSafeId(),
                entity.getName(),
                ProjectReference.fromEntity(entity.getProject()),
                HourCategoryReference.fromEntities(entity.getAllowedHourCategories())
        );
    }

    public Contract toEntity(LookupFunction<Long, Contract> contractLookup,
                             LookupFunction<Long, Project> projectLookup,
                             LookupFunction<Long, HourCategory> hourCategoryLookup) {
        var entity = Optional.ofNullable(id()).flatMap(contractLookup::findById).orElseGet(Contract::new);
        entity.setProject(projectLookup.getById(project.id()));
        entity.setName(name());
        entity.setAllowedHourCategories(hourCategoryLookup.findByReferences(allowedHourCategories(), HourCategoryReference::id));
        return entity;
    }
}
