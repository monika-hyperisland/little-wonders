
import '../main.js';
import { getWonderById } from '../lib/wonders.js';
import { uploadWonderPhoto } from '../lib/photos.js';

const categoryInput = document.querySelector('#category');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const photoInput = document.querySelector('#wonder-photo');
const message = document.querySelector('#editWonderMessage');

async function loadWonder() {
  const params = new URLSearchParams(window.location.search);
  const wonderId = params.get('id');

  if (!wonderId) {
    message.className = 'alert alert-danger mt-3';
    message.textContent = 'No wonder selected for editing.';
    return;
  }

  try {
    const wonder = await getWonderById(wonderId);

    categoryInput.value = wonder.category;
    titleInput.value = wonder.title;
    descriptionInput.value = wonder.description || '';
  } catch (error) {
    console.error('Failed to load wonder:', error);

    message.className = 'alert alert-danger mt-3';
    message.textContent = 'Unable to load this wonder.';
  }
}

loadWonder();

import { updateWonder } from '../lib/wonders.js';

const editForm = document.querySelector('#editWonderForm');

editForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const wonderId = params.get('id');

  const category = categoryInput.value;
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const photoFile = photoInput?.files[0];

  if (!wonderId || !category || !title) {
    message.className = 'alert alert-danger mt-3';
    message.textContent = 'Please fill in all required fields.';
    return;
  }

  message.className = 'alert alert-info mt-3';
  message.textContent = 'Saving changes...';

  try {
    await updateWonder(wonderId, {
      category,
      title,
      description,
    });

    if (photoFile) {
      await uploadWonderPhoto(wonderId, photoFile);
    }

    message.className = 'alert alert-success mt-3';
    message.textContent = 'Wonder updated successfully!';
  } catch (error) {
    console.error('Failed to update wonder:', error);

    message.className = 'alert alert-danger mt-3';
    message.textContent = 'Unable to update this wonder.';
  }
});
