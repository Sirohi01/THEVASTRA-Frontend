import { MetadataRoute } from 'next';
import API from '@/services/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thevastrahouse.com';

  // Core static pages
  const staticPages = [
    '',
    '/shop',
    '/collections',
    '/new-arrivals',
    '/offers',
    '/about-us',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Products
  let productPages: any[] = [];
  try {
    const { data } = await API.get('/catalog/products?limit=1000');
    productPages = data.products.map((product: any) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error('Sitemap Product Fetch Error:', err);
  }

  // Dynamic Categories
  let categoryPages: any[] = [];
  try {
    const { data } = await API.get('/catalog/categories');
    categoryPages = data.categories.map((cat: any) => ({
      url: `${baseUrl}/shop?category=${cat._id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Sitemap Category Fetch Error:', err);
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
