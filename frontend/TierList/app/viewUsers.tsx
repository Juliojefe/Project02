import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ViewUsersPage = () => {
  const { userID } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const userIdValue = Array.isArray(userID) ? userID[0] : userID;
  useEffect(() => {
    handleViewUsers();
  }, []);

  const handleViewUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/`);
      setUsers(response.data);
    } catch (error) {
      console.log("Error getting all user data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAccount = (user) => {
    router.push(`/AdminEditUserPage?userId=${encodeURIComponent(user.id)}`);
  };

  const handleDeleteAccount = async (user) => {
    try {
      await axios.delete(`http://localhost:8080/users/admin/${user.id}`, {
        data: { email: user.email },
      });

      Alert.alert("Deleted", `User ${user.name} deleted successfully.`);
      handleViewUsers(); // refresh the list after deletion
    } catch (error) {
      console.error("Delete Error:", error);
      Alert.alert("Error", "Failed to delete user.");
    }
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text>No Users Exist?</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const adminUsers = users.filter((user) => user.isAdmin === true);
  const normalUsers = users.filter((user) => user.isAdmin === false);

  const DATA = [
    { title: "Admin Users", data: adminUsers },
    { title: "Normal Users", data: normalUsers },
  ];

  const renderAdminItem = ({ item }) => (
    <View style={styles.userBox}>
      <Text style={styles.adminItem}>
        <Text style={styles.type}>ID:</Text> {item.id}
      </Text>
      <Text style={styles.adminItem}>
        <Text style={styles.type}>Name:</Text> {item.name}
      </Text>
      <Text style={styles.adminItem}>
        <Text style={styles.type}>Email:</Text> {item.email}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push(`/AdminEditUserPage?userId=${item.id}`)}>
        <Text style={styles.buttonText}>Edit Admin</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleDeleteAccount(item)}>
        <Text style={styles.buttonText}>Delete Admin</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNormalItem = ({ item }) => (
    <View style={styles.userBox}>
      <Text>
        <Text style={styles.type}>ID:</Text> {item.id}
      </Text>
      <Text>
        <Text style={styles.type}>Name:</Text> {item.name}
      </Text>
      <Text>
        <Text style={styles.type}>Email:</Text> {item.email}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => handleEditAccount(item)}>
        <Text style={styles.buttonText}>Edit User</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleDeleteAccount(item)}>
        <Text style={styles.buttonText}>Delete User</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.listContainer}>
          <Text style={styles.adminSectionTitle}>Admin Users</Text>
          <FlatList
            data={adminUsers}
            renderItem={renderAdminItem}
            keyExtractor={(item) => item.id.toString()}
          />

          <View style={styles.horizontalLine} />

          <Text style={styles.userSectionTitle}>Normal Users</Text>
          <FlatList
            data={normalUsers}
            renderItem={renderNormalItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 15,
    overflow: "scroll",
  },
  userContainer: {
    flex: 1,
    flexDirection: "row",
  },
  type: {
    fontWeight: "bold",
  },
  adminSectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#00FF41",
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#0e0e0e",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    textAlign: "center",
    
  },
  userSectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#0e0e0e",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    textAlign: "center",
  },
  userBox: {
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#e8e8e8",
    borderRadius: 10,
  },
  adminItem: {
    color: "#27592D",
  },
  kebabButton: {
    padding: 5,
  },
  menu: {
    position: "absolute",
    right: 0,
  },
  button: {
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  horizontalLine: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default ViewUsersPage;
