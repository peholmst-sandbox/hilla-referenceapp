package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.transaction.annotation.Transactional;
import org.vaadin.referenceapp.workhours.domain.model.ContractRepository;
import org.vaadin.referenceapp.workhours.domain.model.HourCategoryRepository;
import org.vaadin.referenceapp.workhours.domain.model.ProjectRepository;

import java.util.List;

@BrowserCallable
@RolesAllowed("ROLE_MANAGER") // TODO Replace with constant
class ContractAdminService {

    private final ContractRepository contractRepository;
    private final ProjectRepository projectRepository;
    private final HourCategoryRepository hourCategoryRepository;

    ContractAdminService(ContractRepository contractRepository,
                         ProjectRepository projectRepository,
                         HourCategoryRepository hourCategoryRepository) {
        this.contractRepository = contractRepository;
        this.projectRepository = projectRepository;
        this.hourCategoryRepository = hourCategoryRepository;
    }

    public List<ContractDTO> findAll() { // TODO Add pagination
        return contractRepository.findAllWithUpperLimit().map(ContractDTO::fromEntity).toList();
    }

    @Transactional
    public ContractDTO save(ContractDTO dto) {
        if ("fail".equals(dto.name())) { // TODO Remove this
            throw new UnsupportedOperationException("fail");
        }
        return ContractDTO.fromEntity(contractRepository.saveAndFlush(dto.toEntity(
                contractRepository::findAllById,
                projectRepository::findAllById,
                hourCategoryRepository::findAllById)
        ));
    }
}
