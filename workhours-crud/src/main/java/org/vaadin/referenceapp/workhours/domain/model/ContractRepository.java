package org.vaadin.referenceapp.workhours.domain.model;

import org.vaadin.referenceapp.workhours.domain.base.BaseRepository;
import org.vaadin.referenceapp.workhours.domain.primitives.ContractId;

import java.util.List;

public interface ContractRepository extends BaseRepository<Contract, ContractId> {

    List<Contract> findByProject(Project project);
}
