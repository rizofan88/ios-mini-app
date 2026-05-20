import { useContext, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as CryptoES from 'crypto-es';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { hp } from './constants/dimensions';
import { LoginContext } from './notesContext';
import {
  UsernameInput,
  PasswordInput,
} from './components/login/loginCredentials';
import {
  LoginButton,
  LogoutButton,
} from './components/login/loginButtons';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const passwordRef = useRef<string>('');

  const { userIsLogged, usernameCurrent, checkLoggedIn } =
    useContext(LoginContext);

  const router = useRouter();

  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  const showModal = (message: string, duration = 1000) => {
    setModalMessage(message);
    setModalVisible(true);

    setTimeout(() => {
      setModalVisible(false);
    }, duration);
  };

  async function saveCredentials(username: string, password: string) {
    try {
      await SecureStore.setItemAsync(`username${username}`, password, {
        keychainAccessible:
          SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      });
    } catch (e) {
      console.warn('Saving credentials failed.', e);
    }
  }

  async function clearCredentials() {
    try {
      const currentUser = await SecureStore.getItemAsync('CURRENT_USER');

      if (currentUser) {
        await SecureStore.deleteItemAsync(`LOGGED_IN${currentUser}`);
      }

      await SecureStore.deleteItemAsync('CURRENT_USER');

      passwordRef.current = '';
      return true;
    } catch (e) {
      console.error('Failed to delete credentials.', e);
      return false;
    }
  }

  async function login(username: string) {
    if (!username || !passwordRef.current) {
      showModal("Can't leave username or password empty!", 1000);
      return false;
    }

    const password = CryptoES.SHA256(passwordRef.current).toString();

    let savedPassword: string | null = null;

    try {
      savedPassword = await SecureStore.getItemAsync(`username${username}`);
    } catch (e) {
      console.warn('Failed checking username.', e);
    }

    if (savedPassword === null) {
      await saveCredentials(username, password);
      showModal('Account created, login with new credentials.', 2000);
      return false;
    }

    if (password !== savedPassword) {
      showModal('Wrong password or username, try again!', 1500);
      return false;
    }

    try {
      await SecureStore.setItemAsync('CURRENT_USER', username);
      await SecureStore.setItemAsync(`LOGGED_IN${username}`, 'true');
      return true;
    } catch (e) {
      console.warn('Failed to log in.', e);
      return false;
    }
  }

  const handleLoginPress = async (message: string) => {
    Keyboard.dismiss();

    const result = await login(username);

    if (result) {
      showModal(message, 1000);
      router.navigate('/');
    }
  };

  const handleLogoutPress = async (message: string) => {
    Keyboard.dismiss();

    const result = await clearCredentials();

    if (result) {
      showModal(message, 1000);
      router.navigate('/');
    } else {
      showModal('Not logged out.', 1000);
    }
  };

  return (
    <SafeAreaProvider style={styles.provider}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.screen}>
          {!userIsLogged && (
            <>
              <UsernameInput setUsername={setUsername} />

              <PasswordInput passwordRef={passwordRef} />

              <SafeAreaView style={styles.logButtonsWrapperView}>
                <LoginButton handleLoginPress={handleLoginPress} />

                <LogoutButton handleLogoutPress={handleLogoutPress} />
              </SafeAreaView>
            </>
          )}

          {userIsLogged && (
            <SafeAreaView style={styles.container}>
              <Text style={styles.label}>You are logged in as:</Text>
              <Text style={styles.username}>{usernameCurrent}</Text>

              <LogoutButton handleLogoutPress={handleLogoutPress} />
            </SafeAreaView>
          )}

          <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={[styles.modalText, styles.modalTextBold]}>
                  {modalMessage}
                </Text>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  provider: {
    backgroundColor: 'white',
    paddingTop: hp(2),
  },
  screen: {
    flex: 1,
    padding: hp(1),
    justifyContent: 'center',
  },
  logButtonsWrapperView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: hp(2),
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTextBold: {
    fontSize: 20,
    fontWeight: '700',
  },
  container: {
    alignItems: 'center',
    paddingVertical: hp(4),
  },
  label: {
    fontSize: hp(2.2),
    color: '#6B7280',
    marginBottom: hp(0.5),
  },
  username: {
    fontSize: hp(3.8),
    fontWeight: '600',
    color: '#111827',
    marginBottom: hp(3),
  },
});
