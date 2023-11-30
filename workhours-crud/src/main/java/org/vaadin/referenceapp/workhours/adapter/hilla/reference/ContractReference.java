package org.vaadin.referenceapp.workhours.adapter.hilla.reference;

import org.vaadin.referenceapp.workhours.domain.model.Contract;
import org.vaadin.referenceapp.workhours.domain.primitives.ContractId;

public record ContractReference(
        Long id,
        String name
) {

    public ContractId contractId() {
        return ContractId.fromLong(id());
    }

    public static ContractReference fromEntity(Contract entity) {
        return new ContractReference(entity.nullSafeId().toLong(), entity.getName());
    }
}
