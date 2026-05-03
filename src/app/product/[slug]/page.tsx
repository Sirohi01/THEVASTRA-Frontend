import { Navbar } from "@/components/layout/Navbar";
import { ProductDetails } from "@/components/common/ProductDetails";
import API from "@/services/api";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await API.get(`/catalog/products/${slug}`);
    const product = data.product;
    return {
      title: `${product.name} | TheVastraHouse Luxury`,
      description: product.description.slice(0, 160),
      openGraph: {
        images: [product.images[0]?.url],
      }
    };
  } catch (error) {
    return { title: "Product | TheVastraHouse" };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug || slug === 'undefined') {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="h-screen flex items-center justify-center uppercase tracking-widest text-xs">Product Not Found</div>
      </main>
    );
  }

  let product = null;
  try {
    const { data } = await API.get(`/catalog/products/${slug}`);
    product = data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="h-screen flex items-center justify-center">Product not found</div>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images.map((img: any) => img.url),
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "TheVastraHouse"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://thevastrahouse.com/product/${slug}`,
      "priceCurrency": "INR",
      "price": product.basePrice,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <ProductDetails product={product} />
      </div>
    </main>
  );
}
