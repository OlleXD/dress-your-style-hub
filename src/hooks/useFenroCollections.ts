import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_FENRO_API_URL || '';
const SHOP_ID = import.meta.env.VITE_FENRO_SHOP_ID || '';

export function useFenroCollections(includeProducts = false) {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!API_URL || !SHOP_ID) {
      setError(new Error('Fenro API URL eller Shop ID saknas'));
      setLoading(false);
      return;
    }

    const fetchCollections = async () => {
      try {
        const url = `${API_URL}/api/shop/${SHOP_ID}/collections?include_products=${includeProducts}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setCollections(data.collections || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Okänt fel'));
        console.error('Error fetching collections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [includeProducts]);

  return { collections, loading, error };
}

