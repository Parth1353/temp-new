import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <header className="w-full py-4 bg-blue-700 text-white text-center font-bold text-xl mb-8">
          Hospital Bed Allocation System
        </header>
        {children}
      </body>
    </html>
  );
}
