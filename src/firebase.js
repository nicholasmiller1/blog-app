import firebase from 'firebase';
import * as firebaseui from 'firebaseui';

var firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log("Firebase initialized");

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