const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Inițializează Firebase Admin SDK
admin.initializeApp();

// Configurații pentru Nodemailer cu contul de email de pe cPanel
const transporter = nodemailer.createTransport({
  host: "mail.real-amor.com",
  port: 465,
  secure: true,
  auth: {
    user: "office@real-amor.com",
    pass: "realamoradm2024",
  },
});

// Funcție pentru a trimite un email de bun venit
exports.sendWelcomeEmail = functions.firestore
    .document("Users/{userId}")
    .onCreate((snap, context) => {
      const newUser = snap.data();

      const email = newUser.email;
      const username = newUser.username;
      const targetLanguage = newUser.targetLanguage || "fr";

      // Mesaje de bun venit în funcție de limbă
      let emailMessage = "";
      let emailSubject = "";

      if (targetLanguage === "nl") {
      // Mesaj în olandeză
        emailMessage =
        `Hallo ${username},\n\n` +
        `Welkom bij Real Amor!\n\n` +
        `We zijn blij dat je bij ons bent.\n` +
        `Je kunt nu mensen ontdekken die jouw interesses delen` +
        `en jouw perfecte match vinden.\n\n` +
        `Als je vragen hebt, neem dan gerust contact met ons op.\n\n` +
        `Vriendelijke groeten,\n` +
        `Het Real Amor Team`;

        emailSubject = "Welkom bij Real Amor!";
      } else {
      // Mesaj în franceză
        emailMessage =
        `Bonjour ${username},\n\n` +
        `Nous vous souhaitons la bienvenue sur Real Amor !\n\n` +
        `Nous sommes ravis de vous avoir parmi nous.\n` +
        `Vous pouvez maintenant découvrir des personnes partageant vos ` +
        `centres d'intérêt et trouver votre compatibilité parfaite.\n\n` +
        `Si vous avez des questions, n'hésitez pas à nous contacter.\n\n` +
        `Cordialement,\n` +
        `L'équipe Real Amor`;

        emailSubject = "Bienvenue sur Real Amor!";
      }

      // Configurarea opțiunilor de email
      const mailOptions = {
        from: "office@real-amor.com", // Adresa de email de pe cPanel
        to: email, // Emailul utilizatorului
        subject: emailSubject,
        text: emailMessage,
      };

      console.log("Trimiterea emailului de bun venit către:", email);

      // Trimiterea emailului
      return transporter
          .sendMail(mailOptions)
          .then(() => {
            console.log("Email de bun venit trimis cu succes:", email);
          })
          .catch((error) => {
            console.error("Eroare la trimiterea emailului:", error);
          });
    });
