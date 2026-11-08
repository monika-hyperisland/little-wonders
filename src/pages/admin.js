
import { supabase } from '../lib/supabase.js';

async function checkAdminAccess() {
  const content = document.getElementById('admin-content');

  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError || !user) {
    window.location.replace('/login.html');
    return;
  }

  const { data: userRole, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (roleError || userRole?.role !== 'admin') {
    content.textContent = 'Access denied. Admins only.';
    return;
  }


  const { data: wonders, error: wondersError } = await supabase
    .from('wonders')
    .select('id, title, category')
    .order('created_at', { ascending: false });

  if (wondersError) {
    content.textContent = 'Could not load wonders.';
    console.error(wondersError);
    return;
  }

  content.innerHTML = '<h2>All Wonders</h2>';

  if (wonders.length === 0) {
    content.insertAdjacentText('beforeend', 'No wonders yet.');
    return;
  }

  const list = document.createElement('ul');
  list.className = 'list-group mt-3';

  for (const wonder of wonders) {
    const item = document.createElement('li');
    item.className = 'list-group-item';
    
    const title = document.createElement('span');
    title.textContent = `${wonder.title} (${wonder.category})`;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-sm btn-outline-danger ms-3';
    deleteButton.textContent = 'Delete';


    deleteButton.addEventListener('click', async () => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${wonder.title}"?`
      );

      if (!confirmed) return;

      deleteButton.disabled = true;
      deleteButton.textContent = 'Deleting...';

      const { error } = await supabase
        .from('wonders')
        .delete()
        .eq('id', wonder.id);

      if (error) {
        alert('Could not delete this wonder.');
        console.error(error);
        deleteButton.disabled = false;
        deleteButton.textContent = 'Delete';
        return;
      }

      item.remove();
    });

    
    const editButton = document.createElement('a');
    editButton.href = `/edit-wonder.html?id=${encodeURIComponent(wonder.id)}`;
    editButton.className = 'btn btn-sm btn-outline-primary ms-3';
    editButton.textContent = 'Edit';

    item.appendChild(title);
    item.appendChild(editButton);
    item.appendChild(deleteButton);
    list.appendChild(item);

  }

  content.appendChild(list);
}

checkAdminAccess();
