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


    // -----------------------------------------
    // 🔥 2️⃣ INTERCEPTORS (TOKEN LOGIC)
    // -----------------------------------------
    useEffect(() => {

        // Prevent multiple refresh calls at same time
        let isRefreshing = false;

        // Queue for requests waiting for token refresh
        let failedQueue = [];

        // Helper to resolve queued requests
        const processQueue = (error, token = null) => {
            failedQueue.forEach(promise => {
                if (error) {
                    promise.reject(error);
                } else {
                    promise.resolve(token);
                }
            });

            failedQueue = [];
        };

        // -----------------------------
        // REQUEST INTERCEPTOR
        // -----------------------------
        // Automatically attach access token
        const requestInterceptor = axios.interceptors.request.use(
            config => {
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            }
        );

        // -----------------------------
        // RESPONSE INTERCEPTOR
        // -----------------------------
        const responseInterceptor = axios.interceptors.response.use(
            response => response,

            async error => {
                const originalRequest = error.config;

                // If error is not 401 → just reject
                if (error.response?.status !== 401) {
                    return Promise.reject(error);
                }

                // Prevent infinite loop:
                // If refresh endpoint itself fails → do not retry
                if (originalRequest.url.includes("/auth/refresh")) {
                    return Promise.reject(error);
                }

                // Prevent retrying same request forever
                if (originalRequest._retry) {
                    return Promise.reject(error);
                }

                originalRequest._retry = true;

                // -----------------------------
                // HANDLE MULTIPLE 401 REQUESTS
                // -----------------------------
                if (isRefreshing) {
                    // If refresh already running,
                    // push request into queue and wait
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest);
                    });
                }

                isRefreshing = true;

                try {
                    // Attempt to refresh token
                    const response = await axios.post(
                        "http://localhost:8000/auth/refresh",
                        {},
                        { withCredentials: true }
                    );

                    const newToken = response.data.access_token;

                    // Update context state
                    setAccessToken(newToken);

                    // Resolve all queued requests
                    processQueue(null, newToken);

                    // Retry original failed request
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axios(originalRequest);

                } catch (err) {
                    // Refresh failed → logout user
                    processQueue(err, null);
                    setAccessToken(null);
                    setUser(null);
                    return Promise.reject(err);

                } finally {
                    isRefreshing = false;
                }
            }
        );

        // -----------------------------------------
        // CLEANUP
        // -----------------------------------------
        // Very important:
        // Without ejecting, interceptors stack
        // every time accessToken changes.
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };

    }, [accessToken]); // re-run when token changes


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
