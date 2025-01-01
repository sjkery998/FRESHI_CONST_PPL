// src/jsx/webAuth.jsx
import app from './firebaseConfig.jsx';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

const auth = getAuth(app);

// Mengecek status login dan mengarahkan pengguna ke halaman yang sesuai
export function checkLogin() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (window.location.href.includes('webapp-auth.html')) {
                window.location.href = "home.html";
            }
        } else {
            if (!window.location.href.includes('webapp-auth.html')) {
                window.location.href = "webapp-auth.html";
            }
        }
    });
}

// Mengecek data pengguna yang sedang login
export function checkUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user.metadata);
        }
    });
}

// Mendaftarkan pengguna baru
export async function authRegister(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered:", userCredential.user);
    } catch (error) {
        console.error(`Registration Error: ${error.message}`);
    }
}

// Login pengguna dengan email dan password
export async function authLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
    } catch (error) {
        console.error(`Login Error: ${error.message}`);
    }
}

// Login menggunakan Google OAuth
export async function OAuthLogin() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Google User logged in:", result.user);
    } catch (error) {
        console.error(`OAuth Login Error: ${error.message}`);
    }
}

// Logout pengguna
export async function authLogout() {
    try {
        await signOut(auth);
        console.log('Logout berhasil!');
    } catch (error) {
        console.error(`Logout Error: ${error.message}`);
    }
}

// Mendapatkan UID pengguna yang sedang login
export function getUserId() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user.uid); // Mengembalikan UID pengguna
            } else {
                reject("No user is logged in."); // Error jika tidak ada pengguna
            }
        });
    });
}
