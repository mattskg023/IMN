import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, increment, orderBy, query } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDveuYd3_bfqSuMOeBnVrIw4u2mg9TWLZ4",
  authDomain: "imn-media.firebaseapp.com",
  projectId: "imn-media",
  storageBucket: "imn-media.appspot.com",
  messagingSenderId: "1053700852775",
  appId: "1:1053700852775:web:cde18dca2d0e5fe3231202"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const commentsCol = collection(db, "comments");

// Buttons
const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const addCommentBtn = document.getElementById('addCommentBtn');

signupBtn.addEventListener('click', signup);
loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);
addCommentBtn.addEventListener('click', addComment);

// Check login state
onAuthStateChanged(auth, user => {
  if(user) {
    document.getElementById('commentForm').style.display = 'block';
  } else {
    document.getElementById('commentForm').style.display = 'none';
  }
  loadComments();
});

// Functions
async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert('Account aangemaakt!');
  } catch(e) { alert(e.message); }
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch(e) { alert(e.message); }
}

async function logout() {
  await signOut(auth);
}

async function addComment() {
  const user = auth.currentUser;
  const message = document.getElementById('message').value;
  if(!user) return alert('Je moet inloggen!');
  if(!message) return alert('Typ een reactie!');
  await addDoc(commentsCol, {
    username: user.email.split('@')[0],
    message: message,
    timestamp: Date.now(),
    likes: 0
  });
  document.getElementById('message').value = '';
  loadComments();
}

async function loadComments() {
  const q = query(commentsCol, orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  const container = document.getElementById('comments');
  container.innerHTML = '';
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
      <b>${data.username}</b>: ${data.message} <br>
      <span class="likes" onclick="likeComment('${docSnap.id}')">👍 ${data.likes}</span>
    `;
    container.appendChild(div);
  });
}

window.likeComment = async (id) => {
  const docRef = doc(db, "comments", id);
  await updateDoc(docRef, { likes: increment(1) });
  loadComments();
};
