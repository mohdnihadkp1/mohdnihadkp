import Hero from "@/components/Hero";
import BentoBox from "@/components/BentoBox";
import CaseStudies from "@/components/CaseStudies";
import Ventures from "@/components/Ventures";
import Contact from "@/components/Contact";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Nihad KP Digital Ventures",
    "image": "https://nihadkp.com/nkp-logo.png",
    "@id": "https://nihadkp.com",
    "url": "https://nihadkp.com",
    "telephone": "+919846750898",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kerala",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.850516,
      "longitude": 76.271080
    },
    "priceRange": "$$"
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Hero />
      <ScrollReveal yOffset={60} duration={0.8} delay={0.1}>
        <BentoBox />
      </ScrollReveal>
      <ScrollReveal yOffset={60} duration={0.8} delay={0.1}>
        <CaseStudies />
      </ScrollReveal>
      <ScrollReveal yOffset={60} duration={0.8} delay={0.1}>
        <Ventures />
      </ScrollReveal>
      <ScrollReveal yOffset={60} duration={0.8} delay={0.1}>
        <Contact />
      </ScrollReveal>
    </main>
  );
}
