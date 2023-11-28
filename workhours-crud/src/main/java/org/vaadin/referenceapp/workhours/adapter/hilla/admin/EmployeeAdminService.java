package org.vaadin.referenceapp.workhours.adapter.hilla.admin;

import dev.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import org.vaadin.referenceapp.workhours.domain.model.EmployeeRepository;
import org.vaadin.referenceapp.workhours.domain.security.Roles;

import java.util.List;

@BrowserCallable
@RolesAllowed(Roles.MANAGER)
class EmployeeAdminService {

    private final EmployeeRepository employeeRepository;

    EmployeeAdminService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<EmployeeDTO> findAll() {
        return employeeRepository.findAllWithUpperLimit().map(EmployeeDTO::fromEntity).toList();
    }

    public EmployeeDTO save(EmployeeDTO dto) {
        return EmployeeDTO.fromEntity(employeeRepository.saveAndFlush(dto.toEntity(employeeRepository::findAllById)));
    }
}
