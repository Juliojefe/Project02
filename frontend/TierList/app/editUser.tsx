import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { Image } from "expo-image";
import { useFonts } from "expo-font";

export default function EditUserPage() {
  const router = useRouter();
  // "userID" comes from the query string ?userID=...
  const { userID } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [fontsLoaded] = useFonts({
    "Silverknife-RegularItalic": require("@/assets/fonts/Silverknife-RegularItalic.otf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const landingLogo = require("@/assets/images/HotTakesLogoWithRightText.png");
  const footerLogo = require("@/assets/images/CSUMB-COS-Logo.png");

  // Fetch existing user data to pre-fill fields
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/users/${userID}`);
        setName(res.data.name || "");
        setImage(res.data.image || "");
      } catch (error) {
        setErrorMessage("Could not load user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userID]);

  const handlePatchUser = async () => {
    setErrorMessage("");
    try {
      await axios.patch(`http://localhost:8080/users/${userID}`, {
        name: name,
        image: image,
      });
      Alert.alert("Success", "User updated successfully!");
      // Navigate back or wherever you want
      router.push(`/landing?userID=${encodeURIComponent(userID)}`);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Failed to update user.");
      }
    }
  };

  const handleHome = () => {
    router.push(`/landing?userID=${encodeURIComponent(userID)}`);
  };

  // Viewing Tier lists
  const handleTierLists = () => {
    router.push(`/viewCurrentSubjects?userID=${encodeURIComponent(userID)}`);
  };

  // View Settings Functionality
  const handleSettings = () => {
    router.push(`/settings?userID=${encodeURIComponent(userID)}`);
  };

  // Logout Functionality
  const handleLogout = () => {
    router.dismissAll();
    router.replace("/");
  };

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
        <Text style={styles.editHeader}>EDIT USER</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new image URL"
              value={image}
              onChangeText={setImage}
            />
          </View>

          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handlePatchUser}>
            <Text style={styles.buttonText}>Save Changes</Text>
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
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
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
  editHeader: {
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
  button: {
    padding: 12,
    backgroundColor: "#0cce6b",
    borderRadius: 100,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#0a0a0a",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  error: {
    color: "#e1342c",
    marginTop: 12,
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
