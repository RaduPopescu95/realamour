import React from "react";
import Link from "next/link";
import Preloader from "@/components/common/Preloader";
import FooterOne from "@/components/layout/footers/FooterOne";
import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
import SignUpForm from "@/components/others/SignUpForm";

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

  console.log("targe lagn..", targetLanguage);

  const translatedLinks = {
    signUpText: await fetchTranslation("Sign Up", targetLanguage),
    alreadyHaveAccountText: await fetchTranslation(
      "Ai deja un cont?",
      targetLanguage
    ),
    conectText: await fetchTranslation("Conectează-te", targetLanguage),
    registerText: await fetchTranslation("Înregistrează-te", targetLanguage),
    emailPlaceholder: await fetchTranslation("Email", targetLanguage),
    emailAdresaPlaceholder: await fetchTranslation(
      "Adresă email",
      targetLanguage
    ),
    usernamePlaceholder: await fetchTranslation(
      "Nume utilizator",
      targetLanguage
    ),
    passwordPlaceholder: await fetchTranslation("Parolă", targetLanguage),
    confirmPasswordPlaceholder: await fetchTranslation(
      "Confirmă Parola",
      targetLanguage
    ),
    phonePlaceholder: await fetchTranslation("Telefon", targetLanguage),
    aboutMePlaceholder: await fetchTranslation("Adresa", targetLanguage),
    videoPlaceholder: await fetchTranslation(
      "Adaugă video de prezentare",
      targetLanguage
    ),
    pozePlaceholder: await fetchTranslation(
      "Adaugă poze(prima poza va servi ca poza principala, apasa pe alte poze pentru a schimba poza principala)",
      targetLanguage
    ),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),
    lang: targetLanguage,
  };

  return (
    <>
      <div className="main-content">
        <Preloader />
        <HeaderAuth
          tarifsText={translatedLinks.tarifsText}
          methodeText={translatedLinks.methodeText}
        />
        <div className="content-wrapper js-content-wrapper">
          <section className="form-page js-mouse-move-container">
            {/* Afișarea componentei AuthImageMove și a formularului de înregistrare */}

            <section className="form-page js-mouse-move-container">
              {/* Componența AuthImageMove primește răspunsurile ca props */}
              <AuthImageMove />
              {/* Formularul de înregistrare */}
              <SignUpForm
                signUpText={translatedLinks.signUpText}
                alreadyHaveAccountText={translatedLinks.alreadyHaveAccountText}
                conectText={translatedLinks.conectText}
                registerText={translatedLinks.registerText}
                emailPlaceholder={translatedLinks.emailPlaceholder}
                emailAdresaPlaceholder={translatedLinks.emailAdresaPlaceholder}
                usernamePlaceholder={translatedLinks.usernamePlaceholder}
                passwordPlaceholder={translatedLinks.passwordPlaceholder}
                confirmPasswordPlaceholder={
                  translatedLinks.confirmPasswordPlaceholder
                }
                phonePlaceholder={translatedLinks.phonePlaceholder}
                aboutMePlaceholder={translatedLinks.aboutMePlaceholder}
                videoPlaceholder={translatedLinks.videoPlaceholder}
                pozePlaceholder={translatedLinks.pozePlaceholder}
              />
            </section>
          </section>
        </div>
      </div>
    </>
  );
}
