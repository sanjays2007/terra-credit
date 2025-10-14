'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  getDocs,
  type Query,
  type DocumentData,
  type Firestore,
} from 'firebase/firestore';
import { useFirebase } from '@/firebase';

interface UseCollectionOptions<T> {
  query?: [string, '==', any];
}

export const useCollection = <T extends DocumentData>(
  q: Query<T> | null
) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!q) {
        setLoading(false);
        return;
    };

    setLoading(true);
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(documents);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching collection: ', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [q]);

  return { data, loading, error };
};
