import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

const SettingsPage = () => {
  const { userID } = useLocalSearchParams();
  const [deleteAccountError, setDeleteAccountError] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");

  const handleDeleteAccount = async () => {
    // Checks to make sure that the user answered all
    // the fields and passwords are matching
    if (!id) {
      setDeleteAccountError("⚠️ Please enter an id.");
      return;
    } else if (!email) {
      setDeleteAccountError("⚠️ Please enter id's email.");
      return;
    }

    // Checks to delete the user
    try {
      const response = await axios.delete(
        `http://localhost:8080/users/admin/${id}`,
        {
          data: {
            email: email,
          },
        }
      );
      if (
        response.status === 200 &&
        response.data === "✅ User deleted successfully!"
      ) {
        router.replace(`/viewUsers?userID=${encodeURIComponent(userID)}`);
      }
    } catch (error) {
      if (error.response) {
        setDeleteAccountError(`${error.response.data}`);
        console.log(
          "Error deleting user (server response): ",
          error.response.data
        );
      } else if (error.request) {
        setDeleteAccountError("Error: No response from server");
        console.log(
          "Error deleting user (no server response): ",
          error.request
        );
      } else {
        setDeleteAccountError("Error: An unexpected error occurred");
        console.log("Error deleting user (unexpected): ", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Deleting User's Account</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter ID"
            value={id}
            onChangeText={setId}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <Text style={styles.errorText}>{deleteAccountError}</Text>
        <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>Delete Account</Text>
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
    backgroundColor: "#ff0000",
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

export default SettingsPage;
