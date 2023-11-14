package org.vaadin.referenceapp.workhours.adapter.keycloak;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;

@Configuration
class KeycloakConfig {

    private final String serverUrl;
    private final String realm;

    KeycloakConfig(@Value("${spring.security.oauth2.client.provider.keycloak.issuer-uri}") String issuerUri) {
        var splitter = issuerUri.indexOf("/realms/");
        serverUrl = issuerUri.substring(0, splitter + 1);
        realm = issuerUri.substring(splitter + 8);
    }

    @Bean
    public Keycloak keycloak(@Value("${spring.security.oauth2.client.registration.keycloak.client-id}") String clientId,
                             @Value("${spring.security.oauth2.client.registration.keycloak.client-secret}") String clientSecret) {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .build();
    }

    @Bean
    public KeycloakUserDetailsRepository keycloakUserDetailsRepository(Keycloak keycloak) {
        return new KeycloakUserDetailsRepository(keycloak, realm);
    }

    @Bean
    public GrantedAuthoritiesMapper grantedAuthoritiesMapper() {
        return new KeycloakGrantedAuthoritiesMapper();
    }
}
