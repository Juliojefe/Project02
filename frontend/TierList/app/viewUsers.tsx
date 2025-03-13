import { View, Text, StyleSheet, FlatList, } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ViewUsersPage = () => {
  const { userID } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.adminSectionTitle}>Admin Users</Text>
          <FlatList
            data={adminUsers}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Text style={styles.adminItem}>
                  <b>ID:</b> {item.id}
                </Text>
                <Text style={styles.adminItem}>
                  <b>Name:</b> {item.name}
                </Text>
                <Text style={styles.adminItem}>
                  <b>Email:</b> {item.email}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />

          <View style={styles.horizontalLine} />

          <Text style={styles.userSectionTitle}>Normal Users</Text>
          <FlatList
            data={normalUsers}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Text>
                  <b>ID:</b> {item.id}
                </Text>
                <Text>
                  <b>Name:</b> {item.name}
                </Text>
                <Text>
                  <b>Email:</b> {item.email}
                </Text>
              </View>
            )}
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
    padding: 16,
  },
  adminSectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#006400",
  },
  userSectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  userItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#e8e8e8",
    borderRadius: 10,
  },
  horizontalLine: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  adminItem: {
    color: "#000"
  }
});

export default ViewUsersPage;
