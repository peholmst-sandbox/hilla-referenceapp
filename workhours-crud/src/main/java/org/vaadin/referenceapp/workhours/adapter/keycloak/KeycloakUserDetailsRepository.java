package org.vaadin.referenceapp.workhours.adapter.keycloak;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.vaadin.referenceapp.workhours.domain.model.identity.UserDetails;
import org.vaadin.referenceapp.workhours.domain.model.identity.UserDetailsRepository;
import org.vaadin.referenceapp.workhours.domain.primitives.EmailAddress;
import org.vaadin.referenceapp.workhours.domain.primitives.UserId;

import javax.ws.rs.NotFoundException;
import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of {@link UserDetailsRepository} that uses Keycloak as the source of user details.
 */
class KeycloakUserDetailsRepository implements UserDetailsRepository {
    private final Keycloak keycloak;
    private final String realm;

    // TODO Cache user details

    KeycloakUserDetailsRepository(Keycloak keycloak, String realm) {
        this.keycloak = keycloak;
        this.realm = realm;
    }

    @Override
    public Optional<UserDetails> findByUserId(UserId userId) {
        var resource = keycloak.realm(realm).users().get(userId.toString());
        try {
            return Optional.of(toUserDetails(resource.toRepresentation()));
        } catch (NotFoundException ex) {
            return Optional.empty();
        }
    }

    @Override
    public List<UserDetails> findByUsername(String username, boolean exactMatch) {
        if (username.length() < 3) {
            return Collections.emptyList();
        }
        var resource = keycloak.realm(realm).users().searchByUsername(username, exactMatch);
        return resource.stream()
                .map(this::toUserDetails)
                .toList();
    }

    private UserDetails toUserDetails(UserRepresentation user) {
        return new UserDetails(
                UserId.fromString(user.getId()),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                Optional.ofNullable(user.getAttributes())
                        .map(attributes -> attributes.get("picture"))
                        .orElse(Collections.emptyList())
                        .stream()
                        .findFirst()
                        .map(URI::create)
                        .orElse(null),
                Optional.ofNullable(user.getEmail())
                        .map(EmailAddress::fromString)
                        .orElse(null)
        );
    }
}
