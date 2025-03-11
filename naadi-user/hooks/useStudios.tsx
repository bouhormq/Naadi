import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Studio } from '@naadi/types';
import { db } from '../utils/firebase';

export function useStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, 'studios'));
        setStudios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Studio)));
        setError(null);
      } catch (err) {
        console.error('Error fetching studios:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch studios'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudios();
  }, []);

  return { studios, loading, error };
} 