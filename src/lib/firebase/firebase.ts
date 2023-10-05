import { getApps, initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, connectAuthEmulator, onAuthStateChanged } from 'firebase/auth';
import { user } from '$lib/stores/firebaseAuthStore';

const firebaseConfig = {
	apiKey: 'AIzaSyD6o7Yq4_ORCXQqbCLo-w1MbR08EcDjeTo',
	authDomain: 'ididit-fyi.firebaseapp.com',
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

const analytics = getAnalytics(firebaseApp);

// Authentication
const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, 'http://127.0.0.1:9099');
onAuthStateChanged(auth, (currentUser) => {
	if (currentUser) {
		console.log('user logged');
	} else {
		console.log('no user');
	}
	user.set(currentUser);
	user.subscribe((value) => console.log(value));
});

export { firebaseApp, auth };
