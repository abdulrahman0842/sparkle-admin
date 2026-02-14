import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { supabase } from "../services/SupabaseClient";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setsession] = useState(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {

        supabase.auth.getSession().then(({ data }) => {
            setsession(data.session);
            setloading(false)
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setsession(session)
        })

        return () => {
            subscription.unsubscribe();
        }
    }, [])

    return (
        <AuthContext.Provider value={{ session, loading }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext) 