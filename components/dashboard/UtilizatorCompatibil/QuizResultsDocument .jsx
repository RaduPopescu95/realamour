import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { questions } from "@/data/quiz";

// Definește stilurile pentru PDF
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

// Componenta PDF
export const QuizResultsDocument = ({ userData }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>
        Rezultatele Chestionărului pentru {userData?.username}
      </Text>
      {questions &&
        questions.map((question, index) => (
          <View key={question.id}>
            <Text style={styles.question}>
              {index + 1}. {question.text || "Întrebare indisponibilă"}
            </Text>
            <Text style={styles.answer}>
              Răspunsul utilizatorului:{" "}
              {userData?.responses[question.id] || "N/A"}
            </Text>
          </View>
        ))}
    </Page>
  </Document>
);
