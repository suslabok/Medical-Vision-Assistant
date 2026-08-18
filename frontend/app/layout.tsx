import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Medical Vision Assistant",
  description: "AI-assisted chest X-ray analysis for research purposes only.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
       <AuthProvider>
  <Navbar />
  {children}
</AuthProvider>
      </body>
    </html>
  );
}