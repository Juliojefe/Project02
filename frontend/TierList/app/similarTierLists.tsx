import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Image,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

interface TierList {
    tierlistId: number;
    userId: number;
    createdAt: string;
    subjectId: number;
}

interface Assignment {
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

const SimilarTierLists = () => {
    const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
    const [lists, setLists] = useState<TierList[]>([]);
    const [assignments, setAssignments] = useState<Record<number, Assignment[]>>({});
    const [userNames, setUserNames] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        fetchSimilarLists();
    }, [subjectId]);

    const fetchSimilarLists = async () => {
        try {
            const resp = await axios.get("http://localhost:8080/api/tierlists");
            const filtered = resp.data.filter((tl: TierList) => tl.subjectId === Number(subjectId));
            setLists(filtered);

            // Fetch assignments
            const assignMap: Record<number, Assignment[]> = {};
            await Promise.all(filtered.map(async (tl: TierList) => {
                const items = await axios.get<any[]>(`http://localhost:8080/api/tierlist_items/${tl.tierlistId}`);
                const display = await Promise.all(items.data.map(async a => {
                    const [itemRes, rankRes] = await Promise.all([
                        axios.get(`http://localhost:8080/api/tieritems/${a.itemId}`),
                        axios.get(`http://localhost:8080/api/itemranks/${a.rankId}`)
                    ]);
                    return { id: a.id, rankName: rankRes.data.name, itemImage: itemRes.data.image };
                }));
                assignMap[tl.tierlistId] = display;
            }));
            setAssignments(assignMap);

            // Fetch usernames
            const uniqueUserIds: number[] = [...new Set<number>(filtered.map((tl: TierList) => tl.userId))];
            const nameMap: Record<number, string> = {};

            await Promise.all(
                uniqueUserIds.map(async (id: number) => {
                    const userResp = await axios.get(`http://localhost:8080/users/${id}`);
                    nameMap[id] = userResp.data.name;
                })
            );
            setUserNames(nameMap);
        } catch (err) {
            console.error(err);
            setError("Unable to load similar tier lists.");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: TierList }) => (
        <View style={styles.card}>
            <Text style={styles.username}>{userNames[item.userId] || "Unknown User"}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            <View style={styles.row}>
                {assignments[item.tierlistId]?.map(a => (
                    <View key={a.id} style={styles.pair}>
                        <View style={[styles.rankBox, { backgroundColor: rankColors[a.rankName] }]}>
                            <Text style={styles.rankText}>{a.rankName}</Text>
                        </View>
                        <Image source={{ uri: a.itemImage }} style={styles.itemImage} />
                    </View>
                ))}
            </View>
        </View>
    );

    if (loading) return <View style={styles.centered}><ActivityIndicator /></View>;
    if (error) return <View style={styles.centered}><Text style={styles.error}>{error}</Text></View>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Similar Tier Lists</Text>
            <FlatList
                data={lists}
                keyExtractor={l => l.tierlistId.toString()}
                renderItem={renderItem}
            />
        </View>
    );
}

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
        marginBottom: 16,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    username: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
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
    },
    itemImage: {
        width: 50,
        height: 50,
        marginLeft: 8,
        borderRadius: 4,
    },
    error: {
        color: "red",
    },
});

export default SimilarTierLists;

