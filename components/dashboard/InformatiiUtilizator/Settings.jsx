"use client";

import React, { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import Password from "./Password";
import SocialProfiles from "./SocialProfiles";
import CloseAccount from "./CloseAccount";
import FooterNine from "@/components/layout/footers/FooterNine";
import Notification from "./Notifications";
import CoursesCardDashboard from "../DashBoardCards/CoursesCardDashboard";
import Pagination from "@/components/common/Pagination";
import { coursesData } from "@/data/dashboard";

const buttons = [
  "Edit Profile",
  "Password",
  "Social Profiles",
  "Notifications",
  "Close Account",
];

export default function Settings({ translatedTexts }) {
  const [currentCategory, setCurrentCategory] = useState("All Categories");
  const [pageItems, setPageItems] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [pageData, setPageData] = useState(coursesData);
  useEffect(() => {
    if (activeTab == 1) {
      setPageData(coursesData);
    } else if (activeTab == 2) {
      setPageData(coursesData.filter((elm) => elm.status == "Finished"));
    } else if (activeTab == 3) {
      setPageData(coursesData.filter((elm) => elm.status == "Not enrolled"));
    }
  }, [activeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    if (currentCategory == "All Categories") {
      setPageItems(pageData);
    } else {
      setPageItems([
        ...pageData.filter((elm) => elm.category == currentCategory),
      ]);
    }
  }, [currentCategory, pageData]);

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row y-gap-30">
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="tabs -active-purple-2 js-tabs pt-0">
                {/* <div className="tabs__controls d-flex  x-gap-30 y-gap-20 flex-wrap items-center pt-20 px-30 border-bottom-light js-tabs-controls">
                  {buttons.map((elm, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i + 1)}
                      className={`tabs__button text-light-1 js-tabs-button ${
                        activeTab == i + 1 ? "is-active" : ""
                      } `}
                      type="button"
                    >
                      {elm}
                    </button>
                  ))}
                </div> */}

                <div className="tabs__content py-30 px-30 js-tabs-content">
                  <EditProfile
                    activeTab={activeTab}
                    translatedTexts={translatedTexts}
                  />
                </div>
                {/* <div className="tabs__content py-30 px-30 js-tabs-content mt-5">
                  <div className="tabs__pane -tab-item-1 is-active">
       

                    <div className="row y-gap-30 pt-30">
                    <div className="col-12">

                        <h2 className="text-black">
                        <i className="icon-person-2 text-40 mr-10"></i>
                          Lista Compatibilitati
                        </h2>
                    </div>
                      {pageItems.map((data, i) => (
                        <CoursesCardDashboard data={data} key={i} />
                      ))}
                    </div>

                    <div className="row justify-center pt-30">
                      <div className="col-auto">
                        <Pagination />
                      </div>
                    </div>
                  </div>

                  <div className="tabs__pane -tab-item-2"></div>
                  <div className="tabs__pane -tab-item-3"></div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterNine />
    </div>
  );
}
