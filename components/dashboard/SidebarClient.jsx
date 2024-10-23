"use client";

import { sidebarItems, sidebarItemsClient } from "@/data/dashBoardSidebar";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { handleLogout } from "@/utils/authUtils";

export default function SidebarClient({
  contText,
  listaCompatibilitatiText,
  chatText,
  profileText,
  deconectareText,
}) {
  const pathname = usePathname();

  // Înlocuim textele statice din `sidebarItemsClient` cu textele traduse primite prin props
  const translatedSidebarItems = [
    { ...sidebarItemsClient[0], text: contText },
    { ...sidebarItemsClient[1], text: listaCompatibilitatiText },
    { ...sidebarItemsClient[2], text: chatText },
    { ...sidebarItemsClient[3], text: profileText },
    { ...sidebarItemsClient[4], text: deconectareText },
  ];

  return (
    <div className="sidebar -dashboard">
      {translatedSidebarItems.map((elm, i) => (
        <div
          key={i}
          className={`sidebar__item   ${
            pathname == elm.href ? "-is-active" : ""
          } `}
        >
          <Link
            key={i}
            href={elm.href}
            className="d-flex items-center text-17 lh-1 fw-500 "
            onClick={() =>
              elm.id === 8 ? handleLogout() : console.log("click")
            }
          >
            <i className={`${elm.iconClass} mr-15`}></i>
            {elm.text}
          </Link>
        </div>
      ))}
    </div>
  );
}
