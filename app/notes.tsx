import { useContext, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { hp } from './constants/dimensions';
import { NotesContext } from './notesContext';
import { ListItem } from './components/notes/ListItem';

export default function NotesScreen() {
  const {
    notes,
    updateNote,
    addNote,
    rmvNote,
    loadUserNotes,
  } = useContext(NotesContext);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [rmvModalVisible, setRmvModalVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const user = useRef<string>('');

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const username = await SecureStore.getItemAsync('CURRENT_USER');
        const isLoggedIn = await SecureStore.getItemAsync(
          `LOGGED_IN${username}`
        );

        if (username && isLoggedIn) {
          setLoggedIn(true);

          user.current = username;

          await loadUserNotes(username);
          return;
        }

        router.replace('/login');
      } catch (e) {
        console.warn('Failed loading notes.', e);
      }
    };

    loadNotes();
  }, [loadUserNotes]);

  if (!loggedIn) {
    return (
      <SafeAreaProvider style={styles.provider}>
        <SafeAreaView style={styles.emptyScreen} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.provider}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.flex}>
            <FlatList
              data={notes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ListItem
                  note={item}
                  updateNote={updateNote}
                />
              )}
              contentContainerStyle={styles.listContent}
            />

            <View style={styles.buttonsWrapper}>
              <Pressable
                onPress={() => setAddModalVisible(true)}
                style={[styles.actionButton, styles.addButton]}
              >
                <Text style={styles.actionButtonText}>+</Text>
              </Pressable>

              <Pressable
                onPress={() => setRmvModalVisible(true)}
                style={[styles.actionButton, styles.removeButton]}
              >
                <Text style={styles.actionButtonText}>-</Text>
              </Pressable>
            </View>

            <Modal
              animationType="slide"
              transparent
              visible={addModalVisible}
              onRequestClose={() => setAddModalVisible(false)}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    Want To Add New Line?
                  </Text>

                  <View style={styles.modalButtons}>
                    <Pressable
                      style={[styles.modalButton, styles.confirmButton]}
                      onPress={() => {
                        addNote();
                        setAddModalVisible(false);
                      }}
                    >
                      <Text style={styles.textStyle}>Yes</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setAddModalVisible(false)}
                    >
                      <Text style={styles.textStyle}>No</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent
              visible={rmvModalVisible}
              onRequestClose={() => setRmvModalVisible(false)}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    Want To Delete Empty Line?
                  </Text>

                  <View style={styles.modalButtons}>
                    <Pressable
                      style={[styles.modalButton, styles.confirmButton]}
                      onPress={() => {
                        rmvNote();
                        setRmvModalVisible(false);
                      }}
                    >
                      <Text style={styles.textStyle}>Yes</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setRmvModalVisible(false)}
                    >
                      <Text style={styles.textStyle}>No</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  provider: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: hp(2),
  },
  flex: {
    flex: 1,
  },
  emptyScreen: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 200,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    alignSelf: 'center',
    padding: hp(0.8),
    borderRadius: hp(0.8),
  },
  addButton: {
    backgroundColor: 'black',
    marginRight: hp(2),
    paddingHorizontal: hp(2),
  },
  removeButton: {
    backgroundColor: 'red',
    paddingHorizontal: hp(2.35),
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '900',
    fontSize: hp(4),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginLeft: 5,
  },
  confirmButton: {
    backgroundColor: '#2a6a38ff',
  },
  cancelButton: {
    backgroundColor: '#b81212ff',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
