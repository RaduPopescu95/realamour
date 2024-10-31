"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authentication, db } from "../firebase";
import { handleGetFirestore } from "@/utils/firestoreUtils";
import { collection, doc, getDocs, setDoc, where } from "firebase/firestore";
import { query } from "firebase/database";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Funcția care preia informațiile utilizatorului autentificat din Firestore
export const handleGetUserInfo = async () => {
  let userData;
  try {
    const auth = authentication;

    // Verifică dacă utilizatorul este autentificat
    if (!auth.currentUser) {
      throw new Error(
        "Utilizatorul nu este autentificat. Vă rugăm să vă autentificați mai întâi."
      );
    }

    // Preluăm datele utilizatorului din Firestore
    const q = query(
      collection(db, "Users"),
      where("uid", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userData = doc.data();
    });

    return userData;
  } catch (err) {
    console.log("Eroare la preluarea datelor utilizatorului: ", err);
    throw err;
  }
};

// Furnizorul de context Auth pentru întreaga aplicație
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Stare pentru utilizatorul autentificat
  const [userData, setUserData] = useState(null); // Stare pentru datele utilizatorului din Firestore
  const [loading, setLoading] = useState(true); // Stare pentru încărcare
  const [isGuestUser, setIsGuestUser] = useState(false); // Stare pentru utilizator invitat (guest)
  const [selectedSlot, setSelectedSlot] = useState({ day: null, slot: null }); // Stare pentru sloturile selectate

  // Initializează limba cu valoarea din localStorage sau cu "en" implicit
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("locale") || "en";
    }
    return "en";
  });

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("locale", newLanguage); // Salvăm noua limbă în localStorage
  };

  // Funcție pentru a seta utilizatorul ca guest
  const setAsGuestUser = (isGuest) => {
    try {
      localStorage.setItem("isGuestUser", isGuest ? "true" : "false");
      setIsGuestUser(isGuest);
    } catch (e) {
      console.error("Failed to update isGuestUser in localStorage:", e);
    }
  };

  // Sincronizarea stării utilizatorului cu localStorage
  useEffect(() => {
    const storedCurrentUser = localStorage.getItem("currentUser");
    const storedUserData = localStorage.getItem("userData");

    // Verificăm dacă datele din localStorage sunt valide înainte de a le parsa
    if (storedCurrentUser) {
      try {
        setCurrentUser(JSON.parse(storedCurrentUser));
      } catch (e) {
        console.error("Datele currentUser nu sunt JSON valid:", e);
        localStorage.removeItem("currentUser");
      }
    }

    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (e) {
        console.error("Datele userData nu sunt JSON valid:", e);
        localStorage.removeItem("userData");
      }
    }
  }, []);

  // Gestionarea schimbării stării de autentificare utilizând onAuthStateChanged
  useEffect(() => {
    const unsubscribe = authentication.onAuthStateChanged(async (user) => {
      console.log("Autentificare detectată: ", user);
      if (user && user.providerData[0]?.providerId !== "google.com") {
        try {
          // Preluăm datele utilizatorului din Firestore
          const userDataFromFirestore = await handleGetUserInfo();
          console.log("Date utilizator preluate: ", userDataFromFirestore);

          setUserData(userDataFromFirestore);
          localStorage.setItem("currentUser", JSON.stringify(user));
          localStorage.setItem(
            "userData",
            JSON.stringify(userDataFromFirestore)
          );
        } catch (error) {
          console.error("Eroare la preluarea datelor utilizatorului: ", error);
        }
      } else {
        if (user?.displayName) {
          // Dacă utilizatorul a fost creat cu un displayName (ex. Google Sign-In), salvăm aceste date
          const first_name = user.displayName;
          const last_name = "";
          const email = user.email;
          const owner_uid = user.uid;
          const data = { first_name, last_name, email, owner_uid };

          setUserData(data);
          localStorage.setItem("currentUser", JSON.stringify(user));
          localStorage.setItem("userData", JSON.stringify(data));
        }
      }

      // Actualizăm starea utilizatorului curent
      setCurrentUser(user);
      setLoading(false); // Oprirea stării de încărcare
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const value = {
    currentUser,
    userData,
    loading,
    isGuestUser,
    setAsGuestUser,
    setUserData,
    setCurrentUser,
    setLoading,
    selectedSlot,
    setSelectedSlot,
    language,
    changeLanguage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
