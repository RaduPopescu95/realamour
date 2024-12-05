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
    activeStatusText: await fetchTranslation("Active", targetLanguage),
    subscriptionCanceledUntilText: await fetchTranslation(
      "Subscription canceled, valid until",
      targetLanguage
    ),
    subscriptionCanceledImmediatelyText: await fetchTranslation(
      "Subscription canceled immediately",
      targetLanguage
    ),
    subscriptionExpiredText: await fetchTranslation(
      "Subscription expired",
      targetLanguage
    ),
    subscriptionStatusText: await fetchTranslation(
      "Subscription Status",
      targetLanguage
    ),
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
    deconectareText: await fetchTranslation("Se Déconnecter", targetLanguage),
    // Traducerile pentru butoane
    editProfileText: await fetchTranslation("Edit Profile", targetLanguage),
    passwordText: await fetchTranslation("Password", targetLanguage),
    closeAccountText: await fetchTranslation("Close Account", targetLanguage),
    profileSettingsText: await fetchTranslation(
      "Profile Settings",
      targetLanguage
    ),

    currentPasswordText: await fetchTranslation(
      "Current password",
      targetLanguage
    ),
    newPasswordText: await fetchTranslation("New password", targetLanguage),
    confirmNewPasswordText: await fetchTranslation(
      "Confirm New Password",
      targetLanguage
    ),
    enterEmailText: await fetchTranslation(
      "Enter email to reset password",
      targetLanguage
    ),
    emailForResetText: await fetchTranslation(
      "Email for password reset",
      targetLanguage
    ),
    savePasswordText: await fetchTranslation("Save Password", targetLanguage),
    sendResetEmailText: await fetchTranslation(
      "Send Reset Email",
      targetLanguage
    ),
    newPasswordMismatchError: await fetchTranslation(
      "New password and confirm password do not match",
      targetLanguage
    ),
    noUserSignedInError: await fetchTranslation(
      "No user is currently signed in",
      targetLanguage
    ),
    passwordUpdateSuccess: await fetchTranslation(
      "Password updated successfully",
      targetLanguage
    ),
    passwordUpdateError: await fetchTranslation(
      "An error occurred while updating the password",
      targetLanguage
    ),
    resetEmailSuccess: await fetchTranslation(
      "Password reset email sent successfully",
      targetLanguage
    ),
    resetEmailError: await fetchTranslation(
      "An error occurred while sending the reset email",
      targetLanguage
    ),

    closeAccountText: await fetchTranslation(
      "Supprimer le compte",
      targetLanguage
    ),
    accountCloseWarning: await fetchTranslation(
      "Attention : si vous supprimez votre compte, toutes vos données seront supprimées définitivement et vous perdrez l'accès à tous les services associés.",
      targetLanguage
    ),
    enterPasswordText: await fetchTranslation("Enter Password", targetLanguage),
    closeAccountButtonText: await fetchTranslation(
      "Supprimer le compte",
      targetLanguage
    ),
    accountClosedSuccess: await fetchTranslation(
      "Account closed and data deleted successfully",
      targetLanguage
    ),
    accountCloseError: await fetchTranslation(
      "An error occurred while closing the account",
      targetLanguage
    ),
    noUserSignedInError: await fetchTranslation(
      "No user is currently signed in",
      targetLanguage
    ),

    manageSubscriptionText: await fetchTranslation(
      "Manage Subscription",
      targetLanguage
    ),
    loadingText: await fetchTranslation("Loading...", targetLanguage),
    subscriptionDetailsText: await fetchTranslation(
      "Subscription Details",
      targetLanguage
    ),
    subscriptionIdText: await fetchTranslation(
      "Subscription ID",
      targetLanguage
    ),
    planText: await fetchTranslation("Plan", targetLanguage),
    expiryDateText: await fetchTranslation("Expiry Date", targetLanguage),
    cancelSubscriptionText: await fetchTranslation(
      "Cancel Subscription",
      targetLanguage
    ),
    cancelingText: await fetchTranslation("Canceling...", targetLanguage),
    noSubscriptionText: await fetchTranslation(
      "You don't have an active subscription.",
      targetLanguage
    ),
    buySubscriptionText: await fetchTranslation(
      "Buy a subscription here",
      targetLanguage
    ),
    accountNotActivatedText: await fetchTranslation(
      "Votre compte n'est pas encore activé, vous pourrez acheter un abonnement uniquement après le rendez-vous en présentiel",
      targetLanguage
    ),
    subscriptionCanceledSuccess: await fetchTranslation(
      "Subscription canceled successfully",
      targetLanguage
    ),
    subscriptionCanceledError: await fetchTranslation(
      "Error canceling subscription",
      targetLanguage
    ),
    subscriptionDetailsError: await fetchTranslation(
      "Error fetching subscription details",
      targetLanguage
    ),
    subscriptionCancelledUntilText: await fetchTranslation(
      "Subscription canceled, valid until ",
      targetLanguage
    ),
    getNecesarText: await fetchTranslation(
      "Genul este necesar",
      targetLanguage
    ),
    genText: await fetchTranslation("Gender", targetLanguage),
    hommeText: await fetchTranslation("Homme", targetLanguage),
    femmeText: await fetchTranslation("Femme", targetLanguage),
    selecteazaText: await fetchTranslation("Selecteaza", targetLanguage),
    scopNecesarText: await fetchTranslation(
      "Scopul este necesar",
      targetLanguage
    ),
    scopText: await fetchTranslation("Je cherche", targetLanguage),
    amourText: await fetchTranslation(
      "Je cherche un(e) partenaire de vie pour une relation sérieuse et stable.",
      targetLanguage
    ),
    sexText: await fetchTranslation(
      "Je cherche des rencontres coquines en toute discrétion.",
      targetLanguage
    ),
    amitieText: await fetchTranslation(
      "Je cherche à élargir mon cercle d’amis.",
      targetLanguage
    ),
    signUpText: await fetchTranslation("Sign up", targetLanguage),
    logInText: await fetchTranslation("Log in", targetLanguage),
    contText: await fetchTranslation("Cont", targetLanguage),
    newSubText: await fetchTranslation("Abonament nou", targetLanguage),
    confirmationCancelSubText: await fetchTranslation(
      "Sigur dorești să anulezi abonamentul?",
      targetLanguage
    ),
    cancelSub: await fetchTranslation("Anulează abonamentul", targetLanguage),
    nuAnulaText: await fetchTranslation("Nu anula", targetLanguage),
    pozePlaceholder: await fetchTranslation(
      "Ajouter une photo",
      targetLanguage
    ),
    videoPlaceholder: await fetchTranslation(
      "Ajouter une video",
      targetLanguage
    ),
    activeSubText: await fetchTranslation(
      "Active subscription",
      targetLanguage
    ),
    reactivateSubscriptionText: await fetchTranslation(
      "Reactivate subscription",
      targetLanguage
    ),
    reactivatingText: await fetchTranslation(
      "Se reactiveaza abonamentul...",
      targetLanguage
    ),
    subscriptionReactivatedSuccessText: await fetchTranslation(
      "Abonament reactivat cu success",
      targetLanguage
    ),
  };

  return (
    <div className="barba-container" data-barba="container">
      <main className="main-content">
        <Preloader />
        <HeaderDashboard
          realAmorText={translatedTexts.realAmorText}
          methodeText={translatedTexts.methodeText}
          tarifsText={translatedTexts.tarifsText}
          translatedTexts={translatedTexts}
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
              translatedTexts={translatedTexts}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
