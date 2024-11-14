import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { questions } from "@/data/quiz";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export default function ListCompatibilitati({
  data,
  translatedTexts,
  userUid,
}) {
  const router = useRouter();
  const [isCompatible, setIsCompatible] = useState(false); // Starea pentru compatibilitate

  useEffect(() => {
    const checkCompatibility = async () => {
      try {
        const compatibilitatiRef = collection(
          db,
          "Users",
          userUid,
          "Compatibilitati"
        );
        const q = query(
          compatibilitatiRef,
          where("compatibleUserId", "==", data.id)
        );
        const querySnapshot = await getDocs(q);
        setIsCompatible(!querySnapshot.empty); // Setează `isCompatible` pe baza rezultatului
      } catch (error) {
        console.error("Error checking compatibility:", error);
      }
    };

    checkCompatibility();
  }, [data.id, userUid]);

  const handleCardClick = () => {
    router.push(`/informatii-utilizator?uid=${data.id}`);
  };

  const handleToggleCompatibility = async () => {
    try {
      const compatibilitatiRefUser1 = collection(
        db,
        "Users",
        userUid,
        "Compatibilitati"
      );
      const compatibilitatiRefUser2 = collection(
        db,
        "Users",
        data.id,
        "Compatibilitati"
      );

      if (isCompatible) {
        // Găsește și șterge documentul de compatibilitate la ambii utilizatori
        const q1 = query(
          compatibilitatiRefUser1,
          where("compatibleUserId", "==", data.id)
        );
        const querySnapshot1 = await getDocs(q1);
        querySnapshot1.forEach(async (docSnapshot) => {
          await deleteDoc(docSnapshot.ref);
        });

        const q2 = query(
          compatibilitatiRefUser2,
          where("compatibleUserId", "==", userUid)
        );
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach(async (docSnapshot) => {
          await deleteDoc(docSnapshot.ref);
        });

        setIsCompatible(false);
      } else {
        // Adaugă document nou în subcolecția ambilor utilizatori și actualizează `documentId`
        const docRefUser1 = await addDoc(compatibilitatiRefUser1, {
          compatibleUserId: data.id,
          markedAt: new Date(),
        });
        await updateDoc(docRefUser1, { documentId: docRefUser1.id });

        const docRefUser2 = await addDoc(compatibilitatiRefUser2, {
          compatibleUserId: userUid,
          markedAt: new Date(),
        });
        await updateDoc(docRefUser2, { documentId: docRefUser2.id });

        setIsCompatible(true);
      }
    } catch (error) {
      console.error("Error toggling compatibility:", error);
    }
  };

  // Stiluri pentru PDF
  const styles = StyleSheet.create({
    page: {
      padding: 30,
    },
    title: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: "center",
      color: "#003366",
    },
    question: {
      fontSize: 12,
      marginBottom: 5,
      color: "#333333",
    },
    answer: {
      fontSize: 10,
      marginBottom: 15,
      color: "#666666",
    },
  });

  // Document PDF generat local
  const PDFDocument = (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>
          Rezultatele Chestionărului pentru {data?.username}
        </Text>
        {questions &&
          questions.map((question, index) => (
            <View key={question.id}>
              <Text style={styles.question}>
                {index + 1}. {question.text || "Întrebare indisponibilă"}
              </Text>
              <Text style={styles.answer}>
                Răspunsul utilizatorului:{" "}
                {data?.responses?.[question.id] || "N/A"}
              </Text>
            </View>
          ))}
      </Page>
    </Document>
  );

  return (
    <tr>
      <td>{data.username}</td>
      <td>{data.gender ? data.gender : "N/A"}</td>
      <td>{data.isActivated ? "Cont activ" : "Cont inactiv"}</td>
      <td>28%</td>
      <td style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="btn custom-btn-compatibilitati"
        >
          Vezi detalii
        </button>

        <PDFDownloadLink
          document={PDFDocument}
          fileName={`Rezultate_Chestionar_${data.username}.pdf`}
        >
          {({ loading }) => (
            <button
              onClick={(e) => e.stopPropagation()}
              className="btn custom-btn-compatibilitati"
            >
              {loading ? "Generare PDF..." : "Descarcă PDF"}
            </button>
          )}
        </PDFDownloadLink>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleCompatibility();
          }}
          className="btn custom-btn-compatibilitati"
        >
          {isCompatible ? "Elimină compatibilitate" : "Marchează compatibil"}
        </button>
      </td>
    </tr>
  );
}
