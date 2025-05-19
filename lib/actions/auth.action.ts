'use server';
import { db, auth } from "@/firebase/admin"
import {cookies} from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7 * 1000;

export async function signUp(params: SignUpParams){
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get(); //We are getting the users information
                                                                        //In a doc with their id.
        if(userRecord.exists){
            return {
                success: false,
                message: "Email already exists Sign in Instead."
            };
        }

         await db.collection('users').doc(uid).set({
             name: name,
             email: email,
         })

        return {
            success: true,
            message: "Account created successfully. Please Sign In"
        }
    } catch(e: any) {
        console.error("Error creating a user", e);

        if(e.code === 'auth/email-already-exists'){
            return {
                success: false,
                message: `User already exists`,
            };
        }
        return {
            success: false,
            message: `Failed to create account`,
        };
    }
}

export async function signIn(params: SignInParams){
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return {
                success: false,
                message: `User Does not exist, Create an Accoutn Instead`,
            }
        }
        await setSessionsCookie(idToken);

    } catch(e) {
        console.error("Failed to log in", e);

        return {
            success: false,
            message: `Failed to log in`,
        }

    }
}

export async function setSessionsCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK,
    })
    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    });
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if(!userRecord.exists){
            return null
        }
        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User;

    } catch(e) {
        console.log(e);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}
