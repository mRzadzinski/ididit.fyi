import { auth } from '$lib/firebase/firebase';
import { signOut } from 'firebase/auth';
import { logoutError } from '$lib/stores/authStores';

export async function logout() {
	try {
		await signOut(auth);
	} catch (error) {
		if (
			typeof error === 'object' &&
			error &&
			'message' in error &&
			typeof error.message === 'string'
		)
		logoutError.set(error.message.replace('Firebase: ', '')); ;
	}
}
