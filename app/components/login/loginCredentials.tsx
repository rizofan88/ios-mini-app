import { RefObject } from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";
import { hp } from "../../constants/dimensions";

type UsernameInputProps = {
  setUsername: (username: string) => void;
};

type PasswordInputProps = {
  passwordRef: RefObject<string>;
};

export const UsernameInput = ({ setUsername }: UsernameInputProps) => (
  <Pressable style={styles.inputWrapper}>
    <TextInput
      placeholder="Username"
      style={styles.input}
      onChangeText={(username) => setUsername(username.trim())}
      secureTextEntry
      autoCorrect={false}
      autoComplete="off"
      autoCapitalize="none"
    />
  </Pressable>
);

export const PasswordInput = ({ passwordRef }: PasswordInputProps) => (
  <Pressable style={styles.inputWrapper}>
    <TextInput
      placeholder="Password"
      style={styles.input}
      onChangeText={(password) => {
        passwordRef.current = password.trim();
      }}
      secureTextEntry
      autoCorrect={false}
      autoComplete="off"
      autoCapitalize="none"
    />
  </Pressable>
);

const styles = StyleSheet.create({
  inputWrapper: {
    borderRadius: hp(0.5),
    borderWidth: hp(0.04),
    marginBottom: hp(2),
  },
  input: {
    fontSize: hp(3),
  },
});
