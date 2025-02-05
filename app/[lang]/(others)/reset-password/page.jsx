import PageLinks from "@/components/common/PageLinks";
import Preloader from "@/components/common/Preloader";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header from "@/components/layout/headers/Header";
import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
import ResetPasswordForm from "@/components/others/ResetPasswordForm";
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
  const targetLanguage = params.lang || "fr";

  // Obține traducerile necesare
  const translatedLinks = {
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),
    emailText: await fetchTranslation("Email", targetLanguage),
    resetPasswordHeader: await fetchTranslation(
      "Resetare Parolă",
      targetLanguage
    ),
    sendResetText: await fetchTranslation(
      "Trimite email de resetare",
      targetLanguage
    ),
    successMessage: await fetchTranslation(
      "Un email de resetare a parolei a fost trimis!",
      targetLanguage
    ),
    errorMessage: await fetchTranslation(
      "Eroare la resetarea parolei: ",
      targetLanguage
    ),
    loginRedirectText: await fetchTranslation(
      "Înapoi la autentificare",
      targetLanguage
    ),
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
          <ResetPasswordForm
            emailText={translatedLinks.emailText}
            resetPasswordHeader={translatedLinks.resetPasswordHeader}
            sendResetText={translatedLinks.sendResetText}
            successMessage={translatedLinks.successMessage}
            errorMessage={translatedLinks.errorMessage}
            loginRedirectText={translatedLinks.loginRedirectText} // Transmitere link login
          />
        </section>
      </div>

      <FooterOne />
    </div>
  );
}
