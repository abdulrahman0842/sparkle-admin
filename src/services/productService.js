import { supabase } from "./supabaseClient.js";

// Helper to handle and log errors consistently
const handleError = (error, context) => {
    console.error(`${context}:`, error.message || error);
    throw error;
};

export const addProduct = async (product) => {
    const { name, description, price, category, thumbnailImage, discount } = product;
    const { data, error } = await supabase
        .from("products")
        .insert([
            {
                name,
                description,
                price: Number(price),
                category,
                discount: Number(discount || 0), // Ensure number
                thumbnailImage,
            },
        ])
        .select()
        .single();

    if (error) return handleError(error, "Add Product Error");
    return data;
};

export const updateProduct = async (product) => {
    try {
        // Ensure we don't try to update the ID itself, though Supabase usually ignores it
        const { data, error } = await supabase
            .from('products')
            .update(product)
            .eq("id", product.id)
            .select()
            .single();

        if (error) throw error; // Fixed the 'new error' typo here
        return data;
    } catch (error) {
        return handleError(error, "Update Product Error");
    }
};

export const getProducts = async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false }); // Added sorting here too

        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, "Get Products Error");
    }
};

export const getProductById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, "Get Product By ID Error");
    }
};

export const getProductsByCategory = async (categoryName) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', categoryName)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data ?? [];
    } catch (error) {
        return handleError(error, "Get Products By Category Error");
    }
};

export const deleteProduct = async (id) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        return handleError(error, "Delete Product Error");
    }
};