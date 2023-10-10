import {
	GoogleAuthProvider,
	signInWithRedirect,
	getRedirectResult,
	getAdditionalUserInfo
} from 'firebase/auth';
import { auth } from '../firebase';
import { firstSignIn } from '$lib/stores/firebaseStores';
import { signInError } from '$lib/stores/firebaseErrors';

export async function signInWithGoogle() {
	const provider = new GoogleAuthProvider();
	await signInWithRedirect(auth, provider);
}

export async function checkGoogleSignInStatus() {
	try {
		const result = await getRedirectResult(auth);

		if (result) {
			firstSignIn.set(getAdditionalUserInfo(result)?.isNewUser);
		}
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
