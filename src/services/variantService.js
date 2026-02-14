import { supabase } from "./SupabaseClient";
export const getVariantsByProductId = async (productId) => {
    try {
        const { data, error } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', productId)
            .order('color', { ascending: true });
        if (error) throw new Error(error.message);
        return data || [];
    } catch (err) {
        console.error('Get variants error:', err);
        throw new Error(err.message || err);
    }
};

export const getVariantById = async (variantId) => {
    try {
        const { data, error } = await supabase
            .from('product_variants')
            .select('*')
            .eq('id', variantId)
            .maybeSingle();
        if (error) throw new Error(error.message);
        return data;
    } catch (err) {
        console.error('Get variant error:', err);
        throw new Error(err.message || err);
    }
};

export const addVariant = async (variant) => {
    try {
        const { data, error } = await supabase
            .from('product_variants')
            .insert([variant])
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    } catch (err) {
        console.error('Add variant error:', err);
        throw new Error(err.message || err);
    }
};

export const updateVariant = async (variant) => {
    // console.log('varr', variant)
    const { color, price, images } = variant;
    // console.log(color, price, images)
    try {
        const { data, error } = await supabase
            .from('product_variants')
            .update({ color: color, price: price, images: images })
            .eq('id', variant.id)
            .select()
        console.log('data', data, 'error', error)
        if (error) throw new Error(error.message);
        return data;
    } catch (err) {
        console.error('Update variant error:', err);
        throw new Error(err.message || err);
    }
};

export const deleteVariant = async (variantId) => {
    try {
        const { data, error } = await supabase
            .from('product_variants')
            .delete()
            .eq('id', variantId)
            .select();
        console.log('data', data, 'errpr', error)
        if (error) throw new Error(error.message);
        return data;
    } catch (err) {
        console.error('Delete variant error:', err);
        throw new Error(err.message || err);
    }
};