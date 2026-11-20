// package com.prrp.repository;

// import com.prrp.entity.Role;
// import com.prrp.entity.User;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// import java.util.List;
// import java.util.Optional;

// @Repository
// public interface UserRepository extends JpaRepository<User, Long> {
//     Optional<User> findByEmail(String email);
//     boolean existsByEmail(String email);
//     List<User> findByRole(Role role);
// }


package com.prrp.repository;

import com.prrp.entity.Role;
import com.prrp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoleAndIsActiveTrue(Role role);
}
