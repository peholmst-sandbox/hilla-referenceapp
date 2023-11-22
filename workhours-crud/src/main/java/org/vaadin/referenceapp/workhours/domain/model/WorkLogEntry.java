package org.vaadin.referenceapp.workhours.domain.model;

import jakarta.persistence.*;
import org.vaadin.referenceapp.workhours.domain.base.BaseAuditedEntity;

import java.time.ZonedDateTime;

@Entity
@Table(name = "work_log_entries")
public class WorkLogEntry extends BaseAuditedEntity<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "project_id", nullable = false)
    @ManyToOne(optional = false)
    private Project project;

    @JoinColumn(name = "contract_id", nullable = false)
    @ManyToOne(optional = false)
    private Contract contract;

    @JoinColumn(name = "hour_category_id", nullable = false)
    @ManyToOne(optional = false)
    private HourCategory hourCategory;

    @Column(name = "start_time", nullable = false)
    private ZonedDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private ZonedDateTime endTime;

    @Column(name = "description")
    private String description;

    @Override
    public Long getId() {
        return id;
    }

    // TODO Add validation

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Contract getContract() {
        return contract;
    }

    public void setContract(Contract contract) {
        this.contract = contract;
    }

    public HourCategory getHourCategory() {
        return hourCategory;
    }

    public void setHourCategory(HourCategory hourCategory) {
        this.hourCategory = hourCategory;
    }

    public ZonedDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(ZonedDateTime startTime) {
        this.startTime = startTime;
    }

    public ZonedDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(ZonedDateTime endTime) {
        this.endTime = endTime;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
