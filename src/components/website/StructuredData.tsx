export default function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SmartCampusAI",
    url: "https://smartcampus.ai",
    brand: {
      "@type": "Brand",
      name: "SmartCampusAI",
    },
    description:
      "AI-powered school management software for student management, admissions, attendance, fees, academics, communication, analytics, and school operations.",
    parentOrganization: {
      "@type": "Organization",
      name: "ThomasG Technologies",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SmartCampusAI",
    url: "https://smartcampus.ai",
    description:
      "AI-powered school management software for modern schools and education teams.",
    publisher: {
      "@type": "Organization",
      name: "ThomasG Technologies",
    },
  };

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SmartCampusAI",
    applicationCategory: "EducationalApplication",
    applicationSubCategory: "School Management Software",
    operatingSystem: "Web",
    url: "https://smartcampus.ai",
    description:
      "AI-powered school management platform covering students, teachers, admissions CRM, attendance, fees, academics, communication, analytics, and school operations.",
    creator: {
      "@type": "Organization",
      name: "ThomasG Technologies",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description:
        "Contact SmartCampusAI for school-specific pricing and plans.",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(website),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(software),
        }}
      />
    </>
  );
}
