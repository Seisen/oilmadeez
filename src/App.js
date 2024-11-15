import React, { useState, useEffect } from "react";
import ColorMixForm from './components/ColorMixForm';
import { signInWithGoogle, signOutUser, onAuthStateChangedListener } from "./firestore/userService"; // Import des fonctions d'auth

const App = () => {
  const [user, setUser] = useState(null); // État pour stocker les informations utilisateur

  // Suivi de l'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        setUser(user); // Si connecté, mettre à jour l'utilisateur
      } else {
        setUser(null); // Sinon, réinitialiser
      }
    });

    return () => unsubscribe(); // Nettoie l'écouteur lors du démontage
  }, []);

  // Gestion de la connexion Google
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle(); // Connexion avec Google
      console.log("Utilisateur connecté : ", user);
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google : ", error);
    }
  };

  // Gestion de la déconnexion
  const handleSignOut = async () => {
    try {
      await signOutUser(); // Déconnexion
      console.log("Utilisateur déconnecté");
    } catch (error) {
      console.error("Erreur lors de la déconnexion : ", error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <button onClick={handleSignOut}>Se déconnecter</button>
          <div className="App">
            <ColorMixForm />
          </div>
        </div>
      ) : (
        <button onClick={handleGoogleSignIn}>Se connecter avec Google</button>
      )}
    </div>
  );
};

export default App;