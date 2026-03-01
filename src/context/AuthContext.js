import React, { createContext, useState, useEffect } from 'react';
import { firebaseAuth, firebaseFirestore } from '../services/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = firebaseAuth().onAuthStateChanged(async (authUser) => {
            if (authUser) {
                try {
                    const userDoc = await firebaseFirestore().collection('users').doc(authUser.uid).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        setUser({ ...authUser, ...userData });
                        setRole(userData.role);
                    } else {
                        // Fallback for missing user profile
                        setUser(authUser);
                        setRole('member');
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setUser(authUser);
                    setRole('member');
                }
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        return firebaseAuth().signInWithEmailAndPassword(email, password);
    };

    const logout = async () => {
        return firebaseAuth().signOut();
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
