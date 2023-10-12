import { auth, redirectEmailLoginLink } from '$lib/firebase/firebase';
import { sendSignInLinkToEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { registerError, loginError } from '$lib/stores/authStores';

const actionCodeSettings = {
	url: redirectEmailLoginLink,
	handleCodeInApp: true
};

export async function sendEmailLink(email: string) {
	try {
		await sendSignInLinkToEmail(auth, email, actionCodeSettings);
		window.localStorage.setItem('emailForSignIn', email);
		registerError.set('');
	} catch (error) {
		if (
			typeof error === 'object' &&
			error &&
			'message' in error &&
			typeof error.message === 'string'
		)
			registerError.set(error.message.replace('Firebase: ', ''));
	}
}

export async function loginWithPassword(email: string, password: string) {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		loginError.set('');
	} catch (error) {
		if (
			typeof error === 'object' &&
			error &&
			'message' in error &&
			typeof error.message === 'string'
		)
			loginError.set(error.message.replace('Firebase: ', ''));
	}
}
