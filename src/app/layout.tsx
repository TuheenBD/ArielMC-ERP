import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArielMC Enterprise ERP | Global Sourcing & Supply Chain",
  description: "Enterprise ERP for Ariel Marketing & Communications Limited (ArielMC) - B2B Export & D2C Brand Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
