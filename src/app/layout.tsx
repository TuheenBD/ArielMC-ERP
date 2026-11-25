import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArielMC™ Enterprise Resource Planning System | Global Sourcing & Supply Chain",
  description: "ArielMC™ Enterprise Resource Planning System — © Ariel Marketing & Communications Limited | All Right Reserve",
  icons: {
    icon: [
      { url: "/favicon.ico?v=arielmc3", sizes: "any" },
      { url: "/icon.png?v=arielmc3", type: "image/png", sizes: "192x192" },
      { url: "/images/ArielMC_ERP_Icon.png?v=arielmc3", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png?v=arielmc3", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=arielmc3",
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
        {/* Microsoft Clarity */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "zi6ykgppc0");`,
          }}
        />
        <link rel="icon" href="/favicon.ico?v=arielmc3" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon.png?v=arielmc3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png?v=arielmc3" />
        <link rel="shortcut icon" href="/favicon.ico?v=arielmc3" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Open+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="h-full overflow-hidden flex flex-col bg-[#FAF9F5] text-[#1A1A1A] antialiased selection:bg-[#C9A86A] selection:text-[#1F3A2E]"
      >
        {children}
      </body>
    </html>
  );
}
