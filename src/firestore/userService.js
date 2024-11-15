// authService.js
import { auth, googleProvider } from "../firebase-config";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// Fonction pour gérer la connexion avec Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider); // Connexion Google
    return result.user; // Renvoie l'utilisateur connecté
  } catch (error) {
    console.error("Erreur lors de la connexion avec Google : ", error);
    throw error; // Lève l'erreur pour gestion dans l'appelant
  }
};

// Fonction pour gérer la déconnexion
export const signOutUser = async () => {
  try {
    await signOut(auth); // Déconnexion
    console.log("Utilisateur déconnecté");
  } catch (error) {
    console.error("Erreur lors de la déconnexion : ", error);
    throw error;
  }
};

// Fonction pour surveiller l'état d'authentification
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback); // Écoute l'état de l'utilisateur
};