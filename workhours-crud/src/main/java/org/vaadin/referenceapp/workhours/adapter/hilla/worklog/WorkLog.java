package org.vaadin.referenceapp.workhours.adapter.hilla.worklog;

import dev.hilla.BrowserCallable;
import dev.hilla.Nullable;
import dev.hilla.crud.ListService;
import dev.hilla.crud.filter.Filter;
import jakarta.annotation.security.PermitAll;
import org.springframework.data.domain.Pageable;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ContractReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.HourCategoryReference;
import org.vaadin.referenceapp.workhours.adapter.hilla.reference.ProjectReference;
import org.vaadin.referenceapp.workhours.domain.model.*;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

@BrowserCallable
@PermitAll // TODO Protect this service with roles
@SuppressWarnings("unused") // Otherwise IntelliJ IDEA will complain
class WorkLog implements ListService<WorkLogListEntryDTO> {

    private final ProjectRepository projectRepository;
    private final ContractRepository contractRepository;
    private final WorkLogEntryRepository timeEntryRepository;
    private final HourCategoryRepository hourCategoryRepository;

    // TODO Query limits!

    WorkLog(ProjectRepository projectRepository,
            ContractRepository contractRepository,
            WorkLogEntryRepository timeEntryRepository,
            HourCategoryRepository hourCategoryRepository) {
        this.projectRepository = projectRepository;
        this.contractRepository = contractRepository;
        this.timeEntryRepository = timeEntryRepository;
        this.hourCategoryRepository = hourCategoryRepository;
    }

    public List<ProjectReference> findProjects() {
        return projectRepository.findAll().stream().map(ProjectReference::fromEntity).toList();
    }

    public List<ContractReference> findContractsByProject(long projectId) {
        return projectRepository.findById(projectId).stream()
                .flatMap(project -> contractRepository.findByProject(project).stream())
                .map(ContractReference::fromEntity)
                .toList();
    }

    public List<HourCategoryReference> findHourCategoriesByContract(long contractId) {
        return contractRepository.findById(contractId).stream()
                .flatMap(contract -> contract.getAllowedHourCategories().stream())
                .map(HourCategoryReference::fromEntity)
                .toList();
    }

    public WorkLogEntryFormDTO loadForm(long workLogEntryId) {
        return WorkLogEntryFormDTO.fromEntity(timeEntryRepository.getById(workLogEntryId));
    }

    public WorkLogEntryFormDTO saveForm(WorkLogEntryFormDTO form) {
        if (form.description() != null && form.description().contains("fail")) {
            throw new RuntimeException("This is an unexpected error!"); // Used for testing the client side error handler
        }

        // TODO Null checks
        WorkLogEntry entity;
        if (form.id() == null) {
            entity = new WorkLogEntry();
        } else {
            entity = timeEntryRepository.getById(form.id());
            // TODO Optimistic locking or versioning
        }
        entity.setProject(projectRepository.getById(form.projectId()));
        entity.setContract(contractRepository.getById(form.contractId()));
        entity.setHourCategory(hourCategoryRepository.getById(form.hourCategoryId()));
        entity.setDate(form.date());
        entity.setStartTime(form.startTime());
        entity.setEndTime(form.endTime());
        entity.setDescription(form.description());
        return WorkLogEntryFormDTO.fromEntity(timeEntryRepository.saveAndFlush(entity));
    }

    public long calculateDurationInSecondsBetween(LocalDate date, LocalTime startTime, LocalTime endTime) {
        // TODO This is business logic that should go into the domain model (or at least into an application service)
        LocalDate endDate = date;
        if (!endTime.isAfter(startTime)) {
            endDate = date.plusDays(1);
        }
        var tz = ZoneId.systemDefault(); // TODO Get current user's time zone
        var from = date.atTime(startTime).atZone(tz);
        var to = endDate.atTime(endTime).atZone(tz);
        return Duration.between(from, to).toSeconds();
    }

    @Override
    public List<WorkLogListEntryDTO> list(Pageable pageable, @Nullable Filter filter) {
        // TODO Apply filters
        return timeEntryRepository.findAll(pageable).stream().map(WorkLogListEntryDTO::fromEntity).toList();
    }
}
