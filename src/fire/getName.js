
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../fire/init"; // Adjust the import path based on your project structure

/**
 * Retrieves the user's name from Firestore using their UID.
 * @param {string} uid - The UID of the user whose name is to be retrieved.
 * @returns {Promise<string | null>} - The user's name or null if not found.
 */
async function getUserNameAndHistory(uid) {
  try {
    const userDocRef = doc(db, "users", uid); // Reference to the user's document
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userName = userData.name;

      // Get the clients collection
      const clientsCollectionRef = collection(userDocRef, "clients");
      const clientsSnapshot = await getDocs(clientsCollectionRef);
      const clients = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), wpf: [] }));

      // Get the wpf collection
      const wpfCollectionRef = collection(userDocRef, "wpf");
      const wpfSnapshot = await getDocs(wpfCollectionRef);
      const wpfList = wpfSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Attach the wpf to the corresponding client
      wpfList.forEach(wpf => {
        const clientIndex = clients.findIndex(client => client.id === wpf.assignedClientId);
        if (clientIndex !== -1) {
          clients[clientIndex].wpf.push(wpf);
        }
      });

      return {
        name: userName,
        clients
      };
    } else {
      console.log("No such document!");
      return null; // No document found
    }
  } catch (error) {
    console.error("Error getting user details: ", error);
    return null; // Handle errors, return null
  }
  }
  
export default getUserNameAndHistory