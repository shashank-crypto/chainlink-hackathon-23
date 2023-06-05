import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { FcGoogle } from "react-icons/fc";
import app from "@/config/firebase";
import {
    signInWithPopup,
    GoogleAuthProvider,
    getAuth,
    getAdditionalUserInfo,
} from "firebase/auth";

export default function Home() {
    const authenticate = async () => {
        try {
            const auth = getAuth(app);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const newUser = getAdditionalUserInfo(result).isNewUser;
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1>Welcome to Chainlink!</h1>
                <div className={styles.button} onClick={authenticate}>
                    <FcGoogle />
                    <span>Continue with Google</span>
                </div>
            </main>
        </>
    );
}