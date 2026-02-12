import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔥 On app load → try to refresh token
    useEffect(() => {
        const refresh = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:8000/auth/refresh",
                    {},
                    { withCredentials: true } // send refresh cookie
                );

                setAccessToken(response.data.access_token);

                // Optional: if refresh returns user info
                setUser(response.data.user || { loggedIn: true });

            } catch (err) {
                setUser(null);
                setAccessToken(null);
            } finally {
                setLoading(false);
            }
        };

        refresh();
    }, []);

    const login = (userData, token) => {
        setAccessToken(token);
        setUser(userData);
    };

    const logout = async () => {
        await axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true });
        setUser(null);
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
