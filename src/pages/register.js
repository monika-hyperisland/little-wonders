
import { supabase } from '../lib/supabase.js';

const registerForm = document.querySelector('#registerForm');

registerForm.addEventListener('submit', async (event) => {
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

  
message.classList.add('alert-info');
message.textContent = 'Creating your account...';

try {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: `${window.location.origin}/login.html`,
    },
  });

  if (error) {
    message.className = 'alert alert-danger mt-3';
    message.textContent = error.message;
    return;
  }

  message.className = 'alert alert-success mt-3';
  message.textContent =
    'Please check your email for a confirmation link.';
} catch (error) {
  message.className = 'alert alert-danger mt-3';
  message.textContent =
    'Unable to connect. Please try again later.';
}

});
