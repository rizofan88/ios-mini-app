import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import * as Clipboard from "expo-clipboard";

import MyModal from "../../components/modal";
import { ThemedView } from "../../components/themed-view";
import { Note } from "../../notesContext";
import { hp, wp } from "../../constants/dimensions";

type ListItemProps = {
  note: Note;
  updateNote: (id: string, label: string, password: string) => void;
};

export const ListItem = ({ note, updateNote }: ListItemProps) => {
  const [isLocked, setIsLocked] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const copy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 800);
  };

  return (
    <ThemedView style={styles.mainView}>
      <TextInput
        style={styles.labelInput}
        placeholder="Name of password"
        value={note.label}
        onChangeText={(label) => updateNote(note.id, label, note.password)}
      />

      <ThemedView style={styles.passwordRow}>
        <Pressable style={styles.passwordButton}>
          <TextInput
            style={styles.passwordInput}
            editable={!isLocked}
            placeholder="Password"
            value={note.password}
            onChangeText={(password) =>
              updateNote(note.id, note.label, password)
            }
          />
        </Pressable>

        <Pressable style={styles.copyButton} onPress={() => copy(note.password)}>
          <Text>Copy</Text>
        </Pressable>

        <Pressable
          style={styles.lockButton}
          onPress={() => setIsLocked((current) => !current)}
        >
          <Text style={styles.lockButtonText}>
            {isLocked ? "Unlock" : "Lock"}
          </Text>
        </Pressable>
      </ThemedView>

      <MyModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: hp(2),
    paddingLeft: hp(1),
  },
  labelInput: {
    fontSize: hp(2),
    fontWeight: "700",
    paddingBottom: hp(1),
    width: hp(25),
  },
  passwordRow: {
    flexDirection: "row",
  },
  passwordButton: {
    borderWidth: hp(0.04),
    borderRadius: hp(0.5),
    width: hp(25),
  },
  passwordInput: {
    fontSize: hp(2),
    fontWeight: "700",
    padding: hp(0.2),
  },
  copyButton: {
    backgroundColor: "#c9d5ccff",
    paddingVertical: hp(0.1),
    paddingLeft: wp(1.2),
    paddingRight: wp(1.9),
    borderRadius: hp(1),
    marginLeft: wp(1),
    justifyContent: "center",
  },
  lockButton: {
    backgroundColor: "#000000ff",
    paddingVertical: hp(0.1),
    paddingLeft: wp(1.2),
    paddingRight: wp(1.9),
    borderRadius: hp(1),
    marginLeft: wp(1),
    justifyContent: "center",
  },
  lockButtonText: {
    color: "white",
    fontWeight: "500",
  },
});
