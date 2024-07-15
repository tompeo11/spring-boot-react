package com.tom.api.utility;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.tom.api.constant.SecurityConstant;
import com.tom.api.entity.domain.UserPrincipal;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class JWTTokenProvider {
    @Value("${jwt.secret}")
    private String secret;

    private String generateJwtToken(UserPrincipal userPrincipal) {
        List<String> authorities = new ArrayList<>();

        for (GrantedAuthority grantedAuthority : userPrincipal.getAuthorities()) {
            authorities.add(grantedAuthority.getAuthority());
        }

        String[] claims = authorities.toArray(new String[0]);

        return JWT.create()
                .withIssuer(SecurityConstant.COMPANY)
                .withAudience(SecurityConstant.APPLICATION_NAME)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstant.EXPIRATION_TIME))
                .withArrayClaim("authorities", claims)
                .withSubject(userPrincipal.getUsername())
                .sign(Algorithm.HMAC512(secret.getBytes()));
    }

    private JWTVerifier getJwtVerifier() {
        JWTVerifier verifier;

        try {
            Algorithm algorithm = Algorithm.HMAC512(secret);
            verifier = JWT.require(algorithm).withIssuer(SecurityConstant.COMPANY).build();
        }catch (JWTVerificationException e) {
            throw new JWTVerificationException(SecurityConstant.TOKEN_CANNOT_BE_VERIFIED);
        }

        return verifier;
    }

    public boolean isTokenValid(String username, String token) {
        JWTVerifier verifier = getJwtVerifier();

        Date expirationDate = verifier.verify(token).getExpiresAt();

        boolean isTokenExpired = expirationDate.before(new Date());

        return !isTokenExpired && StringUtils.isNotEmpty(username);
    }

    public List<GrantedAuthority> getAuthoritiesFromToken(String token) {
        JWTVerifier verifier = getJwtVerifier();

        String[] claims = verifier.verify(token).getClaim("authorities").asArray(String.class);

        return Stream.of(claims).map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }

    public String getSubject(String token) {
        JWTVerifier verifier = getJwtVerifier();
        return verifier.verify(token).getSubject();
    }

    public Authentication getAuthentication(String username, List<GrantedAuthority> authorities, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(username, null, authorities);

        usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        return usernamePasswordAuthenticationToken;
    }

}
