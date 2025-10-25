/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  onUserChanged,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  logout as signOut, // alias to keep naming clear in this file
} from '../../server/services/auth';

type AuthUser = {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
} | null;

type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // server/services/auth.ts returns the unsubscribe function
    const unsubscribe = onUserChanged((firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
      } else {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? null,
          displayName: firebaseUser.displayName ?? null,
          photoURL: firebaseUser.photoURL ?? null,
        });
      }
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (e: any) {
      setError(e?.message ?? 'Unable to sign in.');
      throw e;
    }
  };

  const signup = async (email: string, password: string) => {
    setError(null);
    try {
      await signUpWithEmail(email, password);
    } catch (e: any) {
      setError(e?.message ?? 'Unable to sign up.');
      throw e;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setError(e?.message ?? 'Google sign-in failed.');
      throw e;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut();
    } catch (e: any) {
      setError(e?.message ?? 'Unable to sign out.');
      throw e;
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, error, login, signup, loginWithGoogle, logout }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
