import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Collections | TheVastraHouse Luxury Ethnic Wear",
  description: "Browse our curated selection of luxury sarees, lehengas, and fusion wear. Filter by category, price, and latest arrivals.",
  openGraph: {
    title: "TheVastraHouse Catalog | Premium Ethnic Wear",
    description: "Explore our handpicked ethnic masterpieces.",
  }
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
