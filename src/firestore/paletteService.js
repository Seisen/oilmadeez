import { onAuthStateChanged } from "firebase/auth"; // Pour surveiller les changements d'état d'authentification
import { addDoc, collection, query, where, getDocs } from "firebase/firestore"; // Pour manipuler Firestore
import { auth, db } from "../firebase-config"; // Assurez-vous que ces configurations sont correctes


// Récupérer les palettes d'un utilisateur
export async function getPalettesByUser(userId) {
  try {
    const palettesRef = collection(db, "userPalettes");
    const q = query(palettesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const palettes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return palettes;
  } catch (error) {
    console.error("Erreur lors de la récupération des palettes :", error);
    throw error;
  }
}
export async function addPaletteToFirestore(palette) {
    const paletteCollection = collection(db, 'userPalettes');
  
    // Check for authenticated user
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
  
        try {
          // Add the new palette with userId to the Firestore
          await addDoc(paletteCollection, {
            ...palette,
            userId: userId // Associate palette with the user
          });
          console.log(`Palette '${palette.name}' added successfully for user:`, userId);
        } catch (error) {
          console.error("Error adding palette to Firestore: ", error);
        }
      } else {
        console.log("No user is signed in");
      }
    });
  }