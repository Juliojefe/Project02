import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Image } from "expo-image";

interface TierList {
  tierlistId: number;
  name: string;
  userId: number;
  createdAt: string;
  status: number;
  subjectId: number;
}

interface DisplayAssignment {
  id: number;
  rankName: string;
  itemImage: string;
}

const rankColors: Record<string, string> = {
  S: "#0CCE6B",
  A: "#91CF4C",
  B: "#ffcf33",
  C: "#f07b16",
  D: "#e1342c",
  F: "#a51e17",
};

const PastTierLists = () => {
  const { userID } = useLocalSearchParams<{ userID: string }>();
  const router = useRouter();
  const [tierLists, setTierLists] = useState<TierList[]>([]);
  const [assignmentsByList, setAssignmentsByList] = useState<
    Record<number, DisplayAssignment[]>
  >({});
  const [subjectNames, setSubjectNames] = useState<{ [key: number]: string }>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchTierLists = async () => {
    if (!userID) {
      console.log("[PastTierLists] No userID provided; aborting fetch.");
      setError("User ID not provided.");
      setLoading(false);
      return;
    }

    try {
      console.log(
        `[PastTierLists] Fetching tier lists for userID=${userID}...`
      );
      const response = await axios.get(
        `http://localhost:8080/api/tierlists/user/${userID}`
      );
      console.log(
        "[PastTierLists] Request succeeded, response data:",
        response.data
      );
      setTierLists(response.data);

      const subjectIds = response.data.map((tl: TierList) => tl.subjectId);
      const uniqueSubjectIds = [...new Set(subjectIds)];
      const subjectPromises = uniqueSubjectIds.map((id) =>
        axios.get(`http://localhost:8080/api/subjects/${id}`)
      );
      const subjectsRes = await Promise.all(subjectPromises);
      const subjectMap: { [key: number]: string } = {};
      subjectsRes.forEach((res) => {
        subjectMap[res.data.subjectId] = res.data.name;
      });
      setSubjectNames(subjectMap);

      const map: Record<number, DisplayAssignment[]> = {};
      await Promise.all(
        response.data.map(async (tl: TierList) => {
          const resp = await axios.get<any[]>(
            `http://localhost:8080/api/tierlist_items/${tl.tierlistId}`
          );
          const display = await Promise.all(
            resp.data.map(async (a) => {
              const [itemRes, rankRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/tieritems/${a.itemId}`),
                axios.get(`http://localhost:8080/api/itemranks/${a.rankId}`),
              ]);
              return {
                id: a.id,
                rankName: rankRes.data.name,
                itemImage: itemRes.data.image,
              };
            })
          );
          map[tl.tierlistId] = display;
        })
      );
      setAssignmentsByList(map);
    } catch (err) {
      console.error("[PastTierLists] Request error:", err);
      setError("Failed to load tier lists.");
      Alert.alert("Error", "Failed to load tier lists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTierLists();
  }, [userID]);

  const handleDeleteTierList = async (tierlistId: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/tierlists/${tierlistId}`);
      Alert.alert("Deleted", `Tier list ${tierlistId} has been deleted.`);
      fetchTierLists();
    } catch (err) {
      console.error("Delete failed:", err);
      Alert.alert("Error", "Failed to delete tier list.");
    }
  };

  const renderItem = ({ item }: { item: TierList }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {subjectNames[item.subjectId] || "Loading..."}
      </Text>
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>

      <View style={styles.singleRow}>
        {assignmentsByList[item.tierlistId]?.map((a) => (
          <View key={a.id} style={styles.pair}>
            <View
              style={[
                styles.rankBox,
                { backgroundColor: rankColors[a.rankName]},
              ]}
            >
              <Text style={styles.rankText}>{a.rankName}</Text>
            </View>
            <Image source={{ uri: a.itemImage }} style={styles.itemImage} />
          </View>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTierList(item.tierlistId)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push(
              `/tierList?userID=${userID}&subjectId=${item.subjectId}`
            )
          }
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.similarButton}
          onPress={() =>
            router.push(
              `/similarTierLists?userID=${userID}&subjectId=${item.subjectId}`
            )
          }
        >
          <Text style={styles.similarButtonText}>Similar Tier Lists</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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

      <Text style={styles.title}>YOUR PAST TIER LISTS</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={tierLists}
          keyExtractor={(i) => i.tierlistId.toString()}
          renderItem={renderItem}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f2022",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  scrollContainer: {
    flexGrow: 1,
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f2022",
  },
  title: {
    fontSize: 50,
    color: "#ffcf33",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Silverknife-RegularItalic",
    letterSpacing: 2,
  },
  listContainer: {
    margin: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#131515",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fcfcfc",
    fontFamily: "Arial",
  },
  date: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 12,
    fontFamily: "Arial",
  },
  singleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  pair: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 8,
  },
  rankBox: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  rankText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a0a0a",
    fontFamily: "Arial",
  },
  itemImage: {
    width: 50,
    height: 50,
    marginLeft: 8,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#e1342c",
    padding: 10,
    borderRadius: 10,
  },
  editButton: {
    backgroundColor: "#ffcc33",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  similarButton: {
    backgroundColor: "#0cce6b",
    padding: 10,
    borderRadius: 10,
    marginLeft: "auto",
  },
  deleteButtonText: {
    color: "#fcfcfc",
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "Arial",
  },
  editButtonText: {
    color: "#0a0a0a",
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "Arial",
  },
  similarButtonText: {
    color: "#0a0a0a",
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "Arial",
  },
  errorText: {
    fontSize: 16,
    color: "#e1342c",
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

export default PastTierLists;
