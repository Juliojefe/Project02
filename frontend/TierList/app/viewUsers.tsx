import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, React } from "react";
import axios from "axios";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider, } from "react-native-popup-menu";
import { Image } from "expo-image";
import { useFonts } from "expo-font";

const ViewUsersPage = () => {
  const { userID } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const userIdValue = Array.isArray(userID) ? userID[0] : userID;
  
  const [fontsLoaded] = useFonts({
    "Silverknife-RegularItalic": require("@/assets/fonts/Silverknife-RegularItalic.otf"),
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text>Loading Fonts...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const landingLogo = require("@/assets/images/HotTakesLogoWithRightText.png");
  const footerLogo = require("@/assets/images/CSUMB-COS-Logo.png");

  useEffect(() => {
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
    
    handleViewUsers();
  }, []);

  const handleEditAccount = (id) => {
    router.push(`/AdminEditUserPage?userID=${encodeURIComponent(userID)}&selectedUserID=${encodeURIComponent(id)}`);
  };

  const handleDeleteAccount = (id) => {
    router.push(`/adminDeleteAccount?userID=${encodeURIComponent(userID)}&selectedUserID=${encodeURIComponent(id)}`);
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
        <Text style={styles.type}>
          User ID: <Text style={styles.adminItem}>#{item.id}</Text>
        </Text>
        <Menu>
          <MenuTrigger>
            <Text style={styles.menuTrigger}>⋮</Text>
          </MenuTrigger>
          <MenuOptions style={styles.menuStyle}>
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
          <MenuOptions style={styles.menuStyle}>
            <MenuOption onSelect={() => handleEditAccount(item.id)}>
              <Text style={styles.menuOption}>Edit</Text>
            </MenuOption>
            <MenuOption onSelect={() => handleDeleteAccount(item.id)}>
              <Text style={styles.menuOption}>Delete</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
      <Text style={styles.renderText}>
        <Text style={styles.type}>Name:</Text> {item.name}
      </Text>
      <Text style={styles.renderText}>
        <Text style={styles.type}>Email:</Text> {item.email}
      </Text>
    </View>
  );
  

  return (
    <MenuProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
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
              <Text style={styles.adminSectionTitle}>Admin Users</Text>
              <FlatList
                data={adminUsers}
                renderItem={renderAdminItem}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>

            <View style={styles.rightColumn}>
              <Text style={styles.userSectionTitle}>Normal Users</Text>
              <FlatList
                data={normalUsers}
                renderItem={renderNormalItem}
                keyExtractor={(item) => item.id.toString()}
              />
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
        </SafeAreaView>
      </SafeAreaProvider>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
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
    justifyContent: "flex-start",
    paddingHorizontal: "2%",
    backgroundColor: "#1f2022",
  },
  rightColumn: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: "2%",
    backgroundColor: "#1f2022",
  },
  listContainer: {
    flex: 1,
    overflow: "scroll",
  },
  userContainer: {
    flex: 1,
    flexDirection: "row",
  },
  type: {
    fontWeight: "bold",
    color: "#fcfcfc",
    fontFamily: "Arial",
    fontSize: 18,
    paddingVertical: "0.2%",
  },
  renderText: {
    color: "#fcfcfc",
    fontFamily: "Arial",
    fontSize: 18,
    paddingVertical: "0.2%",
  },
  adminSectionTitle: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#0cce6b",
    padding: 20,
    marginVertical: 10,
    fontFamily: "Silverknife-RegularItalic",
    textAlign: "center",
    justifyContent: "center",
    letterSpacing: 2,
  },
  userSectionTitle: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#FFCC33",
    padding: 20,
    marginVertical: 10,
    fontFamily: "Silverknife-RegularItalic",
    textAlign: "center",
    justifyContent: "center",
    letterSpacing: 2,
  },
  userBox: {
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#131515",
    borderRadius: 10,
  },
  adminItem: {
    color: "#0CCE6B",
    fontFamily: "Arial",
    fontSize: 18,
    paddingVertical: "0.2%",
  },
  userItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuStyle: {
    backgroundColor: "#131515",
  },
  menuTrigger: {
    fontSize: 20,
    color: '#fcfcfc',
  },
  menuOption: {
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fcfcfc",
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

export default ViewUsersPage;