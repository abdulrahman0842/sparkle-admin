import { supabase } from './supabaseClient';

export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
}

export async function addCategory(name) {
    const payload = { name };
    const { data, error } = await supabase
        .from('categories')
        .insert(payload)
        .select()
    if (error) throw error;
    return data;
}

export async function updateCategory(id, name) {
    const payload = { name };
    const { data, error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', id)
        .select()
    if (error) throw error;
    return data;
}

export async function deleteCategory(id) {
    const { data, error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .select();
    if (error) throw error;
    return data;
}

export default {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
};
