import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import axios from "axios";
import { useLocalSearchParams, router } from "expo-router";
import { useFonts } from "expo-font";
import { Image } from "expo-image";

interface TierList {
  tierlistId: number;
  userId: number;
  createdAt: string;
  subjectId: number;
  // This will store the assignments
  assignments?: Assignment[];
}

interface Assignment {
  id: number;
  itemId: number;
  rankName: string;
  itemImage: string;
}

interface UserAssignmentMap {
  [itemNameOrId: string]: string;
}

const rankColors: Record<string, string> = {
  S: "#0CCE6B",
  A: "#91CF4C",
  B: "#ffcf33",
  C: "#f07b16",
  D: "#e1342c",
  F: "#a51e17",
};

export default function SimilarTierLists() {
  const { userID, subjectId } = useLocalSearchParams<{
    userID: string;
    subjectId: string;
  }>();

  // State for all tier lists of the subject
  const [lists, setLists] = useState<TierList[]>([]);
  // Assignments keyed by tierlistId
  const [assignmentsByList, setAssignmentsByList] = useState<
    Record<number, Assignment[]>
  >({});

  // Mapping of userId
  const [userNames, setUserNames] = useState<Record<number, string>>({});

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    "Silverknife-RegularItalic": require("@/assets/fonts/Silverknife-RegularItalic.otf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const landingLogo = require("@/assets/images/HotTakesLogoWithRightText.png");
  const footerLogo = require("@/assets/images/CSUMB-COS-Logo.png");

  // Similarity filter controls
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [minSimilarity, setMinSimilarity] = useState(0);

  // The current user's item->rank map
  const [userMap, setUserMap] = useState<UserAssignmentMap>({});

  // Fetch all tier lists for the given subject
  useEffect(() => {
    if (!subjectId) {
      setError("No subjectId provided.");
      return;
    }
    setLoading(true);

    axios
      .get("http://localhost:8080/api/tierlists")
      .then((resp) => {
        const all = resp.data as TierList[];
        // Keep only tier lists that match subject
        const filtered = all.filter((tl) => tl.subjectId === Number(subjectId));
        setLists(filtered);
        return filtered;
      })
      .then(async (filteredLists) => {
        // Fetch assignments for each tier list
        const assignMap: Record<number, Assignment[]> = {};

        await Promise.all(
          filteredLists.map(async (tl) => {
            const itemResp = await axios.get<any[]>(
              `http://localhost:8080/api/tierlist_items/${tl.tierlistId}`
            );
            // Fetch item rank and name
            const displayAssignments: Assignment[] = await Promise.all(
              itemResp.data.map(async (tierListItem) => {
                const [itemRes, rankRes] = await Promise.all([
                  axios.get(
                    `http://localhost:8080/api/tieritems/${tierListItem.itemId}`
                  ),
                  axios.get(
                    `http://localhost:8080/api/itemranks/${tierListItem.rankId}`
                  ),
                ]);
                return {
                  id: tierListItem.id,
                  itemId: tierListItem.itemId,
                  rankName: rankRes.data.name,
                  itemImage: itemRes.data.image,
                };
              })
            );
            assignMap[tl.tierlistId] = displayAssignments;
          })
        );

        setAssignmentsByList(assignMap);

        // Fetch name of users who created these tierlists
        const uniqueUserIds = [
          ...new Set(filteredLists.map((tl) => tl.userId)),
        ];
        const nameMap: Record<number, string> = {};

        await Promise.all(
          uniqueUserIds.map(async (id) => {
            try {
              const userResp = await axios.get(
                `http://localhost:8080/users/${id}`
              );
              nameMap[id] = userResp.data.name;
            } catch {
              nameMap[id] = "Unknown User";
            }
          })
        );
        setUserNames(nameMap);
      })
      .catch((err) => {
        console.error("Fetch Similar Lists error:", err);
        setError("Unable to load similar tier lists.");
      })
      .finally(() => setLoading(false));
  }, [subjectId]);

  // Fetch current user's tier list to build a map
  useEffect(() => {
    if (!userID || !subjectId) return;
    axios
      .get(
        `http://localhost:8080/api/tierlists/user/${userID}/subject/${subjectId}`
      )
      .then((res) => {
        const data = res.data;
        const assn = data.assignments || [];
        // Ensure each assignment has rankName
        Promise.all(
          assn.map(async (row: any) => {
            if (!row.rankName && row.rankId) {
              const rankRes = await axios.get(
                `http://localhost:8080/api/itemranks/${row.rankId}`
              );
              row.rankName = rankRes.data.name;
            }
            return row;
          })
        ).then((assignmentsWithRankName) => {
          const newMap: UserAssignmentMap = {};
          assignmentsWithRankName.forEach((row: any) => {
            newMap[row.itemId] = row.rankName;
          });
          setUserMap(newMap);
        });
      })
      .catch((err) => {
        console.error("Error fetching user’s TierList for similarity:", err);
      });
  }, [userID, subjectId]);

  // Combine tier list with fetched assignments
  const combinedLists = useMemo(() => {
    return lists.map((tl) => {
      const cloned = { ...tl };
      cloned.assignments = assignmentsByList[tl.tierlistId] || [];
      return cloned;
    });
  }, [lists, assignmentsByList]);

  // Apply similarity filtering
  const filteredLists = useMemo(() => {
    // If filter is off or slider at 0%, show all
    if (!filterEnabled || minSimilarity <= 0) {
      return combinedLists;
    }

    return combinedLists.filter((other) => {
      const otherAssignments = other.assignments || [];
      let matches = 0;
      const total = Object.keys(userMap).length;
      if (total === 0) return true;

      for (const a of otherAssignments) {
        if (userMap[a.itemId] === a.rankName) {
          matches++;
        }
      }
      const similarity = (matches / total) * 100;
      return similarity >= minSimilarity;
    });
  }, [combinedLists, userMap, filterEnabled, minSimilarity]);

  // Separate out the user's own list to pin it at the top
  const currentUserIdNum = Number(userID);
  const userList = filteredLists.find(
    (list) => list.userId === currentUserIdNum
  );
  // The rest of the lists, excluding the current user's
  const otherLists = filteredLists.filter(
    (list) => list.userId !== currentUserIdNum
  );

  // Loading / error states
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
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

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

  // function for placeholders
  function handlePlaceholder(action: string) {
    Alert.alert("Coming Soon", `${action} feature is still in development.`);
  }

  // render each tier list card
  function renderTierListCard(item: TierList, isCurrentUser: boolean) {
    return (
      <View style={[styles.card, isCurrentUser && styles.currentUserCard]}>
        <Text style={styles.username}>
          {userNames[item.userId] || "Unknown User"}
        </Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <View style={styles.row}>
          {item.assignments?.map((a, idx) => (
            <View key={`${a.id}-${idx}`} style={styles.pair}>
              <View
                style={[
                  styles.rankBox,
                  { backgroundColor: rankColors[a.rankName] || "#ccc" },
                ]}
              >
                <Text style={styles.rankText}>{a.rankName}</Text>
              </View>
              <Image source={{ uri: a.itemImage }} style={styles.itemImage} />
            </View>
          ))}
        </View>

        {/* These are only placeholders */}
        {!isCurrentUser && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handlePlaceholder("Message")}
            >
              <Text style={styles.actionButtonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handlePlaceholder("Add Friend")}
            >
              <Text style={styles.actionButtonText}>Add Friend</Text>
            </TouchableOpacity>
          </View>
        )}
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
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleTierLists}
            >
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

        <View style={styles.pinnedHeader}>
          <Text style={styles.title}>Similar Tier Lists</Text>
          <View style={styles.topSection}>
            <View style={styles.filterRow}>
              <Text style={styles.enableSimilarityText}>
                Enable Similarity Filter:
              </Text>
              <Switch
                value={filterEnabled}
                onValueChange={(val) => setFilterEnabled(val)}
              />
            </View>

            {filterEnabled && (
              <View style={styles.sliderSection}>
                <Text
                  style={styles.similarityPercentageText}
                >{`Similarity Percentage: ${minSimilarity}%`}</Text>
                <Slider
                  style={{ width: 250, height: 40 }}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  value={minSimilarity}
                  onValueChange={setMinSimilarity}
                />
              </View>
            )}
            <View style={styles.listContainer}>
            </View>
            {userList && renderTierListCard(userList, true)}
          </View>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={otherLists}
            keyExtractor={(item) => item.tierlistId.toString()}
            renderItem={({ item }) => renderTierListCard(item, false)}
            contentContainerStyle={{ paddingTop: 5 }}
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
            CST438 2025© Jayson Basilio, Julio Fernandez, Ozzie Munoz, Ahmed
            Torki
            <br />
            Tier List Project 02 - Hot Takes
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

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
  pinnedHeader: {},
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sliderSection: {
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    fontFamily: "Arial",
    color: "#e1342c",
  },
  title: {
    fontSize: 50,
    color: "#ffcf33",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Silverknife-RegularItalic",
    letterSpacing: 2,
  },
  enableSimilarityText: {
    marginRight: 8,
    fontFamily: "Arial",
    fontWeight: "bold",
    color: "#fcfcfc",
  },
  similarityPercentageText: {
    marginBottom: 4,
    fontFamily: "Arial",
    fontWeight: "bold",
    color: "#fcfcfc",
  },
  listContainer: {
    margin: 20,
  },
  card: {
    backgroundColor: "#131515",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  currentUserCard: {
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  username: {
    color: "#fcfcfc",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: "Arial",
  },
  date: {
    fontSize: 14,
    color: "#4e5056",
    marginBottom: 8,
    fontFamily: "Arial",
  },
  row: {
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
    fontFamily: "Arial",
  },
  itemImage: {
    width: 50,
    height: 50,
    marginLeft: 8,
    borderRadius: 4,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: "#91cf4c",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  actionButtonText: {
    color: "#fcfcfc",
    fontWeight: "600",
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
