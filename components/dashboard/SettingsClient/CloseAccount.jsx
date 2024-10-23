import React, { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { db, storage, authentication } from "@/firebase"; // Importăm corect Firebase Firestore și Storage
import { useRouter } from "next/navigation";

import { handleLogout } from "@/utils/authUtils";
import AlertBox from "@/components/uiElements/AlertBox";

export default function CloseAccount({ activeTab, translatedTexts }) {
  const { userData } = useAuth(); // Obținem datele utilizatorului curent
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = authentication.currentUser;

    if (!user) {
      setAlertMessage({
        type: "danger",
        content: translatedTexts.noUserSignedInError,
        showAlert: true,
      });
      return;
    }

    const credentials = EmailAuthProvider.credential(user.email, password);

    try {
      // Re-autentificarea utilizatorului
      await reauthenticateWithCredential(user, credentials);

      // Ștergerea imaginilor asociate utilizatorului din Firebase Storage
      const imageDeletePromises = userData.images.map((image) => {
        const imageRef = ref(storage, `images/${image.fileName}`);
        return deleteObject(imageRef);
      });

      // Ștergerea videoclipului asociat, dacă există
      let videoDeletePromise = Promise.resolve(); // Promisiune golită dacă nu există video
      if (userData.video && userData.video.videoName) {
        const videoRef = ref(storage, `videos/${userData.video.videoName}`);
        videoDeletePromise = deleteObject(videoRef);
      }

      // Așteptăm să fie șterse toate fișierele din storage
      await Promise.all([...imageDeletePromises, videoDeletePromise]);

      // Ștergerea documentului utilizatorului din Firestore
      await deleteDoc(doc(db, "Users", userData.uid));

      // Ștergerea contului utilizatorului din Firebase Authentication
      await deleteUser(user);
      router.push("/signup");
      handleLogout();
      setAlertMessage({
        type: "success",
        content: translatedTexts.accountClosedSuccess,
        showAlert: true,
      });
    } catch (error) {
      console.error("Error closing account:", error);
      setAlertMessage({
        type: "danger",
        content: error.message || translatedTexts.accountCloseError,
        showAlert: true,
      });
    }
  };

  return (
    <div
      className={`tabs__pane -tab-item-5 ${activeTab == 3 ? "is-active" : ""}`}
    >
      <form onSubmit={handleSubmit} className="contact-form row y-gap-30">
        <div className="col-12">
          <div className="text-16 fw-500 text-dark-1">
            {translatedTexts.closeAccountText}
          </div>
          <p className="mt-10">{translatedTexts.accountCloseWarning}</p>
        </div>

        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            {translatedTexts.enterPasswordText}
          </label>
          <input
            required
            type="password"
            placeholder={translatedTexts.enterPasswordText}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Afișare mesaje de succes sau eroare */}
        {alertMessage.showAlert && (
          <AlertBox
            type={alertMessage.type}
            message={alertMessage.content}
            showAlert={alertMessage.showAlert}
            onClose={() =>
              setAlertMessage({ ...alertMessage, showAlert: false })
            }
          />
        )}

        <div className="col-12">
          <button className="button -md -purple-1 text-white">
            {translatedTexts.closeAccountButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
