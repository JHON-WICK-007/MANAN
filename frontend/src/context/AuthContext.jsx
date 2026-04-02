import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize auth state from localStorage on mount
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (userData, authToken) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", authToken);
        setUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);
        navigate("/");
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        navigate("/");
    };

    const updateUser = (updatedUserData) => {
        const mergedUser = { ...user, ...updatedUserData };
        localStorage.setItem("user", JSON.stringify(mergedUser));
        setUser(mergedUser);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
