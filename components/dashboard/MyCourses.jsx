"use client";

import React, { useEffect, useState } from "react";
import { authentication, db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import CoursesCardDashboard from "./DashBoardCards/CoursesCardDashboard";
import Pagination from "../common/Pagination";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function MyCourses({ translatedTexts }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Numărul de utilizatori pe pagină
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const authenticated = authentication;
    onAuthStateChanged(authenticated, (user) => {
      if (user && user.uid === "oQzVdA6ORHc3XNZFeLhB6Asnb7a2") {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("is user.......");

        // ...
      } else {
        console.log("is user......no.");
        router.push("/login-admin");

        // User is signed out
        // ...
      }
    });
  }, []);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "Users");
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Multiplicăm utilizatorii pentru a avea mai multe elemente de afișat
        // const repeatedUsersList = Array(325).fill(usersList).flat();

        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  // Filtrează utilizatorii pe baza termenului de căutare
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Resetare la pagina 1 când se schimbă căutarea
  }, [searchTerm, users]);

  // Calculează utilizatorii care trebuie afișați pe pagina curentă
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Funcție de schimbare a paginii
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">
              {translatedTexts.listaUtilizatoriText}
            </h1>
          </div>
          <div className="col-auto">
            <input
              type="text"
              placeholder={translatedTexts.searchText}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input" // aplică clasa CSS personalizată
            />
          </div>
        </div>

        <div className="row y-gap-30 pt-30">
          {currentUsers.map((user) => (
            <CoursesCardDashboard data={user} key={user.id} />
          ))}
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
  );
}
