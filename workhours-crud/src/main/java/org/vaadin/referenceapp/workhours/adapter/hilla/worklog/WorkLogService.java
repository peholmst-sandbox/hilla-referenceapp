package org.vaadin.referenceapp.workhours.adapter.hilla.worklog;

import dev.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.EmployeeReference;
import org.vaadin.referenceapp.workhours.domain.model.*;
import org.vaadin.referenceapp.workhours.domain.primitives.WorkLogEntryId;
import org.vaadin.referenceapp.workhours.domain.security.CurrentUser;
import org.vaadin.referenceapp.workhours.domain.security.Roles;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@BrowserCallable
@RolesAllowed(Roles.EMPLOYEE)
class WorkLogService {

    private final ProjectRepository projectRepository;
    private final ContractRepository contractRepository;
    private final WorkLogEntryRepository workLogEntryRepository;
    private final HourCategoryRepository hourCategoryRepository;
    private final EmployeeRepository employeeRepository;
    private final CurrentUser currentUser;

    WorkLogService(ProjectRepository projectRepository,
                   ContractRepository contractRepository,
                   WorkLogEntryRepository workLogEntryRepository,
                   HourCategoryRepository hourCategoryRepository,
                   EmployeeRepository employeeRepository,
                   CurrentUser currentUser) {
        this.projectRepository = projectRepository;
        this.contractRepository = contractRepository;
        this.workLogEntryRepository = workLogEntryRepository;
        this.hourCategoryRepository = hourCategoryRepository;
        this.employeeRepository = employeeRepository;
        this.currentUser = currentUser;
    }

    public Optional<WorkLogEntryFormDTO> loadForm(long workLogEntryId) {
        return workLogEntryRepository.findById(WorkLogEntryId.fromLong(workLogEntryId)).filter(this::hasAccessTo).map(WorkLogEntryFormDTO::fromEntity);
    }

    @Transactional
    public WorkLogEntryFormDTO saveForm(WorkLogEntryFormDTO form) {
        var entity = workLogEntryRepository.saveAndFlush(form.toEntity(
                this::findEntriesByIdWithAccessCheck,
                projectRepository::findAllById,
                contractRepository::findAllById,
                hourCategoryRepository::findAllById,
                employeeRepository::findAllById)
        );
        if (!hasAccessTo(entity)) { // Check that an employee has not tried to save an entry for another employee
            throw new AccessDeniedException("You are not allowed to save this entry");
        }
        return WorkLogEntryFormDTO.fromEntity(entity);
    }

    private List<WorkLogEntry> findEntriesByIdWithAccessCheck(Iterable<WorkLogEntryId> ids) {
        return workLogEntryRepository.findAllById(ids).stream().filter(this::hasAccessTo).toList();
    }

    private boolean hasAccessTo(WorkLogEntry workLogEntry) {
        return currentUser.hasRole(Roles.MANAGER) || currentUser.id().equals(workLogEntry.getEmployee().getUser());
    }

    public long calculateDurationInSecondsBetween(LocalDate date, LocalTime startTime, LocalTime endTime) {
        // TODO This is business logic that should go into the domain model (or at least into an application service)
        LocalDate endDate = date;
        if (!endTime.isAfter(startTime)) {
            endDate = date.plusDays(1);
        }
        var tz = currentUser.timeZone();
        var from = date.atTime(startTime).atZone(tz);
        var to = endDate.atTime(endTime).atZone(tz);
        return Duration.between(from, to).toSeconds();
    }

    public Optional<EmployeeReference> ownEmployeeReference() {
        return employeeRepository.findByUser(currentUser.id()).map(EmployeeReference::fromEntity);
    }
}
