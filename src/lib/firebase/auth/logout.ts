import { auth } from '$lib/firebase/firebase';
import { signOut } from 'firebase/auth';
import { logoutError } from '$lib/stores/authStores';
import { clearAppData } from '$lib/stores/dbStores';

export async function logout() {
	try {
		await signOut(auth);
		clearAppData();
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
