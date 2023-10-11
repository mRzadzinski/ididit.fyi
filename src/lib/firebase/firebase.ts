import { getApps, initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, onAuthStateChanged } from 'firebase/auth';
import { user } from '$lib/stores/firebaseStores';

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

// Authentication
const auth = getAuth(firebaseApp);
// connectAuthEmulator(auth, 'http://127.0.0.1:9099');
// const redirectEmailSignInLink = 'http://127.0.0.1:5000/auth/sign-in-with-link/';
const redirectEmailSignInLink = 'https://ididit.fyi/auth/sign-in-with-link/';

onAuthStateChanged(auth, (currentUser) => {
	if (currentUser) {
		console.log('signed in');
	} else {
		console.log('no user');
	}
	user.set(currentUser);
});

export { firebaseApp, auth, redirectEmailSignInLink };
