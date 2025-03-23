import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
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

const PastTierLists = () => {
  // Get the userID from the URL query parameters
  const { userID } = useLocalSearchParams<{ userID: string }>();
  const router = useRouter();
  const [tierLists, setTierLists] = useState<TierList[]>([]);
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
      const subjectPromises = uniqueSubjectIds.map((id: number) =>
        axios.get(`http://localhost:8080/api/subjects/${id}`)
      );
      const subjectsRes = await Promise.all(subjectPromises);
      const subjectMap: { [key: number]: string } = {};
      subjectsRes.forEach((res) => {
        subjectMap[res.data.subjectId] = res.data.name;
      });
      setSubjectNames(subjectMap);
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
      console.error("[PastTierLists] Delete error:", err);
      Alert.alert("Error", "Failed to delete tier list.");
    }
  };

  if (loading) {
    console.log("[PastTierLists] Loading...");
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    console.log("[PastTierLists] Error state:", error);
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: TierList }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemTitle}>
        {subjectNames[item.subjectId] || "Loading..."}
      </Text>
      <Text style={styles.listItemDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTierList(item.tierlistId)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push(`/tierList?userID=${userID}&subjectId=${item.subjectId}`)
          }
        >
          <Text style={styles.deleteButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (tierLists.length === 0) {
    console.log("[PastTierLists] No tier lists found for the user.");
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Past Tier Lists</Text>
        <Text style={styles.noDataText}>No past tier lists found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Past Tier Lists</Text>
      <FlatList
        data={tierLists}
        keyExtractor={(item) => item.tierlistId.toString()}
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
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  listItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  listItemDate: {
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  editButton: {
    backgroundColor: "#227755",
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
    alignSelf: "flex-start",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default PastTierLists;