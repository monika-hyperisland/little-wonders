import { uploadWonderPhoto } from '../lib/photos.js';
import { createWonder } from '../lib/wonders.js';

const form = document.querySelector('#addWonderForm');
const message = document.querySelector('#addWonderMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const category = document.querySelector('#category').value;
  const title = document.querySelector('#title').value.trim();
  const description = document.querySelector('#description').value.trim();

  message.className = 'alert mt-3';
  message.textContent = '';

  if (!category || !title) {
    message.classList.add('alert-danger');
    message.textContent = 'Please fill in all required fields.';
    return;
  }

  message.classList.add('alert-info');
  message.textContent = 'Saving your wonder...';

  
try {
  const photoFile = document.querySelector('#wonder-photo')?.files[0];

  const wonder = await createWonder({
    category,
    title,
    description,
  });

  if (photoFile) {
    await uploadWonderPhoto(wonder.id, photoFile);
  }

    message.className = 'alert alert-success mt-3';
    message.textContent = 'Wonder saved successfully!';
    form.reset();
  } catch (error) {
    console.error('Failed to save wonder:', error);

    message.className = 'alert alert-danger mt-3';
    message.textContent =
      'Unable to save your wonder. Please try again.';
  }
});
