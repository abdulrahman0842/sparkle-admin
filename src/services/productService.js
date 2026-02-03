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
