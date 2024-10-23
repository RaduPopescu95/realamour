// components/Calendar.js
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { InlineWidget } from "react-calendly";

const Calendar = ({ targetLanguage }) => {
  const { currentUser, loading: loadingContext, userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingContext && !userData?.username) {
      console.log("no userData...", userData?.username);
      // router.push("/signup");
    }
  }, [loadingContext]);
  return (
    <div className="calendar-container" style={{ height: "100vh" }}>
      <InlineWidget
        url={
          targetLanguage === "fr"
            ? "https://calendly.com/webdynamicx/30-minute-meeting-clone"
            : "https://calendly.com/webdynamicx/30-minute-meeting-clone"
        }
        styles={{
          height: "100%",
          width: "100%",
          minHeight: "600px",
        }}
      />
    </div>
  );
};

export default Calendar;
