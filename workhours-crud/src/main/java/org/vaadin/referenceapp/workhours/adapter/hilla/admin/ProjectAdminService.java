package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import org.vaadin.referenceapp.workhours.domain.model.ProjectRepository;

import java.util.List;

@BrowserCallable
@RolesAllowed("ROLE_MANAGER") // TODO Replace with constant
class ProjectAdminService {

    private final ProjectRepository projectRepository;

    ProjectAdminService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectDTO> findAll() { // TODO Add pagination
        return projectRepository.findAllWithUpperLimit().map(ProjectDTO::fromEntity).toList();
    }

    public ProjectDTO save(ProjectDTO dto) {
        if ("fail".equals(dto.name())) { // TODO Remove this
            throw new UnsupportedOperationException("fail");
        }
        return ProjectDTO.fromEntity(projectRepository.saveAndFlush(dto.toEntity(projectRepository::findById)));
    }
}
