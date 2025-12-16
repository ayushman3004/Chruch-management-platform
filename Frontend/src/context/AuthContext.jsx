import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await authService.getCurrentUser();
                setUser(data.user);
            } catch (error) {
                // Not authenticated
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Invalid email or password'
            };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const hasPermission = (requiredRole) => {
        if (!user) return false;
        const roleHierarchy = { public: 1, member: 2, admin: 3 };
        return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
    };

    const refreshUser = async () => {
        try {
            const data = await authService.getCurrentUser();
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: 'Failed to refresh user data' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, hasPermission, refreshUser, isAuthenticated: !!user, loading }}>
            {loading ? (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                    <div className="text-white text-xl">Loading...</div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
