import React, { useState, useEffect } from "react";
import ColorMixForm from './components/ColorMixForm';
import { db } from "./firebase-config";  // import the Firestore instance
import { collection, addDoc, getDocs } from "firebase/firestore";  // Firestore methods
import { auth, googleProvider } from "./firebase-config"; // Import auth and Google provider
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth"; // Import Firebase Auth functions



const App = () => {
  const [user, setUser] = useState(null); // State to store user information

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // If user is logged in, set user info
      } else {
        setUser(null); // If no user, set to null
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider); // Trigger Google login popup
      const user = result.user;
      console.log("User Logged In: ", user);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign the user out
      console.log("User Signed Out");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
          <div className="App">
            <ColorMixForm />
          </div>
        </div>

      ) : (
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      )}

    </div>


  );
};




export default App;