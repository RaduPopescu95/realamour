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


export const handleGetUserInfo = async () => {
  let userData;
  try {
    const auth = authentication;

    // Asigură-te că utilizatorul este autentificat
    if (!auth.currentUser) {
      throw new Error("Utilizatorul nu este autentificat. Vă rugăm să vă autentificați mai întâi.");
    }

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
    console.log("error...la get user info.......", err);
    throw err;
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Inițializare cu null
  const [userData, setUserData] = useState(null); // Inițializare cu null
  const [loading, setLoading] = useState(true);
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ day: null, slot: null }); // ziua și slotul curent pentru ștergerea unui slot



  // Initializează limba cu valoarea din localStorage sau cu "en" implicit
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("locale") || "en";
    }
    return "en";
  });

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Acces la localStorage doar pe client
  // useEffect(() => {
  //   const storedCurrentUser = localStorage.getItem("currentUser");
  //   const storedUserData = localStorage.getItem("userData");
  //   const storedIsGuestUser = localStorage.getItem("isGuestUser");

  //   if (storedCurrentUser) {
  //     setCurrentUser(JSON.parse(storedCurrentUser));
  //   }

  //   if (storedUserData) {
  //     setUserData(JSON.parse(storedUserData));
  //   }

  //   if (storedIsGuestUser) {
  //     setIsGuestUser(storedIsGuestUser === "true");
  //   }
  // }, []);

  const setAsGuestUser = (isGuest) => {
    try {
      localStorage.setItem("isGuestUser", isGuest ? "true" : "false");
      setIsGuestUser(isGuest);
    } catch (e) {
      console.error("Failed to update isGuestUser in localStorage:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = authentication.onAuthStateChanged(async (user) => {
      console.log("start use effect from auth context", user);
      if (user && user.providerData[0]?.providerId !== "google.com") {
        try {
          console.log("user....firebase...", user);
          let userDataFromFirestore = await handleGetUserInfo();
          console.log(
            "User data fetched at onAuthStateChanged from handleGetUserInfoJobs...",
            userDataFromFirestore
          );

          setUserData(userDataFromFirestore);
          localStorage.setItem("currentUser", JSON.stringify(user));
          localStorage.setItem(
            "userData",
            JSON.stringify(userDataFromFirestore)
          );
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      } else {
        console.log("user....other...", user);
        if (user?.displayName) {
          let first_name = user.displayName;
          let last_name = "";
          let email = user.email;
          let owner_uid = user.uid;
          let data = { first_name, last_name, email, owner_uid };
          setUserData(data);
          localStorage.setItem("currentUser", JSON.stringify(user));
          localStorage.setItem("userData", JSON.stringify(data));
        }
      }
      setCurrentUser(user);

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Salvarea userData în localStorage
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  // Salvarea currentUser în localStorage
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
    language, // Adăugăm limba în context
    changeLanguage, // Adăugăm funcția de schimbare a limbii
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
