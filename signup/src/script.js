import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";
import {
  doc,
  setDoc,
  Timestamp,
  getFirestore,
  getDocs,
  query,
  where
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

if (getAuth().currentUser) {
  location.replace('/app');
}

function showErr(err) {
  document.getElementById('errorLog').textContent = err;
}

let doing;
let authChanged;

onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    if (authChanged) {
      return;
    }
    location.replace('/app');
  }
  else {
    authChanged = true;
  }
})

function setDoing(value) {
  document.querySelector('.loader').style.display = value ? 'initial' : 'none';
  doing = value;
}

setDoing(false);

window.signUp = async function() {
  if (doing) {
    return;
  }
  setDoing(true);
  const target = document.querySelector('form');
  createUserWithEmailAndPassword(getAuth(), target.email.value, target.password.value)
    .then(async (userCred) => {
      setDoc(doc(getFirestore(), "users", userCred.user.uid), {
        name: target.name.value,
        email: target.email.value,
        uid: userCred.user.uid,
        createdAt: Timestamp.fromDate(new Date())
      }).then(() => {
        setDoing(false);
        location.replace('/app');
      })
    })
    .catch((err) => {
      setDoing(false);
      if (err.message == "Firebase: Error (auth/email-already-in-use).") {
        showErr('email already in use')
      }
      else {
        showErr(err.message);
      }
    })
}

document.getElementById('google').addEventListener('click', async (e) => {
  if (doing) {
    return;
  }
  setDoing(true);
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then(async (userCred) => {
      const user = userCred.user;
      setDoc(doc(getFirestore(), "users", user.uid), {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        createdAt: Timestamp.fromDate(new Date())
      }).then(() => {
        setDoing(false);
        location.replace('/app');
      });
    })
    .catch((err) => {
      setDoing(false);
      showErr(err.message);
    })
})
