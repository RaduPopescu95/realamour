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
import { Router } from "next/router";
import { handleLogout } from "@/utils/authUtils";
import { useRouter } from "next/navigation";

export default function CloseAccount({ activeTab }) {
  const { userData } = useAuth(); // Obținem datele utilizatorului curent
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = authentication.currentUser;

    if (!user) {
      setErrorMessage("No user is currently signed in");
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
      setSuccessMessage("Account closed and data deleted successfully");
      setErrorMessage("");
    } catch (error) {
      console.error("Error closing account:", error);
      setErrorMessage(
        error.message || "An error occurred while closing the account"
      );
      setSuccessMessage("");
    }
  };

  return (
    <div
      className={`tabs__pane -tab-item-5 ${activeTab == 3 ? "is-active" : ""}`}
    >
      <form onSubmit={handleSubmit} className="contact-form row y-gap-30">
        <div className="col-12">
          <div className="text-16 fw-500 text-dark-1">Close account</div>
          <p className="mt-10">
            Warning: If you close your account, all your data will be deleted
            permanently, and you will lose access to all associated services.
          </p>
        </div>

        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            Enter Password
          </label>
          <input
            required
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMessage && (
          <div className="col-12">
            <p style={{ color: "red" }}>{errorMessage}</p>
          </div>
        )}
        {successMessage && (
          <div className="col-12">
            <p style={{ color: "green" }}>{successMessage}</p>
          </div>
        )}

        <div className="col-12">
          <button className="button -md -purple-1 text-white">
            Close Account
          </button>
        </div>
      </form>
    </div>
  );
}
