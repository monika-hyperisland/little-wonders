
import '../main.js';
import { getWonders, deleteWonder } from '../lib/wonders.js';
import { supabase } from '../lib/supabase.js';
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

wonders.forEach((wonder) => {
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

