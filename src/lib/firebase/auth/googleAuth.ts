import {
	GoogleAuthProvider,
	signInWithRedirect,
	getRedirectResult,
	getAdditionalUserInfo
} from 'firebase/auth';
import { auth } from '../firebase';
import { firstLogin, loginError } from '$lib/stores/authStores';

export async function loginWithGoogle() {
	const provider = new GoogleAuthProvider();
	await signInWithRedirect(auth, provider);
}

export async function checkForFirstLogin() {
	try {
		const result = await getRedirectResult(auth);

		if (result) {
			firstLogin.set(getAdditionalUserInfo(result)?.isNewUser);
		}
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
