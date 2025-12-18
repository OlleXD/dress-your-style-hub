import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_FENRO_API_URL || '';
const SHOP_ID = import.meta.env.VITE_FENRO_SHOP_ID || '';

export function useFenroCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!API_URL || !SHOP_ID) {
      setError(new Error('Fenro API URL eller Shop ID saknas'));
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const url = `${API_URL}/api/shop/${SHOP_ID}/categories`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setCategories(data.categories || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Okänt fel'));
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

