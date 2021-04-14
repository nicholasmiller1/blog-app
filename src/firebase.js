import firebase from 'firebase';
import * as firebaseui from 'firebaseui';

var firebaseConfig = {
    apiKey: "AIzaSyB3WNPn7pspn8ZLkpLZyFUHT0-d1J6u7vA",
    authDomain: "authenticated-blog-app.firebaseapp.com",
    projectId: "authenticated-blog-app",
    storageBucket: "authenticated-blog-app.appspot.com",
    messagingSenderId: "606170293718",
    appId: "1:606170293718:web:6d1356f6903b2c167b7077"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const uiConfig = {
    signInSuccessUrl: "./",
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
}

const authui = new firebaseui.auth.AuthUI(firebase.auth());
const displayAuthUi = (elementId) => {
    authui.start(elementId, uiConfig);
}

export {displayAuthUi};
export default firebase;