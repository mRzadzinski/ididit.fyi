import { firebaseAuth } from '$lib/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { authUser } from '$lib/stores/firebaseAuthStore';

export async function signUpWithEmail(email: string, password: string) {
	let errorMsg = '';
	try {
		const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
		authUser.set({
			uid: userCredential.user.uid,
			email: userCredential.user.email || ''
		});
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
	console.log(firebaseAuth.currentUser);
	try {
		const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
		authUser.set({
			uid: userCredential.user.uid,
			email: userCredential.user.email || ''
		});
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
