import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArielMC Enterprise ERP | Global Sourcing & Supply Chain",
  description: "Enterprise ERP for Ariel Marketing & Communications Limited (ArielMC) - B2B Export & D2C Brand Management",
  icons: {
    icon: "/images/ArielMC_Emblem_Square.png",
    apple: "/images/ArielMC_Emblem_Square.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Open+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#F4F6F4] text-[#1A1A1A] antialiased selection:bg-[#C9A86A] selection:text-[#1F3A2E]"
      >
        {children}
      </body>
    </html>
  );
}
