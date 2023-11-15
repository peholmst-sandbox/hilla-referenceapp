package org.vaadin.referenceapp.workhours.adapter.hilla.reference;

import dev.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import org.vaadin.referenceapp.workhours.domain.model.ContractRepository;
import org.vaadin.referenceapp.workhours.domain.model.HourCategoryRepository;
import org.vaadin.referenceapp.workhours.domain.model.ProjectRepository;

import java.util.List;

@BrowserCallable
@PermitAll
class ReferenceLookupService {

    private final ProjectRepository projectRepository;
    private final ContractRepository contractRepository;
    private final HourCategoryRepository hourCategoryRepository;

    ReferenceLookupService(ProjectRepository projectRepository,
                           ContractRepository contractRepository,
                           HourCategoryRepository hourCategoryRepository) {
        this.projectRepository = projectRepository;
        this.contractRepository = contractRepository;
        this.hourCategoryRepository = hourCategoryRepository;
    }

    public List<ProjectReference> findProjects() {
        return projectRepository.findAllWithUpperLimit().map(ProjectReference::fromEntity).toList();
    }

    public List<ContractReference> findContractsByProject(ProjectReference projectReference) {
        return projectRepository.findById(projectReference.id()).stream()
                .flatMap(project -> contractRepository.findByProject(project).stream())
                .map(ContractReference::fromEntity)
                .toList();
    }

    public List<HourCategoryReference> findHourCategoriesByContract(ContractReference contractReference) {
        return contractRepository.findById(contractReference.id()).stream()
                .flatMap(contract -> contract.getAllowedHourCategories().stream())
                .map(HourCategoryReference::fromEntity)
                .toList();
    }

    public List<HourCategoryReference> findHourCategories() {
        return hourCategoryRepository.findAllWithUpperLimit().map(HourCategoryReference::fromEntity).toList();
    }
}
