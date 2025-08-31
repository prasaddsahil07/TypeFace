import { createContext, useContext, useState, useEffect } from "react";
import api, { authAPI } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    // Restore session on page reload
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await authAPI.getUser(); // calls /auth/me
                setUser(res.data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const res = await authAPI.login(credentials);
            setUser(res.data.user);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            throw err; // so the component can still catch it
        }
    };

    const logout = async () => {
        await authAPI.logout(); // backend clears cookie
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
