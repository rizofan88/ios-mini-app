import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function MainHeaderRight() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.navigate("/login")}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialIcons name="account-circle" size={38} color="black" />
      </View>
    </TouchableOpacity>
  );
}
