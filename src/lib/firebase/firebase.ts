import { getApps, initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { user } from '$lib/stores/authStores';

const firebaseConfig = {
	apiKey: 'AIzaSyD6o7Yq4_ORCXQqbCLo-w1MbR08EcDjeTo',
	authDomain: 'ididit.fyi',
	projectId: 'ididit-fyi',
	storageBucket: 'ididit-fyi.appspot.com',
	messagingSenderId: '756131332156',
	appId: '1:756131332156:web:89739ebc181c25ddb80339',
	measurementId: 'G-0TD15L5HEY'
};

let firebaseApp;
if (!getApps().length) {
	firebaseApp = initializeApp(firebaseConfig);
}

export const auth = getAuth(firebaseApp);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore (at least one app instance will be there)
export const db = getFirestore(firebaseApp);
export const functions = getFunctions(firebaseApp, 'us-central1');

connectAuthEmulator(auth, 'http://127.0.0.1:9099');
connectFirestoreEmulator(db, '127.0.0.1', 8080);
connectFunctionsEmulator(functions, "127.0.0.1", 5001);
export const redirectEmailLoginLink = 'http://127.0.0.1:5000/auth/login-with-link/';

// export const redirectEmailLoginLink = 'https://ididit.fyi/auth/login-with-link/';

onAuthStateChanged(auth, (currentUser) => {
	if (currentUser) {
		console.log('logged in');
	} else {
		console.log('no user');
	}
	user.set(currentUser);
});

export { firebaseApp };
