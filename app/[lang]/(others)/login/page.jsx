import PageLinks from "@/components/common/PageLinks";
import Preloader from "@/components/common/Preloader";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
import LoginForm from "@/components/others/LoginForm";
import Terms from "@/components/terms/Terms";
import React from "react";

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

export default async function Page({ params }) {
  const targetLanguage = params.lang || "en";

  const translatedLinks = {
    emailText: await fetchTranslation("Email", targetLanguage),
    parolaText: await fetchTranslation("Parola", targetLanguage),
    autentificareText: await fetchTranslation("Autentificare", targetLanguage),
    aiContText: await fetchTranslation("Nu ai un cont încă?", targetLanguage),
    inscrieText: await fetchTranslation("Înscrie-te gratuit", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),
    lang: targetLanguage,
  };

  return (
    <div className="main-content">
      <Preloader />

      <HeaderAuth
        tarifsText={translatedLinks.tarifsText}
        methodeText={translatedLinks.methodeText}
      />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <section className="form-page js-mouse-move-container">
          <AuthImageMove />
          <LoginForm
            emailText={translatedLinks.emailText}
            parolaText={translatedLinks.parolaText}
            autentificareText={translatedLinks.autentificareText}
            aiContText={translatedLinks.aiContText}
            inscrieText={translatedLinks.inscrieText}
          />
        </section>
      </div>
    </div>
  );
}
