package org.vaadin.referenceapp.workhours.adapter.keycloak;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

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
    public OAuth2UserService<OidcUserRequest, OidcUser> oauth2UserService() {
        // Using a GrantedAuthoritiesMapper is not enough, you need to override the user service like this.
        // The reason is that the SSO Kit will ignore whatever the authorities mapper returns and instead
        // use the raw OidcUser object when fetching authorities.
        return new OidcUserService() {
            private final GrantedAuthoritiesMapper grantedAuthoritiesMapper = new KeycloakGrantedAuthoritiesMapper();

            @Override
            public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
                var original = super.loadUser(userRequest);
                return new DefaultOidcUser(grantedAuthoritiesMapper.mapAuthorities(original.getAuthorities()), original.getIdToken(), original.getUserInfo()); // TODO nameAttributeKey
            }
        };
    }
}
