# Architecture

## index.tsx

Main landing page of the app.

Contains:
- navigation buttons
- instructions section
- automatic login timeout checks
- app background state handling

The app checks how long it has been in the background using SecureStore timestamps.
If the inactivity time exceeds the timeout threshold, the user is logged out automatically.

---

## login.tsx

Handles:
- login
- logout
- account creation

Credentials are stored locally using Expo SecureStore.

Passwords are SHA256 hashed before storage.

The page also:
- validates empty input
- shows modal errors
- redirects after successful login/logout

---

## encode.tsx

Main encryption page.

Flow:
1. user enters secret key
2. user enters plaintext
3. PBKDF2 derives a hashed key
4. random salt and IV are generated
5. AES encryption is performed
6. result is converted into hex for storage/sharing

The final encrypted payload contains:

```txt
[salt][iv][ciphertext]
```

Salt and IV are intentionally public and are required for decryption.

The page also contains:
- clipboard support
- keyboard-aware layout handling
- optional key locking

---

## decode.tsx

Main decryption page.

Flow:
1. user pastes encrypted hex
2. app reconstructs byte arrays
3. app extracts:
   - salt
   - IV
   - ciphertext
4. PBKDF2 recreates the key
5. AES decrypts the data
6. plaintext password is returned

---

## notes.tsx

Password notes manager.

Features:
- add/remove notes
- edit labels/passwords
- automatic local persistence
- clipboard copy support

Notes are rendered using a FlatList and are scoped per-user.

---

## notesContext.tsx

Shared application state.

Contains:
- NotesProvider
- LoginProvider
- local storage logic
- note synchronization
- shared login state

All pages access shared data through React Context.

---

# Local Storage

The app uses Expo SecureStore.

Examples:

```txt
CURRENT_USER
LOGGED_IN_<username>
NOTES_<username>
```

Notes are serialized as JSON strings before storage.

---
