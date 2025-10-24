// Upvote / Downvote functie (lokaal, geen database)
document.querySelectorAll('article').forEach(article => {
  const up = article.querySelector('.upvote');
  const down = article.querySelector('.downvote');
  const count = article.querySelector('.count');

  let votes = 0;
  up.addEventListener('click', () => {
    votes++;
    count.textContent = votes;
  });
  down.addEventListener('click', () => {
    votes--;
    count.textContent = votes;
  });
});

// Dummy login alert
document.getElementById('login-btn').addEventListener('click', () => {
  alert("Login feature not implemented yet. Coming soon!");
});

// Privacy policy popup
document.getElementById('privacy-link').addEventListener('click', (e) => {
  e.preventDefault();
  alert("Privacy Policy: This site uses Formspree for submitting ideas. Your email and message will only be used for IMN communication.");
});
