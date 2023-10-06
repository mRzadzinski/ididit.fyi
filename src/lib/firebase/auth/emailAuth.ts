import { auth } from '$lib/firebase/firebase';
import {
	signInWithEmailAndPassword
} from 'firebase/auth';

export async function loginWithEmailLink(email: string) {
	let errorMsg = '';
	try {
		// await createUserWithEmailAndPassword(auth, email, password)
		// .then(async (cred) => await sendEmailVerification(cred.user));
	
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

export async function loginWithPassword(email: string, password: string) {
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
