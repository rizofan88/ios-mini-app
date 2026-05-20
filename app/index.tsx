import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Entypo from '@expo/vector-icons/Entypo';

import ParallaxScrollView from './components/parallax-scroll-view';
import { ThemedText } from './components/themed-text';
import { ThemedView } from './components/themed-view';

const { width, height } = Dimensions.get('window');

const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;

export default function Index() {
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{
          light: '#e8edeeff',
          dark: '#1D3D47',
        }}
        headerImage={
          <Image
            source={require('@/assets/images/encryption.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleWrapper}>
          <Text style={styles.titleTop}>THE</Text>
        </ThemedView>

        <ThemedView style={styles.titleWrapper}>
          <Text style={styles.titleMain}>ENCRYPTOR</Text>
        </ThemedView>

        <Link href="/encode" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Encode</Text>
          </Pressable>
        </Link>

        <Link href="/decode" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Decode</Text>
          </Pressable>
        </Link>

        <Pressable
          onPress={() => setInstructionsVisible((value) => !value)}
          style={styles.dropDownMenu}>
          <Text style={styles.instructionsTitle}>
            Instructions{' '}
            <Entypo
              name={
                instructionsVisible
                  ? 'chevron-with-circle-down'
                  : 'chevron-with-circle-right'
              }
              size={hp(3)}
              color="black"
            />
          </Text>
        </Pressable>

        {instructionsVisible && (
          <ThemedView style={styles.instructionsWrapper}>
            <ThemedText type="subtitle">
              Step 1:{' '}
              <ThemedText type="subtitleNotBold">
                Choose A MASTER KEY
              </ThemedText>
            </ThemedText>

            <ThemedText type="subtitle">
              Step 2:{' '}
              <ThemedText type="subtitleNotBold">
                Make sure the KEY has not been already used
              </ThemedText>
            </ThemedText>

            <ThemedText type="subtitle">
              Step 3:{' '}
              <ThemedText type="subtitleNotBold">
                Write down the KEY on a piece of paper
              </ThemedText>
            </ThemedText>
          </ThemedView>
        )}
      </ParallaxScrollView>

      <ThemedView style={styles.footerWrapper}>
        <Text style={styles.footerRights}>
          2025 The Encryptor© All Rights Reserved
        </Text>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleWrapper: {
    alignItems: 'center',
  },

  titleTop: {
    fontWeight: 'bold',
    fontSize: wp(10),
  },

  titleMain: {
    fontWeight: 'bold',
    fontSize: wp(9.5),
  },

  buttonText: {
    color: 'white',
    fontSize: hp(3),
    fontWeight: 'bold',
    alignSelf: 'center',
  },

  dropDownMenu: {
    minWidth: hp(10),
    alignSelf: 'center',
  },

  instructionsTitle: {
    fontSize: hp(3.2),
  },

  instructionsWrapper: {
    gap: hp(1),
    marginBottom: hp(1),
  },

  footerWrapper: {
    minWidth: hp(10),
  },

  footerRights: {
    justifyContent: 'flex-end',
    alignSelf: 'center',
    paddingBottom: hp(2.5),
    fontSize: hp(1.3),
  },

  reactLogo: {
    height: hp(29),
    width: wp(75),
    top: hp(1),
    left: wp(14),
  },

  button: {
    marginLeft: wp(1),
    marginRight: wp(1),
    backgroundColor: '#85df9aff',
    alignSelf: 'center',
    paddingVertical: wp(4),
    paddingHorizontal: wp(27),
    borderRadius: hp(2),
    minWidth: wp(90),
  },
});
