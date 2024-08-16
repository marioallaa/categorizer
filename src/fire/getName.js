
import { doc, getDoc } from "firebase/firestore";
import { db } from "../fire/init"; // Adjust the import path based on your project structure

/**
 * Retrieves the user's name from Firestore using their UID.
 * @param {string} uid - The UID of the user whose name is to be retrieved.
 * @returns {Promise<string | null>} - The user's name or null if not found.
 */
async function getUserName(uid) {
    try {
      const userDocRef = doc(db, "users", uid); // Reference to the user's document
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.name || null; // Return the user's name if it exists
      } else {
        console.log("No such document!");
        return null; // No document found
      }
    } catch (error) {
      console.error("Error getting user name: ", error);
      return null; // Handle errors, return null
    }
  }
  
export default getUserName