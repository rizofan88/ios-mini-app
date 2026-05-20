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

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import MyModal from '../app/components/modal';

import { hp, wp } from './constants/dimensions';

import {
  concatUint8Arrays,
  uint8ArrayToHex,
  wordArrayToUint8Array,
} from './helpers/format';

const encrypt = (
  message: string,
  secretKey: string
) => {
  try {
    const salt = CryptoES.WordArray.random(16);

    const saltBytes =
      wordArrayToUint8Array(salt);

    const key = CryptoES.PBKDF2(
      secretKey,
      salt,
      {
        keySize: 256 / 32,
        iterations: 1000,
      }
    );

    const iv = CryptoES.WordArray.random(16);

    const encrypted = CryptoES.AES.encrypt(
      message,
      key,
      { iv }
    );

    const ivBytes =
      wordArrayToUint8Array(iv);

    const cipherBytes =
      wordArrayToUint8Array(
        encrypted.ciphertext!
      );

    return concatUint8Arrays(
      saltBytes,
      ivBytes,
      cipherBytes
    );
  } catch (e) {
    console.warn(
      'Encrypt function failed.',
      e
    );

    return new Uint8Array([]);
  }
};

export default function Encode() {
  const [key, setKey] = useState('');

  const [isLocked, setLock] =
    useState(false);

  const [text, setText] = useState<
    Uint8Array | undefined
  >();

  const [modalVisible, setModalVisible] =
    useState(false);

  const [secureKey, setSecureKey] =
    useState(true);

  const [secureCiph, setSecureCiph] =
    useState(true);

  const copy = async (
    what: Uint8Array
  ) => {
    try {
      const toCopy =
        uint8ArrayToHex(what);

      await Clipboard.setStringAsync(
        toCopy
      );
    } catch (e) {
      console.warn(
        'Copy to clipboard failed.',
        e
      );
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
                padding: hp(2),
              }}>
              <View
                style={{
                  alignItems: 'center',
                  paddingBottom: hp(2),
                }}>
                <Image
                  source={require('@/assets/images/encryption.png')}
                  style={{
                    width: wp(50),
                    height: hp(20),
                  }}
                />
              </View>

              <View
                style={{
                  flex: 1,
                  gap: hp(0),
                }}>
                <View
                  style={[
                    styles.containerRow,
                    {
                      alignItems: 'center',
                    },
                  ]}>
                  <View style={styles.container}>
                    <TextInput
                      editable={!isLocked}
                      placeholder="Secret Key"
                      onChangeText={(
                        value
                      ) =>
                        setKey(
                          value.trim()
                        )
                      }
                      defaultValue={key}
                      placeholderTextColor="#c0c0c0"
                      style={
                        styles.keyInputBox
                      }
                      secureTextEntry={
                        secureKey
                      }
                      autoCorrect={false}
                      autoComplete="off"
                      autoCapitalize="none"
                    />

                    <TouchableOpacity
                      style={
                        styles.iconContainer
                      }
                      onPress={() =>
                        setSecureKey(
                          !secureKey
                        )
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

                  <Pressable
                    style={
                      styles.lockButton
                    }
                    onPress={() =>
                      setLock(
                        !isLocked
                      )
                    }>
                    <Text
                      style={
                        styles.lockButtonText
                      }>
                      {isLocked
                        ? 'Unlock'
                        : 'Lock'}
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.container}>
                  <TextInput
                    placeholder="To Encrypt"
                    onChangeText={(
                      value
                    ) =>
                      value
                        ? setText(
                            encrypt(
                              value.trim(),
                              key
                            )
                          )
                        : setText(
                            undefined
                          )
                    }
                    defaultValue=""
                    placeholderTextColor="#c0c0c0"
                    style={
                      styles.encryptInputBox
                    }
                    secureTextEntry={
                      secureCiph
                    }
                    autoCorrect={false}
                    autoComplete="off"
                    autoCapitalize="none"
                  />

                  <TouchableOpacity
                    style={
                      styles.iconContainerTwo
                    }
                    onPress={() =>
                      setSecureCiph(
                        !secureCiph
                      )
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

                <View>
                  <Text
                    style={
                      styles.encryptedText
                    }>
                    Encrypted:
                  </Text>

                  <Text
                    style={
                      styles.encodedText
                    }>
                    {text
                      ? text.length > 20
                        ? `${text.slice(
                            0,
                            20
                          )}…`
                        : text
                      : ''}
                  </Text>

                  <Pressable
                    style={
                      styles.copyButton
                    }
                    onPress={() => {
                      if (!text) return;

                      copy(text);

                      setModalVisible(
                        true
                      );

                      setTimeout(() => {
                        setModalVisible(
                          false
                        );
                      }, 800);
                    }}>
                    <Text
                      style={
                        styles.copyButtonText
                      }>
                      Copy to Clipboard
                    </Text>
                  </Pressable>

                  <MyModal
                    visible={
                      modalVisible
                    }
                    onClose={() => {}}
                  />
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  keyInputBox: {
    height: hp(6),
    width: wp(68),
    padding: hp(0.4),
    marginLeft: wp(5.5),
    marginHorizontal: wp(2),
    borderWidth: hp(0.1),
    fontSize: hp(3.5),
    borderRadius: hp(1),
    paddingRight: hp(6),
  },

  lockButton: {
    borderRadius: hp(2.5),
    backgroundColor: '#85df9aff',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3.8),
  },

  lockButtonText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: 'bold',
  },

  encryptInputBox: {
    height: hp(6),
    padding: hp(0.4),
    marginHorizontal: wp(2),
    borderWidth: hp(0.1),
    fontSize: hp(3.5),
    borderRadius: hp(1),
    paddingRight: hp(6),
  },

  encryptedText: {
    marginTop: hp(1),
    padding: hp(0.5),
    fontSize: hp(5),
    alignSelf: 'center',
  },

  encodedText: {
    padding: hp(0),
    fontSize: hp(3.2),
    marginBottom: hp(1),
    fontStyle: 'italic',
    alignSelf: 'center',
    maxWidth: wp(90),
  },

  copyButton: {
    backgroundColor: '#c9d5ccff',
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(1.5),
    paddingLeft: wp(4),
    paddingRight: wp(4),
    borderRadius: hp(1),
    alignSelf: 'center',
  },

  copyButtonText: {
    color: 'black',
    fontSize: hp(1.76),
    fontWeight: 'normal',
  },

  containerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: hp(2),
  },

  container: {
    position: 'relative',
  },

  iconContainer: {
    position: 'absolute',
    right: hp(2.3),
    height: '100%',
    justifyContent: 'center',
  },

  iconContainerTwo: {
    position: 'absolute',
    right: hp(2),
    height: '100%',
    justifyContent: 'center',
  },
});
