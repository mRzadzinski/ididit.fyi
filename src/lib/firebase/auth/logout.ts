import { firebaseAuth } from '$lib/firebase/firebase';
import { signOut } from 'firebase/auth';
import { authUser } from '$lib/stores/firebaseAuthStore';

export async function logout() {
	let errorMsg = '';
	try {
		await signOut(firebaseAuth);
		authUser.set(null);
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
