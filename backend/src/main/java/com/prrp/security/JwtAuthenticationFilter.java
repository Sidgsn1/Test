// package com.prrp.security;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// import org.springframework.stereotype.Component;
// import org.springframework.util.StringUtils;
// import org.springframework.web.filter.OncePerRequestFilter;

// import java.io.IOException;

// @Component
// @RequiredArgsConstructor
// public class JwtAuthenticationFilter extends OncePerRequestFilter {

//     private final JwtTokenProvider tokenProvider;
//     private final CustomUserDetailsService customUserDetailsService;

//     @Override
//     protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//             throws ServletException, IOException {
//         try {
//             String jwt = getJwtFromRequest(request);

//             if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
//                 String username = tokenProvider.getUsernameFromJWT(jwt);
//                 UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

//                 UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
//                         userDetails, null, userDetails.getAuthorities()
//                 );
//                 authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

//                 SecurityContextHolder.getContext().setAuthentication(authentication);
//             }
//         } catch (Exception ignored) {
//         }

//         filterChain.doFilter(request, response);
//     }

//     private String getJwtFromRequest(HttpServletRequest request) {
//         String bearerToken = request.getHeader("Authorization");
//         if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
//             return bearerToken.substring(7);
//         }
//         return null;
//     }
// }


package com.prrp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String jwt = getJwtFromRequest(request);

            // No token: continue as an unauthenticated request.
            if (!StringUtils.hasText(jwt)) {
                filterChain.doFilter(request, response);
                return;
            }

            // Invalid token: do not authenticate the user.
            if (!tokenProvider.validateToken(jwt)) {
                log.debug("Invalid JWT token for request: {}", request.getRequestURI());
                SecurityContextHolder.clearContext();

                filterChain.doFilter(request, response);
                return;
            }

            // Extract username from valid token.
            String username = tokenProvider.getUsernameFromJWT(jwt);

            UserDetails userDetails =
                    customUserDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception ex) {
            // Do not expose internal authentication errors to the client.
            log.warn("JWT authentication failed for request: {}",
                    request.getRequestURI(), ex);

            SecurityContextHolder.clearContext();
        }

        // Continue the filter chain.
        // Spring Security will decide whether authentication is required.
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {

        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken)
                && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        return null;
    }
}
