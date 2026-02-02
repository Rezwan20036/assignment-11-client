import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_apiKey,
    authDomain: import.meta.env.VITE_authDomain,
    projectId: import.meta.env.VITE_projectId,
    storageBucket: import.meta.env.VITE_storageBucket,
    messagingSenderId: import.meta.env.VITE_messagingSenderId,
    appId: import.meta.env.VITE_appId
};

// Initialize secondary app ONLY if it hasn't been initialized yet
let secondaryApp;
let secondaryAuth;

try {
    secondaryApp = initializeApp(firebaseConfig, "AdminAction");
    secondaryAuth = getAuth(secondaryApp);
} catch (error) {
    // If already initialized
    secondaryAuth = getAuth(); // Fallback or handle appropriately
}

export { secondaryAuth };
