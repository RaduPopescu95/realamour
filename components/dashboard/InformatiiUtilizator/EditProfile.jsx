"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore"; // Pentru a aduce date din Firestore
import { db } from "@/firebase"; // Asigură-te că ai importat corect db-ul configurat pentru Firebase

export default function EditProfile({ activeTab }) {
  const router = useRouter();
  const { uid } = router.query; // Extragem UID-ul din query-ul URL-ului
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loader pentru a afișa în timp ce datele sunt preluate

  // Funcție pentru a prelua datele utilizatorului din Firebase pe baza UID-ului
  const fetchUserData = async (uid) => {
    if (!uid) return;

    try {
      const userDocRef = doc(db, "Users", uid); // Referință către documentul utilizatorului
      const userSnapshot = await getDoc(userDocRef); // Preluăm documentul

      if (userSnapshot.exists()) {
        setUserData(userSnapshot.data()); // Setăm datele utilizatorului
      } else {
        console.error("User not found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Oprim loader-ul
    }
  };

  // Preluăm datele când UID-ul este disponibil
  useEffect(() => {
    if (uid) {
      fetchUserData(uid);
    }
  }, [uid]);

  // Dacă încă se încarcă datele, afișăm un mesaj de încărcare
  if (loading) {
    return <p>Loading...</p>;
  }

  // Dacă nu există date despre utilizator, afișăm un mesaj de eroare
  if (!userData) {
    return <p>No user data found.</p>;
  }

  return (
    <div
      className={`tabs__pane -tab-item-1 ${activeTab == 1 ? "is-active" : ""} `}
    >
      <div className="row y-gap-20 x-gap-20 items-center">
        {/* Afișăm imaginea utilizatorului dacă există */}
        {userData.images && userData.images.length > 0 && userData.images[0]?.fileUri ? (
          <Image
            width={300}
            height={300}
            className="size-300"
            src={userData.images[0].fileUri}
            alt={userData.username}
          />
        ) : (
          <Image
            width={300}
            height={300}
            className="size-300"
            src="/assets/img/dashboard/edit/default-avatar.png" // Imagine implicită
            alt="default avatar"
          />
        )}
      </div>

      <div className="border-top-light pt-30 mt-30">
        <form className="contact-form row y-gap-30">
          <div className="col-md-6">
            <input
              readOnly
              required
              type="text"
              placeholder="Nume Utilizator"
              value={userData.username || ""}
            />
          </div>

          <div className="col-md-6">
            <input
              readOnly
              required
              type="text"
              placeholder="Telefon"
              value={userData.phone || ""}
            />
          </div>

          <div className="col-md-6">
            <input
              readOnly
              required
              type="text"
              placeholder="Email"
              value={userData.email || ""}
            />
          </div>

          <div className="col-12">
            <textarea
              readOnly
              required
              placeholder="Despre mine"
              rows="7"
              value={userData.aboutMe || ""}
            ></textarea>
          </div>

          <div className="col-12">
            <button
              className="button -md -purple-1 text-white"
              onClick={() => router.push("/chat")}
            >
              <i className="icon-document text-30 mr-10"></i>
              Download questions PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
