import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Switch,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";

const AdminEditUserPage = () => {
    const { userId } = useLocalSearchParams();
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/users/${userId}`);
                const user = res.data;
                setName(user.name);
                setImage(user.image || "");
                setIsAdmin(user.isAdmin);
                setEmail(user.email);
            } catch (err) {
                Alert.alert("Error", "Failed to load user data.");
            }
        };

        fetchUser();
    }, [userId]);


    const handleSave = async () => {
        try {
            // Update name, image, and admin status
            await axios.patch(`http://localhost:8080/users/${userId}`, {
                name,
                image,
                isAdmin,
            });

            // Update password if provided (admin override)
            if (newPassword) {
                await axios.put(`http://localhost:8080/users/${userId}/admin-update-password`, {
                    newPassword,
                });
            }

            Alert.alert("Success", "User updated successfully!");
            router.replace(`/viewUsers?userID=${userId}`); // go back to view
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to update user.");
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/users/admin/${userId}`, {
                data: { email },
            });

            Alert.alert("Deleted", `User ${name} deleted successfully.`);
            router.replace(`/viewUsers?userID=${userId}`);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to delete user.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin: Edit User</Text>

            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
            <TextInput style={styles.input} value={image} onChangeText={setImage} placeholder="Image URL" />
            <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="New Password (optional)" secureTextEntry />

            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Admin Status</Text>
                <Switch value={isAdmin} onValueChange={setIsAdmin} />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete User</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, backgroundColor: "#fff" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    input: {
        borderWidth: 1, borderColor: "#ccc", borderRadius: 5,
        padding: 10, marginBottom: 15,
    },
    switchContainer: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20,
    },
    switchLabel: { fontWeight: "bold" },
    saveButton: {
        backgroundColor: "#227755", padding: 15,
        borderRadius: 8, alignItems: "center", marginBottom: 10,
    },
    saveButtonText: { color: "#fff", fontWeight: "bold" },
    deleteButton: {
        backgroundColor: "#ff3b30", padding: 15,
        borderRadius: 8, alignItems: "center",
    },
    deleteButtonText: { color: "#fff", fontWeight: "bold" },
});

export default AdminEditUserPage;
