import Preloader from "@/components/common/Preloader";
import DashboardOne from "@/components/dashboard/DashboardOne";
import MyCourses from "@/components/dashboard/MyCourses";
import Sidebar from "@/components/dashboard/Sidebar";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import { fetchTranslation } from "@/utils/translationUtils";
import React from "react";

export const metadata = {
  title: "Lista-utilizatori",
  description: "Lista-utilizatori",
};

export default async function page({ params }) {
  const targetLanguage = params.lang || "fr"; // Setăm limba țintă pentru traduceri
  console.log("target...language...", targetLanguage);
  // Obținem traducerile pentru textele statice
  const translatedTexts = {
    title: await fetchTranslation("Lista utilizatori", targetLanguage),
    description: await fetchTranslation("Lista utilizatori", targetLanguage),
    sidebarText: await fetchTranslation("Sidebar", targetLanguage),
    myCoursesText: await fetchTranslation("My Courses", targetLanguage),
    headerDashboardText: await fetchTranslation("Dashboard", targetLanguage),
    realAmorText: await fetchTranslation("Real Amor", targetLanguage),
    methodeText: await fetchTranslation("Methode", targetLanguage),
    tarifsText: await fetchTranslation("Tarifs", targetLanguage),
    adminText: await fetchTranslation("Panou administrare", targetLanguage),
    usersText: await fetchTranslation("Utilizatori", targetLanguage),
    disconnectText: await fetchTranslation("Se Déconnecter", targetLanguage),
    listaUtilizatoriText: await fetchTranslation(
      "Lista utilizatori",
      targetLanguage
    ),
    signUpText: await fetchTranslation("Sign up", targetLanguage),
    logInText: await fetchTranslation("Log in", targetLanguage),
    contText: await fetchTranslation("Cont", targetLanguage),
  };

  return (
    <div className="barba-container" data-barba="container">
      <main className="main-content">
        <Preloader />
        <HeaderDashboard
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
              <Sidebar
                adminText={translatedTexts.adminText}
                usersText={translatedTexts.usersText}
                disconnectText={translatedTexts.disconnectText}
              />
            </div>
            <DashboardOne />
          </div>
        </div>
      </main>
    </div>
  );
}
