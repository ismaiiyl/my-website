
// Use namespaced imports to bypass "no exported member" errors in some environments
import * as FirebaseApp from "firebase/app";
import * as Firestore from "firebase/firestore";
import * as Analytics from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0ob2l5q4NK1O8orU7cNDnSM0dpx2hQ54",
  authDomain: "ismaaiiyl-admin.firebaseapp.com",
  projectId: "ismaaiiyl-admin",
  storageBucket: "ismaaiiyl-admin.firebasestorage.app",
  messagingSenderId: "346118691638",
  appId: "1:346118691638:web:21429a48278bffdb667197",
  measurementId: "G-NRVNWTF0K6"
};

// Initialize Firebase (Modular SDK) using namespaces
const app = FirebaseApp.initializeApp(firebaseConfig);
const db = Firestore.getFirestore(app);
const analytics = Analytics.getAnalytics(app);

export { db };
