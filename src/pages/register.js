
const registerForm = document.querySelector('#registerForm');

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.querySelector('#fullName').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value;
  const confirmPassword =
    document.querySelector('#confirmPassword').value;

  const message = document.querySelector('#registerMessage');

  message.className = 'alert mt-3';
  message.textContent = '';

  if (!name || !email || !password || !confirmPassword) {
    message.classList.add('alert-danger');
    message.textContent = 'Please fill in all fields.';
    return;
  }

  if (password.length < 8) {
    message.classList.add('alert-danger');
    message.textContent =
      'Password must be at least 8 characters.';
    return;
  }

  if (password !== confirmPassword) {
    message.classList.add('alert-danger');
    message.textContent = 'Passwords do not match.';
    return;
  }

  message.classList.add('alert-success');
  message.textContent =
    'Form validated successfully! Registration is coming soon.';
});
