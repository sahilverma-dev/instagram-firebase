import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDw4iLp7KAUsDetyo0aTdYmHmR4DgFMXHs",
  authDomain: "instagram-clone-28771.firebaseapp.com",
  projectId: "instagram-clone-28771",
  storageBucket: "instagram-clone-28771.appspot.com",
  messagingSenderId: "111989369370",
  appId: "1:111989369370:web:45754427e792b855c8bfa3",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
export { firestore, auth, storage, analytics };
