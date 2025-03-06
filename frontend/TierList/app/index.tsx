import React, { useState, useEffect } from "react";
import axios from "axios";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const Index = () => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const getTitle = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users/title");
        setTitle(response.data);
        console.log("Response Data: ", response.data);
      } catch (error) {
        console.log("Error getting title: ", error);
      } finally {
        setLoading(false); // Set loading to false after request
      }
    };
    getTitle();
  }, []); // Run only once on mount

  const handleLogin = () => {
    router.push("/login");
  };
  
  const handleSignup = () => {
    router.push("/signup");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Our Tier List!</Text>
      <Text style={styles.description}>{title}</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Index;
