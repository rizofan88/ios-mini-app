import { Stack } from "expo-router";
import { LoginProvider, NotesProvider } from "./notesContext";
import MainHeaderLeft from "./components/layout/MainHeaderLeft";
import MainHeaderRight from "./components/layout/MainHeaderRight";

export default function RootLayout() {
  return (
    <LoginProvider>
      <NotesProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
              title: "Main",
              headerLeft: () => <MainHeaderLeft />,
              headerRight: () => <MainHeaderRight />,
            }}
          />

          <Stack.Screen
            name="encode"
            options={{
              headerBackTitle: "main",
              headerShown: true,
              title: "",
            }}
          />

          <Stack.Screen
            name="decode"
            options={{
              headerBackTitle: "main",
              title: "",
            }}
          />
        </Stack>
      </NotesProvider>
    </LoginProvider>
  );
}
