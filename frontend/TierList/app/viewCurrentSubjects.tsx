import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, React, useCallback } from "react";
import axios from "axios";
import { Image } from "expo-image";
import { useFonts } from "expo-font";

const ViewCurrentSubjectsPage = () => {
  const { userID } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [subjects, setSubjects] = useState([]);

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
    const handleGetSubjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/subjects/current`
        );
        setSubjects(response.data);
      } catch (error) {
        console.log("Error getting current subjects of the week: ", error);
      } finally {
        setLoading(false);
      }
    };
    handleGetSubjects();
  }, []);

  // Turns the subject names into proper casing with the first letter of each word capitalized
  function titleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.subjectItem, { backgroundColor }]}>
      <Text style={[styles.subjectTitle, { color: textColor }]}>{titleCase(item.name.toLowerCase())}</Text>
    </TouchableOpacity>
  );

  const renderSubjectItem = ({ item }) => {
  
    return (
      <Item
        style={styles.subjectItem}
        item={item}
        onPress={() => {
          setSelectedId(item.subjectId);
          router.push(`/tierList?userID=${encodeURIComponent(userID)}&subjectId=${encodeURIComponent(item.subjectId)}`);
        }}
      />
    );
  };

  const handleHome = useCallback(() => {
    if (router.pathname !== "/landing") {
      router.push(`/landing?userID=${encodeURIComponent(userID)}`);
    }
  }, [userID]);

  // Viewing Tier lists
  const handleTierLists = useCallback(() => {
    if (router.pathname !== "/viewCurrentSubjects") {
      router.push(`/viewCurrentSubjects?userID=${encodeURIComponent(userID)}`);
    }
  }, [userID]);

  // View Settings Functionality
  const handleSettings = useCallback(() => {
    if (router.pathname !== "/settings") {
      router.push(`/settings?userID=${encodeURIComponent(userID)}`);
    }
  }, [userID]);

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

      <Text style={styles.subjectsHeader}>CURRENT SUBJECTS FOR THE WEEK</Text>
      <Text style={styles.subjectsDescription}>Choose one of the following subjects and create a tier list. </Text>
      <View style={styles.flatListContainer}>
        <FlatList
          data={subjects}
          renderItem={renderSubjectItem}
          keyExtractor={(item) => item.subjectId.toString()}
        />
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
    backgroundColor: "#1f2022",
  },
  container: {
    flex: 1,
    backgroundColor: "#1f2022",
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
  subjectsHeader: {
    fontSize: 50,
    color: "#ffcf33",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 5,
    fontFamily: "Silverknife-RegularItalic",
    letterSpacing: 2,
  },
  subjectsDescription: {
    fontSize: 16,
    color: "#fcfcfc",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Arial",
  },
  flatListContainer: {
    alignItems: "center",
    justifyContent: 'center',
  },
  subjectItem: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 100,
    backgroundColor: "#761511",
    justifyContent: "center",
    alignItems: "center", 
  },
  subjectTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fcfcfc",
    fontFamily: "Arial",
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

export default ViewCurrentSubjectsPage;