'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User, signInAnonymously } from 'firebase/auth';
import { useAuth } from '@/firebase';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(auth?.currentUser ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setUser(user);
        } else {
          // If no user, sign in anonymously
          signInAnonymously(auth).catch((error) => {
            console.error("Anonymous sign-in failed:", error);
            setUser(null);
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setLoading(false);
      }
    );

    // Initial check in case onAuthStateChanged is slow
    if (auth.currentUser) {
        setUser(auth.currentUser);
        setLoading(false);
    } else if (loading) { // If still loading and no user, try to sign in
        signInAnonymously(auth).catch(err => console.error(err)).finally(() => setLoading(false));
    }


    return () => unsubscribe();
  }, [auth, loading]);

  return { user, loading };
}
