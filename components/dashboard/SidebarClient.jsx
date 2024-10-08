"use client";

import { sidebarItems, sidebarItemsClient } from "@/data/dashBoardSidebar";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function SidebarClient() {
  const pathname = usePathname();
  return (
    <div className="sidebar -dashboard">
      {sidebarItemsClient.map((elm, i) => (
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
          >
            <i className={`${elm.iconClass} mr-15`}></i>
            {elm.text}
          </Link>
        </div>
      ))}
    </div>
  );
}
