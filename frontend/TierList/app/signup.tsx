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

const SignupPage = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  const [fontsLoaded] = useFonts({
    "Silverknife-RegularItalic": require("@/assets/fonts/Silverknife-RegularItalic.otf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const logo = require("@/assets/images/HotTakesLogo.png");
  const footerLogo = require("@/assets/images/CSUMB-COS-Logo.png");

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
      setSignupError("⚠️ Your passwords don't match.");
      return;
    } else if ((user.password).length < 6 || !(user.password).match(/\W/)) { // Password Rules
      setSignupError("⚠️ Your password must be at least 6 characters and have 1 special character.");
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

  const handleLogin = () => {
    router.push("/login");
  }

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logoImage} resizeMode="contain" />
      <View style={styles.card}>
        <Text style={styles.heading}>CREATE A NEW ACCOUNT</Text>
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
        {/* <View style={styles.signupButtonContainer}> */}
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign up</Text>
        </TouchableOpacity>
        {/* </View> */}
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginLink}><br/><br/>Already have an Account?</Text>
        </TouchableOpacity>
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
    height: "70%",
  },
  heading: {
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
  signupButtonContainer: {
    justifyContent: "center",
    width: "50%",
  },
  signupButton: {
    padding: 12,
    backgroundColor: "#f07b16",
    borderRadius: 100,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: "25%",
  },
  signupButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 19,
    fontFamily: "Arial",
  },
  errorText: {
    textAlign: "center",
    color: "#e1342c",
    fontSize: 16,
    fontFamily: "Arial",
  },
  loginLink: {
    color: "#1d9bf2",
    textAlign: "center",
    fontSize: 15,
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

export default SignupPage;