import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

// Define the structure for a TierList object
interface TierList {
    tierlistId: number;
    name: string;
    userId: number;
    createdAt: string;
    status: number;
}

const PastTierLists = () => {
    // Get the userID from the URL query parameters
    const { userID } = useLocalSearchParams<{ userID: string }>();
    const [tierLists, setTierLists] = useState<TierList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch tier lists for the current user
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

    const handleCreateBlankTierList = async () => {
        try {
            console.log("[PastTierLists] Creating a blank tier list for userID:", userID);
            // Send a POST request to the backend with a default name and status
            const response = await axios.post("http://localhost:8080/api/tierlists", {
                name: "Blank Tier List",
                userId: parseInt(userID as string, 10),
                status: 1,
            });
            console.log("[PastTierLists] Blank tier list created:", response.data);
            Alert.alert("Success", "A blank tier list was created successfully!");
            // Refresh the tier list data to show the new blank tier list
            fetchTierLists();
        } catch (error) {
            console.error("[PastTierLists] Error creating blank tier list:", error);
            Alert.alert("Error", "Could not create tier list.");
        }
    };

    // Function to delete a tier list given its ID
    const handleDeleteTierList = async (tierlistId: number) => {
        try {
            await axios.delete(`http://localhost:8080/api/tierlists/${tierlistId}`);
            Alert.alert("Deleted", `Tier list ${tierlistId} has been deleted.`);
            // Refresh the list after deletion
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
            <Text style={styles.listItemTitle}>{item.name}</Text>
            <Text style={styles.listItemDate}>
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTierList(item.tierlistId)}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    // If there are no tier lists, let the user know
    if (tierLists.length === 0) {
        console.log("[PastTierLists] No tier lists found for the user.");
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Your Past Tier Lists</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleCreateBlankTierList}
                >
                    <Text style={styles.buttonText}>Create Blank Tier List</Text>
                </TouchableOpacity>
                <Text style={styles.noDataText}>No past tier lists found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Past Tier Lists</Text>
            {/* Button to create a new blank tier list */}
            <TouchableOpacity style={styles.button} onPress={handleCreateBlankTierList}>
                <Text style={styles.buttonText}>Create Blank Tier List</Text>
            </TouchableOpacity>
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
    button: {
        backgroundColor: "#227755",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: "center",
    },
    buttonText: {
        fontSize: 15,
        color: "#fff",
    },
    deleteButton: {
        backgroundColor: "#ff4444",
        padding: 8,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: "flex-start",
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 14,
    },
});

export default PastTierLists;