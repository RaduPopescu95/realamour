"use client";

import React, { useState } from "react";
import FooterNine from "../layout/footers/FooterNine";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import FinishedQuizComp from "../common/FinishQuizComp";
import { useAuth } from "@/context/AuthContext";
import { questions } from "@/data/quiz";

export default function QuizClient() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [progress, setProgress] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const { currentUser, userData } = useAuth();

  const saveResponsesToFirestore = async (userId, responses) => {
    try {
      const userDocRef = doc(db, "Users", userId);
      await updateDoc(userDocRef, { responses });
      console.log("Răspunsurile au fost adăugate cu succes!");
      setQuizFinished(true); // setează quiz-ul ca fiind finalizat doar după salvarea cu succes
    } catch (error) {
      console.error("Eroare la salvarea răspunsurilor:", error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionChange = (option) => {
    if (currentQuestion.type === "multiple") {
      setSelectedOptions((prev) => {
        const options = prev[currentQuestion.id] || [];
        if (options.includes(option)) {
          return {
            ...prev,
            [currentQuestion.id]: options.filter((o) => o !== option),
          };
        } else {
          return { ...prev, [currentQuestion.id]: [...options, option] };
        }
      });
    } else {
      setSelectedOptions((prev) => ({
        ...prev,
        [currentQuestion.id]: option,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedAnswer = selectedOptions[currentQuestion.id];

    let nextQuestionId;
    if (currentQuestion.type === "multiple") {
      nextQuestionId = currentQuestion.next.default;
    } else {
      nextQuestionId =
        currentQuestion.next[selectedAnswer] || currentQuestion.next.default;
    }

    const nextQuestionIndex = questions.findIndex(
      (q) => q.id === nextQuestionId
    );

    if (nextQuestionIndex !== -1) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setProgress(((nextQuestionIndex + 1) / questions.length) * 100);
    } else {
      console.log("Chestionar finalizat");
      if (userData?.uid) {
        await saveResponsesToFirestore(userData.uid, selectedOptions);
      } else {
        console.error("Utilizatorul nu este autentificat");
      }
    }
  };

  // Afișează `FinishedQuizComp` dacă chestionarul este finalizat
  if (quizFinished) {
    return <FinishedQuizComp />;
  }

  return (
    <div className="dashboard__main pl-0">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">Chestionar</h1>
          </div>
        </div>

        <div className="row y-gap-30">
          <div className="col-xl-9">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4">
              <div className="py-30 px-30">
                <div className="border-light overflow-hidden rounded-8">
                  <div className="py-40 px-40 bg-dark-5">
                    {/* <h4 className="text-18 lh-1 fw-500 text-white">
                      Întrebarea {currentQuestion.id}
                    </h4> */}
                    <div className="text-20 lh-1 text-white mt-15">
                      {currentQuestion.text}
                    </div>
                  </div>
                  <div className="px-40 py-40">
                    <form onSubmit={handleSubmit}>
                      {currentQuestion.options.map((option, index) => (
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
                        <button
                          type="submit"
                          className="button -md -dark-1 text-white -dark-button-white mt-40"
                        >
                          Următorul
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-between items-center mt-40"></div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3">
            <div className="row y-gap-30">
              <div className="col-12">
                <div className="pt-20 pb-30 px-30 rounded-16 bg-white -dark-bg-dark-1 shadow-4">
                  <h5 className="text-17 fw-500 mb-30">Progres chestionar</h5>
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
        </div>
      </div>

      <FooterNine />
    </div>
  );
}
