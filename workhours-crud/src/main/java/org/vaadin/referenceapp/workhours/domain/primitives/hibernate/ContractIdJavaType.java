package org.vaadin.referenceapp.workhours.domain.primitives.hibernate;

import org.vaadin.referenceapp.workhours.domain.primitives.ContractId;

public class ContractIdJavaType extends BaseLongIdJavaType<ContractId> {

    public ContractIdJavaType() {
        super(ContractId.class, ContractId::fromString, ContractId::fromLong);
    }
}
