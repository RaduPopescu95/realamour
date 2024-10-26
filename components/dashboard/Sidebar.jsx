"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/data/dashBoardSidebar";
import { handleLogout } from "@/utils/authUtils";

export default function Sidebar({ adminText, usersText, disconnectText }) {
  const pathname = usePathname();

  // Înlocuim textele din sidebarItems cu cele traduse
  const translatedSidebar = [
    // { ...translatedSidebarItems[0], text: adminText },
    { ...sidebarItems[1], text: usersText },
    { ...sidebarItems[2], text: disconnectText },
  ];

  return (
    <div className="sidebar -dashboard">
      {translatedSidebar.map((elm, i) => (
        <div
          key={i}
          className={`sidebar__item ${
            pathname == elm.href ? "-is-active" : ""
          }`}
        >
          <Link
            key={i}
            href={elm.href}
            onClick={() =>
              elm.text === "Deconectare"
                ? handleLogout()
                : console.log("pressed...")
            }
            className="d-flex items-center text-17 lh-1 fw-500 "
          >
            <i className={`${elm.iconClass} mr-15`}></i>
            {elm.text}
          </Link>
        </div>
      ))}
    </div>
  );
}
