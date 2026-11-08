
import { supabase } from '../lib/supabase.js';

const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', async(event) => {
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


message.className = 'alert alert-info mt-3';
message.textContent = 'Signing in...';

try {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    message.className = 'alert alert-danger mt-3';
    message.textContent = 'Invalid email or password.';
    return;
  }

  window.location.replace('/wonders.html');
} catch (error) {
  console.error('Login request failed:', error);

  message.className = 'alert alert-danger mt-3';
  message.textContent =
    'Unable to connect. Please try again later.';
}
;
});

const logoutButton = document.querySelector('#logoutButton');

logoutButton.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout failed:', error.message);
    return;
  }

  window.location.reload();
});



async function updateLogoutVisibility() {
  const { data, error } = await supabase.auth.getUser();

  const logoutSection = document.querySelector('#logoutSection');
  const isLoggedIn = !error && !!data.user;

  loginForm.classList.toggle('d-none', isLoggedIn);
  logoutSection.classList.toggle('d-none', isLoggedIn === false);
}


updateLogoutVisibility();

