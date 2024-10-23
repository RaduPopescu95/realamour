"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Importăm pentru a prelua parametrii din URL
import { useAuth } from "@/context/AuthContext";

export default function PaymentSuccessPage({
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
    setLoading(true);
    try {
      if (!session_id) {
        console.error("Lipsește session_id din URL.");
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/get-session?session_id=${session_id}`);
      const sessionData = await response.json();

      if (sessionData && sessionData.id) {
        setReservationData(sessionData);
      } else {
        console.error("Sesiunea nu a fost găsită în Stripe.");
      }
    } catch (error) {
      console.error("Eroare la preluarea datelor sesiunii:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData(); // Apelează funcția pentru a prelua și salva datele sesiunii
  }, [session_id]);

  useEffect(() => {
    if (!loadingContext && !userData?.username) {
      console.log("no userData...", userData?.username);
      // router.push("/signup");
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

            {/* Cardul de confirmare a plății */}
            <div className="priceCard -type-1 rounded-16 bg-white shadow-2 mt-40">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  {paymentConfirmation}
                </div>
                <Image
                  width={150}
                  height={150}
                  className="mt-30"
                  src="/assets/img/confirmare-plata.png" // Imagine simbolică pentru confirmare de succes
                  alt="success-icon"
                />
                <div className="priceCard__text text-center pr-15 mt-40">
                  {loading ? (
                    loadingText
                  ) : (
                    <>
                      {successText}
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

                {/* Butoane pentru navigare */}
                <div className="col-auto mt-40">
                  <div className="row x-gap-10 y-gap-10 justify-center">
                    {/* Buton pentru a continua cu rezervarea */}
                    <div className="col-auto">
                      <Link href="/booking">
                        <button className="button px-40 py-20 fw-500 -purple-1 text-white">
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
