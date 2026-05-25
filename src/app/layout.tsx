import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoryNest — Where Stories Come Alive",
  description:
    "A magical children's storytelling platform. Spark your child's imagination with enchanting tales, interactive adventures, and bedtime favorites. For ages 3-12.",
  keywords: [
    "children's stories",
    "kids books",
    "bedtime stories",
    "interactive reading",
    "educational stories",
    "StoryNest",
    "kids storytelling",
    "reading platform",
  ],
  authors: [{ name: "StoryNest Team" }],
  icons: {
    icon: [
      { url: "/logo.png", sizes: "1024x1024", type: "image/png" },
      { url: "/logo.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: "/logo.png",
  },
  metadataBase: new URL("https://storynest.com"),
  openGraph: {
    title: "StoryNest — Where Stories Come Alive",
    description:
      "A magical children's storytelling platform. Spark imagination with enchanting tales for ages 3-12.",
    url: "https://storynest.com",
    siteName: "StoryNest",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StoryNest — Where Stories Come Alive",
    description:
      "A magical children's storytelling platform. Spark imagination with enchanting tales for ages 3-12.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "StoryNest",
  description:
    "A magical children's storytelling platform with enchanting tales for ages 3-12.",
  url: "https://storynest.com",
  applicationCategory: "Education",
  operatingSystem: "Web",
  audience: {
    "@type": "PeopleAudience",
    suggestedMinAge: "3",
    suggestedMaxAge: "12",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Monthly",
      price: "4.99",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Yearly",
      price: "39.99",
      priceCurrency: "USD",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
