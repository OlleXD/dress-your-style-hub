export interface ColorVariant {
  color: string;
  images: string[];
  image: string;
}

export interface ProductData {
  id: number;
  name: string;
  price: string;
  image: string;
  images?: string[];
  colorVariants?: ColorVariant[];
  category: string;
  priceValue: number;
  gender: 'Kvinnor' | 'Herrar' | null;
  description?: string;
  sizes?: string[];
  colors?: string[];
  details?: string[];
  tags?: string[];
  inStock?: boolean;
  stockCount?: number;
  rating?: number;
  reviewCount?: number;
}

// Helper function to generate product data
const createProduct = (
  id: number,
  category: string,
  name: string,
  gender: 'Kvinnor' | 'Herrar',
  imageUrl: string,
  priceValue: number,
  tags: string[] = []
): ProductData => {
  // Create multiple image variations using different crop parameters
  const images = [
    imageUrl,
    imageUrl.replace('&q=80', '&q=80&auto=format&fit=crop&w=401'),
    imageUrl.replace('&q=80', '&q=80&auto=format&fit=crop&w=402'),
    imageUrl.replace('&q=80', '&q=80&auto=format&fit=crop&w=403'),
  ];

  return {
    id,
    name,
    price: `${priceValue.toLocaleString('sv-SE')} kr`,
    image: imageUrl,
    images,
    category,
    priceValue,
    gender,
    description: `Premium ${category.toLowerCase()} i hög kvalitet.`,
    sizes: gender === 'Herrar' ? ['S', 'M', 'L', 'XL', 'XXL'] : ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Svart', 'Blå', 'Grå', 'Beige'],
    details: [
      'Premium kvalitet',
      'Hållbart material',
      'Maskintvättbar',
    ],
    tags,
    inStock: true,
    stockCount: Math.floor(Math.random() * 20) + 5,
    rating: Number((4 + Math.random()).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 50) + 10,
  };
};

// Category image URLs - same image for all products in each category
const categoryImages: Record<string, string> = {
  'Byxor': 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=600&fit=crop&q=80',
  'Jackor': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop&q=80',
  'Klänningar': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&q=80',
  'Kostymer': 'https://images.unsplash.com/photo-1594938291221-94f18e0a0fde?w=400&h=600&fit=crop&q=80',
  'Skjortor': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop&q=80',
  'Tröjor': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=600&fit=crop&q=80',
  'Accessoarer': 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400&h=600&fit=crop&q=80',
};

export const allProducts: ProductData[] = [
  // Byxor - Herrar (4)
  createProduct(1, 'Byxor', 'Byxor 1', 'Herrar', categoryImages['Byxor'], 699, ['byxor', 'herrar', 'klassisk', 'elegant']),
  createProduct(2, 'Byxor', 'Byxor 2', 'Herrar', categoryImages['Byxor'], 799, ['byxor', 'herrar', 'modern', 'slim']),
  createProduct(3, 'Byxor', 'Byxor 3', 'Herrar', categoryImages['Byxor'], 899, ['byxor', 'herrar', 'casual', 'bekväm']),
  createProduct(4, 'Byxor', 'Byxor 4', 'Herrar', categoryImages['Byxor'], 999, ['byxor', 'herrar', 'premium', 'designer']),
  
  // Byxor - Damer (4)
  createProduct(5, 'Byxor', 'Byxor 5', 'Kvinnor', categoryImages['Byxor'], 649, ['byxor', 'damer', 'klassisk', 'elegant']),
  createProduct(6, 'Byxor', 'Byxor 6', 'Kvinnor', categoryImages['Byxor'], 749, ['byxor', 'damer', 'modern', 'slim']),
  createProduct(7, 'Byxor', 'Byxor 7', 'Kvinnor', categoryImages['Byxor'], 849, ['byxor', 'damer', 'casual', 'bekväm']),
  createProduct(8, 'Byxor', 'Byxor 8', 'Kvinnor', categoryImages['Byxor'], 949, ['byxor', 'damer', 'premium', 'designer']),

  // Jackor - Herrar (4)
  createProduct(9, 'Jackor', 'Jackor 1', 'Herrar', categoryImages['Jackor'], 1299, ['jackor', 'herrar', 'vinter', 'varm']),
  createProduct(10, 'Jackor', 'Jackor 2', 'Herrar', categoryImages['Jackor'], 1399, ['jackor', 'herrar', 'vindtät', 'funktionell']),
  createProduct(11, 'Jackor', 'Jackor 3', 'Herrar', categoryImages['Jackor'], 1499, ['jackor', 'herrar', 'klassisk', 'elegant']),
  createProduct(12, 'Jackor', 'Jackor 4', 'Herrar', categoryImages['Jackor'], 1599, ['jackor', 'herrar', 'premium', 'designer']),
  
  // Jackor - Damer (4)
  createProduct(13, 'Jackor', 'Jackor 5', 'Kvinnor', categoryImages['Jackor'], 1199, ['jackor', 'damer', 'vinter', 'varm']),
  createProduct(14, 'Jackor', 'Jackor 6', 'Kvinnor', categoryImages['Jackor'], 1299, ['jackor', 'damer', 'vindtät', 'funktionell']),
  createProduct(15, 'Jackor', 'Jackor 7', 'Kvinnor', categoryImages['Jackor'], 1399, ['jackor', 'damer', 'klassisk', 'elegant']),
  createProduct(16, 'Jackor', 'Jackor 8', 'Kvinnor', categoryImages['Jackor'], 1499, ['jackor', 'damer', 'premium', 'designer']),

  // Klänningar - Damer (8)
  createProduct(17, 'Klänningar', 'Klänningar 1', 'Kvinnor', categoryImages['Klänningar'], 899, ['klänningar', 'damer', 'sommar', 'luftig']),
  createProduct(18, 'Klänningar', 'Klänningar 2', 'Kvinnor', categoryImages['Klänningar'], 999, ['klänningar', 'damer', 'fest', 'elegant']),
  createProduct(19, 'Klänningar', 'Klänningar 3', 'Kvinnor', categoryImages['Klänningar'], 1099, ['klänningar', 'damer', 'casual', 'bekväm']),
  createProduct(20, 'Klänningar', 'Klänningar 4', 'Kvinnor', categoryImages['Klänningar'], 1199, ['klänningar', 'damer', 'kväll', 'glamorös']),
  createProduct(21, 'Klänningar', 'Klänningar 5', 'Kvinnor', categoryImages['Klänningar'], 1299, ['klänningar', 'damer', 'bröllop', 'formell']),
  createProduct(22, 'Klänningar', 'Klänningar 6', 'Kvinnor', categoryImages['Klänningar'], 1399, ['klänningar', 'damer', 'maxi', 'lång']),
  createProduct(23, 'Klänningar', 'Klänningar 7', 'Kvinnor', categoryImages['Klänningar'], 1499, ['klänningar', 'damer', 'mini', 'kort']),
  createProduct(24, 'Klänningar', 'Klänningar 8', 'Kvinnor', categoryImages['Klänningar'], 1599, ['klänningar', 'damer', 'premium', 'designer']),

  // Kostymer - Herrar (4)
  createProduct(25, 'Kostymer', 'Kostymer 1', 'Herrar', categoryImages['Kostymer'], 2299, ['kostymer', 'herrar', 'affär', 'formell']),
  createProduct(26, 'Kostymer', 'Kostymer 2', 'Herrar', categoryImages['Kostymer'], 2399, ['kostymer', 'herrar', 'bröllop', 'elegant']),
  createProduct(27, 'Kostymer', 'Kostymer 3', 'Herrar', categoryImages['Kostymer'], 2499, ['kostymer', 'herrar', 'klassisk', 'timeless']),
  createProduct(28, 'Kostymer', 'Kostymer 4', 'Herrar', categoryImages['Kostymer'], 2599, ['kostymer', 'herrar', 'premium', 'designer']),
  
  // Kostymer - Damer (4)
  createProduct(29, 'Kostymer', 'Kostymer 5', 'Kvinnor', categoryImages['Kostymer'], 2199, ['kostymer', 'damer', 'affär', 'formell']),
  createProduct(30, 'Kostymer', 'Kostymer 6', 'Kvinnor', categoryImages['Kostymer'], 2299, ['kostymer', 'damer', 'bröllop', 'elegant']),
  createProduct(31, 'Kostymer', 'Kostymer 7', 'Kvinnor', categoryImages['Kostymer'], 2399, ['kostymer', 'damer', 'klassisk', 'timeless']),
  createProduct(32, 'Kostymer', 'Kostymer 8', 'Kvinnor', categoryImages['Kostymer'], 2499, ['kostymer', 'damer', 'premium', 'designer']),

  // Skjortor - Herrar (4)
  createProduct(33, 'Skjortor', 'Skjortor 1', 'Herrar', categoryImages['Skjortor'], 599, ['skjortor', 'herrar', 'affär', 'formell']),
  createProduct(34, 'Skjortor', 'Skjortor 2', 'Herrar', categoryImages['Skjortor'], 699, ['skjortor', 'herrar', 'casual', 'bekväm']),
  createProduct(35, 'Skjortor', 'Skjortor 3', 'Herrar', categoryImages['Skjortor'], 799, ['skjortor', 'herrar', 'klassisk', 'vit']),
  createProduct(36, 'Skjortor', 'Skjortor 4', 'Herrar', categoryImages['Skjortor'], 899, ['skjortor', 'herrar', 'premium', 'designer']),
  
  // Skjortor - Damer (4)
  createProduct(37, 'Skjortor', 'Skjortor 5', 'Kvinnor', categoryImages['Skjortor'], 549, ['skjortor', 'damer', 'affär', 'formell']),
  createProduct(38, 'Skjortor', 'Skjortor 6', 'Kvinnor', categoryImages['Skjortor'], 649, ['skjortor', 'damer', 'casual', 'bekväm']),
  createProduct(39, 'Skjortor', 'Skjortor 7', 'Kvinnor', categoryImages['Skjortor'], 749, ['skjortor', 'damer', 'feminin', 'elegant']),
  createProduct(40, 'Skjortor', 'Skjortor 8', 'Kvinnor', categoryImages['Skjortor'], 849, ['skjortor', 'damer', 'premium', 'designer']),

  // Tröjor - Herrar (4)
  createProduct(41, 'Tröjor', 'Tröjor 1', 'Herrar', categoryImages['Tröjor'], 799, ['tröjor', 'herrar', 'vinter', 'varm']),
  createProduct(42, 'Tröjor', 'Tröjor 2', 'Herrar', categoryImages['Tröjor'], 899, ['tröjor', 'herrar', 'casual', 'bekväm']),
  createProduct(43, 'Tröjor', 'Tröjor 3', 'Herrar', categoryImages['Tröjor'], 999, ['tröjor', 'herrar', 'stickad', 'klassisk']),
  createProduct(44, 'Tröjor', 'Tröjor 4', 'Herrar', categoryImages['Tröjor'], 1099, ['tröjor', 'herrar', 'premium', 'designer']),
  
  // Tröjor - Damer (4)
  createProduct(45, 'Tröjor', 'Tröjor 5', 'Kvinnor', categoryImages['Tröjor'], 749, ['tröjor', 'damer', 'vinter', 'varm']),
  createProduct(46, 'Tröjor', 'Tröjor 6', 'Kvinnor', categoryImages['Tröjor'], 849, ['tröjor', 'damer', 'casual', 'bekväm']),
  createProduct(47, 'Tröjor', 'Tröjor 7', 'Kvinnor', categoryImages['Tröjor'], 949, ['tröjor', 'damer', 'stickad', 'klassisk']),
  createProduct(48, 'Tröjor', 'Tröjor 8', 'Kvinnor', categoryImages['Tröjor'], 1049, ['tröjor', 'damer', 'premium', 'designer']),

  // Accessoarer - Herrar (4)
  createProduct(49, 'Accessoarer', 'Accessoarer 1', 'Herrar', categoryImages['Accessoarer'], 399, ['accessoarer', 'herrar', 'bälte', 'läder']),
  createProduct(50, 'Accessoarer', 'Accessoarer 2', 'Herrar', categoryImages['Accessoarer'], 499, ['accessoarer', 'herrar', 'klocka', 'elegant']),
  createProduct(51, 'Accessoarer', 'Accessoarer 3', 'Herrar', categoryImages['Accessoarer'], 599, ['accessoarer', 'herrar', 'handskar', 'vinter']),
  createProduct(52, 'Accessoarer', 'Accessoarer 4', 'Herrar', categoryImages['Accessoarer'], 699, ['accessoarer', 'herrar', 'premium', 'designer']),
  
  // Accessoarer - Damer (4)
  createProduct(53, 'Accessoarer', 'Accessoarer 5', 'Kvinnor', categoryImages['Accessoarer'], 349, ['accessoarer', 'damer', 'väska', 'läder']),
  createProduct(54, 'Accessoarer', 'Accessoarer 6', 'Kvinnor', categoryImages['Accessoarer'], 449, ['accessoarer', 'damer', 'halsduk', 'silke']),
  createProduct(55, 'Accessoarer', 'Accessoarer 7', 'Kvinnor', categoryImages['Accessoarer'], 549, ['accessoarer', 'damer', 'smycken', 'elegant']),
  createProduct(56, 'Accessoarer', 'Accessoarer 8', 'Kvinnor', categoryImages['Accessoarer'], 649, ['accessoarer', 'damer', 'premium', 'designer']),
];

export const getProductById = (id: number): ProductData | undefined => {
  return allProducts.find(product => product.id === id);
};

export const getRelatedProducts = (currentProductId: number, limit: number = 4): ProductData[] => {
  const currentProduct = getProductById(currentProductId);
  if (!currentProduct) return [];
  
  return allProducts
    .filter(product => 
      product.id !== currentProductId && 
      (product.category === currentProduct.category || product.gender === currentProduct.gender)
    )
    .slice(0, limit);
};
