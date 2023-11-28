package org.vaadin.referenceapp.workhours.domain.model.identity;

import org.vaadin.referenceapp.workhours.domain.primitives.UserId;

import java.util.List;
import java.util.Optional;

public interface UserDetailsRepository {

    Optional<UserDetails> findByUserId(UserId userId);

    List<UserDetails> findByUsername(String username, boolean exactMatch);
}
