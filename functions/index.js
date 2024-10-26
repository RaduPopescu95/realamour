const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Inițializează Firebase Admin SDK
admin.initializeApp();

// Configurații pentru Nodemailer (folosește un cont de Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "webdynamicx@gmail.com", // Înlocuiește cu emailul tău
    pass: "nnbf ezyh jgnx hlxv", // Înlocuiește cu parola generată de aplicație
  },
});

// Funcție pentru a trimite un email
exports.sendWelcomeEmail = functions.firestore
  .document("Users/{userId}")
  .onCreate((snap, context) => {
    const newUser = snap.data();

    const email = newUser.email;
    const username = newUser.username;

    // Mesajul emailului de bun venit în franceză
    const emailMessage =
      `Bonjour ${username},\n\n` +
      `Nous vous souhaitons la bienvenue sur Real Amor !\n\n` +
      `Nous sommes ravis de vous avoir parmi nous.\n` +
      `Vous pouvez maintenant découvrir des personnes partageant vos ` +
      `centres d'intérêt et trouver votre compatibilité parfaite.\n\n` +
      `Si vous avez des questions, n'hésitez pas à nous contacter.\n\n` +
      `Cordialement,\n` +
      `L'équipe Real Amor`;

    // Configurarea opțiunilor de email
    const mailOptions = {
      from: "webdynamicx@gmail.com", // Emailul tău
      to: email, // Emailul utilizatorului
      subject: "Bienvenue sur Real Amor!",
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
