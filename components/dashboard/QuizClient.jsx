"use client";
import React, { useState } from "react";
import FooterNine from "../layout/footers/FooterNine";

export default function QuizClient() {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Răspuns selectat:", selectedOption);
    // Poți adăuga logica pentru a trimite răspunsul către backend sau pentru a trece la următoarea întrebare.
  };

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
              <div className="d-flex items-center py-20 px-30 border-bottom-light">
                <h2 className="text-17 lh-1 fw-500">Chestionar</h2>
              </div>

              <div className="py-30 px-30">
                <div className="border-light overflow-hidden rounded-8">
                  <div className="py-40 px-40 bg-dark-5">
                    <div className="d-flex justify-between">
                      <h4 className="text-18 lh-1 fw-500 text-white">
                        Întrebarea 1
                      </h4>
                    </div>

                    <div className="text-20 lh-1 text-white mt-15">
                      Ce apreciezi cel mai mult într-o relație?
                    </div>
                  </div>

                  <div className="px-40 py-40">
                    <form onSubmit={handleSubmit}>
                      <div className="form-radio d-flex items-center">
                        <div className="radio">
                          <input
                            type="radio"
                            value="Încrederea"
                            checked={selectedOption === "Încrederea"}
                            onChange={handleOptionChange}
                          />
                          <div className="radio__mark">
                            <div className="radio__icon"></div>
                          </div>
                        </div>
                        <div className="fw-500 ml-12">Încrederea</div>
                      </div>

                      <div className="form-radio d-flex items-center mt-20">
                        <div className="radio">
                          <input
                            type="radio"
                            value="Comunicarea"
                            checked={selectedOption === "Comunicarea"}
                            onChange={handleOptionChange}
                          />
                          <div className="radio__mark">
                            <div className="radio__icon"></div>
                          </div>
                        </div>
                        <div className="fw-500 ml-12">Comunicarea</div>
                      </div>

                      <div className="form-radio d-flex items-center mt-20">
                        <div className="radio">
                          <input
                            type="radio"
                            value="Respectul reciproc"
                            checked={selectedOption === "Respectul reciproc"}
                            onChange={handleOptionChange}
                          />
                          <div className="radio__mark">
                            <div className="radio__icon"></div>
                          </div>
                        </div>
                        <div className="fw-500 ml-12">Respectul reciproc</div>
                      </div>

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

              <div className="d-flex justify-between items-center mt-40">
                {/* Poți adăuga alte componente sau elemente aici */}
              </div>
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
                      <div className="progress-bar__bar bg-purple-1 w-1/4"></div>
                    </div>

                    <div className="d-flex y-gap-10 justify-between items-center ml-15">
                      <div>25%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Poți adăuga alte componente legate de progres sau navigare aici */}
            </div>
          </div>
        </div>
      </div>

      <FooterNine />
    </div>
  );
}
