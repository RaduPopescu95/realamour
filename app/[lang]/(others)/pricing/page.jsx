import React from "react";
import Preloader from "@/components/common/Preloader";
import Header from "@/components/layout/headers/Header";
import PageLinks from "@/components/common/PageLinks";
import Pricing from "@/components/common/Pricing";

// In-memory cache for translations
const translationCache = {};

// Funcție pentru a obține traducerile de pe server
async function fetchTranslation(text, targetLanguage) {
  const cacheKey = `${text}_${targetLanguage}`;

  // Verificăm dacă traducerea este în cache
  if (translationCache[cacheKey]) {
    console.log(
      `Using cached translation for "${text}" in "${targetLanguage}"`
    );
    return translationCache[cacheKey];
  }

  // Dacă nu e în cache, facem cererea la Google Translate API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_TRANSLATE_ENDPOINT}/api/translate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLanguage,
      }),
    }
  );

  const data = await res.json();

  // Salvăm traducerea în cache
  translationCache[cacheKey] = data;

  return data;
}

// Componenta pentru pagina de pricing
export default async function Page({ params }) {
  // Extragem limba din URL folosind params
  const targetLanguage = params.lang || "en";

  console.log("targe lagn..", targetLanguage);

  const translatedLinks = {
    home: await fetchTranslation("Acasa", targetLanguage),
    realAmor: await fetchTranslation("RealAmor", targetLanguage),
    pricing: await fetchTranslation("Pricing", targetLanguage),
    lang: targetLanguage,
    bookingText: await fetchTranslation(
      "Pricing for booking system",
      targetLanguage
    ),
    paymentOneTimeText: await fetchTranslation(
      "One-time payment for reservations",
      targetLanguage
    ),
    oneTimeFeature1: await fetchTranslation(
      "Access to all reservation features",
      targetLanguage
    ),
    oneTimeFeature2: await fetchTranslation(
      "No subscription required",
      targetLanguage
    ),
    oneTimeFeature3: await fetchTranslation(
      "Active for 30 days",
      targetLanguage
    ),
    oneTimeFeature4: await fetchTranslation(
      "Unlimited access to customer support",
      targetLanguage
    ),
    getStarted: await fetchTranslation("Get Started Now", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),

    // Traducerea textului pentru bifa termenilor și condițiilor
    acceptTermsText: await fetchTranslation(
      "Accept Terms and Conditions, Privacy Policy, and Cookies",
      targetLanguage
    ),
  };

  return (
    <div className="main-content">
      <Preloader />
      <Header
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        {/* Transmitem datele traduse și limba către componenta PageLinks */}
        <PageLinks translatedLinks={translatedLinks} />
        <Pricing
          bookingText={translatedLinks.bookingText}
          paymentOneTimeText={translatedLinks.paymentOneTimeText}
          oneTimeFeature1={translatedLinks.oneTimeFeature1}
          oneTimeFeature2={translatedLinks.oneTimeFeature2}
          oneTimeFeature3={translatedLinks.oneTimeFeature3}
          oneTimeFeature4={translatedLinks.oneTimeFeature4}
          getStarted={translatedLinks.getStarted}
          acceptTermsText={translatedLinks.acceptTermsText}
        />

        {/* <Brands/> */}
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
