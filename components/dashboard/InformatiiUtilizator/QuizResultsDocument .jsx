import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  firstQuestions,
  questionsSet1,
  questionsSet2,
  questionsSet3,
} from "@/data/quiz";

// Définit les styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#003366",
  },
  section: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
    color: "#003366",
  },
  question: {
    fontSize: 12,
    marginBottom: 5,
    color: "#333333",
  },
  answer: {
    fontSize: 11,
    marginBottom: 15,
    color: "#666666",
  },
  option: {
    fontSize: 10,
    marginLeft: 10,
    color: "#555555",
  },
});

// Composant PDF
export const QuizResultsDocument = ({ userData }) => {
  // Combine les questions et les réponses pour chaque section
  const allSections = [
    {
      sectionName: "Premières Questions",
      sectionNameAlt: "Premières Questions",
      questions: firstQuestions,
      responses: userData?.responses?.firstQuestions || [],
    },
    {
      sectionName: "Questions Ensemble 1",
      sectionNameAlt: "Amor",
      questions: questionsSet1,
      responses: userData?.responses?.questionsSet1 || [],
    },
    {
      sectionName: "Questions Ensemble 2",
      sectionNameAlt: "Sexe",
      questions: questionsSet2,
      responses: userData?.responses?.questionsSet2 || [],
    },
    {
      sectionName: "Questions Ensemble 3",
      sectionNameAlt: "Amitie",
      questions: questionsSet3,
      responses: userData?.responses?.questionsSet3 || [],
    },
  ];

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>
          Résultats du Questionnaire pour {userData?.username || "Utilisateur"}
        </Text>

        {allSections
          .filter(
            ({ responses }) =>
              responses.some((response) => response?.answer !== undefined) // Conserve uniquement les sections avec des réponses
          )
          .map(({ sectionName, sectionNameAlt, questions, responses }) => (
            <View key={sectionNameAlt}>
              <Text style={styles.section}>{sectionNameAlt}</Text>

              {questions.map((question) => {
                // Trouve la réponse de l'utilisateur pour la question actuelle
                const userAnswer = responses.find(
                  (response) => response.id === question.id
                );

                return (
                  <View key={question.id}>
                    <Text style={styles.question}>
                      {question.id}. {question.text}{" "}
                      {question.compatibility
                        ? "(L'algorithme de correspondance prend en compte cette question)"
                        : ""}
                    </Text>

                    {/* Affiche les options de la question */}
                    {question.options &&
                      question.options.map((option, index) => (
                        <Text key={index} style={styles.option}>
                          - {option}
                        </Text>
                      ))}

                    {/* Affiche la réponse de l'utilisateur */}
                    <Text style={styles.answer}>
                      Réponse de l'utilisateur :{" "}
                      {userAnswer?.answer !== undefined
                        ? Array.isArray(userAnswer.answer)
                          ? userAnswer.answer.join(", ")
                          : typeof userAnswer.answer === "string"
                          ? userAnswer.answer
                          : "N/A"
                        : "N/A"}
                      {userAnswer?.consentValue !== undefined
                        ? ` (Consentement : ${
                            userAnswer.consentValue ? "Oui" : "Non"
                          })`
                        : ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
      </Page>
    </Document>
  );
};
