import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";

export default function EditUserPage() {
    const router = useRouter();
    // "userID" comes from the query string ?userID=...
    const { userID } = useLocalSearchParams();

    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch existing user data to pre-fill fields
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/users/${userID}`);
                setName(res.data.name || "");
                setImage(res.data.image || "");
            } catch (error) {
                setErrorMessage("Could not load user details.");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userID]);

    const handlePatchUser = async () => {
        setErrorMessage("");
        try {
            await axios.patch(`http://localhost:8080/users/${userID}`, {
                name: name,
                image: image,
            });
            Alert.alert("Success", "User updated successfully!");
            // Navigate back or wherever you want
            router.replace("/viewUsers");
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("Failed to update user.");
            }
        }
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
            <Text style={styles.header}>Edit User</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter new name"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Image URL</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter new image URL"
                value={image}
                onChangeText={setImage}
            />

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handlePatchUser}>
                <Text style={styles.buttonText}>Update User</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: "center",
    },
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#fafafa",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
    },
    label: {
        marginTop: 16,
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 6,
        marginTop: 4,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        marginTop: 24,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    error: {
        color: "red",
        marginTop: 12,
    },
});
