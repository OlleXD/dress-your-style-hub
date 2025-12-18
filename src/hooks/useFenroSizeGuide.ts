import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_FENRO_API_URL || '';
const SHOP_ID = import.meta.env.VITE_FENRO_SHOP_ID || '';

export function useFenroSizeGuide(sizeGuideId: string | null) {
  const [sizeGuide, setSizeGuide] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sizeGuideId || !API_URL || !SHOP_ID) {
      setSizeGuide(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchSizeGuide = async () => {
      try {
        const url = `${API_URL}/api/shop/${SHOP_ID}/size-guides?id=${encodeURIComponent(sizeGuideId)}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setSizeGuide(data.size_guide || null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Okänt fel'));
        console.error('Error fetching size guide:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSizeGuide();
  }, [sizeGuideId]);

  return { sizeGuide, loading, error };
}

