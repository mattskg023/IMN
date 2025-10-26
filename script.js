// Formspree Submit a Topic
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('topicForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const data = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      const statusMsg = document.getElementById('statusMsg');
      if (response.ok) {
        statusMsg.textContent = "✅ Your topic has been sent successfully!";
        form.reset();
      } else {
        statusMsg.textContent = "❌ Something went wrong. Please try again.";
      }
    });
  }
});

// Privacy Policy toggle
const privacyLink = document.querySelectorAll('#privacy, .privacy-link');
const privacySection = document.getElementById('privacy-section');

privacyLink.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    privacySection.classList.toggle('hidden');
    privacySection.scrollIntoView({ behavior: 'smooth' });
  });
});
