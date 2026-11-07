
const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value;
  const message = document.querySelector('#loginMessage');

  message.className = 'alert mt-3';
  message.textContent = '';

  if (!email || !password) {
    message.classList.add('alert-danger');
    message.textContent = 'Please fill in all fields.';
    return;
  }

  if (!email.includes('@')) {
    message.classList.add('alert-danger');
    message.textContent = 'Please enter a valid email address.';
    return;
  }

  message.classList.add('alert-info');
  message.textContent =
    'Form validated! Actual login will be available soon.';
});
