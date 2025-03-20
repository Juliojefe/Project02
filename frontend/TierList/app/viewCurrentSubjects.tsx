import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";

const ViewCurrentSubjectsPage = () => {
  const { userID } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    handleGetSubjects();
  }, []);

  const handleGetSubjects = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/subjects/current`
      );
      setSubjects(response.data);
    } catch (error) {
      console.log("Error getting current subjects of the week: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Turns the subject names into proper casing with the first letter of each word capitalized
  function titleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{titleCase(item.name.toLowerCase())}</Text>
    </TouchableOpacity>
  );

  const renderSubjectItem = ({ item }) => {
    const backgroundColor = item.subjectId === selectedId ? "#a4d8d8" : "#a4d8d8";
    const color = item.subjectId === selectedId ? "black" : "black";
  
    return (
      <Item
        style={styles.item}
        item={item}
        onPress={() => {
          setSelectedId(item.subjectId);
          router.push(`/tierList?userID=${encodeURIComponent(userID)}&subjectId=${encodeURIComponent(item.subjectId)}`);
        }}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Current Subjects for this week</Text>
      <FlatList
        data={subjects}
        renderItem={renderSubjectItem}
        keyExtractor={(item) => item.subjectId.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20, // Add padding for better spacing
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#fcba03",
    color: "#000",
    justifyContent: "center",
    alignItems: "center", 
  },
  title: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#227755",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 15,
    color: "#fff",
  },
  adminButton: {
    backgroundColor: "#0D0208",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  adminButtonText: {
    fontSize: 15,
    color: "#00FF41",
  },
  settingsButton: {
    backgroundColor: "#898989",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  settingsButtonText: {
    fontSize: 15,
    color: "#fff",
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  logoutButtonText: {
    fontSize: 15,
    color: "#fff",
  },
});

export default ViewCurrentSubjectsPage;