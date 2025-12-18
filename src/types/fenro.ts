// Fenro API Type Definitions

export interface FenroProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_price: number | null; // För rabatter
  stock: number;
  category: string | null;
  is_active: boolean;
  options: { name: string; values: string[] }[]; // T.ex. Färg, Storlek
  variants: Record<string, number | undefined>; // T.ex. "Röd / M": 5
  size_guide_id: string | null;
  collection_id: string | null;
  keywords: string[];
  images: string[]; // Signerade URLs
  manufacturer: string | null;
  created_at: string;
  updated_at: string;
}

export interface FenroCollection {
  id: string;
  name: string;
  description: string;
  description_html: string; // Rich text description
  image_url: string;
  product_count?: number;
  created_at: string;
  updated_at: string;
}

export interface FenroSizeGuide {
  id: string;
  name: string;
  unit: 'metric' | 'imperial';
  rows: { value: string; bold: boolean }[][]; // Table data
  created_at: string;
  updated_at: string;
}

export interface FenroCategory {
  name: string;
  product_count: number;
}

export interface FenroProductsResponse {
  products: FenroProduct[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    timestamp: string;
  };
}

export interface FenroCollectionsResponse {
  collections: FenroCollection[];
}

export interface FenroCategoriesResponse {
  categories: FenroCategory[];
}

export interface FenroSizeGuideResponse {
  size_guide: FenroSizeGuide;
}

