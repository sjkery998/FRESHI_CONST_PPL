import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../jsx/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";


const AuthContext = createContext();


export function useAuth() {
    return useContext(AuthContext);
}


export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null); 
    const [userLoggedIn, setUserLoggedIn] = useState(false); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const { uid, email, displayName, photoURL } = user;
                setCurrentUser({ uid, email, displayName, photoURL }); 
                setUserLoggedIn(true);
            } else {
                setCurrentUser(null);
                setUserLoggedIn(false);
            }
            setLoading(false); 
        });

        
        return unsubscribe;
    }, []);

    
    const value = {
        currentUser,
        userLoggedIn,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} 
        </AuthContext.Provider>
    );
}
