import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";
import axios from "axios";

const SignupPage = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (name, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    // Checks to make sure that the user answered all 
    // the fields and passwords are matching
    if (!user.name || !user.email || !user.password) {
      setSignupError("⚠️ Please enter your name, email, and password.");
      return;
    } else if (!confirmPassword) {
      setSignupError("⚠️ Please re-enter your password.")
      return;
    } else if (user.password != confirmPassword) {
      setSignupError("⚠️ Passwords don't match.");
      return;
    }

    // Checks to create the user and will be routed to login page if account creation is successful
    try {
      const response = await axios.post(
        "http://localhost:8080/users/register",
        {
          name: user.name,
          email: user.email,
          password: user.password,
        }
      );
      if (response.status === 200 && response.data === "✅ User registered successfully!") {
        console.log("User logged in successfully");
        router.push("/login");
      }
    } catch (error) {
      if (error.response) {
        setSignupError(`${error.response.data}`);
        console.log("Error registering user (server response): ", error.response.data);
    } else if (error.request) {
        setSignupError("Error: No response from server");
        console.log("Error registering user (no server response): ", error.request);
    } else {
        setSignupError("Error: An unexpected error occurred");
        console.log("Error registering user (unexpected): ", error.message);
    }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Greetings, let's get you situated.</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Name"
            value={user.name}
            onChangeText={(text) => handleChange("name", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Email"
            value={user.email}
            onChangeText={(text) => handleChange("email", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={user.password}
            onChangeText={(text) => handleChange("password", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        <Text style={styles.errorText}>{signupError}</Text>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: 300,
  },
  heading: {
    fontSize: 22,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  button: {
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default SignupPage;
