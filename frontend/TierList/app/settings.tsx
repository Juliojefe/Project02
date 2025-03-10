import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const SettingsPage = () => {
  const { userID } = useLocalSearchParams();
  
  const handleLandingPage = () => {
    // not very security safe since userID can be changed in link to view another user's account
    router.push(`/landing?userID=${encodeURIComponent(userID)}`);
  };

  const handleAccountDetails = () => {
    // could do popup to change specific details or onChangeText in settings page and confirm button to update changes
    alert("*Pressed button to change certain account details*");
  };

  const handleDeleteAccount = () => {
    // would need confirmation from user before deleting with a popup or something
    alert("*Pressed button to delete account*");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tempButton} onPress={handleLandingPage}>
        <Text style={styles.tempButtonText}>
          Temporary Back Button to Landing Page
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAccountDetails}>
        <Text style={styles.buttonText}>Change Account Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteAccountButton}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.deleteAccountButtonText}>⚠️ Delete Account ⚠️</Text>
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
  tempButton: {
    backgroundColor: "#0000FF",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  tempButtonText: {
    fontSize: 15,
    color: "#fff",
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
  deleteAccountButton: {
    backgroundColor: "#ff6700",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  deleteAccountButtonText: {
    fontSize: 15,
    color: "#fff",
  },
});

export default SettingsPage;
