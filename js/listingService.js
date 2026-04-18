import { db } from "./firebaseConfig.js";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

/**
 * Service to handle Waste Listings in Firestore
 */
export const ListingService = {
    /**
     * Add a new listing to Firestore
     * @param {Object} listingData 
     */
    async addListing(listingData) {
        try {
            const docRef = await addDoc(collection(db, "listings"), {
                ...listingData,
                status: 'Available',
                createdAt: serverTimestamp()
            });
            console.log("Listing added with ID: ", docRef.id);
            return docRef.id;
        } catch (e) {
            console.error("Error adding listing: ", e);
            throw e;
        }
    },

    /**
     * Fetch all listings from Firestore
     */
    async getAllListings() {
        try {
            const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const listings = [];
            querySnapshot.forEach((doc) => {
                listings.push({ id: doc.id, ...doc.data() });
            });
            return listings;
        } catch (e) {
            console.error("Error fetching listings: ", e);
            return [];
        }
    }
};

// Expose to window for non-module scripts if needed
window.ListingService = ListingService;
