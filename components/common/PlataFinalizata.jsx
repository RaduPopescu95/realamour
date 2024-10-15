"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Importăm pentru a prelua parametrii din URL

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [reservationData, setReservationData] = useState(null);
  const searchParams = useSearchParams(); // Utilizăm useSearchParams pentru a obține parametrii URL
  const session_id = searchParams?.get("session_id"); // Obținem session_id din URL

  // Funcție pentru a salva datele în localStorage
  const saveToLocalStorage = (key, data) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // Funcție pentru a prelua datele din localStorage
  const getFromLocalStorage = (key) => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  };

  const fetchSessionData = async () => {
    setLoading(true);
    try {
      if (!session_id) {
        console.error("Lipsește session_id din URL.");
        setLoading(false);
        return;
      }

      // Verificăm dacă datele sunt deja în localStorage
      const localData = getFromLocalStorage(`session_${session_id}`);
      if (localData) {
        setReservationData(localData);
        setLoading(false);
        return;
      }

      // Dacă datele nu sunt în localStorage, le preluăm din API-ul Stripe
      const response = await fetch(`/api/get-session?session_id=${session_id}`);
      const sessionData = await response.json();

      if (sessionData && sessionData.id) {
        // Salvează datele în localStorage
        saveToLocalStorage(`session_${session_id}`, sessionData);
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

  return (
    <section className="layout-pt-lg layout-pb-md">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="sectionTitle">
              <h2 className="sectionTitle__title">Plată Finalizată</h2>
              <p className="sectionTitle__text">
                Vă mulțumim pentru plata efectuată! Vă rugăm să continuați cu rezervarea dumneavoastră.
              </p>
            </div>

            {/* Cardul de confirmare a plății */}
            <div className="priceCard -type-1 rounded-16 bg-white shadow-2 mt-40">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  Confirmare de plată
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
                    "Se încarcă detaliile plății..."
                  ) : (
                    <>
                      Plata dumneavoastră a fost procesată cu succes. Un email cu factura și confirmarea plății a fost trimis la adresa dvs. Vă rugăm să verificați căsuța de email pentru mai multe detalii.
                      {reservationData && (
                        <>
                          <p>
                            Detalii rezervare:
                            <br />
                            <strong>Nume:</strong> {reservationData.metadata?.nume}
                            <br />
                            <strong>Email:</strong> {reservationData.metadata?.email}
                            <br />
                            <strong>Telefon:</strong> {reservationData.metadata?.phone}
                            <br />
                            <strong>Sumă plătită:</strong> {reservationData.amount_total / 100} RON
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
                          Continuă cu Rezervarea
                        </button>
                      </Link>
                    </div>
                    {/* Buton pentru a reveni la pagina principală */}
                    {/* <div className="col-auto">
                      <Link href="/home">
                        <button className="button px-40 py-20 fw-500 -outline-purple-1 text-purple-1">
                          Înapoi la Pagina Principală
                        </button>
                      </Link>
                    </div> */}
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
