"use client"

import React, { useState } from "react";
import Link from "next/link";
import Preloader from "@/components/common/Preloader";
import FooterOne from "@/components/layout/footers/FooterOne";
import HeaderAuth from "@/components/layout/headers/HeaderAuth";
import AuthImageMove from "@/components/others/AuthImageMove";
import SignUpForm from "@/components/others/SignUpForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

// Valori pentru opțiunile selectabile
const sexOptions = ["Masculin", "Feminin", "Altul"];
const preferintaOptions = ["Masculin", "Feminin", "Ambele"];
const intentieOptions = [
  "Relație serioasă",
  "Aventură",
  "Escorte",
  "Distracție / Fără obligații",
];

export default function Page() {
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [formData, setFormData] = useState({
    sex: "",
    preferinta: "",
    intentie: "",
  });

  const [ddOpen, setDdOpen] = useState({
    sex: false,
    preferinta: false,
    intentie: false,
  });

  // Funcție pentru a schimba valorile din state
  const handleSelectionChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setDdOpen({ ...ddOpen, [field]: false }); // Închide dropdown-ul după selectare
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.sex && formData.preferinta && formData.intentie) {
      setShowSignUpForm(true);
    } else {
      alert("Te rugăm să completezi toate câmpurile pentru a continua.");
    }
  };

  // Componenta de Selectare Personalizată
  const CustomSelect = ({ label, field, options }) => {
    return (
      <div className="col-lg-12">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">{label}</label>
        <div className="select js-multiple-select">
          <button
            onClick={() => setDdOpen((prev) => ({ ...prev, [field]: !prev[field] }))}
            className="select__button js-button d-flex align-items-center justify-between w-100 p-10 border rounded mb-4"
          >
            <span className="js-button-title">
              {formData[field] ? formData[field] : "Selectează o opțiune"}
            </span>
            <FontAwesomeIcon icon={faChevronDown} />
          </button>

          {/* Dropdown-ul opțiunilor */}
          <div
            className={`select__dropdown js-dropdown ${
              ddOpen[field] ? "-is-visible" : ""
            }`}
          >
            <div className="select__options js-options">
              {options.map((option, index) => (
                <div
                  onClick={() => handleSelectionChange(field, option)}
                  className={`select__options__button js-target-title d-flex align-items-center p-2 ${
                    formData[field] === option ? "-is-choosen bg-light" : ""
                  }`}
                  key={index}
                  style={{ cursor: "pointer" }}
                >
                  <div className="form-checkbox pointer-events-none">
                    <input
                      type="checkbox"
                      checked={formData[field] === option}
                      readOnly
                    />
                    <div className="form-checkbox__mark">
                      <div className="form-checkbox__icon icon-check"></div>
                    </div>
                  </div>
                  <span className="ml-10">{option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="main-content">
      <Preloader />
      <HeaderAuth />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <section className="form-page js-mouse-move-container">
          {/* Formularul inițial de întrebări */}
          {!showSignUpForm && (
            <div className="container py-50">
              <div className="row justify-center items-center">
                <div
                  className="col-xl-8 col-lg-9 bg-white shadow-1 rounded-16 p-50"
                  style={{ height: "80vh", overflowY: "auto" }}
                >
                  <h3 className="text-30 lh-13 mb-30">Spune-ne despre tine</h3>
                  <form onSubmit={handleSubmit} className="row y-gap-20 pt-30">
                    {/* Componentă de Select Personalizată */}
                    <CustomSelect
                      label="Ce sex ești? *"
                      field="sex"
                      options={sexOptions}
                    />
                    <CustomSelect
                      label="Ce sex te interesează? *"
                      field="preferinta"
                      options={preferintaOptions}
                    />
                    <CustomSelect
                      label="Ce cauți aici? *"
                      field="intentie"
                      options={intentieOptions}
                    />

<div className="col-auto">
          <div className="row x-gap-10 y-gap-10">
            <div className="col-auto">
              <button className="button -md -purple-1 text-white">
             Continua
              </button>
            </div>
        
          </div>
        </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Afișarea componentei AuthImageMove și a formularului de înregistrare */}
          {showSignUpForm && (
            <section className="form-page js-mouse-move-container">
              {/* Componența AuthImageMove primește răspunsurile ca props */}
              <AuthImageMove
                sex={formData.sex}
                preferinta={formData.preferinta}
                intentie={formData.intentie}
              />
              {/* Formularul de înregistrare */}
              <SignUpForm />
            </section>
          )}
        </section>
      </div>
      <FooterOne />
    </div>
  );
}
