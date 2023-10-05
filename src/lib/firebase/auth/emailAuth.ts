import { auth } from '$lib/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export async function signUpWithEmail(email: string, password: string) {
	let errorMsg = '';
	try {
		await createUserWithEmailAndPassword(auth, email, password);
	} catch (error) {
		if (
			typeof error === 'object' &&
			error &&
			'message' in error &&
			typeof error.message === 'string'
		)
			errorMsg = error.message;
	}
	return errorMsg;
}

export async function loginWithEmail(email: string, password: string) {
	let errorMsg = '';
	try {
		await signInWithEmailAndPassword(auth, email, password);
	} catch (error) {
		if (
			typeof error === 'object' &&
			error &&
			'message' in error &&
			typeof error.message === 'string'
		)
			errorMsg = error.message;
	}
	return errorMsg;
}
