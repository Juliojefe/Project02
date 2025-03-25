import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { Image } from "expo-image";
import React from "react";

const LandingPage = () => {
  // visibility of admin buttons (should only be visible to admin users)
  const [isAdminPermsVisible, setAdminPermsVisible] = useState(false);
  const [userName, setUserName] = useState(true);
  const { userID } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  const landingLogo = require("@/assets/images/HotTakesLogoWithRightText.png");
  const brainLogo = require("@/assets/images/yellingBrains.jpg");
  const footerLogo = require("@/assets/images/CSUMB-COS-Logo.png");

  useEffect(() => {
    handleGetUserData();
  }, []);

  const handleGetUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/${userID}`);
      setUserName(response.data.name);

      if (response.data.isAdmin) {
        toggleAdminPermsVisibility();
      }
    } catch (error) {
      console.log("Error getting user's data: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Viewing Tier lists
  // currently goes to creating a tier list
  const handleTierLists = () => {
    router.push(`/viewCurrentSubjects?userID=${encodeURIComponent(userID)}`);
  };

  const handlePastTierLists = () => {
    router.push(`/pastTierLists?userID=${encodeURIComponent(userID)}`);
  };

  const toggleAdminPermsVisibility = () => {
    setAdminPermsVisible(true);
  };

  // Viewing all users created
  const handleViewUsers = () => {
    router.push(`/viewUsers?userID=${encodeURIComponent(userID)}`);
  };

  const handleCreateUsers = () => {
    // should have popup or something to create users
    router.push(`/createAccount?userID=${encodeURIComponent(userID)}`);
  };

  // View Settings Functionality
  const handleSettings = () => {
    // not very security safe since userID can be changed in link to view another user's account
    router.push(`/settings?userID=${encodeURIComponent(userID)}`);
  };

  // Logout Functionality
  const handleLogout = () => {
    // should go back to home page
    router.dismissAll();
    router.replace("/");
  };

  const handleHome = () => {
    router.push(`/landing?userID=${encodeURIComponent(userID)}`)
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.headerContainer}>
          <Image source={landingLogo} style={styles.logoImage} resizeMode="contain" />
        </View>
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navButton} onPress={handleHome}>Home</TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleTierLists}>Create new Tier List</TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleSettings}>Settings</TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleLogout}>Log Out</TouchableOpacity>
        </View>
      </View>

      <View style={styles.columnContainer}>
        <View style={styles.leftColumn}>
        <Text style={styles.welcomeText}>Welcome,  {userName}<br/><br/></Text>
          <TouchableOpacity style={styles.currentTierListButton} onPress={handleTierLists}>
            <Text style={styles.buttonText}>Create a New Tier List</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pastTierListButton} onPress={handlePastTierLists}>
            <Text style={styles.buttonText}>View Past Tier Lists</Text>
          </TouchableOpacity>

          {isAdminPermsVisible && (
            <>
              <TouchableOpacity
                style={styles.adminButton}
                onPress={handleViewUsers}
              >
                <Text style={styles.adminButtonText}>View & Edit Users</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.adminButton}
                onPress={handleCreateUsers}
              >
                <Text style={styles.adminButtonText}>Create a New User</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.rightColumn}>
        <Image source={brainLogo} style={styles.brainImage} resizeMode="contain" />
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
    alignItems: "center",
    backgroundColor: "#1f2022",
  },
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  },
  navButton: {
    paddingHorizontal: 15,
    color: "#fcfcfc",
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  columnContainer: {
    flex: 1,
    flexDirection: "row",
    paddingBottom: 50,
    backgroundColor: "#1f2022",
  },
  leftColumn: {
    flex: 1,
    padding: "5%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#1f2022",
  },
  rightColumn: {
    flex: 1,
    padding: "5%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#1f2022",
  },
  welcomeText: {
    color: "#fcfcfc",
    fontWeight: "bold",
    fontSize: 30,
    fontFamily: "Arial",
  },
  currentTierListButton: {
    backgroundColor: "#761511",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 100,
    marginBottom: 15,
  },
  pastTierListButton: {
    backgroundColor: "#f07b16",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 100,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 20,
    color: "#fcfcfc",
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  adminButton: {
    backgroundColor: "#0a0a0a",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 100,
    marginBottom: 15,
  },
  adminButtonText: {
    fontSize: 20,
    color: "#0cce6b",
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  brainImage: {
    width: "125%",
    height: undefined,
    aspectRatio: 2.25,
    marginLeft: "-20%",
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

export default LandingPage;
