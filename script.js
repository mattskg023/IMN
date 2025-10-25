import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Firebase configuratie
const firebaseConfig = {
  apiKey: "AIzaSyDveuYd3_bfqSuMOeBnVrIw4u2mg9TWLZ4",
  authDomain: "imn-media.firebaseapp.com",
  projectId: "imn-media",
  storageBucket: "imn-media.firebasestorage.app",
  messagingSenderId: "1053700852775",
  appId: "1:1053700852775:web:cde18dca2d0e5fe3231202"
};

// Initialiseer Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM-elementen
const commentInput = document.getElementById('commentInput');
const postCommentBtn = document.getElementById('postCommentBtn');
const commentsContainer = document.getElementById('commentsContainer');
const suggestionInput = document.getElementById('suggestionInput');
const submitSuggestion = document.getElementById('submitSuggestion');

// Functie om reacties op te halen en weer te geven
async function loadComments() {
  const querySnapshot = await getDocs(collection(db, 'comments'));
  commentsContainer.innerHTML = '';
  querySnapshot.forEach(doc => {
    const comment = doc.data();
    const commentElement = document.createElement('div');
    commentElement.textContent = `${comment.email}: ${comment.text}`;
    commentsContainer.appendChild(commentElement);
  });
}

// Functie om een nieuwe reactie toe te voegen
async function addComment() {
  if (commentInput.value.trim() !== '') {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, 'comments'), {
        email: user.email,
        text: commentInput.value.trim(),
        timestamp: new Date()
      });
      commentInput.value = '';
      loadComments();
    } else {
      alert('Je moet ingelogd zijn om een reactie te plaatsen.');
    }
  }
}

// Functie om suggestie op te slaan
function saveSuggestion() {
  if (suggestionInput.value.trim() !== '') {
    alert('Suggestie verstuurd: ' + suggestionInput.value);
    suggestionInput.value = '';
  } else {
    alert('Vul een suggestie in.');
  }
}

// Event listeners
postCommentBtn.addEventListener('click', addComment);
submitSuggestion.addEventListener('click', saveSuggestion);

// Authentificatie status controleren
onAuthStateChanged(auth, user => {
  if (user) {
    loadComments();
  } else {
    commentsContainer.innerHTML = '<p>Log in om reacties te zien.</p>';
  }
});
