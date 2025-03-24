import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useFonts } from "expo-font";

const Index = () => {
  // Correctly load the font using useFonts hook
  const [fontsLoaded] = useFonts({
    "Silverknife-RegularItalic": require("@/assets/fonts/Silverknife-RegularItalic.otf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const logo = require("@/assets/images/HotTakesLogo.png");
  const footerLogo = require("@/assets/images/CSUMB-COS-Logo.png");

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <View style={styles.container}>
      {/* First Column - Image */}
      <View style={styles.leftColumn}>
        <Image source={logo} style={styles.logoImage} />
      </View>

      {/* Second Column - Title and Buttons */}
      <View style={styles.rightColumn}>
        <Text style={styles.title}>HOT TAKES</Text>
        <Text style={styles.description}>
          Create tier lists from weekly topics and <br></br>showcase your hot
          takes.
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        {/* Horizontal line */}
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <Text style={styles.lineText}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.buttonText}>Create new account</Text>
        </TouchableOpacity>
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Image
          source={footerLogo}
          style={styles.footerImage}
          resizeMode="contain"
        />
        <Text style={styles.footerText}>
          CST438 2025© Jayson Basilio, Julio Fernandez, Ozzie Munoz, Ahmed Torki
          <br />
          Tier List Project 02 - Hot Takes
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  leftColumn: {
    flex: 1,
    padding: "5%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  rightColumn: {
    flex: 1,
    padding: "5%",
    justifyContent: "center",
    backgroundColor: "#1f2022",
  },
  logoImage: {
    width: "65%",
    height: "65%",
  },
  title: {
    fontSize: 130,
    fontWeight: "bold",
    color: "#ffcf33",
    letterSpacing: 5,
    fontFamily: "Silverknife-RegularItalic",
    marginBottom: -10,
  },
  description: {
    fontSize: 25,
    marginBottom: 20,
    color: "#fcfcfc",
    fontFamily: "Arial",
  },
  lineContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "47%",
  },
  line: {
    borderBottomWidth: 2,
    marginHorizontal: 8,
    borderBottomColor: "#4E5056",
    marginVertical: 10,
    flex: 1,
  },
  lineText: {
    fontSize: 15,
    color: "#fcfcfc",
    fontFamily: "Arial",
  },
  loginButton: {
    backgroundColor: "#e1342c",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 100,
    marginVertical: 15,
    width: "40%",
    marginLeft: "3%",
  },
  signupButton: {
    backgroundColor: "#f07b16",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 100,
    marginVertical: 15,
    width: "40%",
    marginLeft: "3%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Arial",
  },
  footer: {
    position: "absolute",
    bottom: "0%",
    left: "0%",
    right: "0%",
    backgroundColor: "#b5c8da",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 2,
    borderTopColor: "#fcfcfc",
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

export default Index;
