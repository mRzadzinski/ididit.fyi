import { auth } from '$lib/firebase/firebase';
import { signOut } from 'firebase/auth';
import { signOutError } from '$lib/stores/firebaseErrors';

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
		signOutError.set(error.message.replace('Firebase: ', '')); ;
	}
}
