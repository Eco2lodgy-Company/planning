import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SidebarWrapper from "./components/SidebarWrapper"; // Import du composant client

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Eco2lodgy planning",
  description: "Logiciel de gestion de planning pour Eco2lodgy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen w-full">
          <SidebarWrapper /> {/* La sidebar s'affiche uniquement sur /employees */}

          {/* Contenu principal */}
          <div className="flex-1 overflow-auto bg-gray-100 p-6">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
