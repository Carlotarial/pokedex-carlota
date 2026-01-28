import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="detalle/[id]"
          options={{
            title: "DATOS POKÉMON",
            headerStyle: { backgroundColor: "#CC0000" },
            headerTintColor: "#FFF",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
