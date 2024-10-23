import React, { useState } from "react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { authentication } from "@/firebase"; // Asigură-te că ai importat corect Firebase Auth

export default function Password({ activeTab }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailForReset, setEmailForReset] = useState(""); // Email pentru resetare parolă
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validare pentru noua parolă și confirmarea ei
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match");
      return;
    }

    // Obținem utilizatorul curent
    const user = authentication.currentUser;

    if (!user) {
      setErrorMessage("No user is currently signed in");
      return;
    }

    // Re-autentificarea utilizatorului înainte de a schimba parola
    const credentials = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      // Re-autentificare cu parola curentă
      await reauthenticateWithCredential(user, credentials);

      // Actualizare parolă
      await updatePassword(user, newPassword);

      setSuccessMessage("Password updated successfully");
      setErrorMessage("");
    } catch (error) {
      // Gestionare erori
      setErrorMessage(
        error.message || "An error occurred while updating the password"
      );
      setSuccessMessage("");
    }
  };

  // Funcția pentru trimiterea email-ului de resetare a parolei
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(authentication, emailForReset);
      setSuccessMessage("Password reset email sent successfully");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.message || "An error occurred while sending the reset email"
      );
      setSuccessMessage("");
    }
  };

  return (
    <div
      className={`tabs__pane -tab-item-2 ${activeTab == 2 ? "is-active" : ""} `}
    >
      {/* Form pentru actualizarea parolei */}
      <form onSubmit={handleSubmit} className="contact-form row y-gap-30">
        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            Current password
          </label>
          <input
            required
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            New password
          </label>
          <input
            required
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            Confirm New Password
          </label>
          <input
            required
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Save Password
          </button>
        </div>
      </form>

      {/* Form pentru resetarea parolei prin email */}
      <form
        onSubmit={handlePasswordReset}
        className="contact-form row y-gap-30 mt-40"
      >
        <div className="col-md-7">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            Enter email to reset password
          </label>
          <input
            required
            type="email"
            placeholder="Email for password reset"
            value={emailForReset}
            onChange={(e) => setEmailForReset(e.target.value)}
          />
        </div>

        <div className="col-12">
          <button className="button -md -purple-1 text-white">
            Send Reset Email
          </button>
        </div>
      </form>
    </div>
  );
}
