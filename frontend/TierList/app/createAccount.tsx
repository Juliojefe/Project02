import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  CheckBox,
  ScrollView,
  ActivityIndicator
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Image } from "expo-image";
import { useFonts } from "expo-font";

const CreateAccountPage = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [createError, setCreateError] = useState("");
  const { userID } = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    "Silverknife-RegularItalic": require("@/assets/fonts/Silverknife-RegularItalic.otf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const landingLogo = require("@/assets/images/HotTakesLogoWithRightText.png");
  const footerLogo = require("@/assets/images/CSUMB-COS-Logo.png");

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

  const handleHome = useCallback(() => {
    if (router.pathname !== "/landing") {
      router.push(`/landing?userID=${encodeURIComponent(userID)}`);
    }
  }, [userID]);

  // Viewing Tier lists
  const handleTierLists = useCallback(() => {
    if (router.pathname !== "/viewCurrentSubjects") {
      router.push(`/viewCurrentSubjects?userID=${encodeURIComponent(userID)}`);
    }
  }, [userID]);

  // View Settings Functionality
  const handleSettings = useCallback(() => {
    if (router.pathname !== "/settings") {
      router.push(`/settings?userID=${encodeURIComponent(userID)}`);
    }
  }, [userID]);

  // Logout Functionality
  const handleLogout = () => {
    router.dismissAll();
    router.replace("/");
  };

  return (
    <ScrollView style={styles.scrollContainer}>
    <View style={styles.container}>
      <View>
        <View style={styles.headerContainer}>
          <Image
            source={landingLogo}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navButton} onPress={handleHome}>
            Home
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleTierLists}>
            Create new Tier List
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleSettings}>
            Settings
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleLogout}>
            Log Out
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.card}>
          <Text style={styles.heading}>CREATE A NEW ACCOUNT</Text>
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
            <Text style={styles.label}>{`Admin User?    `}</Text>
            <CheckBox
              value={user.isAdmin}
              onValueChange={(boolean) => handleChange("isAdmin", boolean)}
              style={styles.checkbox}
            />
          </View>
          <Text style={styles.errorText}>{createError}</Text>
          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={handleCreateAccount}
          >
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#1f2022",
  },
  container: {
    backgroundColor: "#1f2022",
    minHeight: "100vh",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    flexGrow: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  logoImage: {
    width: "18%",
    height: undefined,
    aspectRatio: 2.5,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    backgroundColor: "#0a0a0a",
  },
  navButton: {
    paddingHorizontal: 15,
    color: "#fcfcfc",
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  mainContent: {
    flex: 1,
    marginTop: "2%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 100,
  },
  card: {
    backgroundColor: "#131515",
    padding: 20,
    borderRadius: 10,
    width: "30%",
    minHeight: "100%",
    flexGrow: 1,
  },
  heading: {
    fontSize: "250%",
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
    backgroundColor: "#131515",
    color: "#fcfcfc",
    fontFamily: "Arial",
  },
  createAccountButton: {
    padding: 12,
    backgroundColor: "#f07b16",
    borderRadius: 100,
    alignItems: "center",
    marginTop: 10,
  },
  createAccountButtonText: {
    color: "#fcfcfc",
    fontWeight: "bold",
    fontSize: 19,
    fontFamily: "Arial",
  },
  errorText: {
    color: "#e1342c",
    fontSize: 16,
    fontFamily: "Arial",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  checkbox: {
    alignSelf: "center",
  },
  footer: {
    backgroundColor: "#b5c8da",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 2,
    borderTopColor: "#fcfcfc",
    marginTop: "auto",
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

export default CreateAccountPage;