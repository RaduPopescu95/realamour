"use client";

import Image from "next/image";
import React, { useState } from "react";
import { pricingData } from "../../data/pricing";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/context/AuthContext";

// Verifică dacă variabila de mediu este definită
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST
);

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(false); // Starea pentru a controla butonul de încărcare
  const router = useRouter();
  const {userData, currentUser}  = useAuth()

  const handleCheckboxChange = (event) => {
    setIsYearly(event.target.checked);
  };

  // Funcția de inițiere a checkout-ului
  const initiateCheckout = async (price) => {
    console.log("userData.....", userData)
    console.log("userData.....", currentUser)
    try {
      if (!stripePromise) {
        throw new Error("Stripe is not initialized. Please check your API key.");
      }
      
      const stripe = await stripePromise;
      setLoading(true); // Setează loading la true înainte de a face cererea

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          costRezervare: price * 100, // Convertim în bani (de exemplu, 10000 pentru 100 RON)
          nume: userData.username,
          email: userData.email, // Aici poți adăuga un email dintr-o stare sau context al utilizatorului
          phone: userData.phone,
          uid: userData.uid, // UID-ul utilizatorului, dacă este disponibil
        }),
      });

      if (!response.ok) {
        throw new Error(`Eroare: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      if (data.id) {
        // Redirectează utilizatorul la sesiunea de checkout Stripe
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        alert("Eroare la inițierea checkout-ului");
      }
    } catch (error) {
      console.error("Eroare la inițierea checkout-ului", error);
      alert(`Eroare: ${error.message}`);
    } finally {
      setLoading(false); // Resetează starea loading
    }
  };

  return (
    <section className="layout-pt-lg layout-pb-md">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-auto">
            <div className="sectionTitle ">
              <h2 className="sectionTitle__title ">Simple Pricing</h2>
              {/* <p className="sectionTitle__text ">
                Lorem ipsum dolor sit amet, consectetur.
              </p> */}
            </div>

            {/* Toggle pentru anual/lunar */}
            {/* <div className="d-flex justify-center items-center pt-60 lg:pt-40">
              <div className="text-14 text-dark-1">Monthly</div>
              <div className="form-switch px-20">
                <div className="switch" data-switch=".js-switch-content">
                  <input
                    checked={isYearly}
                    onChange={handleCheckboxChange}
                    type="checkbox"
                  />
                  <span className="switch__slider"></span>
                </div>
              </div>
              <div className="text-14 text-dark-1">
                Annually <span className="text-purple-1">Save 30%</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Carduri de prețuri */}
        <div className="row y-gap-30 justify-center pt-60 lg:pt-40">
        <div className="col-lg-4 col-md-6">
            <div className="priceCard -type-1 rounded-16 bg-white shadow-2">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <div className="priceCard__type text-18 lh-11 fw-500 text-dark-1">
                  {pricingData[2].type}
                </div>
                <div className="priceCard__price text-45 lh-11 fw-700 text-dark-1 mt-15">
                  $
                  {isYearly
                    ? (pricingData[2].price * 12 * 0.7).toFixed(2)
                    : pricingData[2].price}
                </div>
                <div className="priceCard__period">
                  {isYearly ? "per year" : pricingData[2].period}
                </div>
                <Image
                  width={90}
                  height={90}
                  className="mt-30"
                  src="/assets/img/pricing/3.svg"
                  alt="icon"
                />
                <div className="priceCard__text text-left pr-15 mt-40">
                  Standard listing submission, active for 30 dayss
                </div>

                <div className="text-left y-gap-15 mt-35">
                  {pricingData[2].features.map((elm, i) => (
                    <div key={i}>
                      <i
                        className="text-purple-1 fa fa-check pr-8"
                        style={{ strokeWidth: 2 }}
                        data-feather="check"
                      ></i>
                      {elm}
                    </div>
                  ))}
                </div>

                <div className="d-inline-block mt-30">
                  <Link
                    className="button px-40 py-20 fw-500 -purple-3 text-purple-1"
                    onClick={() => initiateCheckout(pricingData[2].price)}
                    href={"#"}
                  >
                    Get Started Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
