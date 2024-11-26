"use client";

import React, { useEffect, useRef, useState } from "react";
import FooterNine from "../layout/footers/FooterNine";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  onSnapshot,
  where,
} from "firebase/firestore";
import { query } from "firebase/database";

export default function Message() {
  const { userData } = useAuth();
  const [compatibleUsers, setCompatibleUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unseenMessages, setUnseenMessages] = useState({});

  // Referință pentru containerul de mesaje
  const messagesEndRef = useRef(null);

  // Funcție pentru scroll la ultimul mesaj
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch compatible users and count unseen messages
  useEffect(() => {
    const fetchCompatibleUsers = async () => {
      if (!userData?.uid) return;
      try {
        const compatibilitatiRef = collection(
          db,
          "Users",
          userData?.uid,
          "Compatibilitati"
        );
        const compatibilitatiSnapshot = await getDocs(compatibilitatiRef);

        const compatibleUserIds = compatibilitatiSnapshot.docs.map(
          (doc) => doc.data().compatibleUserId
        );

        const unseenMessagesCount = {}; // Obiect pentru stocarea mesajelor necitite

        const usersData = await Promise.all(
          compatibleUserIds.map(async (userId) => {
            const userDocRef = doc(db, "Users", userId);
            const userSnapshot = await getDoc(userDocRef);
            const userData = { id: userSnapshot.id, ...userSnapshot.data() };

            // Numără mesajele necitite pentru fiecare utilizator
            const messagesQuery = query(
              collection(db, "Chats", `${userId}-${userData?.uid}`, "Messages"),
              where("seen", "==", false),
              where("receiverId", "==", userData?.uid) // Numără doar mesajele primite necitite
            );
            const messagesSnapshot = await getDocs(messagesQuery);
            unseenMessagesCount[userId] = messagesSnapshot.size; // Salvează numărul mesajelor necitite

            const mainImage =
              userData?.images?.find((image) => image.isMain)?.fileUri ||
              userData?.images?.[0]?.fileUri ||
              "/default-avatar.png";
            return { ...userData, mainImage };
          })
        );

        setCompatibleUsers(usersData);
        setUnseenMessages(unseenMessagesCount); // Actualizează starea cu mesajele necitite

        // Selectează automat primul utilizator din listă
        if (usersData.length > 0) {
          setSelectedUser(usersData[0]);
        }
      } catch (error) {
        console.error("Error fetching compatible users:", error);
      }
    };

    fetchCompatibleUsers();
  }, [userData?.uid]);

  // Scroll la ultimul mesaj atunci când lista de mesaje se schimbă
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time listener for messages between user and selected user
  useEffect(() => {
    if (!selectedUser) return;

    const chatRef = collection(
      db,
      "Chats",
      `${userData?.uid}-${selectedUser.id}`,
      "Messages"
    );

    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      const fetchedMessages = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.timestamp?.toDate() - b.timestamp?.toDate());

      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [selectedUser, userData?.uid]);

  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      senderId: userData?.uid,
      receiverId: selectedUser.id,
      content: newMessage,
      timestamp: new Date(),
      seen: false,
    };

    await addDoc(
      collection(
        db,
        "Chats",
        `${userData?.uid}-${selectedUser.id}`,
        "Messages"
      ),
      messageData
    );
    await addDoc(
      collection(
        db,
        "Chats",
        `${selectedUser.id}-${userData?.uid}`,
        "Messages"
      ),
      messageData
    );

    setNewMessage("");
  };

  // Handle sending message on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      // Adaugă un nou rând
      setNewMessage((prev) => prev + "\n");
    } else if (e.key === "Enter") {
      // Trimite mesajul
      e.preventDefault(); // Previne adăugarea unui nou rând în textarea
      handleSendMessage();
    }
  };

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">Messages</h1>
          </div>
        </div>

        <div className="row y-gap-30">
          <div className="col-xl-4">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="d-flex items-center py-20 px-30 border-bottom-light">
                <h2 className="text-17 lh-1 fw-500">Chats</h2>
              </div>

              <div className="py-30 px-30">
                <div className="y-gap-30">
                  {compatibleUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`d-flex justify-between cursor-pointer ${
                        selectedUser?.id === user.id ? "bg-light-5" : ""
                      }`}
                    >
                      <div className="d-flex items-center">
                        <div className="shrink-0">
                          <Image
                            width={50}
                            height={50}
                            src={user.mainImage || "/default-avatar.png"}
                            alt="image"
                            className="size-50"
                          />
                        </div>
                        <div className="ml-10">
                          <div className="lh-11 fw-500 text-dark-1">
                            {user.username}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex items-end flex-column pt-8">
                        {unseenMessages[user.id] > 0 && (
                          <div className="d-flex justify-center items-center size-20 bg-green-5 rounded-full mt-8">
                            <span className="text-11 lh-1 text-white fw-500">
                              {unseenMessages[user.id]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-8">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="d-flex items-center justify-between py-20 px-30 border-bottom-light">
                <div className="d-flex items-center">
                  <div className="shrink-0">
                    <Image
                      width={50}
                      height={50}
                      src={selectedUser?.mainImage || "/default-avatar.png"}
                      alt="image"
                      className="size-50"
                    />
                  </div>
                  <div className="ml-10">
                    <div className="lh-11 fw-500 text-dark-1">
                      {selectedUser ? selectedUser.username : "Select a user"}
                    </div>
                    <div className="text-14 lh-11 mt-5">Active</div>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-14 lh-11 fw-500 text-orange-1 underline"
                >
                  Delete Conversation
                </a>
              </div>

              {/* Container with fixed height and scroll for messages */}
              <div
                className="messages-container py-40 px-40"
                style={{ height: "400px", overflowY: "auto" }}
              >
                <div className="row y-gap-20">
                  {messages.map((msg) => (
                    <div
                      key={msg?.id}
                      className={`col-xl-7 col-lg-10 ${
                        msg?.senderId === userData?.uid
                          ? "offset-xl-5 offset-lg-2 text-right"
                          : ""
                      }`}
                    >
                      <div
                        className={`d-flex items-center ${
                          msg?.senderId === userData?.uid ? "justify-end" : ""
                        }`}
                      >
                        {msg?.senderId !== userData?.uid && (
                          <div className="shrink-0">
                            <Image
                              width={50}
                              height={50}
                              src={
                                selectedUser?.mainImage || "/default-avatar.png"
                              }
                              alt="image"
                              className="size-50"
                            />
                          </div>
                        )}
                        <div className="lh-11 fw-500 text-dark-1 ml-10">
                          {msg?.senderId === userData?.uid
                            ? "You"
                            : selectedUser?.username}
                        </div>
                        <div className="text-14 lh-11 ml-10">
                          {msg?.timestamp instanceof Date
                            ? msg?.timestamp.toLocaleTimeString()
                            : msg?.timestamp?.toDate().toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="d-inline-block mt-15">
                        <div
                          className={`py-20 px-30 rounded-8 message-content ${
                            msg?.senderId === userData?.uid
                              ? "bg-light-7 -dark-bg-dark-2 text-purple-1 text-right"
                              : "bg-light-3"
                          }`}
                          style={{
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                          }}
                        >
                          {msg?.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Adaugăm un div pentru a face scroll automat */}
                  <div ref={messagesEndRef}></div>
                </div>
              </div>

              <div className="py-25 px-40 border-top-light">
                <div className="row y-gap-10 justify-between">
                  <div className="col-lg-7">
                    <textarea
                      required
                      className="-dark-bg-dark-1 py-20 w-1/1"
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a Message"
                      onKeyDown={handleKeyDown} // Trigger on Enter
                      style={{
                        resize: "none", // Dezactivează redimensionarea manuală
                        maxHeight: "100px", // Înălțime fixă
                        width: "100%", // Lățime fixă sau proporțională
                        boxSizing: "border-box", // Include padding în dimensiuni
                        border: "1px solid #ccc", // Linie de contur
                        padding: "10px", // Spațiu interior
                        overflowY: "auto", // Scroll vertical dacă textul depășește înălțimea
                      }}
                    />
                  </div>
                  <div className="col-auto">
                    <button
                      onClick={handleSendMessage}
                      className="button -md -purple-1 text-white shrink-0"
                    >
                      Send Message
                    </button>
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
