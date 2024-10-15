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
import AlertBox from "../uiElements/AlertBox";

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
  const [alertMessage, setAlertMessage] = useState({ type: "", content: "", showAlert: false });
  
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
      setAlertMessage({ type: "success", content: "Imagine adăugată cu succes!", showAlert: true });    }
  };

  const handleImageDelete = (imageId) => {
    setTempImages((prev) => prev.filter((image) => image.id !== imageId));
    setAlertMessage({ type: "success", content: "Imagine ștearsă cu succes!", showAlert: true });  };

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
      setAlertMessage({ type: "success", content: "Videoclip adăugat cu succes!", showAlert: true });    }
  };

  const handleVideoDelete = () => {
    setTempVideo(null);
    setAlertMessage({ type: "success", content: "Videoclip șters cu succes!", showAlert: true });  };

  const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!validateForm()) {
        setAlertMessage({ type: "danger", content: "Te rugăm să completezi toate câmpurile corect.", showAlert: true });
        return;
      }
  
      try {
        const userCredential = await createUserWithEmailAndPassword(
          authentication,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
  
        const uploadedImages = await Promise.all(
          tempImages.map(async (image) => {
            const storageRef = ref(storage, `images/${image.id}`);
            const uploadTask = await uploadBytesResumable(storageRef, image.file);
            const fileUrl = await getDownloadURL(uploadTask.ref);
  
            return {
              fileName: image.id,
              fileUri: fileUrl,
            };
          })
        );
  
        let uploadedVideo = null;
        if (tempVideo) {
          const storageRef = ref(storage, `videos/${tempVideo.id}`);
          const uploadTask = await uploadBytesResumable(storageRef, tempVideo.file);
          const videoUrl = await getDownloadURL(uploadTask.ref);
  
          uploadedVideo = {
            videoName: tempVideo.id,
            videoUri: videoUrl,
          };
        }
  
        await setDoc(doc(db, "Users", user.uid), {
          uid: user.uid,
          email: formData.email,
          username: formData.username,
          phone: formData.phone,
          aboutMe: formData.aboutMe,
          images: uploadedImages,
          video: uploadedVideo,
        });
  
        setAlertMessage({ type: "success", content: "Utilizator înregistrat cu succes!", showAlert: true });
      } catch (err) {
        setAlertMessage({ type: "danger", content: err.message, showAlert: true });
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
  
        setAlertMessage({ type: "success", content: "Utilizator înregistrat cu succes cu Google!", showAlert: true });
      } catch (err) {
        setAlertMessage({ type: "danger", content: err.message, showAlert: true });
      }
    };

  const closeMessage = () => setMessage({ ...message, show: false });

  return (
    <div className="form-page__content lg:py-50 relative">
      <div className="container">
        <div className="row justify-center items-center">
          <div className="col-xl-10 col-lg-10">
            <div
              style={{
                maxHeight: "95vh",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
              className="px-30 py-20 md:px-25 md:py-25 bg-white shadow-1 rounded-16"
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
{/* Câmp pentru încărcarea imaginii */}
<div className="row y-gap-10 x-gap-10 items-center" style={{ flexWrap: 'wrap' }}>
  {tempImages.map((image, index) => (
    <div key={image.id} className="position-relative" style={{
      backgroundColor: "#f2f3f4",
      width: 100,
      height: 100,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      borderRadius: "4px",
      border: "1px solid #ddd",
      marginRight: 10, // Elimină margin-right la prima imagine de pe fiecare rând
      marginTop: tempImages.length >= 4 ? 10 : 0,   // Adaugă margin-top pentru imaginile de pe al doilea rând
      position: "relative"  // Poziționare relativă pentru iconul bin
    }}>
      <Image
        width={100}
        height={100}
        className="rounded-md size-100"
        src={image.previewUrl}
        alt="uploaded image"
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      {/* Icon Bin pentru ștergerea imaginii */}
      <i
        className="icon-bin top-0 right-0 m-1 p-1 text-red-500"
        style={{ cursor: "pointer", position: "absolute", top: 5, right: 5 }}
        onClick={() => handleImageDelete(image.id)}
      >
        
      </i>
    </div>
  ))}

  {/* Label pentru adăugarea unei noi imagini */}
  <label
    className={`col-auto position-relative ${tempImages.length > 0 ? 'ml-10' : ''}`}
    htmlFor="imageUpload"
    style={{
      backgroundColor: "#f2f3f4",
      width: 100,
      height: 100,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      borderRadius: "4px",
      border: "1px solid #ddd",
      marginTop: tempImages.length >= 4 ? 10 : 0, // Adaugă margin-top pentru rândurile următoare
    }}
  >
    <div className="icon icon-cloud text-16"></div>
    <input
      id="imageUpload"
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      style={{ display: "none" }}
    />
  </label>
</div>

{/* Câmp pentru încărcarea videoclipului */}
<div className="row y-gap-10 x-gap-10 items-center mt-10 mb-10">
  {tempVideo ? (
    <div className="position-relative" style={{
      backgroundColor: "#f2f3f4",
      width: 200, // Dimensiune mai mare pentru video
      height: 200, // Dimensiune mai mare pentru video
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      borderRadius: "4px",
      border: "1px solid #ddd",
      marginRight: 10,
      position: "relative"  // Asigură poziționarea relativă pentru iconul bin
    }}>
      <video
        width={200}
        height={200}
        src={tempVideo.previewUrl}
        controls
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      {/* Icon Bin pentru ștergerea videoclipului */}
      <i
        className="icon-bin top-0 right-0 m-1 p-1 text-red-500"
        style={{ cursor: "pointer", position: "absolute", top: 5, right: 5 }}
        onClick={handleVideoDelete}
      >
        
      </i>
    </div>
  ) : (
    <label
      className="col-auto position-relative"
      htmlFor="videoUpload"
      style={{
        backgroundColor: "#f2f3f4",
        width: 100,
        height: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        borderRadius: "4px",
        border: "1px solid #ddd"
      }}
    >
      <div className="icon icon-cloud text-16"></div>
      <input
        id="videoUpload"
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        style={{ display: "none" }}
      />
    </label>
  )}
</div>








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

                {/* <div className="col-lg-12">
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
                </div> */}

    

                <div className="col-12">
                  <button
                    type="submit"
                    className="button -md -green-1 text-dark-1 fw-500 w-1/1"
                  >
                    Înregistrează-te
                  </button>
                </div>
              </form>

              {/* <div className="lh-12 text-dark-1 fw-500 text-center mt-20">
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
              </div> */}
            </div>
          </div>
        </div>

       {/* Afișare componentă AlertBox */}
       <AlertBox
          type={alertMessage.type}
          message={alertMessage.content}
          showAlert={alertMessage.showAlert}
          onClose={() => setAlertMessage({ ...alertMessage, showAlert: false })}
        />
      </div>
    </div>
  );
};

export default SignUpForm;
