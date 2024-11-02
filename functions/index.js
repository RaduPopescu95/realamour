const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const Stripe = require("stripe");
const stripe = new Stripe(functions.config().stripe.test_secret_key);

// Funcție care rulează la fiecare 5 minute

// Inițializează Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

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

// Funcția periodică pentru actualizarea abonamentelor utilizatorilor
exports.updateUserSubscriptions = functions.pubsub
    .schedule("*/5 * * * *")
    .onRun(async (context) => {
      try {
        const usersSnapshot = await db.collection("Users").get();

        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const subscriptionId = userData.subscriptionId;

          if (!subscriptionId) continue;

          // Preia datele abonamentului din Stripe
          const subscription = await stripe.subscriptions.retrieve(
              subscriptionId,
          );
          const endDateInMillis = subscription.current_period_end * 1000;
          const subscriptionEndDate = new Date(endDateInMillis);

          const cancelAtEnd = subscription.cancel_at_period_end;
          const subscriptionStatus =
          subscription.status === "active" && cancelAtEnd ?
            "canceledUntilEnd" :
            subscription.status === "active" ?
            "active" :
            subscription.status === "canceled" &&
              !subscription.current_period_end ?
            "expired" :
            subscription.status === "incomplete" ||
              subscription.status === "incomplete_expired" ?
            "paymentFailed" :
            "canceledImmediately";

          const updates = {
            subscriptionActive: subscriptionStatus === "active",
            subscriptionStatus: subscriptionStatus,
            subscriptionEndDate: subscriptionEndDate,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          };

          if (
            subscriptionStatus === "active" &&
          userData.subscriptionStatus !== "active"
          ) {
            updates.subscriptionStartDate = new Date();
          }

          // Actualizează documentul utilizatorului în Firestore
          await userDoc.ref.update(updates);
          console.log(`Updated subscription for user: ${userDoc.id}`);
        }

        console.log("Subscription updates completed successfully.");
      } catch (error) {
        console.error("Error updating subscriptions:", error);
      }
    });

exports.sendActivationEmail = functions.firestore
    .document("Users/{userId}")
    .onUpdate((change, context) => {
      const newUser = change.after.data();
      const previousUser = change.before.data();

      // Verificăm dacă isActivated devine true
      if (!previousUser.isActivated && newUser.isActivated) {
        const email = newUser.email;
        const username = newUser.username;
        const targetLanguage = newUser.targetLanguage || "fr";

        // Mesaje de activare a contului în funcție de limbă
        let emailMessage = "";
        let emailSubject = "";

        if (targetLanguage === "nl") {
        // Mesaj în olandeză
          emailMessage =
          `Hallo ${username},\n\n` +
          `Je account op Real Amor is geactiveerd!\n\n` +
          `We nodigen je uit om deel te nemen aan onze gemeenschap. ` +
          `Log nu in: https://app.real-amor.com/login\n\n` +
          `Vriendelijke groeten,\n` +
          `Het Real Amor Team`;

          emailSubject = "Je Real Amor-account is geactiveerd!";
        } else {
        // Mesaj în franceză
          emailMessage =
          `Bonjour ${username},\n\n` +
          `Votre compte sur Real Amor a été activé!\n\n` +
          `Nous vous invitons à rejoindre notre communauté. ` +
          `Connectez-vous dès maintenant : https://app.real-amor.com/login\n\n` +
          `Cordialement,\n` +
          `L'équipe Real Amor`;

          emailSubject = "Votre compte Real Amor est activé!";
        }

        // Configurarea opțiunilor de email
        const mailOptions = {
          from: "office@real-amor.com", // Adresa de email de pe cPanel
          to: email, // Emailul utilizatorului
          subject: emailSubject,
          text: emailMessage,
        };

        console.log("Trimiterea emailului de activare către:", email);

        // Trimiterea emailului
        return transporter
            .sendMail(mailOptions)
            .then(() => {
              console.log("Email de activare trimis cu succes:", email);
            })
            .catch((error) => {
              console.error("Eroare la trimiterea emailului:", error);
            });
      } else {
      // Dacă isActivated nu s-a schimbat sau este deja true, nu trimitem email
        return null;
      }
    });
