import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function MainHeaderLeft() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.navigate("/notes")}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <AntDesign name="menu" size={30} color="black" />
      </View>
    </TouchableOpacity>
  );
}
