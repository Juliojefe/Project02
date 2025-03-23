import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";

// Define the structure for a TierList object, adding subjectId
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
  S: "#00FF00",
  A: "#ADFF2F",
  B: "#FFFF00",
  C: "#FFA500",
  D: "#FF6347",
  F: "#FF0000",
};

const PastTierLists = () => {
  // Get the userID from the URL query parameters
  const { userID } = useLocalSearchParams<{ userID: string }>();
  const router = useRouter();
  const [tierLists, setTierLists] = useState<TierList[]>([]);
  const [assignmentsByList, setAssignmentsByList] = useState<Record<number, DisplayAssignment[]>>({});
  const [subjectNames, setSubjectNames] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTierLists = async () => {
    if (!userID) {
      console.log("[PastTierLists] No userID provided; aborting fetch.");
      setError("User ID not provided.");
      setLoading(false);
      return;
    }

    try {
      console.log(`[PastTierLists] Fetching tier lists for userID=${userID}...`);
      const response = await axios.get(
        `http://localhost:8080/api/tierlists/user/${userID}`
      );
      console.log("[PastTierLists] Request succeeded, response data:", response.data);
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
                    style={[styles.rankBox, { backgroundColor: rankColors[a.rankName] }]}
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
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                  router.push(`/tierList?userID=${userID}&subjectId=${item.subjectId}`)
              }
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
  );

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
      <View style={styles.container}>
        <Text style={styles.title}>Your Past Tier Lists</Text>
        <FlatList
            data={tierLists}
            keyExtractor={(i) => i.tierlistId.toString()}
            renderItem={renderItem}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
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
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: "#227755",
    padding: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

export default PastTierLists;
