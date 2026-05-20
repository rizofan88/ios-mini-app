import {
  createContext,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';

export type Note = {
  id: string;
  label: string;
  password: string;
};

type NotesContextType = {
  notes: Note[];
  updateNote: (id: string, label: string, password: string) => Promise<void>;
  addNote: () => Promise<void>;
  rmvNote: () => Promise<void>;
  loadUserNotes: (username: string) => Promise<void>;
};

type LoginContextType = {
  userIsLogged: boolean;
  usernameCurrent: string;
  checkLoggedIn: () => Promise<void>;
};

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  updateNote: async () => {},
  addNote: async () => {},
  rmvNote: async () => {},
  loadUserNotes: async () => {},
});

export const LoginContext = createContext<LoginContextType>({
  userIsLogged: false,
  usernameCurrent: '',
  checkLoggedIn: async () => {},
});

export function LoginProvider({ children }: { children: ReactNode }) {
  const [userIsLogged, setUserIsLogged] = useState(false);
  const [usernameCurrent, setUsernameCurrent] = useState('');

  const checkLoggedIn = useCallback(async () => {
    try {
      const currentUser = await SecureStore.getItemAsync('CURRENT_USER');

      if (currentUser !== null) {
        setUserIsLogged(true);
        setUsernameCurrent(currentUser);
      } else {
        setUserIsLogged(false);
        setUsernameCurrent('');
      }
    } catch (e) {
      console.warn('Failed fetching current user.', e);
    }
  }, []);

  return (
    <LoginContext.Provider
      value={{
        userIsLogged,
        usernameCurrent,
        checkLoggedIn,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const currentUser = useRef<string | null>(null);

  const saveNotes = useCallback(async (notesToSave: Note[]) => {
    if (currentUser.current === null) return;

    try {
      await SecureStore.setItemAsync(
        `NOTES_${currentUser.current}`,
        JSON.stringify(notesToSave)
      );
    } catch (e) {
      console.warn('Failed to save notes.', e);
    }
  }, []);

  const loadUserNotes = useCallback(async (username: string) => {
    currentUser.current = username;

    try {
      const raw = await SecureStore.getItemAsync(`NOTES_${username}`);

      if (raw === null) {
        setNotes([]);
        return;
      }

      try {
        const parsed: Note[] = JSON.parse(raw);
        setNotes(parsed);
      } catch (e) {
        console.warn('Failed to parse notes.', e);
        setNotes([]);
      }
    } catch (e) {
      console.warn('Failed fetching or setting notes.', e);
    }
  }, []);

  const updateNote = useCallback(
    async (id: string, label: string, password: string) => {
      setNotes((prev) => {
        const updated = prev.map((note) =>
          note.id === id ? { ...note, label, password } : note
        );

        saveNotes(updated);
        return updated;
      });
    },
    [saveNotes]
  );

  const addNote = useCallback(async () => {
    setNotes((prev) => {
      const newNote: Note = {
        id: Date.now().toString(),
        label: '',
        password: '',
      };

      const updated = [...prev, newNote];

      saveNotes(updated);
      return updated;
    });
  }, [saveNotes]);

  const rmvNote = useCallback(async () => {
    setNotes((prev) => {
      const updated = prev.filter(
        (note) => !(note.label === '' && note.password === '')
      );

      saveNotes(updated);
      return updated;
    });
  }, [saveNotes]);

  return (
    <NotesContext.Provider
      value={{
        notes,
        updateNote,
        addNote,
        rmvNote,
        loadUserNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
