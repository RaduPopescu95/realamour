"use client";

import React, { useState } from "react";
import { Range } from "react-range"; // Slider pentru valori multiple
import FooterNine from "../layout/footers/FooterNine";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import FinishedQuizComp from "../common/FinishQuizComp";
import { useAuth } from "@/context/AuthContext";
import {
  firstQuestions,
  questionsSet1,
  questionsSet2,
  questionsSet3,
} from "@/data/quiz";
import QuestionWithApiValidation from "./QuestionWithApiValidation";
import { prepareResponses } from "@/utils/quizUtils";
import AlertBox from "../uiElements/AlertBox";

const getQuestionSetName = (currentQuestions) => {
  if (currentQuestions === firstQuestions) return "firstQuestions";
  if (currentQuestions === questionsSet1) return "questionsSet1";
  if (currentQuestions === questionsSet2) return "questionsSet2";
  if (currentQuestions === questionsSet3) return "questionsSet3";
  return "unknownSet";
};

export default function QuizClient() {
  const [currentQuestions, setCurrentQuestions] = useState(firstQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [inputAnswers, setInputAnswers] = useState({});
  const [rangeValues, setRangeValues] = useState([18, 100]); // Valorile sliderului range
  const [progress, setProgress] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const { userData } = useAuth();
  const [answers, setAnswers] = useState({
    firstQuestions,
    questionsSet1,
    questionsSet2,
    questionsSet3,
  });
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const saveResponsesToFirestore = async (userId, userAnswers) => {
    try {
      // Toate seturile de întrebări
      const allQuestionSets = [
        { name: "firstQuestions", questions: firstQuestions },
        { name: "questionsSet1", questions: questionsSet1 },
        { name: "questionsSet2", questionsSet2 },
        { name: "questionsSet3", questionsSet3 },
      ];

      // Pregătește structura finală cu răspunsuri
      const structuredResponses = prepareResponses(
        allQuestionSets,
        userAnswers
      );

      // Salvează în Firestore
      const userDocRef = doc(db, "Users", userId);
      await updateDoc(userDocRef, { responses: structuredResponses });

      console.log("Răspunsurile au fost salvate cu succes!");
      setQuizFinished(true);
    } catch (error) {
      console.error("Eroare la salvarea răspunsurilor:", error);
    }
  };

  const handleOptionChange = (option) => {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    if (currentQuestion.type === "multiple") {
      setSelectedOptions((prev) => {
        const options = prev[currentQuestion.id] || []; // Asigură-te că începe cu un array gol
        return {
          ...prev,
          [currentQuestion.id]: options.includes(option)
            ? options.filter((o) => o !== option) // Deselectează dacă este deja selectat
            : [...options, option], // Selectează opțiunea
        };
      });
    } else {
      setSelectedOptions((prev) => ({
        ...prev,
        [currentQuestion.id]: option,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    const currentQuestion = currentQuestions[currentQuestionIndex];
    setInputAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentQuestion = currentQuestions[currentQuestionIndex];
    let selectedAnswer;

    // Validare răspunsuri în funcție de tipul întrebării
    if (currentQuestion.type === "input") {
      selectedAnswer = inputAnswers[currentQuestion.id];
      if (!selectedAnswer) {
        setAlertMessage("Vă rugăm să completați răspunsul.");
        setShowAlert(true);
        return;
      }
    } else if (currentQuestion.type === "range") {
      selectedAnswer = { min: rangeValues[0], max: rangeValues[1] };
      if (!selectedAnswer.min || !selectedAnswer.max) {
        setAlertMessage("Vă rugăm să setați un interval valid.");
        setShowAlert(true);
        return;
      }
    } else if (currentQuestion.type === "multiple") {
      selectedAnswer = selectedOptions[currentQuestion.id] || [];
      if (selectedAnswer.length === 0) {
        setAlertMessage("Vă rugăm să selectați cel puțin o opțiune.");
        setShowAlert(true);
        return;
      }
    } else {
      selectedAnswer = selectedOptions[currentQuestion.id];
      if (!selectedAnswer) {
        setAlertMessage("Vă rugăm să selectați o opțiune.");
        setShowAlert(true);
        return;
      }
    }

    if (!selectedAnswer) {
      setAlertMessage("Vă rugăm să selectați o opțiune.");
      setShowAlert(true);
      return; // Oprește execuția aici
    }

    const questionSetName = getQuestionSetName(currentQuestions);

    // Gestionare caz special pentru întrebarea cu id: 9 (cod poștal)
    if (currentQuestion.id === 9) {
      selectedAnswer = inputAnswers[currentQuestion.id]; // Obține valoarea introdusă
      const postalCode = selectedAnswer?.split(",")[0]?.trim();
      const city = selectedAnswer?.split(",")[1]?.trim();

      if (!postalCode || !city) {
        console.error("Codul poștal sau orașul sunt invalide.");
        return;
      }

      // Adaugă răspunsul formatat în answers
      setAnswers((prev) => ({
        ...prev,
        [questionSetName]: prev[questionSetName].map((q) =>
          q.id === currentQuestion.id
            ? { ...q, answer: `${city}, ${postalCode}` }
            : q
        ),
      }));
    }
    // Gestionare caz special pentru întrebările de consimțământ
    else if (currentQuestion.consentFor) {
      selectedAnswer = selectedOptions[currentQuestion.id];

      if (!selectedAnswer) {
        console.error("Nu s-a selectat nicio opțiune pentru consimțământ.");
        return;
      }

      const consentValue = selectedAnswer === "Oui"; // True dacă răspunsul este "Oui"

      // Actualizează întrebările din `consentFor` cu `consentValue`
      setAnswers((prev) => ({
        ...prev,
        [questionSetName]: prev[questionSetName].map((q) => {
          if (q.id === currentQuestion.id) {
            return { ...q, answer: selectedAnswer };
          } else if (currentQuestion.consentFor.includes(q.id)) {
            return { ...q, consentValue }; // Adaugă proprietatea `consentValue`
          }
          return q;
        }),
      }));
    }
    // Gestionare generală pentru alte întrebări
    else {
      if (currentQuestion.type === "input") {
        selectedAnswer = inputAnswers[currentQuestion.id];
      } else if (currentQuestion.type === "range") {
        selectedAnswer = { min: rangeValues[0], max: rangeValues[1] };
      } else {
        selectedAnswer = selectedOptions[currentQuestion.id];
      }

      if (!selectedAnswer) {
        console.error(
          "Nu s-a selectat niciun răspuns pentru întrebarea curentă."
        );
        return;
      }

      setAnswers((prev) => ({
        ...prev,
        [questionSetName]: prev[questionSetName].map((q) =>
          q.id === currentQuestion.id ? { ...q, answer: selectedAnswer } : q
        ),
      }));
    }

    // **Modificare aici pentru gestionarea `conditionalNext`**
    if (currentQuestion.conditionalNext) {
      const nextQuestionId = currentQuestion.conditionalNext[selectedAnswer];
      if (nextQuestionId) {
        const nextQuestionIndex = currentQuestions.findIndex(
          (q) => q.id === nextQuestionId
        );
        if (nextQuestionIndex !== -1) {
          setCurrentQuestionIndex(nextQuestionIndex);
          setProgress(
            ((nextQuestionIndex + 1) / currentQuestions.length) * 100
          );
          return; // Ieșim din funcție după gestionarea `conditionalNext`
        }
      }
    }

    // Gestionare trecere la întrebarea următoare
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < currentQuestions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setProgress(((nextQuestionIndex + 1) / currentQuestions.length) * 100);
    } else if (currentQuestions === firstQuestions) {
      // Gestionare tranziție la seturi de întrebări
      switch (selectedOptions[1]) {
        case "Je cherche un(e) partenaire de vie pour une relation sérieuse et stable.":
          setCurrentQuestions(questionsSet1);
          break;
        case "Je cherche des rencontres coquines en toute discrétion.":
          setCurrentQuestions(questionsSet2);
          break;
        case "Je cherche à élargir mon cercle d’amis.":
          setCurrentQuestions(questionsSet3);
          break;
        default:
          console.error("Răspuns necunoscut la întrebarea 1.");
          return;
      }

      setCurrentQuestionIndex(0);
      setShowProgressBar(true); // Activează progress bar-ul
      setProgress(0);
    } else {
      // Finalizare chestionar
      if (userData?.uid) {
        try {
          console.log("Salvez răspunsurile în Firestore...", answers);
          const userDocRef = doc(db, "Users", userData.uid);
          await updateDoc(userDocRef, { responses: answers });

          console.log("Răspunsurile au fost salvate cu succes!");
          setQuizFinished(true);
        } catch (error) {
          console.error("Eroare la salvarea răspunsurilor:", error);
        }
      } else {
        console.error("Utilizatorul nu este autentificat.");
      }
    }
  };

  const handleNextQuestion = () => {
    if (
      currentQuestions === firstQuestions &&
      currentQuestionIndex === currentQuestions.length - 1
    ) {
      switch (selectedOptions[1]) {
        case "Je cherche un(e) partenaire de vie pour une relation sérieuse et stable.":
          setCurrentQuestions(questionsSet1);
          break;
        case "Je cherche des rencontres coquines en toute discrétion.":
          setCurrentQuestions(questionsSet2);
          break;
        case "Je cherche à élargir mon cercle d’amis.":
          setCurrentQuestions(questionsSet3);
          break;
        default:
          console.error("Răspuns necunoscut la întrebarea 1");
          return;
      }
      setCurrentQuestionIndex(0);
      setProgress(0);
      return;
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < currentQuestions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);

      // Resetează selecțiile pentru următoarea întrebare
      setSelectedOptions((prev) => ({
        ...prev,
        [currentQuestions[nextQuestionIndex]?.id]: [], // Setează un array gol pentru următoarea întrebare
      }));

      setProgress(((nextQuestionIndex + 1) / currentQuestions.length) * 100);
    } else {
      if (userData?.uid) {
        saveResponsesToFirestore(userData.uid, answers);
      } else {
        console.error("Utilizatorul nu este autentificat");
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setProgress(
        ((currentQuestionIndex - 1 + 1) / currentQuestions.length) * 100
      );
    }
  };

  const handleValidatedAnswer = (validatedAnswer) => {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const questionSetName = getQuestionSetName(currentQuestions);

    // Gestionăm răspunsul pentru întrebarea cu id: 9
    if (currentQuestion.id === 9) {
      const postalCode = validatedAnswer?.split(",")[0]?.trim();
      const city = validatedAnswer?.split(",")[1]?.trim();

      if (!postalCode || !city) {
        console.error("Codul poștal sau orașul sunt invalide.");
        return;
      }

      // Formatăm răspunsul ca string: "city, postalCode"
      const formattedAnswer = `${city}, ${postalCode}`;

      // Adăugăm răspunsul formatat în answers
      setAnswers((prev) => ({
        ...prev,
        [questionSetName]: prev[questionSetName].map((q) =>
          q.id === currentQuestion.id ? { ...q, answer: formattedAnswer } : q
        ),
      }));

      handleNextQuestion(); // Trecem la următoarea întrebare
      return;
    }

    // Gestionăm cazurile generale
    setAnswers((prev) => ({
      ...prev,
      [questionSetName]: prev[questionSetName].map((q) =>
        q.id === currentQuestion.id ? { ...q, answer: validatedAnswer } : q
      ),
    }));

    handleNextQuestion(); // Trecem la următoarea întrebare
  };

  if (quizFinished) {
    return <FinishedQuizComp />;
  }

  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <>
      <div className="dashboard__main pl-0">
        <div className="dashboard__content bg-light-4">
          <div className="row pb-50 mb-10">
            <div className="col-auto">
              <h1 className="text-30 lh-12 fw-700">Chestionar</h1>
            </div>
          </div>

          <div className="row y-gap-30">
            <div className={showProgressBar ? "col-xl-9" : "col-xl-12"}>
              <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4">
                <div className="py-30 px-30">
                  <div className="border-light overflow-hidden rounded-8">
                    <div className="py-40 px-40 bg-dark-5">
                      <h4 className="text-18 lh-1 fw-500 text-white">
                        Întrebarea {currentQuestion.id}
                      </h4>
                      <div className="text-20 lh-1 text-white mt-15">
                        {currentQuestion.text}
                      </div>
                    </div>
                    <div className="px-40 py-40">
                      {currentQuestion.type === "input" &&
                      currentQuestion.id !== 9 ? (
                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <input
                              type="text"
                              placeholder={currentQuestion.placeholder}
                              value={inputAnswers[currentQuestion.id] || ""}
                              onChange={handleInputChange}
                              className="form-control custom-input"
                            />
                          </div>
                          <div className="d-flex justify-end">
                            {currentQuestionIndex != 0 && (
                              <button
                                type="button"
                                className="button -md -dark-1 text-white -dark-button-white mt-40 mr-10"
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                              >
                                Înapoi
                              </button>
                            )}
                            <button
                              type="submit"
                              className="button -md -dark-1 text-white -dark-button-white mt-40"
                            >
                              Următorul
                            </button>
                          </div>
                        </form>
                      ) : currentQuestion.type === "range" ? (
                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <Range
                              step={1}
                              min={currentQuestion.validation.min}
                              max={currentQuestion.validation.max}
                              values={rangeValues}
                              onChange={(values) => setRangeValues(values)}
                              renderTrack={({ props, children }) => (
                                <div
                                  {...props}
                                  className="range-track"
                                  style={{
                                    height: "6px",
                                    background: "#ddd",
                                    borderRadius: "3px",
                                  }}
                                >
                                  {children}
                                </div>
                              )}
                              renderThumb={({ props, value }) => (
                                <div
                                  {...props}
                                  className="range-thumb"
                                  style={{
                                    height: "20px",
                                    width: "20px",
                                    background: "#6c63ff",
                                    borderRadius: "50%",
                                    outline: "none",
                                  }}
                                >
                                  <div className="value-tooltip">{value}</div>
                                </div>
                              )}
                            />
                            <div className="range-labels">
                              <span>{rangeValues[0]}</span>
                              <span>{rangeValues[1]}</span>
                            </div>
                          </div>
                          <div className="d-flex justify-end">
                            {currentQuestionIndex != 0 && (
                              <button
                                type="button"
                                className="button -md -dark-1 text-white -dark-button-white mt-40 mr-10"
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                              >
                                Înapoi
                              </button>
                            )}
                            <button
                              type="submit"
                              className="button -md -dark-1 text-white -dark-button-white mt-40"
                            >
                              Următorul
                            </button>
                          </div>
                        </form>
                      ) : currentQuestion.id === 9 ? (
                        <QuestionWithApiValidation
                          question={currentQuestion}
                          onValidatedAnswer={handleValidatedAnswer}
                        />
                      ) : (
                        <form onSubmit={handleSubmit}>
                          {currentQuestion.options?.map((option, index) => (
                            <div
                              key={index}
                              className="form-radio d-flex items-center mt-20"
                            >
                              <div className="radio">
                                <input
                                  type={
                                    currentQuestion.type === "multiple"
                                      ? "checkbox"
                                      : "radio"
                                  }
                                  value={option}
                                  checked={
                                    currentQuestion.type === "multiple"
                                      ? selectedOptions[
                                          currentQuestion.id
                                        ]?.includes(option)
                                      : selectedOptions[currentQuestion.id] ===
                                        option
                                  }
                                  onChange={() => handleOptionChange(option)}
                                />
                                <div className="radio__mark">
                                  <div className="radio__icon"></div>
                                </div>
                              </div>
                              <div className="fw-500 ml-12">{option}</div>
                            </div>
                          ))}
                          <div className="d-flex justify-end">
                            {currentQuestionIndex != 0 && (
                              <button
                                type="button"
                                className="button -md -dark-1 text-white -dark-button-white mt-40 mr-10"
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                              >
                                Înapoi
                              </button>
                            )}
                            <button
                              type="submit"
                              className="button -md -dark-1 text-white -dark-button-white mt-40"
                            >
                              Următorul
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-between items-center mt-40"></div>
              </div>
            </div>

            {showProgressBar && (
              <div className="col-xl-3 col-lg-3">
                <div className="row y-gap-30">
                  <div className="col-12">
                    <div className="pt-20 pb-30 px-30 rounded-16 bg-white -dark-bg-dark-1 shadow-4">
                      <h5 className="text-17 fw-500 mb-30">
                        Progres chestionar
                      </h5>
                      <div className="d-flex items-center">
                        <div className="progress-bar w-1/1">
                          <div className="progress-bar__bg bg-light-3"></div>
                          <div
                            className="progress-bar__bar bg-purple-1"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="d-flex y-gap-10 justify-between items-center ml-15">
                          <div>{progress.toFixed(0)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <FooterNine />
      </div>
      {showAlert && (
        <AlertBox
          type="danger"
          message={alertMessage}
          showAlert={showAlert}
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
}
