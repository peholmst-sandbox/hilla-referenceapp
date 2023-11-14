package org.vaadin.referenceapp.workhours.adapter.keycloak;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;

import java.util.Collection;
import java.util.Collections;
import java.util.stream.Stream;

class KeycloakGrantedAuthoritiesMapper implements GrantedAuthoritiesMapper {

    @Override
    public Collection<? extends GrantedAuthority> mapAuthorities(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
                .filter(OidcUserAuthority.class::isInstance)
                .map(OidcUserAuthority.class::cast)
                .flatMap(this::extractRolesFrom)
                .toList();
    }

    @SuppressWarnings("unchecked")
    private Stream<? extends GrantedAuthority> extractRolesFrom(OidcUserAuthority authority) {
        var roles = (Collection<String>) authority.getAttributes().getOrDefault("roles", Collections.emptyList());
        return roles.stream().map(String::toUpperCase).map(SimpleGrantedAuthority::new);
    }
}
