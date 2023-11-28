package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.transaction.annotation.Transactional;
import org.vaadin.referenceapp.workhours.domain.model.HourCategoryRepository;
import org.vaadin.referenceapp.workhours.domain.security.Roles;

import java.util.List;

@BrowserCallable
@RolesAllowed(Roles.MANAGER)
class HourCategoryAdminService {

    private final HourCategoryRepository hourCategoryRepository;

    HourCategoryAdminService(HourCategoryRepository hourCategoryRepository) {
        this.hourCategoryRepository = hourCategoryRepository;
    }

    public List<HourCategoryDTO> findAll() {
        return hourCategoryRepository.findAllWithUpperLimit().map(HourCategoryDTO::fromEntity).toList();
    }

    @Transactional
    public HourCategoryDTO save(HourCategoryDTO dto) {
        return HourCategoryDTO.fromEntity(hourCategoryRepository.saveAndFlush(dto.toEntity(hourCategoryRepository::findAllById)));
    }
}
