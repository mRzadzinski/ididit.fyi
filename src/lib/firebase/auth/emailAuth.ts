import { auth, redirectEmailSignInLink } from '$lib/firebase/firebase';
import {
	sendSignInLinkToEmail,
	signInWithEmailAndPassword,
	getAdditionalUserInfo
} from 'firebase/auth';
import { signUpError, signInError } from '$lib/stores/firebaseErrors';
import { firstSignIn } from '$lib/stores/firebaseStores';

const actionCodeSettings = {
	url: redirectEmailSignInLink,
	handleCodeInApp: true
};

export async function sendEmailLink(email: string) {
	try {
		await sendSignInLinkToEmail(auth, email, actionCodeSettings);
		window.localStorage.setItem('emailForSignIn', email);
		signUpError.set('');
	} catch (error) {
		if (
			typeof error === 'object' &&
			error &&
			'message' in error &&
			typeof error.message === 'string'
		)
			signUpError.set(error.message.replace('Firebase: ', ''));
	}
}

export async function signInWithPassword(email: string, password: string) {
	try {
		const userInfo = await signInWithEmailAndPassword(auth, email, password);
		firstSignIn.set(getAdditionalUserInfo(userInfo)?.isNewUser);
		signInError.set('');
	} catch (error) {
		if (
			typeof error === 'object' &&
			error &&
			'message' in error &&
			typeof error.message === 'string'
		)
			signInError.set(error.message.replace('Firebase: ', ''));
	}
}
