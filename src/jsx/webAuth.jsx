// src/jsx/webAuth.jsx
import {app} from './firebaseConfig.jsx';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "firebase/auth";

const auth = getAuth(app);

// Mengecek status login dan mengarahkan pengguna ke halaman yang sesuai
export function checkLogin() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = "/";
        }
    });
}

// Mengecek data pengguna yang sedang login
export function checkUser() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.uid);
                resolve(true); // Mengembalikan true jika ada user login
            } else {
                console.log("tidak ada user login");
                resolve(false); // Mengembalikan false jika tidak ada user login
            }
        });
    });
}

// Mendaftarkan pengguna baru
export async function authRegister(formPayload) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, formPayload.email, formPayload.password);
        console.log("User registered:", userCredential.user);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error(`Registration Error: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// Login pengguna dengan email dan password
export async function authLogin(formPayload) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, formPayload.email, formPayload.password);
        console.log("User logged in:", userCredential.user);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error(`Login Error: ${error.message}`);
        return { success: false, error: error.message };
    }
}

export async function authResetPass(formPayload) {
    try {
        await sendPasswordResetEmail(auth, formPayload.email);
        console.log("Permintaan Reset Password telah dikirim ke email:", formPayload.email);

        // Berikan respons sukses
        return { success: true };
    } catch (error) {
        console.error(`Reset Password Error: ${error.message}`);

        // Berikan respons error dengan pesan yang jelas
        return { success: false, error: error.message };
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
        console.log("Logout berhasil!");
        return { success: true, message: "Logout berhasil!" }; // Return berhasil
    } catch (error) {
        console.error(`Logout Error: ${error.message}`);
        return { success: false, message: error.message }; // Return gagal dengan pesan error
    }
}



// Mendapatkan UID pengguna yang sedang login
export const getUserId = () => {
    const user = auth.currentUser;
    return user ? user.uid : null;
};