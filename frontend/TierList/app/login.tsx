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
import { Image } from "expo-image";
import { useFonts } from "expo-font";

const LoginPage = () => {
  const [loginError, setLoginError] = useState("");

  const [fontsLoaded] = useFonts({
    "Silverknife-RegularItalic": require("@/assets/fonts/Silverknife-RegularItalic.otf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const logo = require("@/assets/images/HotTakesLogo.png");
  const footerLogo = require("@/assets/images/CSUMB-COS-Logo.png");

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

  const handleSignup = () => {
    router.push("/signup");
  }

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logoImage} resizeMode="contain" />
      <View style={styles.card}>
        <Text style={styles.title}>LOG IN</Text>
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
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
        <Text style={styles.accountText}><br/><br/>
        Don't have an account? {" "}
        <TouchableOpacity onPress={handleSignup}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
        </Text>
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Image
          source={footerLogo}
          style={styles.footerImage}
          resizeMode="contain"
        />
        <Text style={styles.footerText}>
          CST438 2025© Jayson Basilio, Julio Fernandez, Ozzie Munoz, Ahmed Torki
          <br />
          Tier List Project 02 - Hot Takes
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  logoImage: {
    width: "5%",
    height: undefined,
    aspectRatio: 1,
    margin: "1%",
  },
  card: {
    backgroundColor: "#1f2022",
    padding: 20,
    borderRadius: 10,
    width: "30%",
    height: "60%",
  },
  title: {
    fontSize: "300%",
    color: "#ffcf33",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Silverknife-RegularItalic",
    letterSpacing: 2,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    color: "#fcfcfc",
    marginBottom: 5,
    fontFamily: "Arial",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#4E5056",
    borderRadius: 5,
    fontSize: 14,
    backgroundColor: "#1f2022",
    color: "#fcfcfc",
    fontFamily: "Arial",
  },
  loginButton: {
    padding: 12,
    backgroundColor: "#e1342c",
    borderRadius: 100,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 19,
    fontFamily: "Arial",
  },
  accountText: {
    color: "#737476",
    fontSize: 15,
    fontFamily: "Arial",
  },
  signupLink: {
    color: "#1d9bf2",
    fontFamily: "Arial",
  },
  errorText: {
    color: "#e1342c",
    fontSize: 16,
    fontFamily: "Arial",
  },
  footer: {
    position: "absolute",
    bottom: "0%",
    left: "0%",
    right: "0%",
    backgroundColor: "#b5c8da",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 2,
    borderTopColor: "#fcfcfc",
  },
  footerImage: {
    width: 125,
    height: 40,
    marginBottom: 5,
    resizeMode: "contain",
  },
  footerText: {
    color: "#31456b",
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
    justifyContent: "center",
    fontFamily: "Arial",
  },
});

export default LoginPage;
