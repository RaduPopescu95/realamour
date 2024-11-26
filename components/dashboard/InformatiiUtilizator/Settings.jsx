"use client";

import React, { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import Password from "./Password";
import SocialProfiles from "./SocialProfiles";
import CloseAccount from "./CloseAccount";
import FooterNine from "@/components/layout/footers/FooterNine";
import Notification from "./Notifications";
import Pagination from "@/components/common/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";
import { db } from "@/firebase";
import ListCompatibilitati from "../DashBoardCards/ListaCompatibilitatiComp";

const buttons = [
  "Edit Profile",
  "Password",
  "Social Profiles",
  "Notifications",
  "Close Account",
];

export default function Settings({ translatedTexts }) {
  const [users, setUsers] = useState([]);
  const [currentUserResponses, setCurrentUserResponses] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid"); // UID-ul utilizatorului curent

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Obține datele utilizatorului curent
        const currentUserDoc = await getDoc(doc(db, "Users", uid));
        if (currentUserDoc.exists()) {
          setCurrentUserResponses(currentUserDoc.data().responses || {});
        }

        // Obține lista altor utilizatori
        const usersCollection = collection(db, "Users");
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.id !== uid && user.responses); // Exclude utilizatorul curent și utilizatorii fără `responses`

        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error("Error fetching users or current user:", error);
      }
    };

    fetchUsers();
  }, [uid]);

  // Filtrare utilizatori pe baza termenului de căutare
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Calculează utilizatorii care trebuie afișați pe pagina curentă
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Funcție de schimbare a paginii
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Funcție pentru calcularea compatibilității
  // Funcție pentru calcularea compatibilității
  const calculateCompatibility = (userResponses) => {
    const currentResponses = currentUserResponses || {};

    // Găsește întrebările comune între utilizatorul curent și cel comparat
    const questionSets = [
      "firstQuestions",
      "questionsSet1",
      "questionsSet2",
      "questionsSet3",
    ];
    let commonQuestions = [];

    questionSets.forEach((set) => {
      const currentSet = currentResponses[set] || [];
      const userSet = userResponses[set] || [];

      currentSet.forEach((currentQuestion) => {
        const matchedQuestion = userSet.find(
          (q) => q.id === currentQuestion.id
        );

        if (matchedQuestion && currentQuestion.compatibility) {
          // Adaugă doar întrebările cu proprietatea `compatibility: true`
          commonQuestions.push({
            currentQuestion,
            matchedQuestion,
          });
        }
      });
    });

    // Dacă nu există întrebări compatibile, scorul este 0%
    if (commonQuestions.length === 0) {
      return 0;
    }

    // Verifică dacă toate întrebările `matchRequired` au răspunsuri identice
    const allMatchRequiredAreMatching = commonQuestions.every(
      ({ currentQuestion, matchedQuestion }) => {
        if (currentQuestion.matchRequired) {
          return (
            currentQuestion.answer &&
            matchedQuestion.answer &&
            JSON.stringify(currentQuestion.answer) ===
              JSON.stringify(matchedQuestion.answer)
          );
        }
        return true; // Dacă `matchRequired` nu este setat, continuă
      }
    );

    if (!allMatchRequiredAreMatching) {
      return 0; // Dacă vreuna dintre întrebările `matchRequired` nu se potrivesc, scorul este 0%
    }

    // Calculează scorul pe baza întrebărilor `compatibility`
    const matchingAnswers = commonQuestions.filter(
      ({ currentQuestion, matchedQuestion }) => {
        return (
          currentQuestion.answer &&
          matchedQuestion.answer &&
          JSON.stringify(currentQuestion.answer) ===
            JSON.stringify(matchedQuestion.answer)
        );
      }
    ).length;

    const compatibilityScore = Math.round(
      (matchingAnswers / commonQuestions.length) * 100
    );
    return compatibilityScore;
  };

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row y-gap-30">
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="tabs -active-purple-2 js-tabs pt-0">
                {/* Tabs Controls */}
                <div className="tabs__controls d-flex x-gap-30 y-gap-20 flex-wrap items-center pt-20 px-30 border-bottom-light">
                  {buttons.map((elm, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i + 1)}
                      className={`tabs__button text-light-1 ${
                        activeTab == i + 1 ? "is-active" : ""
                      } `}
                      type="button"
                    >
                      {elm}
                    </button>
                  ))}
                </div>

                {/* Content Tabs */}
                <div className="tabs__content py-30 px-30 js-tabs-content">
                  {activeTab === 1 && (
                    <EditProfile
                      activeTab={activeTab}
                      translatedTexts={translatedTexts}
                    />
                  )}
                  {activeTab === 2 && <Password />}
                  {activeTab === 3 && <SocialProfiles />}
                  {activeTab === 4 && <Notification />}
                  {activeTab === 5 && <CloseAccount />}
                </div>

                {/* Lista Compatibilități */}
                <div className="tabs__content py-30 px-30 js-tabs-content mt-5">
                  <div className="tabs__pane -tab-item-1 is-active">
                    <div className="row y-gap-30 pt-30">
                      <div className="col-12">
                        <h2 className="text-black">
                          <i className="icon-person-2 text-40 mr-10"></i>
                          Lista Compatibilități
                        </h2>
                      </div>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Nume</th>
                            <th>Gen</th>
                            <th>Status</th>
                            <th>Compatibilitate</th>
                            <th>Acțiuni</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers
                            .filter((user) => user.responses) // Filtrează utilizatorii care au `responses`
                            .map((user) => ({
                              ...user,
                              compatibility: calculateCompatibility(
                                user.responses
                              ),
                            }))
                            .sort((a, b) => b.compatibility - a.compatibility) // Sortează descrescător după compatibilitate
                            .map((user) => (
                              <ListCompatibilitati
                                data={user}
                                key={user.id}
                                compatibility={user.compatibility}
                                translatedTexts={translatedTexts}
                                userUid={uid}
                              />
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="row justify-center pt-30">
                      <div className="col-auto">
                        <Pagination
                          usersPerPage={usersPerPage}
                          totalUsers={filteredUsers.length}
                          paginate={paginate}
                          currentPage={currentPage}
                        />
                      </div>
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
