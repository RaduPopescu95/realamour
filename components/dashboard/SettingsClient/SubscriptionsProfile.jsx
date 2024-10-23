"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Import către Firebase
import { useRouter } from "next/navigation"; // Router pentru navigare

export default function SubscriptionsProfile({ activeTab }) {
  const { userData, setUserData } = useAuth(); // Obținem datele utilizatorului autentificat
  const [subscription, setSubscription] = useState(null); // Stare pentru a stoca detaliile abonamentului
  const [loading, setLoading] = useState(true); // Stare pentru încărcare
  const router = useRouter();

  useEffect(() => {
    if (userData && userData.subscriptionId) {
      fetchSubscriptionDetails(userData.subscriptionId);
    } else {
      setLoading(false); // Dacă nu există abonament, nu se face nimic
    }
  }, [userData]);

  // Funcție pentru obținerea detaliilor abonamentului din Stripe
  const fetchSubscriptionDetails = async (subscriptionId) => {
    try {
      const response = await fetch(
        `/api/get-subscription?subscription_id=${subscriptionId}`
      );
      const data = await response.json();
      setSubscription(data);
      setLoading(false); // Oprim starea de încărcare odată ce avem datele
    } catch (error) {
      console.error("Eroare la obținerea detaliilor abonamentului:", error);
      setLoading(false);
    }
  };

  // Funcție pentru anularea abonamentului
  const cancelSubscription = async () => {
    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId: subscription.id }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Abonament anulat cu succes:", data.subscription);
        // Actualizează Firestore după anulare
        await updateSubscriptionInFirestore();
      } else {
        console.error("Eroare la anularea abonamentului:", data.error);
      }
    } catch (error) {
      console.error("Eroare la anularea abonamentului:", error);
    }
  };

  // Funcție pentru actualizarea Firestore după anulare
  const updateSubscriptionInFirestore = async () => {
    if (!userData || !userData.uid) return;
    const userDocRef = doc(db, "Users", userData.uid);
    await updateDoc(userDocRef, {
      subscriptionActive: false,
      subscriptionId: null,
      subscriptionEndDate: null,
      priceId: null,
      subscriptionStartDate: null,
      subscriptionAmount: null,
    });

    setUserData({
      ...userData,

      subscriptionActive: false,
      subscriptionId: null,
      subscriptionEndDate: null,
      priceId: null,
      subscriptionStartDate: null,
      subscriptionAmount: null,
    });
    router.refresh();
  };

  return (
    <div
      className={`tabs__pane -tab-item-4 ${activeTab == 4 ? "is-active" : ""} `}
    >
      <form className="contact-form">
        <div className="row">
          <div className="col-12">
            <div className="text-16 fw-500 text-dark-1">
              Manage Subscription
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : subscription ? (
              <>
                <p className="text-14 lh-13 mt-5">Subscription Details:</p>
                <ul>
                  <li>
                    <strong>ID Abonament:</strong> {subscription.id}
                  </li>
                  <li>
                    <strong>Plan:</strong> {subscription.plan.nickname}
                  </li>
                  <li>
                    <strong>Data de Expirare:</strong>{" "}
                    {new Date(
                      subscription.current_period_end * 1000
                    ).toLocaleDateString()}
                  </li>
                </ul>
                <button
                  type="button"
                  className="button -md -red-1 text-white"
                  onClick={cancelSubscription} // Apelăm funcția fără să trimitem evenimentul
                  disabled={loading}
                >
                  {loading ? "Canceling..." : "Cancel Subscription"}
                </button>
              </>
            ) : (
              <p>You don't have an active subscription.</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
