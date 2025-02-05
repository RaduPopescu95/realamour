import React from "react";
import Preloader from "@/components/common/Preloader";
import Header from "@/components/layout/headers/Header";
import PageLinks from "@/components/common/PageLinks";
import Subscriptions from "@/components/common/Subscriptions";

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
    pricing: await fetchTranslation("Subscriptions", targetLanguage),
    lang: targetLanguage,
    bookingTextPrim: await fetchTranslation("Tarifs RealAmor", targetLanguage),
    bookingText: await fetchTranslation(
      "Inscription et accès au compte personnel : gratuit",
      targetLanguage
    ),
    bookingText2: await fetchTranslation(
      "Ouverture de dossier et premier Rendez-vous en présentiel : 159,00€ TVAC",
      targetLanguage
    ),
    paymentOneTimeText: await fetchTranslation(
      "One-time payment for reservations",
      targetLanguage
    ),
    threeMonthsText: await fetchTranslation(
      "Abonnement 3 mois",
      targetLanguage
    ),
    oneTimeFeature1: await fetchTranslation(
      "Création d'un compte personnalisé",
      targetLanguage
    ),
    oneTimeFeature2: await fetchTranslation(
      "Questions et Test de Personnalité",
      targetLanguage
    ),
    oneTimeFeature3: await fetchTranslation(
      "Rendez-vous en présentiel",
      targetLanguage
    ),
    oneTimeFeature4: await fetchTranslation(
      "Accès à la communauté RealAmor",
      targetLanguage
    ),
    oneTimeFeature5: await fetchTranslation(
      "Réunion pluridisciplinaire RealAmor pour discuter de votre profil",
      targetLanguage
    ),
    oneTimeFeature6: await fetchTranslation(
      "Contact avec les profils compatibles via votre compte",
      targetLanguage
    ),
    oneTimeFeature7: await fetchTranslation(
      "Présentation de chaque profil compatible par un de nos conseillers (téléphone)",
      targetLanguage
    ),
    oneTimeFeature8: await fetchTranslation(
      "Conseils des l'équipe de RealAmor pour améliorer vos chances de réussite",
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
        <PageLinks translatedLinks={translatedLinks} link2={"subscriptions"} />
        <Subscriptions
          bookingText={translatedLinks.bookingText}
          paymentOneTimeText={translatedLinks.paymentOneTimeText}
          oneTimeFeature1={translatedLinks.oneTimeFeature1}
          oneTimeFeature2={translatedLinks.oneTimeFeature2}
          oneTimeFeature3={translatedLinks.oneTimeFeature3}
          oneTimeFeature4={translatedLinks.oneTimeFeature4}
          getStarted={translatedLinks.getStarted}
          acceptTermsText={translatedLinks.acceptTermsText}
          translatedLinks={translatedLinks}
        />

        {/* <Brands/> */}
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
