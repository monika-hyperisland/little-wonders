
import { supabase } from './supabase.js';

export async function uploadWonderPhoto(wonderId, file) {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('You must be logged in to upload photos.');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file.');
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${crypto.randomUUID()}.${extension}`;
  const storagePath = `${user.id}/${wonderId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('wonder-photos')
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { error: databaseError } = await supabase
    .from('wonder_photos')
    .insert({
      wonder_id: wonderId,
      user_id: user.id,
      storage_path: storagePath,
    });

  if (databaseError) {
    await supabase.storage
      .from('wonder-photos')
      .remove([storagePath]);

    throw databaseError;
  }

  return storagePath;
}


export async function getWonderPhotoUrl(wonderId) {
  const { data: photos, error } = await supabase
    .from('wonder_photos')
    .select('storage_path')
    .eq('wonder_id', wonderId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  if (!photos || photos.length === 0) {
    return null;
  }

  const { data, error: urlError } = await supabase.storage
    .from('wonder-photos')
    .createSignedUrl(photos[0].storage_path, 3600);

  if (urlError) {
    throw urlError;
  }

  return data.signedUrl;
}

export async function downloadWonderPhoto(wonderId) {
  const { data: photos, error } = await supabase
    .from('wonder_photos')
    .select('storage_path')
    .eq('wonder_id', wonderId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;

  if (!photos || photos.length === 0) {
    throw new Error('No photo found for this wonder.');
  }

  const storagePath = photos[0].storage_path;

  const { data: file, error: downloadError } = await supabase.storage
    .from('wonder-photos')
    .download(storagePath);

  if (downloadError) throw downloadError;

  return {
    file,
    filename: storagePath.split('/').pop(),
  };
}
