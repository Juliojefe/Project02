import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import { Image } from "expo-image";
import { useFonts } from "expo-font";

const AdminEditUserPage = () => {
  const { userID, selectedUserID } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/users/${selectedUserID}`
        );
        const user = res.data;
        setName(user.name);
        setImage(user.image || "");
        setIsAdmin(user.isAdmin);
        setEmail(user.email);
      } catch (err) {
        Alert.alert("Error", "Failed to load user data.");
      }
    };

    fetchUser();
  }, [selectedUserID]);

  const handleSave = async () => {
    try {
      // Update name, image, and admin status
      await axios.patch(`http://localhost:8080/users/${selectedUserID}`, {
        name,
        image,
        isAdmin,
      });

      // Update password if provided (admin override)
      if (newPassword) {
        await axios.put(
          `http://localhost:8080/users/${selectedUserID}/admin-update-password`,
          {
            newPassword,
          }
        );
      }

      Alert.alert("Success", "User updated successfully!");
      router.replace(`/viewUsers?userID=${selectedUserID}`); // go back to view
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update user.");
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
          <Text style={styles.adminEditHeader}>ADMIN: EDIT USER</Text>
          <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter new name"
            />
          </View>

          <View style={styles.inputContainer}>
          <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={image}
              onChangeText={setImage}
              placeholder="Enter new image URL"
            />
          </View>

          <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password (Optional)</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Admin Status</Text>
              <Switch value={isAdmin} onValueChange={setIsAdmin} />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
    flex: 1,
    backgroundColor: "#1f2022",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
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
  adminEditHeader: {
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  saveButton: {
    padding: 12,
    backgroundColor: "#0CCE6B",
    borderRadius: 100,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#0a0a0a",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
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

export default AdminEditUserPage;
