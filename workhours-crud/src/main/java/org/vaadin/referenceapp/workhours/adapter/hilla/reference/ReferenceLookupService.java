package org.vaadin.referenceapp.workhours.adapter.hilla.reference;

import dev.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import org.vaadin.referenceapp.workhours.domain.model.ContractRepository;
import org.vaadin.referenceapp.workhours.domain.model.EmployeeRepository;
import org.vaadin.referenceapp.workhours.domain.model.HourCategoryRepository;
import org.vaadin.referenceapp.workhours.domain.model.ProjectRepository;
import org.vaadin.referenceapp.workhours.domain.security.CurrentUser;
import org.vaadin.referenceapp.workhours.domain.security.Roles;

import java.util.List;

@BrowserCallable
@PermitAll
class ReferenceLookupService {

    private final ProjectRepository projectRepository;
    private final ContractRepository contractRepository;
    private final HourCategoryRepository hourCategoryRepository;
    private final EmployeeRepository employeeRepository;
    private final CurrentUser currentUser;

    ReferenceLookupService(ProjectRepository projectRepository,
                           ContractRepository contractRepository,
                           HourCategoryRepository hourCategoryRepository, EmployeeRepository employeeRepository, CurrentUser currentUser) {
        this.projectRepository = projectRepository;
        this.contractRepository = contractRepository;
        this.hourCategoryRepository = hourCategoryRepository;
        this.employeeRepository = employeeRepository;
        this.currentUser = currentUser;
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

    public List<EmployeeReference> findEmployees() {
        if (currentUser.hasRole(Roles.MANAGER)) {
            return employeeRepository.findAllWithUpperLimit()
                    .map(EmployeeReference::fromEntity)
                    .toList();
        } else {
            return employeeRepository.findByUser(currentUser.userId())
                    .map(EmployeeReference::fromEntity)
                    .stream()
                    .toList();
        }
    }
}
