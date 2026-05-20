# Encryptor

Encryptor is a small React Native / Expo application for encrypting, decrypting, and locally storing passwords and notes on-device.

The app was built primarily for personal need and interest and combines:
- React Native / Expo
- Secure local storage
- Navigation and shared state
- Cryptography concepts
- iOS deployment with EAS / TestFlight

## Features

- Encrypt text using a secret key
- Decrypt previously encrypted text
- Local account system
- Secure local note storage
- Copy encrypted/decrypted values to clipboard
- Automatic login timeout after inactivity
- iOS support through Expo + EAS + TestFlight

---

# Tech Stack

- Expo
- React Native
- TypeScript
- Expo Router
- Expo SecureStore
- Crypto-ES
- EAS Build / Submit

---

# Project Structure

```txt
app/
│
├── index.tsx
├── encode.tsx
├── decode.tsx
├── login.tsx
├── notes.tsx
├── notesContext.tsx
│
├── components/
│   ├── login/
│   ├── notes/
│   └── layout/
│
├── constants/
├── helpers/
└── hooks/

assets/


# Running Locally

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

For Expo Go mode:

```bash
npx expo start --tunnel
```

If needed, press:

```txt
s
```

inside terminal to switch to Expo Go mode.

---

# Development Build (iOS)

Development builds allow:
- native debugging
- React DevTools
- development client usage

Build:

```bash
eas build --platform ios --profile development
```

Then run:

```bash
npx expo start --dev-client
```

Open the QR code on the device.

---

# Production / TestFlight Build

Build:

```bash
eas build --platform ios --profile production
```

Submit:

```bash
eas submit --platform ios
```

After processing, the build becomes available on TestFlight.

---

# Install Previous Builds

Login to:

```txt
https://expo.dev
```

from iPhone Safari using the same Expo account.

Then select the build and install it.

---

# Creating a New Expo App

```bash
npx create-expo-app@latest MyApp
```

Optional cleanup:

```bash
npm run reset-project
```

This moves template examples into:

```txt
app-example/
```

---

# Security Notes

This app is experimental and educational.

It should NOT currently be treated as a production-grade password manager.

Known limitations:
- no remote backup
- no account recovery
- local-only storage
- no biometric protection integration
- username hashing could be improved
- additional hardening recommended

---

# TODO

- improve keyboard handling
- improve modal animations
- improve note interaction UX
- add account creation flow
- add biometric authentication
- improve encryption/storage hardening
- improve placeholder styling
- improve navigation flow
- investigate async state update behavior in notes context

---

# Lint

```bash
npm run lint
```

---

# Build Notes

If iOS linking issues appear:

```bash
npx pod-install
```

---

# License

Personal learning project.
