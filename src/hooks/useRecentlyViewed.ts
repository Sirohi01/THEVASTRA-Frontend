import { useEffect, useState, useCallback } from 'react';

export const useRecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recently_viewed');
    if (stored) {
      setRecentProducts(JSON.parse(stored));
    }
  }, []);

  const addProduct = useCallback((product: any) => {
    if (!product?._id) return;

    const stored = localStorage.getItem('recently_viewed');
    let products = stored ? JSON.parse(stored) : [];
    
    // Filter out if already exists and add to top
    products = products.filter((p: any) => p._id !== product._id);
    products.unshift({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.basePrice,
      image: product.images?.[0]?.url
    });

    // Keep only last 10
    const limited = products.slice(0, 10);
    localStorage.setItem('recently_viewed', JSON.stringify(limited));
    setRecentProducts(limited);
  }, []);

  return { recentProducts, addProduct };
};
