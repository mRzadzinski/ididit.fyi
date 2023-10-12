import { getApps, initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, onAuthStateChanged } from 'firebase/auth';
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

// Authentication
const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, 'http://127.0.0.1:9099');
const redirectEmailLoginLink = 'http://127.0.0.1:5000/auth/login-with-link/';
// const redirectEmailLoginLink = 'https://ididit.fyi/auth/login-with-link/';

onAuthStateChanged(auth, (currentUser) => {
	if (currentUser) {
		console.log('logged in');
	} else {
		console.log('no user');
	}
	user.set(currentUser);
});

export { firebaseApp, auth, redirectEmailLoginLink };
