package org.vaadin.referenceapp.workhours.adapter.hilla.reference;

import org.vaadin.referenceapp.workhours.domain.model.Contract;

public record ContractReference(
        Long id,
        String name
) {

    public static ContractReference fromEntity(Contract entity) {
        return new ContractReference(entity.nullSafeId(), entity.getName());
    }
}
