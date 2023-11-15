package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import org.vaadin.referenceapp.workhours.domain.model.HourCategoryRepository;

import java.util.List;

@BrowserCallable
@RolesAllowed("ROLE_MANAGER") // TODO Replace with constant
class HourCategoryAdminService {

    private final HourCategoryRepository hourCategoryRepository;

    HourCategoryAdminService(HourCategoryRepository hourCategoryRepository) {
        this.hourCategoryRepository = hourCategoryRepository;
    }

    public List<HourCategoryDTO> findAll() { // TODO Add pagination
        return hourCategoryRepository.findAllWithUpperLimit().map(HourCategoryDTO::fromEntity).toList();
    }

    public HourCategoryDTO save(HourCategoryDTO dto) {
        if ("fail".equals(dto.name())) { // TODO Remove this
            throw new UnsupportedOperationException("fail");
        }
        return HourCategoryDTO.fromEntity(hourCategoryRepository.saveAndFlush(dto.toEntity(hourCategoryRepository::findById)));
    }
}
