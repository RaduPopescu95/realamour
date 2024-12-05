import Brands from "@/components/common/Brands";
import PageLinks from "@/components/common/PageLinks";
import PaymentSuccessPage from "@/components/common/PlataFinalizata";
import Preloader from "@/components/common/Preloader";
import QuizClient from "@/components/dashboard/QuizClient";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import React from "react";

// // In-memory cache for translations
const translationCache = {};

// // Funcție pentru a obține traducerile de pe server
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

export default async function Page({ params }) {
  const targetLanguage = params.lang || "en";

  const translatedLinks = {
    home: await fetchTranslation("Acasă", targetLanguage),
    realAmor: await fetchTranslation("RealAmor", targetLanguage),
    pricing: await fetchTranslation("Plata finalizata", targetLanguage),
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
    signUpText: await fetchTranslation("Sign up", targetLanguage),
    logInText: await fetchTranslation("Log in", targetLanguage),
    contText: await fetchTranslation("Cont", targetLanguage),
    chestionarText: await fetchTranslation("Chestionar", targetLanguage),
    întrebareaText: await fetchTranslation("Întrebarea", targetLanguage),
    urmatorulText: await fetchTranslation("Urmatorul", targetLanguage),
    inapoiText: await fetchTranslation("Înapoi", targetLanguage),
    progresText: await fetchTranslation("Progres chestionar", targetLanguage),
    chestionarFinalizatText: await fetchTranslation(
      "Chestionar Finalizat",
      targetLanguage
    ),
    chestionarFinalizatMultiText: await fetchTranslation(
      "Mulțumim pentru completarea chestionarului. Răspunsurile tale au fost înregistrate.",
      targetLanguage
    ),
    chestionarFinalizatSuccesText: await fetchTranslation(
      "Chestionarul a fost finalizat cu succes!",
      targetLanguage
    ),
    chestionarFinalizatPaginaPrincipalaText: await fetchTranslation(
      "Mergi la pagina principală",
      targetLanguage
    ),
  };

  return (
    <div className="main-content">
      <Preloader />

      <Header
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
        translatedLinks={translatedLinks}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        {/* <PageLinks
          translatedLinks={translatedLinks}
          link2={"plata-finalizata"}
        /> */}
        <QuizClient
          targetLanguage={targetLanguage}
          translatedLinks={translatedLinks}
        />
        {/* <Brands/> */}
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
