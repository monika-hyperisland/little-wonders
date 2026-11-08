import '../main.js';
import { supabase } from '../lib/supabase.js';

function goToUserWonders(category) {
  const query = new URLSearchParams({ category });
  window.location.assign(`/wonders.html?${query.toString()}`);
}

function setupFeatureCardNavigation() {
  const cards = document.querySelectorAll('.js-wonder-entry');

  cards.forEach((card) => {
    const { wonderCategory } = card.dataset;

    if (!wonderCategory) {
      return;
    }

    card.addEventListener('click', () => {
      goToUserWonders(wonderCategory);
    });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      goToUserWonders(wonderCategory);
    });
  });
}

function getUserDisplayName(user) {
  const fullName = user?.user_metadata?.full_name?.trim();

  if (fullName) {
    return fullName;
  }

  const email = user?.email || '';
  return email.split('@')[0] || 'Little Wonder';
}

async function updateNavbarAuthState() {
  const navbar = document.querySelector('.site-navbar');
  const loginItem = document.querySelector('#navLoginItem');
  const registerItem = document.querySelector('#navRegisterItem');
  const userDisplay = document.querySelector('#navUserDisplay');
  const userName = document.querySelector('#navUserName');
  const logoutButton = document.querySelector('#navLogoutButton');
  const navbarToggler = document.querySelector('#mainNavbarToggler');
  const heroStartJourneyButton = document.querySelector('#heroStartJourneyButton');

  if (!loginItem || !registerItem || !userDisplay || !userName) {
    return;
  }

  const { data, error } = await supabase.auth.getUser();
  const isLoggedIn = !error && !!data.user;

  loginItem.classList.toggle('d-none', isLoggedIn);
  registerItem.classList.toggle('d-none', isLoggedIn);
  userDisplay.classList.toggle('d-none', !isLoggedIn);

  if (logoutButton) {
    logoutButton.classList.toggle('d-none', !isLoggedIn);
  }

  if (navbar) {
    navbar.classList.toggle('user-logged-in', isLoggedIn);
  }

  if (navbarToggler) {
    navbarToggler.classList.toggle('d-none', isLoggedIn);
  }

  if (heroStartJourneyButton) {
    heroStartJourneyButton.classList.toggle('d-none', isLoggedIn);
  }

  if (isLoggedIn) {
    userName.textContent = getUserDisplayName(data.user);
  } else {
    userName.textContent = '';
  }
}

function setupLogoutAction() {
  const logoutButton = document.querySelector('#navLogoutButton');

  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout failed:', error.message);
      return;
    }

    window.location.reload();
  });
}

setupFeatureCardNavigation();
setupLogoutAction();
updateNavbarAuthState();
