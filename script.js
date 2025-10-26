import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, increment, query, orderBy } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDveuYd3_bfqSuMOeBnVrIw4u2mg9TWLZ4",
  authDomain: "imn-media.firebaseapp.com",
  projectId: "imn-media",
  storageBucket: "imn-media.appspot.com",
  messagingSenderId: "1053700852775",
  appId: "1:1053700852775:web:cde18dca2d0e5fe3231202"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const commentsCol = collection(db, "comments");

// DOM Elements
const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const postCommentBtn = document.getElementById('postCommentBtn');
const commentInput = document.getElementById('commentInput');
const commentsContainer = document.getElementById('commentsContainer');
const submitSuggestion = document.getElementById('submitSuggestion');
const suggestionInput = document.getElementById('suggestionInput');

// Auth
signupBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try { await createUserWithEmailAndPassword(auth, email, password); alert('Account created!'); }
  catch(e){ alert(e.message); }
});

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try { await signInWithEmailAndPassword(auth, email, password); }
  catch(e){ alert(e.message); }
});

logoutBtn.addEventListener('click', async () => { await signOut(auth); });

// Load comments
async function loadComments() {
  const q = query(commentsCol, orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  commentsContainer.innerHTML = '';
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
      <b>${data.email.split('@')[0]}</b>: ${data.text}
      <span class="likeBtn" onclick="likeComment('${docSnap.id}', this)">👍 ${data.likes || 0}</span>
      <span class="dislikeBtn" onclick="dislikeComment('${docSnap.id}', this)">👎 ${data.dislikes || 0}</span>
    `;
    commentsContainer.appendChild(div);
  });
}

// Post comment
postCommentBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if(!user) return alert('You must be logged in to comment!');
  if(commentInput.value.trim() === '') return alert('Type a comment!');
  await addDoc(commentsCol, {
    email: user.email,
    text: commentInput.value.trim(),
    timestamp: Date.now(),
    likes: 0,
    dislikes: 0
  });
  commentInput.value = '';
  loadComments();
});

// Like/Dislike comment
window.likeComment = async (id, element) => {
  const docRef = doc(db, "comments", id);
  await updateDoc(docRef, { likes: increment(1) });
  element.classList.add('liked');
  loadComments();
};

window.dislikeComment = async (id, element) => {
  const docRef = doc(db, "comments", id);
  await updateDoc(docRef, { dislikes: increment(1) });
  element.classList.add('disliked');
  loadComments();
};

// Suggestion Box
submitSuggestion.addEventListener('click', async () => {
  if(suggestionInput.value.trim() === '') return alert('Type a suggestion!');
  const suggestionsCol = collection(db, "suggestions");
  await addDoc(suggestionsCol, { text: suggestionInput.value.trim(), timestamp: Date.now() });
  alert('Suggestion submitted: ' + suggestionInput.value);
  suggestionInput.value = '';
});
<script>
document.getElementById('topicForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const form = e.target;
  const statusMsg = document.getElementById('statusMsg');
  const formData = new FormData(form);

  const response = await fetch(form.action, {
    method: form.method,
    body: formData,
    headers: { 'Accept': 'application/json' }
  });

  if (response.ok) {
    statusMsg.textContent = "✅ Your topic has been sent successfully!";
    statusMsg.style.color = "#00ff99";
    form.reset();
  } else {
    statusMsg.textContent = "❌ Something went wrong. Please try again later.";
    statusMsg.style.color = "#ff5555";
  }
});
</script>

// Listen for auth changes
onAuthStateChanged(auth, user => {
  if(user) loadComments();
});

