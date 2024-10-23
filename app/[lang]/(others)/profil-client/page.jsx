import Preloader from "@/components/common/Preloader";
import Settings from "@/components/dashboard/SettingsClient/Settings";
import SidebarClient from "@/components/dashboard/SidebarClient";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import React from "react";

// In-memory cache for translations
const translationCache = {};

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

export default async function page({ params }) {
  const targetLanguage = params.lang || "en";

  // Obținem traducerile pentru textele din sidebar și restul componentelor
  const translatedTexts = {
    realAmorText: await fetchTranslation("Real Amor", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    usernameLabel: await fetchTranslation("Nume utilizator", targetLanguage),
    phoneLabel: await fetchTranslation("Telefon", targetLanguage),
    aboutMeLabel: await fetchTranslation("Despre mine", targetLanguage),
    addressLabel: await fetchTranslation("Adresa", targetLanguage),
    updateProfileText: await fetchTranslation(
      "Actualizează profilul",
      targetLanguage
    ),
    successMessage: await fetchTranslation(
      "Profil actualizat cu succes!",
      targetLanguage
    ),
    imageAddedMessage: await fetchTranslation(
      "Imagine adăugată cu succes!",
      targetLanguage
    ),
    videoAddedMessage: await fetchTranslation(
      "Videoclip adăugat cu succes!",
      targetLanguage
    ),
    errorMessage: await fetchTranslation(
      "Eroare la actualizarea profilului",
      targetLanguage
    ),
    usernameRequired: await fetchTranslation(
      "Numele utilizatorului este obligatoriu",
      targetLanguage
    ),
    phoneRequired: await fetchTranslation(
      "Numărul de telefon este obligatoriu",
      targetLanguage
    ),
    aboutMeRequired: await fetchTranslation(
      "Secțiunea Despre mine este obligatorie",
      targetLanguage
    ),
    addressRequired: await fetchTranslation(
      "Secțiunea Adresa este obligatorie",
      targetLanguage
    ),
    completeFieldsError: await fetchTranslation(
      "Te rugăm să completezi toate câmpurile corect.",
      targetLanguage
    ),
    // Traducerile pentru SidebarClient
    contText: await fetchTranslation("Cont", targetLanguage),
    listaCompatibilitatiText: await fetchTranslation(
      "Lista Compatibilitati",
      targetLanguage
    ),
    chatText: await fetchTranslation("Chat", targetLanguage),
    profileText: await fetchTranslation("Profile", targetLanguage),
    deconectareText: await fetchTranslation("Deconectare", targetLanguage),
    // Traducerile pentru butoane
    editProfileText: await fetchTranslation("Edit Profile", targetLanguage),
    passwordText: await fetchTranslation("Password", targetLanguage),
    closeAccountText: await fetchTranslation("Close Account", targetLanguage),
  };

  return (
    <div className="barba-container" data-barba="container">
      <main className="main-content">
        <Preloader />
        <HeaderDashboard
          realAmorText={translatedTexts.realAmorText}
          methodeText={translatedTexts.methodeText}
          tarifsText={translatedTexts.tarifsText}
        />
        <div className="content-wrapper js-content-wrapper overflow-hidden">
          <div
            id="dashboardOpenClose"
            className="dashboard -home-9 js-dashboard-home-9"
          >
            <div className="dashboard__sidebar scroll-bar-1">
              <SidebarClient
                contText={translatedTexts.contText}
                listaCompatibilitatiText={
                  translatedTexts.listaCompatibilitatiText
                }
                chatText={translatedTexts.chatText}
                profileText={translatedTexts.profileText}
                deconectareText={translatedTexts.deconectareText}
              />
            </div>
            <Settings
              usernameLabel={translatedTexts.usernameLabel}
              phoneLabel={translatedTexts.phoneLabel}
              aboutMeLabel={translatedTexts.aboutMeLabel}
              updateProfileText={translatedTexts.updateProfileText}
              successMessage={translatedTexts.successMessage}
              imageAddedMessage={translatedTexts.imageAddedMessage}
              videoAddedMessage={translatedTexts.videoAddedMessage}
              errorMessage={translatedTexts.errorMessage}
              usernameRequired={translatedTexts.usernameRequired}
              phoneRequired={translatedTexts.phoneRequired}
              aboutMeRequired={translatedTexts.aboutMeRequired}
              completeFieldsError={translatedTexts.completeFieldsError}
              // Props pentru traducerile butoanelor
              editProfileText={translatedTexts.editProfileText}
              passwordText={translatedTexts.passwordText}
              closeAccountText={translatedTexts.closeAccountText}
              addressLabel={translatedTexts.addressLabel}
              addressRequired={translatedTexts.addressRequired}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
