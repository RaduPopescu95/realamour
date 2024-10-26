import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SubscriptionsProfile({ activeTab, translatedTexts }) {
  const { userData, setUserData } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false); // Stare pentru spinner-ul de anulare
  const router = useRouter();

  useEffect(() => {
    if (userData && userData?.subscriptionId) {
      fetchSubscriptionDetails(userData?.subscriptionId);
    } else {
      setLoading(false);
    }
  }, [userData]);

  const fetchSubscriptionDetails = async (subscriptionId) => {
    try {
      const response = await fetch(
        `/api/get-subscription?subscription_id=${subscriptionId}`
      );
      const data = await response.json();
      setSubscription(data);
      setLoading(false);
    } catch (error) {
      console.error(translatedTexts.subscriptionDetailsError, error);
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    setCanceling(true); // Începem spinner-ul de anulare
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
        console.log(
          translatedTexts.subscriptionCanceledSuccess,
          data.subscription
        );
        await updateSubscriptionInFirestore();
      } else {
        console.error(translatedTexts.subscriptionCanceledError, data.error);
      }
    } catch (error) {
      console.error(translatedTexts.subscriptionCanceledError, error);
    } finally {
      setCanceling(false); // Oprim spinner-ul de anulare
    }
  };

  const updateSubscriptionInFirestore = async () => {
    if (!userData || !userData?.uid) return;
    const userDocRef = doc(db, "Users", userData?.uid);
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
      className={`tabs__pane -tab-item-4 ${activeTab == 4 ? "is-active" : ""}`}
    >
      <form className="contact-form">
        <div className="row">
          <div className="col-12">
            <div className="text-16 fw-500 text-dark-1">
              {translatedTexts.manageSubscriptionText}
            </div>

            {loading ? (
              <p>{translatedTexts.loadingText}</p>
            ) : userData?.isActivated ? (
              userData?.subscriptionActive ? (
                <>
                  <p className="text-14 lh-13 mt-5">
                    {translatedTexts.subscriptionDetailsText}:
                  </p>
                  <ul>
                    <li>
                      <strong>{translatedTexts.subscriptionIdText}:</strong>{" "}
                      {subscription?.id}
                    </li>
                    <li>
                      <strong>{translatedTexts.planText}:</strong>{" "}
                      {subscription?.plan?.metadata?.tipAbonament}
                    </li>
                    <li>
                      <strong>{translatedTexts.expiryDateText}:</strong>{" "}
                      {new Date(
                        subscription?.current_period_end * 1000
                      ).toLocaleDateString()}
                    </li>
                  </ul>

                  {/* Afișează spinner-ul în loc de text în timpul anulării */}
                  <div className="col-12">
                    {canceling ? (
                      <div className="spinner-container">
                        <div className="spinner"></div>
                        <p>{translatedTexts.cancelingText}</p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="button -md -red-1 text-white"
                        onClick={cancelSubscription}
                      >
                        {translatedTexts.cancelSubscriptionText}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <p>
                  {translatedTexts.noSubscriptionText}{" "}
                  <Link
                    href="/subscriptions"
                    style={{ color: "#c13365", fontWeight: "bold" }}
                  >
                    {translatedTexts.buySubscriptionText}
                  </Link>
                </p>
              )
            ) : (
              <p>{translatedTexts.accountNotActivatedText}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
