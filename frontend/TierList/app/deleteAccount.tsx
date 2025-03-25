import React, { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Image } from "expo-image";
import { useFonts } from "expo-font";

const DeleteAccountPage = () => {
  const { userID } = useLocalSearchParams();
  const [deleteAccountError, setDeleteAccountError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
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

  const handleDeleteAccount = async () => {
    // Checks to make sure that the user answered all
    // the fields and passwords are matching
    if (!password) {
      setDeleteAccountError("⚠️ Please enter your password.");
      return;
    } else if (!confirmPassword) {
      setDeleteAccountError("⚠️ Please re-enter your password.");
      return;
    } else if (password != confirmPassword) {
      setDeleteAccountError("⚠️ Your passwords don't match.");
      return;
    }

    // Checks to delete the user and will be routed to home page if account deletion is successful
    try {
      const response = await axios.delete(
        `http://localhost:8080/users/${userID}`,
        {
          data: {
            password: password,
          },
        }
      );
      if (
        response.status === 200 &&
        response.data === "✅ User deleted successfully!"
      ) {
        router.dismissAll();
        router.replace("/");
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

  const handleHome = () => {
    if (router.pathname !== "/landing") {
      router.push(`/landing?userID=${encodeURIComponent(userID)}`);
    }
  };

  // Viewing Tier lists
  const handleTierLists = () => {
    if (router.pathname !== "/viewCurrentSubjects") {
      router.push(`/viewCurrentSubjects?userID=${encodeURIComponent(userID)}`);
    }
  };

  // View Settings Functionality
  const handleSettings = () => {
    if (router.pathname !== "/settings") {
      router.push(`/settings?userID=${encodeURIComponent(userID)}`);
    }
  };

  // Logout Functionality
  const handleLogout = () => {
    router.dismissAll();
    router.replace("/");
  };

  return (
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
        <Text style={styles.heading}>DELETING YOUR OWN ACCOUNT</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
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
        <Text style={styles.errorText}>{deleteAccountError}</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>Delete Account</Text>
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
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#1f2022",
  },
  container: {
    flex: 1,
    backgroundColor: "#1f2022",
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
    flexGrow: 1,
    minHeight: 100,
  },
  heading: {
    fontSize: 50,
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
  deleteButton: {
    padding: 12,
    backgroundColor: "#761511",
    borderRadius: 100,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fcfcfc",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  errorText: {
    color: "#e1342c",
    fontSize: 16,
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

export default DeleteAccountPage;
