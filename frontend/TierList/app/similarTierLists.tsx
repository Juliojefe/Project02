import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Image,
    Switch,
    TouchableOpacity,
    Alert
} from 'react-native';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

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
    S: '#00FF00',
    A: '#ADFF2F',
    B: '#FFFF00',
    C: '#FFA500',
    D: '#FF6347',
    F: '#FF0000',
};

export default function SimilarTierLists() {
    const { userID, subjectId } = useLocalSearchParams<{ userID: string; subjectId: string }>();

    // State for all tier lists of the subject
    const [lists, setLists] = useState<TierList[]>([]);
    // Assignments keyed by tierlistId
    const [assignmentsByList, setAssignmentsByList] = useState<Record<number, Assignment[]>>({});

    // Mapping of userId
    const [userNames, setUserNames] = useState<Record<number, string>>({});

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Similarity filter controls
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [minSimilarity, setMinSimilarity] = useState(0);

    // The current user's item->rank map
    const [userMap, setUserMap] = useState<UserAssignmentMap>({});

    // Fetch all tier lists for the given subject
    useEffect(() => {
        if (!subjectId) {
            setError('No subjectId provided.');
            return;
        }
        setLoading(true);

        axios
            .get('http://localhost:8080/api/tierlists')
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
                        const itemResp = await axios.get<any[]>(`http://localhost:8080/api/tierlist_items/${tl.tierlistId}`);
                        // Fetch item rank and name
                        const displayAssignments: Assignment[] = await Promise.all(
                            itemResp.data.map(async (tierListItem) => {
                                const [itemRes, rankRes] = await Promise.all([
                                    axios.get(`http://localhost:8080/api/tieritems/${tierListItem.itemId}`),
                                    axios.get(`http://localhost:8080/api/itemranks/${tierListItem.rankId}`),
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
                const uniqueUserIds = [...new Set(filteredLists.map((tl) => tl.userId))];
                const nameMap: Record<number, string> = {};

                await Promise.all(
                    uniqueUserIds.map(async (id) => {
                        try {
                            const userResp = await axios.get(`http://localhost:8080/users/${id}`);
                            nameMap[id] = userResp.data.name;
                        } catch {
                            nameMap[id] = 'Unknown User';
                        }
                    })
                );
                setUserNames(nameMap);
            })
            .catch((err) => {
                console.error('Fetch Similar Lists error:', err);
                setError('Unable to load similar tier lists.');
            })
            .finally(() => setLoading(false));
    }, [subjectId]);

    // Fetch current user's tier list to build a map
    useEffect(() => {
        if (!userID || !subjectId) return;
        axios
            .get(`http://localhost:8080/api/tierlists/user/${userID}/subject/${subjectId}`)
            .then((res) => {
                const data = res.data;
                const assn = data.assignments || [];
                // Ensure each assignment has rankName
                Promise.all(
                    assn.map(async (row: any) => {
                        if (!row.rankName && row.rankId) {
                            const rankRes = await axios.get(`http://localhost:8080/api/itemranks/${row.rankId}`);
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
                console.error('Error fetching user’s TierList for similarity:', err);
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
    const userList = filteredLists.find((list) => list.userId === currentUserIdNum);
    // The rest of the lists, excluding the current user's
    const otherLists = filteredLists.filter((list) => list.userId !== currentUserIdNum);

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

    // function for placeholders
    function handlePlaceholder(action: string) {
        Alert.alert('Coming Soon', `${action} feature is still in development.`);
    }

    // render each tier list card
    function renderTierListCard(item: TierList, isCurrentUser: boolean) {
        return (
            <View style={[styles.card, isCurrentUser && styles.currentUserCard]}>
                <Text style={styles.username}>
                    {userNames[item.userId] || 'Unknown User'}
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
                                    { backgroundColor: rankColors[a.rankName] || '#ccc' },
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
                            onPress={() => handlePlaceholder('Message')}
                        >
                            <Text style={styles.actionButtonText}>Message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handlePlaceholder('Add Friend')}
                        >
                            <Text style={styles.actionButtonText}>Add Friend</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.pinnedHeader}>
                <View style={styles.topSection}>
                    <Text style={styles.title}>Similar Tier Lists</Text>

                    <View style={styles.filterRow}>
                        <Text style={{ marginRight: 8 }}>Enable Similarity Filter:</Text>
                        <Switch
                            value={filterEnabled}
                            onValueChange={(val) => setFilterEnabled(val)}
                        />
                    </View>

                    {filterEnabled && (
                        <View style={styles.sliderSection}>
                            <Text style={{ marginBottom: 4 }}>{`Similarity Percentage: ${minSimilarity}%`}</Text>
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
                </View>
                {userList && renderTierListCard(userList, true)}
            </View>
            <FlatList
                data={otherLists}
                keyExtractor={(item) => item.tierlistId.toString()}
                renderItem={({ item }) => renderTierListCard(item, false)}
                contentContainerStyle={{ paddingTop: 5 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    pinnedHeader: {
    },
    topSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sliderSection: {
        marginBottom: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
    },
    currentUserCard: {
        borderWidth: 2,
        borderColor: '#2196F3',
    },
    username: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    pair: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 8,
    },
    rankBox: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    rankText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemImage: {
        width: 50,
        height: 50,
        marginLeft: 8,
        borderRadius: 4,
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        marginRight: 10,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
