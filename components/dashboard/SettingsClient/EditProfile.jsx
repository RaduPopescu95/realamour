"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import AlertBox from "@/components/uiElements/AlertBox";

const EditProfile = ({activeTab}) => {
  const { userData } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    aboutMe: "",
  });
  const [tempImages, setTempImages] = useState([]);
  const [tempVideo, setTempVideo] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({ type: "", content: "", showAlert: false });

  useEffect(() => {
    if (userData) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, "Users", userData.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userInfo = userDoc.data();
          setFormData({
            username: userInfo.username || "",
            phone: userInfo.phone || "",
            aboutMe: userInfo.aboutMe || "",
          });
          setTempImages(userInfo.images || []);
          setTempVideo(userInfo.video || null);
        }
      };
      fetchUserData();
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tempImage = {
        file,
        previewUrl: URL.createObjectURL(file),
      };
      setTempImages([...tempImages, tempImage]);
      setAlertMessage({ type: "success", content: "Imagine adăugată cu succes!", showAlert: true });
    }
  };

  const handleImageDelete = (imageId) => {
    setTempImages((prev) => prev.filter((image) => image.fileName !== imageId));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tempVid = {
        file,
        previewUrl: URL.createObjectURL(file),
      };
      setTempVideo(tempVid);
      setAlertMessage({ type: "success", content: "Videoclip adăugat cu succes!", showAlert: true });
    }
  };

  const handleVideoDelete = () => {
    setTempVideo(null);
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.username) {
      errors.username = "Username is required";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlertMessage({ type: "danger", content: "Te rugăm să completezi toate câmpurile corect.", showAlert: true });
      return;
    }

    try {
      let uploadedImageUrl = null;
      if (tempImages.length > 0 && tempImages[0].file) {
        const image = tempImages[0];
        const storageRef = ref(storage, `images/${userData.uid}`);
        const uploadTask = await uploadBytesResumable(storageRef, image.file);
        uploadedImageUrl = await getDownloadURL(uploadTask.ref);
      }

      let uploadedVideoUrl = null;
      if (tempVideo && tempVideo.file) {
        const storageRef = ref(storage, `videos/${userData.uid}`);
        const uploadTask = await uploadBytesResumable(storageRef, tempVideo.file);
        uploadedVideoUrl = await getDownloadURL(uploadTask.ref);
      }

      const userDocRef = doc(db, "Users", userData.uid);
      await updateDoc(userDocRef, {
        username: formData.username,
        phone: formData.phone,
        aboutMe: formData.aboutMe,
        ...(uploadedImageUrl && { images: [{ fileName: "profileImage", fileUri: uploadedImageUrl }] }),
        ...(uploadedVideoUrl && { video: { videoName: "profileVideo", videoUri: uploadedVideoUrl } }),
      });

      setAlertMessage({ type: "success", content: "Profil actualizat cu succes!", showAlert: true });
    } catch (error) {
      setAlertMessage({ type: "danger", content: error.message, showAlert: true });
    }
  };

  return (
    <div
      className={`tabs__pane -tab-item-1 ${activeTab == 1 ? "is-active" : ""} `}
    >
        <div className="row justify-center items-center">
          <div className="col-xl-12 col-lg-12">
            <div

              className="px-30 py-10 mt-0 md:px-25 md:py-25"
            >
              <form className="contact-form respondForm__form row y-gap-20 pt-30" onSubmit={handleSubmit}>
                {/* Câmp pentru încărcarea imaginii */}
                <div className="row y-gap-10 x-gap-10 items-center" style={{ flexWrap: 'wrap' }}>
                  {tempImages.map((image, index) => (
                    <div key={index} className="position-relative" style={{
                      backgroundColor: "#f2f3f4",
                      width: 100,
                      height: 100,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      marginRight: 10,
                      marginTop: tempImages.length >= 4 ? 10 : 0,
                      position: "relative"
                    }}>
                      <Image
                        width={100}
                        height={100}
                        className="rounded-md size-100"
                        src={image.fileUri || image.previewUrl}
                        alt="uploaded image"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                      <i
                        className="icon-bin top-0 right-0 m-1 p-1 text-red-500"
                        style={{ cursor: "pointer", position: "absolute", top: 5, right: 5 }}
                        onClick={() => handleImageDelete(image.fileName)}
                      ></i>
                    </div>
                  ))}
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
                      marginTop: tempImages.length >= 4 ? 10 : 0,
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
                      width: 200,
                      height: 200,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      marginRight: 10,
                      position: "relative"
                    }}>
                      <video
                        width={200}
                        height={200}
                        src={tempVideo.videoUri || tempVideo.previewUrl}
                        controls
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                      <i
                        className="icon-bin top-0 right-0 m-1 p-1 text-red-500"
                        style={{ cursor: "pointer", position: "absolute", top: 5, right: 5 }}
                        onClick={handleVideoDelete}
                      ></i>
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
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">Nume utilizator *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`form-control ${formErrors.username ? "border-danger-red" : ""}`}
                  />
                </div>

                <div className="col-lg-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">Telefon *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-control ${formErrors.phone ? "border-danger-red" : ""}`}
                  />
                </div>

                <div className="col-lg-12">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">Despre mine *</label>
                  <textarea
                    name="aboutMe"
                    value={formData.aboutMe}
                    onChange={handleChange}
                    className={`form-control ${formErrors.aboutMe ? "border-danger-red" : ""}`}
                  />
                </div>

                <div className="col-12">
                  <button type="submit" className="button -md -purple-1 text-white">
                    Actualizează profilul
                  </button>
                </div>
              </form>
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
  );
};

export default EditProfile;
