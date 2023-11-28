package org.vaadin.referenceapp.workhours.adapter.hilla.identity;

import dev.hilla.BrowserCallable;
import dev.hilla.Nullable;
import jakarta.annotation.security.PermitAll;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.vaadin.referenceapp.workhours.domain.model.identity.UserDetailsRepository;
import org.vaadin.referenceapp.workhours.domain.primitives.UserId;

import java.util.List;

@BrowserCallable
@PermitAll
@SuppressWarnings("unused") // Otherwise IntelliJ IDEA will complain
class UserDirectory {

    private static final Logger log = LoggerFactory.getLogger(UserDirectory.class);

    private final UserDetailsRepository userDetailsRepository;

    UserDirectory(UserDetailsRepository userDetailsRepository) {
        this.userDetailsRepository = userDetailsRepository;
    }

    public @Nullable UserDetailsDTO findByUserId(String userId) {
        return userDetailsRepository.findByUserId(UserId.fromString(userId))
                .map(UserDetailsDTO::fromEntity)
                .orElseGet(() -> {
                    log.debug("User not found: {}", userId);
                    return null;
                });
    }

    public List<UserDetailsDTO> findByUsername(String username, boolean exactMatch) {
        return userDetailsRepository.findByUsername(username, exactMatch)
                .stream()
                .map(UserDetailsDTO::fromEntity)
                .toList();
    }
}
