import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useState } from 'react';

import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as CryptoES from 'crypto-es';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import MyModal from '../app/components/modal';

import { hp, wp } from './constants/dimensions';

import {
  hexToUint8Array,
  uint8ArrayToWordArray,
} from './helpers/format';

const decrypt = (
  key: string,
  cipheredText: string
) => {
  try {
    const array = hexToUint8Array(cipheredText);

    const salt = uint8ArrayToWordArray(array.slice(0, 16));
    const iv = uint8ArrayToWordArray(array.slice(16, 32));
    const encrypted = uint8ArrayToWordArray(array.slice(32));

    const ciphered = CryptoES.CipherParams.create({
      ciphertext: encrypted,
    });

    const keyDone = CryptoES.PBKDF2(key, salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });

    const decrypted = CryptoES.AES.decrypt(
      ciphered,
      keyDone,
      { iv }
    );

    return decrypted.toString(CryptoES.Utf8);
  } catch (e) {
    console.warn('Decrypt function failed.', e);

    return CryptoES.WordArray
      .create('')
      .toString(CryptoES.Utf8);
  }
};

export default function Decode() {
  const [key, setKey] = useState('');
  const [ciphered, setCiphered] = useState('');
  const [decoded, setDecoded] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const [secureKey, setSecureKey] = useState(true);
  const [secureCiph, setSecureCiph] = useState(true);

  const copy = async (what: string) => {
    try {
      await Clipboard.setStringAsync(what);
    } catch (e) {
      console.warn('Copy to clipboard failed.', e);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
          keyboardVerticalOffset={hp(14)}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                padding: 20,
              }}>
              <Image
                source={require('@/assets/images/encryption.png')}
                style={{
                  alignSelf: 'center',
                  width: wp(50),
                  height: hp(26),
                }}
              />

              <View style={{ flex: 1 }}>
                <View style={styles.container}>
                  <TextInput
                    placeholder="Secret Key"
                    placeholderTextColor="#c0c0c0"
                    style={styles.inputBoxText}
                    onChangeText={(value) =>
                      setKey(value.trim())
                    }
                    secureTextEntry={secureKey}
                    autoCorrect={false}
                    autoComplete="off"
                    autoCapitalize="none"
                  />

                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() =>
                      setSecureKey(!secureKey)
                    }>
                    <MaterialCommunityIcons
                      name={
                        secureKey
                          ? 'eye-closed'
                          : 'eye'
                      }
                      size={30}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.container}>
                  <TextInput
                    placeholder="Ciphered Text"
                    placeholderTextColor="#c0c0c0"
                    style={styles.inputBoxText}
                    onChangeText={(value) => {
                      setCiphered(value.trim());
                      setDecoded('');
                    }}
                    secureTextEntry={secureCiph}
                    autoCorrect={false}
                    autoComplete="off"
                    autoCapitalize="none"
                  />

                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() =>
                      setSecureCiph(!secureCiph)
                    }>
                    <MaterialCommunityIcons
                      name={
                        secureCiph
                          ? 'eye-closed'
                          : 'eye'
                      }
                      size={30}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>

                <Pressable
                  style={styles.button}
                  onPress={() =>
                    setDecoded(
                      decrypt(key, ciphered)
                    )
                  }>
                  <Text style={styles.buttonText}>
                    Decode
                  </Text>
                </Pressable>

                <Text style={styles.passwordText}>
                  Password:
                </Text>

                <Text style={styles.decodedText}>
                  {decoded}
                </Text>

                <Pressable
                  style={styles.copyButton}
                  onPress={() => {
                    copy(decoded);

                    setModalVisible(true);

                    setTimeout(() => {
                      setModalVisible(false);
                    }, 1800);
                  }}>
                  <Text style={styles.copyButtonText}>
                    Copy to Clipboard
                  </Text>
                </Pressable>

                <MyModal
                  visible={modalVisible}
                  onClose={() => {}}
                />
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontSize: hp(2.8),
    fontWeight: 'bold',
    alignSelf: 'center',
  },

  inputBoxText: {
    borderWidth: hp(0.1),
    padding: hp(1.2),
    borderRadius: hp(1.2),
    marginBottom: hp(2),
    fontSize: hp(3.7),
    paddingRight: hp(6),
  },

  passwordText: {
    marginTop: hp(2.5),
    fontSize: hp(3.5),
    alignSelf: 'center',
    color: '#959292',
  },

  decodedText: {
    marginTop: 0,
    fontSize: hp(4),
    alignSelf: 'center',
    fontStyle: 'italic',
  },

  copyButton: {
    marginTop: hp(2),
    backgroundColor: '#c9d5ccff',
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(1.5),
    paddingLeft: wp(4),
    paddingRight: wp(4),
    borderRadius: hp(1.6),
    alignSelf: 'center',
  },

  copyButtonText: {
    color: 'black',
    fontSize: hp(1.76),
    fontWeight: 'normal',
  },

  button: {
    marginLeft: wp(1),
    marginRight: wp(1),
    backgroundColor: '#85df9aff',
    alignSelf: 'center',
    paddingVertical: wp(4),
    paddingHorizontal: wp(18),
    borderRadius: hp(2),
    minWidth: wp(50),
  },

  container: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },

  iconContainer: {
    position: 'absolute',
    right: hp(2),
    paddingBottom: hp(1.3),
    height: '100%',
    justifyContent: 'center',
  },
});
