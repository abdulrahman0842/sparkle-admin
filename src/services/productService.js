import { supabase } from "./supabaseClient.js";

export const addProduct = async (product) => {
    console.log(product)
    const { name, description, price, category, images } = product;

    const { data, error } = await supabase
        .from("products")
        .insert([
            {
                name,
                description,
                price: Number(price),
                category,
                images,
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
