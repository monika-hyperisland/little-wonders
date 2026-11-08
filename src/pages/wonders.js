
import '../main.js';
import { getWonders, deleteWonder } from '../lib/wonders.js';
import { supabase } from '../lib/supabase.js';
import {
  getWonderPhotoUrl,
  downloadWonderPhoto,
} from '../lib/photos.js';
const wondersList = document.querySelector('#wondersList');

async function loadWonders() {
  try {

const { data, error } = await supabase.auth.getUser();

if (error || !data.user) {
  window.location.replace('/login.html');
  return;
}

    const wonders = await getWonders();

    if (wonders.length === 0) {
      wondersList.textContent =
        'No wonders yet. Your little memories will appear here!';
      return;
    }


wondersList.replaceChildren();

wonders.forEach(async (wonder) => {
  const column = document.createElement('div');
  column.className = 'col-12 col-md-6 col-lg-4';

  const card = document.createElement('div');
  card.className = 'card h-100 shadow-sm';

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h2');
  title.className = 'card-title h5';
  title.textContent = wonder.title;

  const category = document.createElement('p');
  category.className = 'text-muted text-capitalize';
  category.textContent = wonder.category;

  const description = document.createElement('p');
  description.className = 'card-text';
  description.textContent = wonder.description || 'No description yet.';
 

const editLink = document.createElement('a');
editLink.className = 'btn btn-outline-primary btn-sm mt-2';
editLink.href = `edit-wonder.html?id=${encodeURIComponent(wonder.id)}`;
editLink.textContent = 'Edit';

const deleteButton = document.createElement('button');
deleteButton.type = 'button';
deleteButton.className = 'btn btn-outline-danger btn-sm mt-2 ms-2';
deleteButton.textContent = 'Delete';


deleteButton.addEventListener('click', async () => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${wonder.title}"?`
  );

  if (!confirmed) {
    return;
  }

  deleteButton.disabled = true;
  deleteButton.textContent = 'Deleting...';

  try {
    await deleteWonder(wonder.id);
    await loadWonders();
  } catch (error) {
    console.error('Failed to delete wonder:', error);

    window.alert('Unable to delete this wonder.');
    deleteButton.disabled = false;
    deleteButton.textContent = 'Delete';
  }
});


  body.append(title, category, description, editLink, deleteButton);

  try {
    const photoUrl = await getWonderPhotoUrl(wonder.id);

    if (photoUrl) {
      const image = document.createElement('img');
      image.src = photoUrl;
      image.alt = wonder.title;
      image.className = 'card-img-top';
      image.style.height = '200px';
      image.style.objectFit = 'cover';

      card.prepend(image);

      const downloadButton = document.createElement('button');
      downloadButton.type = 'button';
      downloadButton.className = 'btn btn-outline-success btn-sm m-3';
      downloadButton.textContent = 'Download Photo';

      downloadButton.addEventListener('click', async () => {
        downloadButton.disabled = true;
        downloadButton.textContent = 'Downloading...';

        try {
          const { file, filename } = await downloadWonderPhoto(wonder.id);

          const url = URL.createObjectURL(file);
          const link = document.createElement('a');

          link.href = url;
          link.download = filename || 'wonder-photo';
          document.body.appendChild(link);
          link.click();
          link.remove();

          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
          console.error('Failed to download photo:', error);
          window.alert('Unable to download the photo.');
        } finally {
          downloadButton.disabled = false;
          downloadButton.textContent = 'Download Photo';
        }
      });

      body.appendChild(downloadButton);

    }
  } catch (error) {
    console.error('Failed to load wonder photo:', error);
  }

  card.appendChild(body);
  column.appendChild(card);
  wondersList.appendChild(column);
});

  } catch (error) {
    console.error('Failed to load wonders:', error);

    wondersList.textContent =
      'Unable to load your wonders. Please try again later.';
  }
}

loadWonders();

