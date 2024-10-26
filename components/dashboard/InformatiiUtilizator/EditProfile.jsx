import Image from "next/image";
import { useSearchParams } from "next/navigation"; // Folosim useSearchParams în loc de useRouter
import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Adăugăm updateDoc pentru a actualiza Firestore
import { db } from "@/firebase"; // Asigură-te că ai importat corect db-ul configurat pentru Firebase

export default function EditProfile({ activeTab, translatedTexts }) {
  const searchParams = useSearchParams(); // Obține parametrii query din URL
  const uid = searchParams.get("uid"); // Extragem UID-ul din query-ul URL-ului
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loader pentru a afișa în timp ce datele sunt preluate
  const [isActivated, setIsActivated] = useState(false); // Stare pentru a gestiona isActivated

  // Funcție pentru a prelua datele utilizatorului din Firebase pe baza UID-ului
  const fetchUserData = async (uid) => {
    if (!uid) return;

    try {
      const userDocRef = doc(db, "Users", uid); // Referință către documentul utilizatorului
      const userSnapshot = await getDoc(userDocRef); // Preluăm documentul

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log("user data....informatiii", userData);
        setUserData(userData); // Setăm datele utilizatorului
        setIsActivated(userData?.isActivated || false); // Setăm isActivated
      } else {
        console.error("User not found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Oprim loader-ul
    }
  };

  // Funcție pentru a schimba valoarea isActivated
  const toggleActivation = async () => {
    try {
      const userDocRef = doc(db, "Users", uid);
      const newIsActivated = !isActivated;
      await updateDoc(userDocRef, { isActivated: newIsActivated }); // Actualizăm valoarea în Firestore
      setIsActivated(newIsActivated); // Actualizăm starea locală
    } catch (error) {
      console.error("Error updating isActivated:", error);
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
      <div className="row pb-50 mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-12 fw-700">{userData.username}</h1>
          {/* <div className="mt-10">
              Lorem ipsum dolor sit amet, consectetur.
            </div> */}
        </div>
      </div>
      <div className="row y-gap-20 x-gap-20 items-center">
        {/* Afișăm toate imaginile utilizatorului */}
        {userData?.images?.length > 0 ? (
          userData.images.map((image, index) => (
            <div
              key={image.fileUri || index} // Folosește fie fileUri (dacă există), fie index ca și cheie
              style={{ width: 300, height: 300, overflow: "hidden" }}
            >
              <Image
                width={300}
                height={300}
                className="size-300"
                src={image.fileUri}
                alt={`User image ${index + 1}`}
                style={{
                  objectFit: "cover", // Asigură că imaginea se întinde corect
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          ))
        ) : (
          <Image
            width={300}
            height={300}
            className="size-300"
            src="/assets/img/dashboard/edit/default-avatar.png" // Imagine implicită
            alt="default avatar"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </div>

      <div className="border-top-light pt-30 mt-30">
        <form className="contact-form row y-gap-30">
          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.userNameText}
            </label>
            <input
              readOnly
              required
              type="text"
              placeholder="Nume Utilizator"
              value={userData?.username || ""}
            />
          </div>

          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.phoneNumberText}
            </label>
            <input
              readOnly
              required
              type="text"
              placeholder="Telefon"
              value={userData?.phone || ""}
            />
          </div>

          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.emailText}
            </label>
            <input
              readOnly
              required
              type="text"
              placeholder="Email"
              value={userData?.email || ""}
            />
          </div>

          <div className="col-12">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.aboutMeText}
            </label>
            <textarea
              readOnly
              required
              placeholder="Despre mine"
              rows="7"
              value={userData?.aboutMe || ""}
            ></textarea>
          </div>
          <div className="col-12">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              {translatedTexts.AddressText}
            </label>
            <textarea
              readOnly
              required
              placeholder="Despre mine"
              rows="7"
              value={userData?.address || ""}
            ></textarea>
          </div>

          <div
            className="col-12"
            style={{ display: "flex", alignItems: "center" }}
          >
            {userData?.reservation?.status === "paid" ? (
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "green",
                }}
              >
                {translatedTexts.paidForReservationText}
              </span>
            ) : (
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "red",
                }}
              >
                {translatedTexts.hasNotPaidForReservationText}
              </span>
            )}
          </div>

          <div
            className="col-12"
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={isActivated}
              onChange={toggleActivation}
              className="large-checkbox"
              style={{
                width: "25px",
                height: "25px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {translatedTexts.activateContText}
            </span>
          </div>

          {/* <div className="col-12">
            <button
              className="button -md -purple-1 text-white"
              onClick={() => router.push("/chat")}
            >
              <i className="icon-document text-30 mr-10"></i>
              Download questions PDF
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
}
