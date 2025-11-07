import { Stack } from "expo-router";

export default function AppointmentsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "My Appointments",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: "Appointment Details",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
