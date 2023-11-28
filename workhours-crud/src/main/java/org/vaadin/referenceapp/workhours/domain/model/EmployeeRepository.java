package org.vaadin.referenceapp.workhours.domain.model;

import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.vaadin.referenceapp.workhours.domain.base.BaseRepository;
import org.vaadin.referenceapp.workhours.domain.primitives.UserId;

import java.util.Optional;

public interface EmployeeRepository extends BaseRepository<Employee, Long> {

    Optional<Employee> findByUser(UserId user);

    default Employee getByUser(UserId user) {
        return findByUser(user).orElseThrow(() -> new IncorrectResultSizeDataAccessException("An employee corresponding to the user does not exist", 1, 0));
    }
}
