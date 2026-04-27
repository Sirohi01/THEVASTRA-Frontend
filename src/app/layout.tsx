import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TheVastraHouse | Premium Luxury Ethnic Fashion",
    template: "%s | TheVastraHouse"
  },
  description: "Discover the finest luxury ethnic wear. Experience royal heritage handcrafted for modern royalty.",
  keywords: ["ethnic wear", "luxury fashion", "sarees", "lehengas", "TheVastraHouse", "premium fashion brand"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://thevastrahouse.com",
    siteName: "TheVastraHouse",
    title: "TheVastraHouse | Premium Luxury Ethnic Fashion",
    description: "Discover the finest luxury ethnic wear. Experience royal heritage handcrafted for modern royalty.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "TheVastraHouse" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "TheVastraHouse | Luxury Ethnic Fashion",
    description: "Discover the finest luxury ethnic wear.",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

import Providers from "@/components/common/Providers";
import { FooterWrapper } from "@/components/FooterWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <Providers>
          {children}
          <FooterWrapper />
        </Providers>
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}
