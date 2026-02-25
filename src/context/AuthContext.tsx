import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types/user';

interface AuthContextType {
    usuario: User | null;
    isAuthenticated: boolean;
    isLoading: boolean
    loginUsuario: (usuario: User) => void;
    logoutUsuario: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('name');
        const email = localStorage.getItem('email');

        if (token && name && email) {
            setUsuario({ token, name, email });
        }
        setIsLoading(false)
    }, []);

    const loginUsuario = (usuario: User) => {
        localStorage.setItem('token', usuario.token);
        localStorage.setItem('name', usuario.name);
        localStorage.setItem('email', usuario.email);
        setUsuario(usuario);
    };

    const logoutUsuario = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, isAuthenticated: !!usuario, isLoading, loginUsuario, logoutUsuario }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
};