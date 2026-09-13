    package com.jobportal.security;

    import io.jsonwebtoken.*;
    import io.jsonwebtoken.security.Keys;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.stereotype.Component;

    import javax.crypto.SecretKey;
    import java.nio.charset.StandardCharsets;
    import java.util.Date;
    import java.util.function.Function;

    @Component
    public class JwtUtil {

        @Value("${jwt.secret}")
        private String secret;

        private SecretKey getSecretKey() {
            return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }

        private final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15; // 15 minutes

        public String generateToken(String email, String role) {
            return Jwts.builder()
                    .setSubject(email)
                    .claim("role", role)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                    .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                    .compact();
        }

        public String extractEmail(String token) {
            return extractClaim(token, Claims::getSubject);
        }

        public String extractRole(String token) {
            return extractAllClaims(token).get("role", String.class);
        }

        public boolean isTokenValid(String token, String email) {
            return extractEmail(token).equals(email) && !isTokenExpired(token);
        }

        private boolean isTokenExpired(String token) {
            return extractClaim(token, Claims::getExpiration).before(new Date());
        }

        private <T> T extractClaim(String token, Function<Claims, T> resolver) {
            Claims claims = extractAllClaims(token);
            return resolver.apply(claims);
        }

        private Claims extractAllClaims(String token) {
            return Jwts.parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }
    }