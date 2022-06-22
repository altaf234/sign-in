const $ = document.querySelector;
const c = document.createElement;

function createMessage(user) {
  return `thanks ${user.name}, for signing up to our site. you can claim a free trial of our future services with the signed up email`;
}

function createUser(user) {
  if (user.toDo === 'remove') {
    delete document.querySelector('#' + user.uid);
    return;
  }

  const name = document.createElement('h3');
  name.classList.add('name');
  name.textContent = user.name;

  const email = document.createElement('p');
  email.classList.add('email');
  email.textContent = user.email;

  const info = document.createElement('div');
  info.appendChild(name);
  info.appendChild(email);

  const a = document.createElement('a');
  a.href = `mailto:${user.email}?subject=feedback&body=${createMessage(user)}`;
  a.textContent = 'send feedback';

  const userEl = document.createElement('div');
  userEl.classList.add('user');
  userEl.appendChild(info);
  userEl.appendChild(a);

  const container = document.querySelector('.container');
  if (user.toDo === 'update') {
    container.replaceChild(userEl, document.querySelector('#' + user.uid));
  }
  else {
    container.appendChild(userEl);
  }
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";
import {
  getFirestore,
  query,
  orderBy,
  collection,
  onSnapshot
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

const email = prompt('enter email');
const password = prompt('enter password');

signInWithEmailAndPassword(getAuth(), email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw error;
  });

onSnapshot(
  query(
    collection(getFirestore(), 'users'),
    orderBy('createdAt')
  ),
  
  (usersSnap) => {
    usersSnap.docChanges().forEach((userChange) => {
      const user = userChange.doc.data();
      if (userChange.type === 'added') {
        createUser({
          uid: user.uid,
          name: user.name,
          email: user.email,
          toDo: 'add'
        });
      }
      else if (userChange.type === 'modified') {
        createUser({
          uid: user.uid,
          name: user.name,
          email: user.email,
          toDo: 'update'
        });
      }
      else if (userChange.type === 'removed') {
        createUser({
          toDo: 'remove'
        })
      }
    });
    function setOrder(user, i) {
      user.style.order = String(i);
    }
    for (let i = 0; i < usersSnap.docs.length; i++) {
      const user = document.getElementById(usersSnap.docs[i].uid)
      user && setOrder(user, i)
    }
  }
)
