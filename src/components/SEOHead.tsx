
import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  structuredData?: object
}

export function SEOHead({
  title = "Justera Group - Premier IT Recruitment & Career Services in Sweden",
  description = "Transform your career with Sweden's leading IT recruitment specialists. Connect with Fortune 500 companies and innovative startups across technology, healthcare, finance, and more industries.",
  keywords = "IT recruitment Sweden, technology jobs Stockholm, software developer careers, IT consultant positions, tech recruitment agency, career opportunities Sweden, digital transformation jobs, Nordic IT jobs",
  canonicalUrl = "https://justeragroup.com",
  ogImage = "/images/og-image.jpg",
  structuredData
}: SEOHeadProps) {
  const jsonLd = structuredData || {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Justera Group",
    "description": description,
    "url": canonicalUrl,
    "logo": `${canonicalUrl}/images/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+46769624470",
      "contactType": "Customer Service",
      "email": "hrteam@justeragroup.com",
      "availableLanguage": ["English", "Swedish"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Stockholm",
      "@country": "Sweden"
    },
    "sameAs": [
      "https://linkedin.com/company/justera-group",
      "https://twitter.com/justeragroup"
    ],
    "serviceArea": {
      "@type": "Country",
      "name": "Sweden"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "IT Recruitment Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Executive Search",
            "description": "C-level and senior management recruitment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Tech Talent Acquisition",
            "description": "Software developers, engineers, and IT specialists"
          }
        }
      ]
    }
  }

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="author" content="Justera Group" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Justera Group" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:creator" content="@justeragroup" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="geo.region" content="SE" />
      <meta name="geo.placename" content="Stockholm" />
      <meta name="geo.position" content="59.3293;18.0686" />
      <meta name="ICBM" content="59.3293, 18.0686" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
    </Head>
  )
}
