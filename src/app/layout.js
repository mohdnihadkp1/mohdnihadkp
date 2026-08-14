import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import AudioPlayer from "@/components/AudioPlayer";
import AmbientBackground from "@/components/AmbientBackground";
import ScrollToTop from "@/components/ScrollToTop";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-primary",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://nihadkp.com'),
  verification: {
    google: "B2KZie4JZvyTNbSQoQCTbI0_NWloo5Lm2u6vY72XwTs",
    other: {
      "msvalidate.01": "336B5ED30780159A713E319A03D13D31",
    },
  },
  title: "Nihad KP | Digital Ventures & Business Solutions",
  description: "Portfolio of Mohammed Nihad KP - Building Scalable Digital Ventures & Strategic Business Solutions.",
  keywords: ["Nihad KP", "Digital Ventures", "Web Development", "App Development", "SEO", "Business Solutions", "Portfolio"],
  authors: [{ name: "Mohammed Nihad KP" }],
  creator: "Mohammed Nihad KP",
  publisher: "Nihad KP",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Nihad KP | Digital Ventures & Business Solutions",
    description: "Portfolio of Mohammed Nihad KP - Building Scalable Digital Ventures & Strategic Business Solutions.",
    url: "https://nihadkp.com",
    siteName: "Nihad KP",
    images: [
      {
        url: "/nkp-logo.png",
        width: 1200,
        height: 630,
        alt: "Nihad KP",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nihad KP | Digital Ventures & Business Solutions",
    description: "Portfolio of Mohammed Nihad KP - Building Scalable Digital Ventures & Strategic Business Solutions.",
    creator: "@nihadkp",
    images: ["/nkp-logo.png"],
  },
  alternates: {
    canonical: 'https://nihadkp.com',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://nihadkp.com/#website",
        "url": "https://nihadkp.com",
        "name": "Nihad KP | Digital Ventures",
        "description": "Portfolio of Mohammed Nihad KP - Building Scalable Digital Ventures & Strategic Business Solutions.",
        "publisher": { "@id": "https://nihadkp.com/#person" },
        "inLanguage": "en-US"
      },
      {
        "@type": "Person",
        "@id": "https://nihadkp.com/#person",
        "name": "Mohammed Nihad KP",
        "url": "https://nihadkp.com",
        "jobTitle": "Founder, Tech Lead & Digital Strategist",
        "image": "https://nihadkp.com/nkp-logo.png",
        "description": "Expert in building scalable digital infrastructure, Android ROMs, and strategic marketing pipelines.",
        "sameAs": [
          "https://github.com/nihadkp",
          "https://linkedin.com/in/nihadkp"
        ],
        "knowsAbout": ["Search Engine Marketing", "Social Media Marketing", "Content Marketing", "Email Marketing", "Affiliate Marketing", "AEO", "VSEO", "MEO", "App Store Optimization"]
      },
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": "https://nihadkp.com/#business",
        "name": "NKP Digital Ventures",
        "image": "https://nihadkp.com/nkp-logo.png",
        "url": "https://nihadkp.com",
        "founder": { "@id": "https://nihadkp.com/#person" },
        "description": "Digital marketing, web development, SEO, app optimization, and AI video creation services.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Calicut",
          "addressRegion": "Kerala",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "11.2588",
          "longitude": "75.7804"
        },
        "areaServed": ["Kerala", "India", "Global"],
        "priceRange": "$$"
      },
      {
        "@type": "VideoObject",
        "@id": "https://nihadkp.com/#aivideo",
        "name": "AI Video Generation by Nihad KP",
        "description": "Live rendering of AI video generation and visual storytelling processes.",
        "thumbnailUrl": "https://nihadkp.com/ai_video_thumbnail.jpg",
        "uploadDate": "2026-08-14T08:00:00+08:00",
        "publisher": { "@id": "https://nihadkp.com/#person" },
        "contentUrl": "https://nihadkp.com"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Who is Mohammed Nihad KP?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mohammed Nihad KP is a Digital Ventures & Business Solutions expert specializing in building scalable web applications and digital assets."
            }
          },
          {
            "@type": "Question",
            "name": "What services does Nihad KP offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Nihad KP offers Portfolio Website Creation, CV & Cover Letter Design, Custom App ROM Installation, SEO/AEO optimization, and digital asset creation."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className={plusJakarta.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Google Analytics */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-J26EYZM8E4" 
          strategy="afterInteractive" 
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J26EYZM8E4');
          `}
        </Script>
        
        <AmbientBackground />
        <ThemeProvider>
          <Navbar />
          {children}
          <AudioPlayer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
