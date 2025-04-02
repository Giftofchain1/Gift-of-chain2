// Importer Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// ⚡ CONFIGURATION FIREBASE (remplace avec tes infos)
const firebaseConfig = {
    apiKey: "TON_API_KEY",
    authDomain: "TON_PROJET.firebaseapp.com",
    projectId: "TON_PROJECT_ID",
    storageBucket: "TON_PROJECT_ID.appspot.com",
    messagingSenderId: "TON_MESSAGING_SENDER_ID",
    appId: "TON_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 📧 CONFIGURATION EMAILJS
emailjs.init("TON_USER_ID");

// 🎯 ÉCOUTER LE FORMULAIRE
document.getElementById("inscriptionForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let nom = document.getElementById("nom").value;
    let prenom = document.getElementById("prenom").value;
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let whatsapp = document.getElementById("whatsapp").value;
    let supporteur = document.getElementById("supporteur").value;
    let adresse = document.getElementById("adresse").value;
    let photo = document.getElementById("photo").files[0];

    // Vérifier le supporteur (max 2 inscriptions)
    const q = query(collection(db, "utilisateurs_valides"), where("supporteur", "==", supporteur));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size >= 2) {
        alert("Ce supporteur a déjà 2 inscrits !");
        return;
    }

    // Vérifier si l'utilisateur existe déjà
    const q2 = query(collection(db, "utilisateurs_valides"), where("username", "==", username));
    const querySnapshot2 = await getDocs(q2);
    if (!querySnapshot2.empty) {
        alert("Ce nom d'utilisateur est déjà pris !");
        return;
    }

    // 🔄 UPLOAD PHOTO
    const storageRef = ref(storage, 'transactions_usdt/' + photo.name);
    await uploadBytes(storageRef, photo);
    const photoUrl = await getDownloadURL(storageRef);

    // ✅ AJOUTER DANS FIREBASE
    await addDoc(collection(db, "utilisateurs_valides"), {
        nom, prenom, username, email, whatsapp, supporteur, adresse, photoUrl, valide: false,
 await addDoc(collection(db, "utilisateurs_valides"), {
    nom, prenom, username, email, whatsapp, supporteur, adresse, photoUrl, valide: false
});



    // 📧 ENVOYER UNE NOTIFICATION EMAIL
    const templateParams = {
        nom, prenom, username, email, whatsapp, supporteur, to_email: "Giftofchain@gmail.com"
    };

    emailjs.send("service_s738l4c", "TON_TEMPLATE_ID", templateParams)
        .then(response => console.log("Email envoyé !", response))
        .catch(error => console.error("Erreur d'email :", error));

    alert("Inscription envoyée !");
});

import { onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔄 Écouter les changements dans Firestore
onSnapshot(collection(db, "utilisateurs_valides"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
            const data = change.doc.data();
            if (data.valide === true) {
                envoyerEmailValidation(data.email, data.nom, data.prenom);
            }
        }
    });

// 📧 Fonction pour envoyer l’email avec le lien du groupe
function envoyerEmailValidation(email, nom, prenom) {
    const templateParams = {
        to_email: email,
        nom: nom,
        prenom: prenom,
        lien_groupe: "https://chat.whatsapp.com/JSw0c0d9zcFAY52AtLwUsd" 
    };

    emailjs.send("service_s738l4c", "Inscripstion reussie", templateParams)
        .then(response => console.log("Email de validation envoyé !", response))
        .catch(error => console.error("Erreur d'email de validation :", error));
}
};