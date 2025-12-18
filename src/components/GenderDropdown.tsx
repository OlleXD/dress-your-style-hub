import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allProducts } from '@/data/products';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';

interface GenderDropdownProps {
  gender: 'women' | 'men';
  label: string;
}

const GenderDropdown = ({ gender, label }: GenderDropdownProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Get categories for this gender
  const genderFilter = gender === 'women' ? 'Kvinnor' : 'Herrar';
  const categories = Array.from(
    new Set(
      allProducts
        .filter(p => p.gender === genderFilter)
        .map(p => p.category)
    )
  );

  // Category images mapping
  const categoryImages: Record<string, string> = {
    'Jackor': product1,
    'Jeans': product2,
    'Klänningar': product1,
    'Kostymer': product2,
    'Skjortor': product1,
    'Byxor': product2,
    'Tröjor': product1,
    'Accessoarer': product2,
  };

  const handleCategoryClick = (category: string) => {
    setIsOpen(false);
    navigate(`/products?gender=${gender}&category=${encodeURIComponent(category)}`);
  };

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 200);
    setTimeoutId(id);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-200"
        onClick={() => navigate(`/products?gender=${gender}`)}
      >
        {label}
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 w-96 bg-background border border-border shadow-lg rounded-lg overflow-hidden z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="grid grid-cols-2">
            {/* Categories List */}
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase">
                Kategorier
              </h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      className="w-full text-left text-sm hover:text-accent transition-colors py-2 px-2 rounded hover:bg-secondary"
                      onClick={() => handleCategoryClick(category)}
                      onMouseEnter={() => setHoveredCategory(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Preview */}
            <div className="bg-secondary/50 p-4 flex items-center justify-center">
              {hoveredCategory ? (
                <img
                  src={categoryImages[hoveredCategory] || product1}
                  alt={hoveredCategory}
                  className="w-full h-64 object-cover rounded"
                />
              ) : (
                <div className="w-full h-64 bg-muted rounded flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Hovra över en kategori
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenderDropdown;
