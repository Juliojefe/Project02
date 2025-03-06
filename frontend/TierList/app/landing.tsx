import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

const LandingPage = () => {
  // visibility of admin buttons (should only be visible to admin users)
  const [isAdminPermsVisible, setAdminPermsVisible] = useState(true);

  // Viewing Tier lists
  const handleTierLists = () => {
    alert("*Pressed button to view tier lists*");
  };

  const toggleAdminPermsVisibility = () => {
    setAdminPermsVisible(!isAdminPermsVisible);
  };

  const handleViewUsers = () => {
    // should go to page of a list of all users (normal users shouldn't be able to get there)
    alert("*Pressed button to view all users*");
  };

  const handleCreateUsers = () => {
    // should have popup or something to create users
    alert("*Pressed button to create a new user*");
  };

  const handleDeleteUsers = () => {
    // should have popup or something to delete specific user
    alert("*Pressed button to delete a user*");
  };

  const handleUpdateUsers = () => {
    // should have popup or something to update a user's account details
    alert("*Pressed button to update a user's account details*");
  };

  // View Settings Functionality
  const handleSettings = () => {
    router.push("/settings");
  };

  // Logout Functionality
  const handleLogout = () => {
    // should go back to home page
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text>Welcome, "User"</Text>

      <TouchableOpacity style={styles.button} onPress={handleTierLists}>
        <Text style={styles.buttonText}>View Tier Lists</Text>
      </TouchableOpacity>

      {isAdminPermsVisible && (
  <>
    <TouchableOpacity style={styles.adminButton} onPress={handleViewUsers}>
      <Text style={styles.adminButtonText}>View All Users</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.adminButton} onPress={handleCreateUsers}>
      <Text style={styles.adminButtonText}>Create a New User</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.adminButton} onPress={handleUpdateUsers}>
      <Text style={styles.adminButtonText}>Update a User's Account Details</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.adminButton} onPress={handleDeleteUsers}>
      <Text style={styles.adminButtonText}>Delete a User</Text>
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
