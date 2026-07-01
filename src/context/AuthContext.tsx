import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  signInWithGoogle: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Verify user against server to ensure they actually exist in the database (catches deleted/wiped users)
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error || !user) {
            console.warn('Cached session is invalid or user was deleted from auth.users. Logging out.', error);
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
          } else {
            setSession(session);
            setUser(session.user);
          }
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Error during session initialization:', err);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    console.log('Initiating Google sign-in with OAuth');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
