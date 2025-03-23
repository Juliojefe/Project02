import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";

const ViewUsersPage = () => {
  const { userID } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleEditAccount = async () => {
    alert("Pressed button to edit account");
  };

  const handleDeleteAccount = ({ id }) => {
    // need to figure out how to pass item that was selected of being deleted
    router.push(`/adminDeleteAccount?userID=${encodeURIComponent(userID)}`);
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
      <View style={styles.userItemHeader}>
        <Text style={styles.type}>User ID: #{item.id}</Text>
        <Menu>
        <MenuTrigger>
          <Text style={styles.menuTrigger}>⋮</Text>
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => handleEditAccount(item.id)}>
            <Text style={styles.menuOption}>Edit</Text>
          </MenuOption>
          <MenuOption onSelect={() => handleDeleteAccount(item.id)}>
            <Text style={styles.menuOption}>Delete</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
      </View>
      <Text style={styles.adminItem}>
        <Text style={styles.type}>Name:</Text> {item.name}
      </Text>
      <Text style={styles.adminItem}>
        <Text style={styles.type}>Email:</Text> {item.email}
      </Text>
      {/* <TouchableOpacity style={styles.button} onPress={handleEditAccount}>
        <Text style={styles.buttonText}>Edit Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity> */}
      {/* Menu for each list item */}
    </View>
  );

  const renderNormalItem = ({ item }) => (
    <View style={styles.userBox}>
    <View style={styles.userItemHeader}>
        <Text style={styles.type}>User ID: #{item.id}</Text>
        <Menu>
        <MenuTrigger>
          <Text style={styles.menuTrigger}>⋮</Text>
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => alert(`Selected: Edit ${item.name}`)}>
            <Text style={styles.menuOption}>Edit</Text>
          </MenuOption>
          <MenuOption onSelect={() => handleDeleteAccount(item.id)}>
            <Text style={styles.menuOption}>Delete</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
      </View>
      <Text>
        <Text style={styles.type}>Name:</Text> {item.name}
      </Text>
      <Text>
        <Text style={styles.type}>Email:</Text> {item.email}
      </Text>
    </View>
  );

  return (
    <MenuProvider>
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
    </MenuProvider>
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
  itemText: {
    fontSize: 20,
  },
  userItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuTrigger: {
    fontSize: 20,
    color: 'gray',
  },
  menuOption: {
    padding: 10,
    fontSize: 16,
  },
  button: {
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  horizontalLine: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default ViewUsersPage;
