import { supabase } from "./SupabaseClient"

export const loginUser = async (email, password) => {

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) throw new Error(error)

    return data;
}

export const logout = async () => {
    try {
        await supabase.auth.signOut();
    } catch (error) {
        throw new Error(error)
    }
}