
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './css/style.css';

const HOME_PATH = '/index.html';

export function goHome() {
	window.location.assign(HOME_PATH);
}

function shouldShowHomeButton() {
	const { pathname } = window.location;
	return pathname !== '/' && pathname !== HOME_PATH;
}

function renderHomeButton() {
	if (!shouldShowHomeButton()) {
		return;
	}

	if (document.querySelector('#globalHomeButton')) {
		return;
	}

	const button = document.createElement('button');
	button.type = 'button';
	button.id = 'globalHomeButton';
	button.className = 'home-return-button';
	button.setAttribute('aria-label', 'Return to home page');
	button.setAttribute('title', 'Home');
	button.innerHTML = '<i class="bi bi-house-door" aria-hidden="true"></i>';
	button.addEventListener('click', goHome);

	document.body.appendChild(button);
}

window.goHome = goHome;

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', renderHomeButton);
} else {
	renderHomeButton();
}

// Little Wonders application entry point
console.log('Little Wonders is ready!');
