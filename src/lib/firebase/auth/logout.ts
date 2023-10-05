import { auth } from '$lib/firebase/firebase';
import { signOut } from 'firebase/auth';

export async function logout() {
	let errorMsg = '';
	try {
		await signOut(auth);
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
