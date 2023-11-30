package org.vaadin.referenceapp.workhours.domain.primitives;

public final class ContractId extends BaseLongId {

    public static final ContractId NONE = new ContractId(-1L);

    private ContractId(long id) {
        super(id);
    }

    public static ContractId fromLong(long contractId) {
        if (contractId < 0) {
            throw new IllegalArgumentException("ContractId must be positive");
        }
        return new ContractId(contractId);
    }

    public static ContractId fromString(String contractId) {
        return fromLong(Long.parseLong(contractId, 10));
    }
}
