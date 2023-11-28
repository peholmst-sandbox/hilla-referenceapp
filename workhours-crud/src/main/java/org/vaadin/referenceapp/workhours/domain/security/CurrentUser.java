package org.vaadin.referenceapp.workhours.domain.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.vaadin.referenceapp.workhours.domain.primitives.UserId;

import java.time.ZoneId;

@Service
public class CurrentUser {

    CurrentUser() {
    }

    public UserId userId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new AccessDeniedException("Authentication required");
        }
        return UserId.fromString(authentication.getName());
    }

    public boolean hasRole(String role) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(role));
    }

    public ZoneId timeZone() {
        return ZoneId.systemDefault(); // TODO Replace with user's actual timezone (from preferences)
    }
}
