import { StyleSheet, Pressable, Text } from "react-native";
import { hp } from "../../constants/dimensions";

type LoginButtonProps = {
  handleLoginPress: (message: string) => Promise<void>;
};

type LogoutButtonProps = {
  handleLogoutPress: (message: string) => Promise<void>;
};

export const LoginButton = ({ handleLoginPress }: LoginButtonProps) => (
  <Pressable
    style={styles.logButtons}
    onPress={() => handleLoginPress("User is logged in!")}
  >
    <Text style={styles.logButtonsText}>LOGIN</Text>
  </Pressable>
);

export const LogoutButton = ({ handleLogoutPress }: LogoutButtonProps) => (
  <Pressable
    style={styles.logButtons}
    onPress={() => handleLogoutPress("User is logged out!")}
  >
    <Text style={styles.logButtonsText}>LOGOUT</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  logButtons: {
    backgroundColor: "black",
    padding: hp(0.8),
    borderRadius: hp(0.4),
    paddingHorizontal: hp(2),
    marginTop: hp(1),
  },
  logButtonsText: {
    color: "white",
    fontWeight: "600",
    fontSize: hp(2),
  },
});
