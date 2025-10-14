'use client';

import { initializeFirebase } from './';
import { FirebaseProvider } from './provider';
import React, { useState, useEffect } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    const init = async () => {
      const instances = await initializeFirebase();
      setFirebase(instances);
    };
    init();
  }, []);

  if (!firebase) {
    // You can return a loader here if you'd like
    return null; 
  }

  return (
    <FirebaseProvider
      app={firebase.app}
      auth={firebase.auth}
      firestore={firebase.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
