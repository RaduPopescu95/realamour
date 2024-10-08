"use client";

import { useState } from "react";
import { authentication, db, googleProvider } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/firebase"; // Asigură-te că importul storage este corect
import Link from "next/link";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid"; // Pentru a genera ID-uri unice pentru imagini

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    aboutMe: "",
  });
  const [tempImages, setTempImages] = useState([]); // Stocăm imaginile temporar înainte de upload
  const [tempVideo, setTempVideo] = useState(null); // Stocăm videoclipul temporar înainte de upload
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState({ type: "", content: "", show: false });

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    }

    if (!formData.username) {
      errors.username = "Username is required";
      isValid = false;
    }

    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required";
      isValid = false;
    }

    if (!formData.aboutMe) {
      errors.aboutMe = "About me is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageId = uuidv4(); // Generăm un ID unic pentru imagine
      const tempImage = {
        id: imageId,
        file,
        previewUrl: URL.createObjectURL(file), // URL pentru previzualizare locală
      };
      setTempImages((prev) => [...prev, tempImage]);
      setMessage({ type: "success", content: "Imagine adăugată cu succes!", show: true });
    }
  };

  const handleImageDelete = (imageId) => {
    setTempImages((prev) => prev.filter((image) => image.id !== imageId));
    setMessage({ type: "success", content: "Imagine ștearsă cu succes!", show: true });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoId = uuidv4(); // Generăm un ID unic pentru videoclip
      const tempVid = {
        id: videoId,
        file,
        previewUrl: URL.createObjectURL(file), // URL pentru previzualizare locală
      };
      setTempVideo(tempVid);
      setMessage({ type: "success", content: "Videoclip adăugat cu succes!", show: true });
    }
  };

  const handleVideoDelete = () => {
    setTempVideo(null);
    setMessage({ type: "success", content: "Videoclip șters cu succes!", show: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: "error", content: "Te rugăm să completezi toate câmpurile corect.", show: true });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        authentication,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Upload imagini în Firebase Storage
      const uploadedImages = await Promise.all(
        tempImages.map(async (image) => {
          const storageRef = ref(storage, `images/${image.id}`);
          const uploadTask = await uploadBytesResumable(storageRef, image.file);
          const fileUrl = await getDownloadURL(uploadTask.ref);

          return {
            fileName: image.id, // Folosim `id` (UUID) pentru a seta `fileName`
            fileUri: fileUrl,
          };
        })
      );

      // Upload videoclip în Firebase Storage
      let uploadedVideo = null;
      if (tempVideo) {
        const storageRef = ref(storage, `videos/${tempVideo.id}`);
        const uploadTask = await uploadBytesResumable(storageRef, tempVideo.file);
        const videoUrl = await getDownloadURL(uploadTask.ref);

        uploadedVideo = {
          videoName: tempVideo.id, // Folosim `id` (UUID) pentru a seta `videoName`
          videoUri: videoUrl,
        };
      }

      // Crearea unui document în Firestore pentru utilizatorul înregistrat
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,
        email: formData.email,
        username: formData.username,
        phone: formData.phone,
        aboutMe: formData.aboutMe,
        images: uploadedImages,
        video: uploadedVideo,
      });

      setMessage({ type: "success", content: "Utilizator înregistrat cu succes!", show: true });
    } catch (err) {
      setMessage({ type: "error", content: err.message, show: true });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(authentication, googleProvider);
      const user = result.user;

      await setDoc(
        doc(db, "Users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          username: user.displayName,
          phone: "",
          aboutMe: "",
          images: [],
          video: null,
        },
        { merge: true }
      );

      setMessage({ type: "success", content: "Utilizator înregistrat cu succes cu Google!", show: true });
    } catch (err) {
      setMessage({ type: "error", content: err.message, show: true });
    }
  };

  const closeMessage = () => setMessage({ ...message, show: false });

  return (
    <div className="form-page__content lg:py-50 relative">
      <div className="container">
        <div className="row justify-center items-center">
          <div className="col-xl-8 col-lg-9">
            <div
              style={{
                maxHeight: "90vh",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
              className="px-50 py-50 md:px-25 md:py-25 bg-white shadow-1 rounded-16"
            >
              <h3 className="text-30 lh-13">Sign Up</h3>
              <p className="mt-10">
                Ai deja un cont?
                <Link href="/login" className="text-purple-1">
                  Conectează-te
                </Link>
              </p>

              <form
                className="contact-form respondForm__form row y-gap-20 pt-30"
                onSubmit={handleSubmit}
              >
                {/* Inputuri pentru informații utilizator */}
                <div className="col-lg-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Adresă email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${formErrors.email ? "border-danger-red" : ""}`}
                  />
                </div>

                <div className="col-lg-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Nume utilizator *
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Nume utilizator"
                    value={formData.username}
                    onChange={handleChange}
                    className={`form-control ${formErrors.username ? "border-danger-red" : ""}`}
                  />
                </div>

                <div className="col-lg-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Parolă *
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Parolă"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-control ${formErrors.password ? "border-danger-red" : ""}`}
                  />
                </div>

                <div className="col-lg-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Confirmă Parola *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmă Parola"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-control ${formErrors.confirmPassword ? "border-danger-red" : ""}`}
                  />
                </div>

                <div className="col-lg-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Telefon *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Telefon"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-control ${formErrors.phone ? "border-danger-red" : ""}`}
                  />
                </div>

                <div className="col-lg-12">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Despre mine *
                  </label>
                  <textarea
                    name="aboutMe"
                    placeholder="Scrie ceva despre tine..."
                    value={formData.aboutMe}
                    onChange={handleChange}
                    className={`form-control ${formErrors.aboutMe ? "border-danger-red" : ""}`}
                  />
                </div>

                {/* Câmp pentru încărcarea imaginii */}
                <div className="col-lg-12">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Încărcați imaginea
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-10"
                  />

                  {/* Previzualizarea imaginilor încărcate temporar */}
                  <div className="d-flex flex-wrap gap-4">
                    {tempImages.map((image) => (
                      <div
                        key={image.id}
                        className="relative"
                        style={{ position: "relative" }}
                      >
                        <Image
                          src={image.previewUrl}
                          alt={image.file.name}
                          width={100}
                          height={100}
                          className="rounded-md"
                          style={{
                            border: "1px solid #ddd",
                            padding: "4px",
                            objectFit: "cover",
                          }}
                        />
                        {/* Buton de ștergere */}
                        <button
                          onClick={() => handleImageDelete(image.id)}
                          className="absolute top-0 right-0 m-1 p-1 bg-red-500 text-white rounded-full"
                        >
                          &#x1F5D1;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Câmp pentru încărcarea videoclipului */}
                <div className="col-lg-12">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Încărcați videoclipul de prezentare
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="mb-10"
                  />

                  {/* Previzualizare videoclip încărcat */}
                  {tempVideo && (
                    <div className="relative mt-4">
                      <video
                        src={tempVideo.previewUrl}
                        width="200"
                        height="200"
                        controls
                        style={{
                          border: "1px solid #ddd",
                          padding: "4px",
                          objectFit: "cover",
                        }}
                      />
                      {/* Buton de ștergere */}
                      <button
                        onClick={handleVideoDelete}
                        className="absolute top-0 right-0 m-1 p-1 bg-red-500 text-white rounded-full"
                      >
                        &#x1F5D1;
                      </button>
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="button -md -green-1 text-dark-1 fw-500 w-1/1"
                  >
                    Înregistrează-te
                  </button>
                </div>
              </form>

              <div className="lh-12 text-dark-1 fw-500 text-center mt-20">
                Sau conectează-te folosind
              </div>

              <div className="d-flex x-gap-20 items-center justify-between pt-20">
                <div>
                  <button
                    onClick={handleGoogleSignIn}
                    className="button -sm px-24 py-20 -outline-red-3 text-red-3 text-14"
                  >
                    Conectează-te cu Google+
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Afișarea mesajelor utilizând MessageBoxes */}
        {message.show && (
          <div className={`message-box fixed bottom-10 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md ${message.type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}>
            <div className="d-flex items-center justify-between">
              <div>{message.content}</div>
              <button onClick={closeMessage} className="ml-4">
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;
