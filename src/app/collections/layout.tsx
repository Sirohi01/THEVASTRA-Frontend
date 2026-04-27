import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heritage Collections | TheVastraHouse",
  description: "Explore our curated collections of traditional and modern ethnic wear, handcrafted by master artisans.",
};

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
