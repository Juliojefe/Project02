import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="tierList" options={{ headerShown: false }} />
      
      </Stack>
  );
}
