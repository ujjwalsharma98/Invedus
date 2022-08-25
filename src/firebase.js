import firebase from "firebase/compat/app";
import "firebase/compat/storage";

var firebaseConfig = {
    apiKey: "super secret keys.....asgvegxgevergfvr",
    authDomain: "tallans-imageupload-tutorial.firebaseapp.com",
    databaseURL: "https://tallans-imageupload-tutorial.firebaseio.com",
    projectId: "tallans-imageupload-tutorial",
    storageBucket: "tallans-imageupload-tutorial.appspot.com",
    messagingSenderId: "super secret keys.....asgvegxgevergfvr",
    appId: "super secret app id....adsfa;lsdkjf",
    measurementId: "super secret as;dlkfjal;dskjf"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
//analytics is optional for this tutoral 
  // firebase.analytics();

  export const storage = firebase.storage();