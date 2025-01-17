import React, { createContext, useContext, useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../jsx/firebaseConfig"; // pastikan import app firebase Anda
import { getUserId } from "../../jsx/webAuth";

const FirebaseContext = createContext();

export const useFirebase = () => {
    return useContext(FirebaseContext);
};

export const FirebaseProvider = ({ children }) => {
    const [Notifications, setData] = useState(null);
    const [isThereNewNotif, setIsThereNewNotif] = useState(false);

    useEffect(() => {
        const uID = getUserId();
        const dataRef = ref(db, `Accounts/${uID}/Notifications`);
        const unsubscribe = onValue(dataRef, (snapshot) => {
            const value = snapshot.val();
            setData(value);
        });
        return () => unsubscribe();
    }, [db]);

    useEffect(() => {
        if (Notifications) {
            // Cek apakah ada notifikasi yang belum dibaca
            const hasUnreadNotif = Object.values(Notifications).some((notif) => !notif.isRead);
            setIsThereNewNotif(hasUnreadNotif);
        }
    }, [Notifications]);

    return (
        <FirebaseContext.Provider value={{ Notifications, isThereNewNotif }}>
            {children}
        </FirebaseContext.Provider>
    );
};
