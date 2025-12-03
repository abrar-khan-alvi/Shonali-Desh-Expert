import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ExpertData } from '../types';
import { loginExpert, updateExpertStatus, updateExpertPassword } from '../services/firebase.service';

interface ExpertContextType {
    expert: ExpertData | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    toggleAvailability: () => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const ExpertContext = createContext<ExpertContextType | undefined>(undefined);

export const ExpertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [expert, setExpert] = useState<ExpertData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load from local storage on mount
    useEffect(() => {
        const storedExpert = localStorage.getItem('expertData');
        if (storedExpert) {
            try {
                setExpert(JSON.parse(storedExpert));
            } catch (e) {
                console.error("Failed to parse stored expert data", e);
                localStorage.removeItem('expertData');
            }
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginExpert(email, password);
            if (data) {
                setExpert(data);
                localStorage.setItem('expertData', JSON.stringify(data));
                return true;
            } else {
                setError('Invalid email or password');
                return false;
            }
        } catch (err) {
            setError('Failed to login. Please check your connection.');
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setExpert(null);
        localStorage.removeItem('expertData');
    };

    const toggleAvailability = async () => {
        if (!expert) return;

        const newStatus = !expert.hasAvailable;
        try {
            // Optimistic update
            const updatedExpert = { ...expert, hasAvailable: newStatus };
            setExpert(updatedExpert);
            localStorage.setItem('expertData', JSON.stringify(updatedExpert));

            await updateExpertStatus(expert.id, newStatus);
        } catch (err) {
            console.error("Failed to update availability", err);
            // Revert on error
            const revertedExpert = { ...expert, hasAvailable: !newStatus };
            setExpert(revertedExpert);
            localStorage.setItem('expertData', JSON.stringify(revertedExpert));
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
        if (!expert) return false;

        // Verify current password (in a real app, re-authenticate with Firebase Auth)
        if (expert.password !== currentPassword) {
            return false;
        }

        try {
            await updateExpertPassword(expert.id, newPassword);
            // Update local state with new password
            const updatedExpert = { ...expert, password: newPassword };
            setExpert(updatedExpert);
            localStorage.setItem('expertData', JSON.stringify(updatedExpert));
            return true;
        } catch (err) {
            console.error("Failed to change password", err);
            return false;
        }
    };

    return (
        <ExpertContext.Provider value={{ expert, loading, error, login, logout, toggleAvailability, changePassword }}>
            {children}
        </ExpertContext.Provider>
    );
};

export const useExpert = () => {
    const context = useContext(ExpertContext);
    if (context === undefined) {
        throw new Error('useExpert must be used within an ExpertProvider');
    }
    return context;
};
