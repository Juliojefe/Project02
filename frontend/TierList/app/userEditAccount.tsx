import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Text,
    ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

const EditAccount = () => {
    const { userID } = useLocalSearchParams();
    const userIdValue = Array.isArray(userID) ? userID[0] : userID;

    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [email, setEmail] = useState("");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8080/users/${userIdValue}`)
            .then((res) => res.json())
            .then((data) => {
                setName(data.name || "");
                setImage(data.image || "");
                setEmail(data.email || "");
            });
    }, [userIdValue]);

    const handleSave = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/users/${userIdValue}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, image }),
                }
            );

            const result = await response.text();
            setMessage(result);
            setError("");
        } catch (error) {
            setError("Failed to update account info.");
            setMessage("");
        }
    };

    const handleUpdatePassword = async () => {
        if (!oldPassword || !newPassword) {
            setError("Please fill in both password fields.");
            setMessage("");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/users/update-password",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, oldPassword, newPassword }),
                }
            );

            const result = await response.text();

            if (response.ok) {
                setMessage(result);
                setOldPassword("");
                setNewPassword("");
                setError("");
            } else {
                setError(result);
                setMessage("");
            }
        } catch (err) {
            setError("Failed to update password.");
            setMessage("");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Edit Account</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
            />

            <Text style={styles.label}>Image URL</Text>
            <TextInput
                style={styles.input}
                value={image}
                onChangeText={setImage}
                placeholder="Enter image URL"
            />

            <Button title="Save Changes" onPress={handleSave} />

            <View style={styles.divider} />

            <Text style={styles.label}>Update Password</Text>
            <TextInput
                style={styles.input}
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Current password"
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                secureTextEntry
            />

            <Button title="Update Password" onPress={handleUpdatePassword} />

            {message ? <Text style={styles.success}>{message}</Text> : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 60,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
    },
    label: {
        fontWeight: "600",
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: 20,
    },
    success: {
        marginTop: 15,
        color: "green",
        fontWeight: "bold",
    },
    error: {
        marginTop: 15,
        color: "red",
        fontWeight: "bold",
    },
});

export default EditAccount;
