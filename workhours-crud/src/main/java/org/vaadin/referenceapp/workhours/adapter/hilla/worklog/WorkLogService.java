package org.vaadin.referenceapp.workhours.adapter.hilla.worklog;

import dev.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.transaction.annotation.Transactional;
import org.vaadin.referenceapp.workhours.domain.model.ContractRepository;
import org.vaadin.referenceapp.workhours.domain.model.HourCategoryRepository;
import org.vaadin.referenceapp.workhours.domain.model.ProjectRepository;
import org.vaadin.referenceapp.workhours.domain.model.WorkLogEntryRepository;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Optional;

@BrowserCallable
@RolesAllowed("ROLE_EMPLOYEE") // Replace with constant
class WorkLogService {

    private final ProjectRepository projectRepository;
    private final ContractRepository contractRepository;
    private final WorkLogEntryRepository workLogEntryRepository;
    private final HourCategoryRepository hourCategoryRepository;

    WorkLogService(ProjectRepository projectRepository,
                   ContractRepository contractRepository,
                   WorkLogEntryRepository workLogEntryRepository,
                   HourCategoryRepository hourCategoryRepository) {
        this.projectRepository = projectRepository;
        this.contractRepository = contractRepository;
        this.workLogEntryRepository = workLogEntryRepository;
        this.hourCategoryRepository = hourCategoryRepository;
    }

    public Optional<WorkLogEntryFormDTO> loadForm(long workLogEntryId) {
        return workLogEntryRepository.findById(workLogEntryId).map(WorkLogEntryFormDTO::fromEntity);
    }

    @Transactional
    public WorkLogEntryFormDTO saveForm(WorkLogEntryFormDTO form) {
        if (form.description() != null && form.description().contains("fail")) {
            throw new RuntimeException("This is an unexpected error!"); // Used for testing the client side error handler
        }

        return WorkLogEntryFormDTO.fromEntity(workLogEntryRepository.saveAndFlush(form.toEntity(
                workLogEntryRepository::findAllById,
                projectRepository::findAllById,
                contractRepository::findAllById,
                hourCategoryRepository::findAllById)
        ));
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
}
