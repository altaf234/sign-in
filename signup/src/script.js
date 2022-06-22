import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";
import {
  collection,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyBazM9WfcjGILh7KNRIWHETR7_muMBZq1Q",
  authDomain: "email-marketing-55161.firebaseapp.com",
  projectId: "email-marketing-55161",
  storageBucket: "email-marketing-55161.appspot.com",
  messagingSenderId: "647097765896",
  appId: "1:647097765896:web:ce58b3ce8c528f2a9901bd"
};

// Initialize Firebase
initializeApp(firebaseConfig);

window.signUp = function() {
  const target = document.querySelector('form');
  createUserWithEmailAndPassword(getAuth(), target.email.value, target.password.value)
    .then((userCred) => {
      addDoc(collection(getFirestore(), "users"), {
        name: target.name.value,
        email: target.email.value,
        uid: userCred.user.uid,
        createdAt: Timestamp.fromDate(new Date())
      })
    })
    .catch((err) => {
      if (err.message == "Firebase: Error (auth/email-already-in-use).") {
        document.getElementById('errorLog').textContent = "email already in use!";
      }
      console.log(target.email.value, target.password.value)
      throw err;
    })
}