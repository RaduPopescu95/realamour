"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Importăm pentru a prelua parametrii din URL
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Asigură-te că importul către Firebase este corect

export default function SubscriptionSuc({
  paymentTitle,
  paymentText,
  paymentConfirmation,
  loadingText,
  successText,
  continueBookingText,
  detaliiRezervareText,
  nameText,
  emailText,
  phoneText,
  amountPaidText,
}) {
  const [loading, setLoading] = useState(true);
  const [reservationData, setReservationData] = useState(null);
  const searchParams = useSearchParams(); // Utilizăm useSearchParams pentru a obține parametrii URL
  const session_id = searchParams?.get("session_id"); // Obținem session_id din URL
  const { currentUser, loading: loadingContext, userData } = useAuth();
  const router = useRouter();

  const fetchSessionData = async () => {
    console.log("Fetching session data...");
    setLoading(true);
    try {
      if (!session_id) {
        console.error("Lipsește session_id din URL.");
        setLoading(false);
        return;
      }

      console.log(`Fetching session data for session_id: ${session_id}`);
      const response = await fetch(`/api/get-session?session_id=${session_id}`);
      const sessionData = await response.json();
      console.log("Session data received:", sessionData);

      if (sessionData && sessionData.id) {
        setReservationData(sessionData);
        console.log("Session data set to state.");

        // Dacă sessionData conține un ID de abonament, îl preluăm separat
        if (sessionData.subscription) {
          const subscriptionDetails = await fetchSubscriptionDetails(
            sessionData.subscription
          );
          console.log("Subscription details received:", subscriptionDetails);

          // Adăugăm detaliile abonamentului în starea componentului
          setReservationData((prevState) => ({
            ...prevState,
            subscriptionDetails,
          }));
        }
      } else {
        console.error("Sesiunea nu a fost găsită în Stripe.");
      }
    } catch (error) {
      console.error("Eroare la preluarea datelor sesiunii:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funcție pentru a obține detaliile abonamentului din Stripe
  const fetchSubscriptionDetails = async (subscriptionId) => {
    try {
      const response = await fetch(
        `/api/get-subscription?subscription_id=${subscriptionId}`
      );
      const subscriptionData = await response.json();
      return subscriptionData;
    } catch (error) {
      console.error("Eroare la preluarea detaliilor abonamentului:", error);
    }
  };

  // Function to update subscription data in Firestore
  const updateSubscriptionInFirestore = async (sessionData) => {
    if (!userData || !userData.uid) {
      console.error("User data or UID is missing.");
      return;
    }

    const userDocRef = doc(db, "Users", userData.uid);
    console.log(`Updating Firestore for user: ${userData.uid}`);

    try {
      const subscriptionId = sessionData.subscription;
      const priceId = sessionData.subscriptionDetails?.plan?.id; // Preluăm priceId din subscriptionDetails
      const subscriptionEndDate = new Date(
        sessionData.subscriptionDetails?.current_period_end * 1000
      );

      if (!subscriptionId || !priceId) {
        console.error("Missing subscription ID or price ID.");
        return;
      }

      await updateDoc(userDocRef, {
        subscriptionActive: true,
        subscriptionId: subscriptionId,
        priceId: priceId,
        subscriptionAmount: sessionData.amount_total / 100,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: subscriptionEndDate,
      });

      console.log("Subscription data saved to Firestore successfully.");
    } catch (error) {
      console.error("Error saving subscription data to Firestore:", error);
    }
  };

  // Apelează funcția de actualizare doar după ce `userData` și `reservationData` sunt disponibile
  useEffect(() => {
    if (reservationData && userData && userData.uid) {
      console.log(
        "User data and session data available, updating Firestore..."
      );
      updateSubscriptionInFirestore(reservationData);
    } else {
      console.log("Waiting for userData or reservationData...");
    }
  }, [userData, reservationData]);

  useEffect(() => {
    if (session_id) {
      console.log("Session ID found:", session_id); // Log dacă este găsit session_id
      fetchSessionData(); // Fetch and save session data when session_id is available
    } else {
      console.log("No session ID found in URL.");
    }
  }, [session_id]);

  useEffect(() => {
    if (!loadingContext && !userData?.username) {
      console.log("User data missing or still loading:", userData); // Log dacă nu există datele utilizatorului
    }
  }, [loadingContext]);

  return (
    <section className="layout-pt-lg pt-10 layout-pb-md">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="sectionTitle">
              <h2 className="sectionTitle__title">{paymentTitle}</h2>
              <p className="sectionTitle__text">{paymentText}</p>
            </div>

            {/* Payment confirmation card */}
            <div className="priceCard -type-1 rounded-16 bg-white shadow-2 mt-40">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  {paymentConfirmation}
                </div>
                <Image
                  width={150}
                  height={150}
                  className="mt-30"
                  src="/assets/img/confirmare-plata.png"
                  alt="success-icon"
                />
                <div className="priceCard__text text-center pr-15 mt-40">
                  {loading ? (
                    <p>{loadingText}</p>
                  ) : (
                    <>
                      <p>{successText}</p>
                      {reservationData && (
                        <>
                          <p>
                            {detaliiRezervareText}
                            <br />
                            <strong>{nameText}:</strong> {userData?.username}
                            <br />
                            <strong>{emailText}:</strong> {userData?.email}
                            <br />
                            <strong>{phoneText}:</strong> {userData?.phone}
                            <br />
                            <strong>{amountPaidText}:</strong>{" "}
                            {reservationData.amount_total / 100} RON
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Buttons for navigation */}
                <div className="col-auto mt-40">
                  <div className="row x-gap-10 y-gap-10 justify-center">
                    <div className="col-auto">
                      <Link href="#">
                        <button
                          onClick={() => console.log("userData...", userData)}
                          className="button px-40 py-20 fw-500 -purple-1 text-white"
                        >
                          {continueBookingText}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
