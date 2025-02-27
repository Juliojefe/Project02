import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="landing" options={{ title: "Landing Page" }} />
      <Stack.Screen name="settings" options={{ title: "Settings Page" }} />
    </Stack>
  );
}
