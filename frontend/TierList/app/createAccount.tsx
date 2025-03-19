import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  CheckBox
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

const CreateAccountPage = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [createError, setCreateError] = useState("");
  const { userID } = useLocalSearchParams();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const handleChange = (name, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleCreateAccount = async () => {
    // Checks to make sure that the user answered all
    // the fields and passwords are matching
    if (!user.name || !user.email || !user.password) {
      setCreateError("⚠️ Please enter a name, email, and password.");
      return;
    } else if (!confirmPassword) {
      setCreateError("⚠️ Please re-enter your password.");
      return;
    } else if (user.password != confirmPassword) {
      setCreateError("⚠️ The passwords don't match.");
      return;
    } else if (user.password.length < 6 || !user.password.match(/\W/)) {
      // Password Rules
      setCreateError(
        "⚠️ The password must be at least 6 characters and have 1 special character."
      );
      return;
    }

    // Checks to create the user and admin will be routed to landing page if account creation is successful
    try {
      const response = await axios.post(
        "http://localhost:8080/users/register",
        {
          name: user.name,
          email: user.email,
          password: user.password,
          isAdmin: user.isAdmin,
        }
      );
      if (
        response.status === 200 &&
        response.data === "✅ User registered successfully!"
      ) {
        router.push(`/landing?userID=${encodeURIComponent(userID)}`);
      }
    } catch (error) {
      if (error.response) {
        setCreateError(`${error.response.data}`);
        console.log(
          "Error registering user (server response): ",
          error.response.data
        );
      } else if (error.request) {
        setCreateError("Error: No response from server");
        console.log(
          "Error registering user (no server response): ",
          error.request
        );
      } else {
        setCreateError("Error: An unexpected error occurred");
        console.log("Error registering user (unexpected): ", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Create an Account</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            value={user.name}
            onChangeText={(text) => handleChange("name", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={user.email}
            onChangeText={(text) => handleChange("email", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry
            value={user.password}
            onChangeText={(text) => handleChange("password", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>
            {`Admin User?    `}
          </Text>
          <CheckBox
            value={user.isAdmin}
            onValueChange={(boolean) => handleChange("isAdmin", boolean)}
            style={styles.checkbox}
          />
        </View>
        <Text style={styles.errorText}>{createError}</Text>
        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Create Account</Text>
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
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  checkbox: {
    alignSelf: "center",
  },
  checkBoxLabel: {
    margin: 8,
  },
});

export default CreateAccountPage;