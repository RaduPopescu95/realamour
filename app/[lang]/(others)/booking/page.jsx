import Brands from "@/components/common/Brands";
import Calendar from "@/components/common/Calendar";

import PageLinks from "@/components/common/PageLinks";
import PaymentSuccessPage from "@/components/common/PlataFinalizata";
import Preloader from "@/components/common/Preloader";
import Pricing from "@/components/common/Pricing";

import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";

import React from "react";
export const metadata = {
  title: "Booking",
  description: "Booking",
};

// In-memory cache for translations
const translationCache = {};

// Funcție pentru a obține traducerile de pe server
async function fetchTranslation(text, targetLanguage) {
  const cacheKey = `${text}_${targetLanguage}`;

  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

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
  translationCache[cacheKey] = data;
  return data;
}

export default async function page({ params }) {
  const targetLanguage = params.lang || "en";

  const translatedLinks = {
    home: await fetchTranslation("Acasă", targetLanguage),
    realAmor: await fetchTranslation("RealAmor", targetLanguage),
    pricing: await fetchTranslation("Pricing", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),
    paymentTitle: await fetchTranslation("Plată Finalizată", targetLanguage),
    paymentText: await fetchTranslation(
      "Vă mulțumim pentru plata efectuată! Vă rugăm să continuați cu rezervarea dumneavoastră.",
      targetLanguage
    ),
    paymentConfirmation: await fetchTranslation(
      "Confirmare de plată",
      targetLanguage
    ),
    loadingText: await fetchTranslation(
      "Se încarcă detaliile plății...",
      targetLanguage
    ),
    successText: await fetchTranslation(
      "Plata dumneavoastră a fost procesată cu succes. Un email cu factura și confirmarea plății a fost trimis la adresa dvs. Vă rugăm să verificați căsuța de email pentru mai multe detalii.",
      targetLanguage
    ),
    continueBookingText: await fetchTranslation(
      "Continuă cu Rezervarea",
      targetLanguage
    ),
    detaliiRezervareText: await fetchTranslation(
      "Detalii rezervare:",
      targetLanguage
    ),
    nameText: await fetchTranslation("Nume", targetLanguage),
    emailText: await fetchTranslation("Email", targetLanguage),
    phoneText: await fetchTranslation("Telefon", targetLanguage),
    amountPaidText: await fetchTranslation("Sumă plătită", targetLanguage),
  };
  return (
    <div className="main-content  ">
      <Preloader />

      <Header
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks translatedLinks={translatedLinks} />
        <Calendar targetLanguage={targetLanguage} />
        {/* <Brands/> */}
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
