import { supabase } from "./supabaseClient.js";

export const addProduct = async (product) => {
    const { name, description, price, category, thumbnailImage } = product;
    const { data, error } = await supabase
        .from("products")
        .insert([
            {
                name,
                description,
                price: Number(price),
                category,
                thumbnailImage,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    return data;
};

export const updateProduct = async (product) => {
    try {
        let { data, error } = await supabase.from('products').update(product).eq("id", product.id).select().single()
        console.log("DATA:", data, "   ERROR:", error)
        if (error) throw new Error(error)
        return data
    } catch (error) {
        console.log("Error:", error)
        throw new Error(error)
    }
}

export const getProducts = async () => {
    try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw new Error(error)
        return data;
    } catch (error) {
        console.log('Error:', error)
        throw new Error(error)

    }
}

export const getProductById = async (id) => {
    try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle()
        if (error) throw new Error(error)
        return data
    } catch (error) {
        console.log("Error:", error)
        throw new Error(error)
    }

}

export const deleteProduct = async (id) => {
    try {
        const { data, error } = await supabase.from('products').delete().eq('id', id).select();
        console.log(data,error)
        if (error) {
            console.error('Supabase delete error:', error);
            throw new Error(error.message || 'Failed to delete product');
        }
        return data;
    } catch (err) {
        console.error('Delete product error:', err);
        throw new Error(err.message || err);
    }
}
