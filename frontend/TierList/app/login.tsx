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

const LoginPage = () => {
  const [loginError, setLoginError] = useState("");

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (name, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    // Checks to make sure that the user answered all
    if (!user.email || !user.password) {
      setLoginError("⚠️ Please enter your email and password.");
      return;
    }

    // Checks if the user exists and will be routed to landing page if login is successful
    try {
      const response = await axios.post("http://localhost:8080/users/login", {
        email: user.email,
        password: user.password,
      });
      console.log("User logged in successfully");
      const userIDResponse = await axios.get(
        `http://localhost:8080/users/userIDLogin?email=${encodeURIComponent(
          user.email
        )}`
      );
      // not very security safe since userID can be changed in link to view another user's account
      router.replace(`/landing?userID=${encodeURIComponent(userIDResponse.data)}`);
    } catch (error) {
      if (error.response) {
        setLoginError(`${error.response.data}`);
        console.log(
          "Error registering user (server response): ",
          error.response.data
        );
      } else if (error.request) {
        setLoginError("Error: No response from server");
        console.log(
          "Error registering user (no server response): ",
          error.request
        );
      } else {
        setLoginError("Error: An unexpected error occurred");
        console.log("Error registering user (unexpected): ", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Welcome Back!</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
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
        <Text style={styles.errorText}>{loginError}</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
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

export default LoginPage;
