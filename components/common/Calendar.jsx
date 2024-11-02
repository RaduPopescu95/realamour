"use client";

import React, { useEffect } from "react";
import { useCalendlyEventListener, InlineWidget } from "react-calendly";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Presupunând că `db` este instanța de Firestore configurată

const Calendar = ({ targetLanguage }) => {
  const { currentUser, loading: loadingContext, userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingContext && !userData?.username) {
      console.log("no userData...", userData?.username);
      // router.push("/signup");
    }
    if (!loadingContext && userData?.reservation?.hasReserved) {
      router.push("/profil-client");
    }
  }, [loadingContext]);

  // Folosim useCalendlyEventListener pentru a asculta evenimentul de programare
  useCalendlyEventListener({
    onEventScheduled: async () => {
      if (userData?.uid) {
        try {
          const userDocRef = doc(db, "Users", userData.uid);
          await updateDoc(userDocRef, {
            "reservation.hasReserved": true,
          });
          console.log("Rezervare actualizată cu succes în Firestore");
        } catch (error) {
          console.error("Eroare la actualizarea rezervării:", error);
        }
      }

      // Redirecționare la pagina „Thank You”
      router.push("/thank-you");
    },
  });

  return (
    <div className="calendar-container" style={{ height: "100vh" }}>
      <InlineWidget
        // url={
        //   targetLanguage === "fr"
        //     ? "https://calendly.com/realamor-adm/30min"
        //     : "https://calendly.com/realamor-adm/reunion-de-30-minutes-clone"
        // }
        url={"https://calendly.com/webdynamicx/30-minute-meeting-clone"}
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
