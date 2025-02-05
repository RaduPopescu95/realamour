import Preloader from "@/components/common/Preloader";
import DashboardOne from "@/components/dashboard/DashboardOne";
import Quiz from "@/components/dashboard/Quiz";
import QuizClient from "@/components/dashboard/QuizClient";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/layout/headers/Header";

import React from "react";
export const metadata = {
  title:
    "Dashboard-quiz || Educrat - Professional LMS Online Education Course NextJS Template",
  description:
    "Elevate your e-learning content with Educrat, the most impressive LMS template for online courses, education and LMS platforms.",
};
export default function page() {
  return (
    <div className="barba-container" data-barba="container">
      <main className="main-content">
        <Preloader />
        <Header />
        <div className="content-wrapper js-content-wrapper overflow-hidden">
          <div
            id="dashboardOpenClose"
            className="dashboard -home-9 js-dashboard-home-9"
          >
            {/* <div  className="dashboard__sidebar scroll-bar-1">
                    <Sidebar/>

                </div> */}
            <QuizClient />
          </div>
        </div>
      </main>
    </div>
  );
}
