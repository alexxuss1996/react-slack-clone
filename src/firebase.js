import Firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Initialize Firebase
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "slack-clone-react-e1ea4.firebaseapp.com",
  databaseURL: "https://slack-clone-react-e1ea4.firebaseio.com",
  projectId: "slack-clone-react-e1ea4",
  storageBucket: "slack-clone-react-e1ea4.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_ID
};
Firebase.initializeApp(config);

export default firebase;
