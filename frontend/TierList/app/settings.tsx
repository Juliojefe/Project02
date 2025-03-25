import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useFonts } from "expo-font";
import React, { useCallback } from "react";

const SettingsPage = () => {
  const { userID } = useLocalSearchParams();
  const userIdValue = Array.isArray(userID) ? userID[0] : userID;

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

  const handleAccountDetails = () => {
    // could do popup to change specific details or onChangeText in settings page and confirm button to update changes
    router.push(`/editUser?userID=${encodeURIComponent(userIdValue)}`);
  };

  const handleDeleteAccount = () => {
    router.push(`/deleteAccount?userID=${encodeURIComponent(userIdValue)}`);
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

      <Text style={styles.settingsHeader}>SETTINGS</Text>
      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.changeDetailsButton} onPress={handleAccountDetails}>
          <Text style={styles.changeDetailsButtonText}>Change Account Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteAccountButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#1f2022",
  },
  container: {
    flex: 1,
    backgroundColor: "#1f2022",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
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
  settingsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  settingsHeader: {
    fontSize: 50,
    color: "#ffcf33",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Silverknife-RegularItalic",
    letterSpacing: 2,
  },
  changeDetailsButton: {
    backgroundColor: "#0cce6b",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 100,
    marginVertical: 10,
  },
  changeDetailsButtonText: {
    fontSize: 20,
    color: "#fcfcfc",
    fontFamily: "Arial",
    fontWeight: "bold",
  },
  deleteAccountButton: {
    backgroundColor: "#e1342c",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 100,
    marginVertical: 10,
  },
  deleteAccountButtonText: {
    fontSize: 20,
    color: "#fcfcfc",
    fontFamily: "Arial",
    fontWeight: "bold",
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

export default SettingsPage;
