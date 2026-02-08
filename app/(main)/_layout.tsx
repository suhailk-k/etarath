import { useIsAuthenticated } from "@/store/userStore";
import { Redirect, Stack } from "expo-router";

const MainLayout = () => {
  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerTintColor: "black",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="order-history"
        options={{
          headerShown: true,
          title: "Order History",
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: "black",
        }}
      />
      <Stack.Screen
        name="warranty-history"
        options={{
          headerShown: true,
          title: "Warranty History",
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: "black",
        }}
      />
      <Stack.Screen
        name="order-details/[id]"
        options={{ headerShown: true, title: "Order Details" }}
      />
      <Stack.Screen
        name="claim-details/[id]"
        options={{ headerShown: true, title: "Claim Details" }}
      />
      <Stack.Screen
        name="performance-summary"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="customers/[id]"
        options={{
          headerShown: true,
          title: "",
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: "black",
        }}
      />
    </Stack>
  );
};

export default MainLayout;
