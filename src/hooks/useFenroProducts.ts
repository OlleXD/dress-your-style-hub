import { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = import.meta.env.VITE_FENRO_API_URL || '';
const SHOP_ID = import.meta.env.VITE_FENRO_SHOP_ID || '';

export interface UseFenroProductsOptions {
  collection?: string;
  category?: string;
  pollingInterval?: number;
  status?: 'active' | 'inactive' | 'all';
  limit?: number;
  offset?: number;
}

export function useFenroProducts(options?: UseFenroProductsOptions) {
  const {
    collection,
    category,
    pollingInterval = 5000,
    status = 'active',
    limit = 100,
    offset = 0,
  } = options || {};

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const lastSync = useRef<string | null>(null);

  const fetchProducts = useCallback(
    async (isInitial = false) => {
      if (!API_URL || !SHOP_ID) {
        setError(new Error('Fenro API URL eller Shop ID saknas'));
        setLoading(false);
        return;
      }

      try {
        let url = `${API_URL}/api/shop/${SHOP_ID}/products?status=${status}&limit=${limit}&offset=${offset}`;

        if (collection) url += `&collection=${encodeURIComponent(collection)}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (!isInitial && lastSync.current) {
          url += `&updated_since=${encodeURIComponent(lastSync.current)}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        if (isInitial) {
          setProducts(data.products || []);
        } else if (data.products && data.products.length > 0) {
          // Merge updates
          setProducts((prev) => {
            const updated = [...prev];
            for (const product of data.products) {
              const index = updated.findIndex((p) => p.id === product.id);
              if (index >= 0) {
                updated[index] = product;
              } else if (product.is_active) {
                updated.unshift(product);
              }
            }
            return updated.filter((p) => p.is_active);
          });
        }

        if (data.meta?.timestamp) {
          lastSync.current = data.meta.timestamp;
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Okänt fel'));
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    },
    [collection, category, status, limit, offset]
  );

  // Initial fetch
  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  // Polling
  useEffect(() => {
    if (!API_URL || !SHOP_ID) return;
    
    const interval = setInterval(() => fetchProducts(false), pollingInterval);
    return () => clearInterval(interval);
  }, [fetchProducts, pollingInterval]);

  return {
    products,
    loading,
    error,
    refetch: () => fetchProducts(true),
  };
}

