import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";

const LandingPage = () => {
  // visibility of admin buttons (should only be visible to admin users)
  const [isAdminPermsVisible, setAdminPermsVisible] = useState(false);
  const [userName, setUserName] = useState(true);
  const { userID } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleGetUserData();
  }, []);

  const handleGetUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/${userID}`);
      setUserName(response.data.name);
      
      // haven't tested fully due to no admin user
      if (response.data.isAdmin) {
        toggleAdminPermsVisibility();
      }
    } catch (error) {
      console.log("Error getting user's data: ", error);
    } finally {
      setLoading(false);
    }
  }

  // Viewing Tier lists
  // currently goes to creating a tier list
  const handleTierLists = () => {
    router.push(`/tierList?userID=${encodeURIComponent(userID)}`);
  };

  const handlePastTierLists = () => {
    router.push(`/pastTierLists?userID=${encodeURIComponent(userID)}`);
  };

  const toggleAdminPermsVisibility = () => {
    setAdminPermsVisible(!isAdminPermsVisible);
  };

  // Viewing all users created
  const handleViewUsers = () => {
    router.push(`/viewUsers?userID=${encodeURIComponent(userID)}`);
  };

  const handleCreateUsers = () => {
    // should have popup or something to create users
    router.push(`/createAccount?userID=${encodeURIComponent(userID)}`);
  };

  const handleUpdateUsers = () => {
    // should have popup or something to update a user's account details
    alert("*Pressed button to update a user's account details*");
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
      <Text>Welcome, {userName}</Text>

      <TouchableOpacity style={styles.button} onPress={handleTierLists}>
        <Text style={styles.buttonText}>View Tier Lists</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handlePastTierLists}>
        <Text style={styles.buttonText}>View Past Tier Lists</Text>
      </TouchableOpacity>

      {isAdminPermsVisible && (
  <>
    <TouchableOpacity style={styles.adminButton} onPress={handleViewUsers}>
      <Text style={styles.adminButtonText}>View & Edit Users</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.adminButton} onPress={handleCreateUsers}>
      <Text style={styles.adminButtonText}>Create a New User</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.adminButton} onPress={handleUpdateUsers}>
      <Text style={styles.adminButtonText}>Update a User's Account Details</Text>
    </TouchableOpacity>
  </>
)}

      <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
        <Text style={styles.settingsButtonText}>⚙️ Settings ⚙️</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // general button style for a quick style
  button: {
    backgroundColor: "#227755",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 15,
    color: "#fff",
  },
  adminButton: {
    backgroundColor: "#0D0208",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  adminButtonText: {
    fontSize: 15,
    color: "#00FF41",
  },
  settingsButton: {
    backgroundColor: "#898989",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  settingsButtonText: {
    fontSize: 15,
    color: "#fff",
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  logoutButtonText: {
    fontSize: 15,
    color: "#fff",
  },
});

export default LandingPage;
