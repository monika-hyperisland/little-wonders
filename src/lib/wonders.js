
import { supabase } from './supabase.js';

export async function getWonders() {
  const { data, error } = await supabase
    .from('wonders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}


export async function createWonder({ category, title, description }) {
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error('You must be logged in to create a wonder.');
  }

  const { data, error } = await supabase
    .from('wonders')
    .insert({
      user_id: userData.user.id,
      category,
      title,
      description,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function updateWonder(id, { category, title, description }) {
  const { data, error } = await supabase
    .from('wonders')
    .update({
      category,
      title,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getWonderById(id) {
  const { data, error } = await supabase
    .from('wonders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteWonder(id) {
  const { error } = await supabase
    .from('wonders')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}
