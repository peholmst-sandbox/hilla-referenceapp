package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.transaction.annotation.Transactional;
import org.vaadin.referenceapp.workhours.domain.model.ProjectRepository;
import org.vaadin.referenceapp.workhours.domain.security.Roles;

import java.util.List;

@BrowserCallable
@RolesAllowed(Roles.MANAGER)
class ProjectAdminService {

    private final ProjectRepository projectRepository;

    ProjectAdminService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectDTO> findAll() {
        return projectRepository.findAllWithUpperLimit().map(ProjectDTO::fromEntity).toList();
    }

    @Transactional
    public ProjectDTO save(ProjectDTO dto) {
        return ProjectDTO.fromEntity(projectRepository.saveAndFlush(dto.toEntity(projectRepository::findAllById)));
    }
}
