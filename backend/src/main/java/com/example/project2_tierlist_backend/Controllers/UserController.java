package com.example.project2_tierlist_backend.Controllers;

import com.example.project2_tierlist_backend.models.User;
import com.example.project2_tierlist_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:8081")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Use BCrypt for hashing and verification
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // User Registration with Hashed Password
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("⚠️ Email already exists!");
        }

        System.out.println("🔍 [REGISTER] Raw Password: " + user.getPassword());

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);

        return ResponseEntity.ok("✅ User registered successfully!");
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User userDetails) {
        Optional<User> user = userRepository.findByEmail(userDetails.getEmail());

        if (user.isPresent()) {
            String storedPassword = user.get().getPassword();
            String enteredPassword = userDetails.getPassword();

            System.out.println("🔍 [LOGIN] Stored Password: " + storedPassword);
            System.out.println("🔍 [LOGIN] Entered Password: " + enteredPassword);

            if (passwordEncoder.matches(enteredPassword, storedPassword)) {
                return ResponseEntity.ok("✅ Login successful!");
            } else {
                System.out.println("❌ [LOGIN] Password Mismatch");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid email or password.");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid email or password.");
    }

//    update user using patch method
    @PatchMapping("/{id}")
    public ResponseEntity<String> patchUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            updates.forEach((key, value) -> {
                switch (key) {
                    case "name" -> user.setName((String) value);
                    case "image" -> user.setImage((String) value);
                    case "isAdmin" -> user.setIsAdmin(Boolean.valueOf(value.toString()));
                    // Add more fields here if needed
                }
            });

            userRepository.save(user);
            return ResponseEntity.ok("✅ User updated successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ User not found.");
        }
    }
    @PatchMapping("/update-password")
    public ResponseEntity<String> patchUpdatePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String storedHashedPassword = user.getPassword();

            if (passwordEncoder.matches(oldPassword, storedHashedPassword)) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return ResponseEntity.ok("✅ Password updated successfully!");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Incorrect old password.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Email not found.");
        }
    }

    // Get All Users
    @GetMapping("/")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get User's ID by email
    @GetMapping("/userIDLogin")
    public ResponseEntity<Object> getIdByEmail(@RequestParam("email") String email) {
        Optional<User> user = userRepository.findByEmail(email);

        // second check to make sure user exists
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get().getId());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ User doesn't exist.");
        }
    }

    // Get User by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}/admin-update-password")
    public ResponseEntity<String> adminUpdatePassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String newPassword = request.get("newPassword");
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok("✅ Password updated by admin");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ User not found.");
    }

    // Update User (Only name and image can be updated)
    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setName(userDetails.getName());
            user.setImage(userDetails.getImage());
            userRepository.save(user);
            return ResponseEntity.ok("✅ User updated successfully!");
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id, @RequestBody(required = false) Map<String, String> request) {
        if (request == null || !request.containsKey("password") || request.get("password").isEmpty()) {  // Check if password is provided
            System.out.println("❌ [DELETE USER] No password provided!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ Password is required to delete account.");
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String enteredPassword = request.get("password");

            if (passwordEncoder.matches(enteredPassword, user.getPassword())) {  // Verify password before deleting
                userRepository.deleteById(id);
                System.out.println("✅ [DELETE USER] User deleted successfully!");
                return ResponseEntity.ok("✅ User deleted successfully!");
            } else {
                System.out.println("❌ [DELETE USER] Incorrect password!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Incorrect password.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ User not found.");
        }
    }

    // Delete User on Admin Side (Deletes after entering Email)
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> adminDeleteUser(@PathVariable Long id, @RequestBody Map<String, String> request) {
        if (request == null || !request.containsKey("email") || request.get("email").isEmpty()) {
            System.out.println("❌ [DELETE USER] No email provided!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ Email is required to delete account.");
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String enteredEmail = request.get("email");

            if (user.getEmail().equals(enteredEmail)) {
                userRepository.deleteById(id);
                System.out.println("✅ [DELETE USER] User deleted successfully!");
                return ResponseEntity.ok("✅ User deleted successfully!");
            } else {
                System.out.println("❌ [DELETE USER] Incorrect email!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Incorrect email.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ User not found.");
        }
    }

    // Password reset
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        System.out.println("🔍 [DEBUG] forgotPassword() called!");

        String email = request.get("email");
        System.out.println("🔍 [DEBUG] Email Received: " + email);

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            // Generate a temporary password
            String tempPassword = UUID.randomUUID().toString().substring(0, 8);
            User user = userOpt.get();
            System.out.println("🔍 [FORGOT PASSWORD] Temp Password: " + tempPassword);

            user.setPassword(passwordEncoder.encode(tempPassword)); // Hash temp password
            userRepository.save(user);

            System.out.println("✅ [FORGOT PASSWORD] Password Updated Successfully!");

            return ResponseEntity.ok("Temporary password: " + tempPassword);
        } else {
            System.out.println("❌ [FORGOT PASSWORD] Email Not Found: " + email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Email not found.");
        }
    }

    // Password update
    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String storedHashedPassword = user.getPassword();

            System.out.println("🔍 [UPDATE PASSWORD] Stored Password (Hashed): " + storedHashedPassword);
            System.out.println("🔍 [UPDATE PASSWORD] Old Password Entered: " + oldPassword);

            if (passwordEncoder.matches(oldPassword, storedHashedPassword)) {
                user.setPassword(passwordEncoder.encode(newPassword)); // Hash new password
                userRepository.save(user);
                System.out.println("✅ [UPDATE PASSWORD] Password Updated Successfully!");
                return ResponseEntity.ok("✅ Password updated successfully!");
            } else {
                System.out.println("❌ [UPDATE PASSWORD] Incorrect Old Password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Incorrect old password.");
            }
        } else {
            System.out.println("❌ [UPDATE PASSWORD] Email Not Found: " + email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Email not found.");
        }
    }
}