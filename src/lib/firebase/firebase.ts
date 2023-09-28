import { getApps, getApp, deleteApp, initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

export default function initializeFirebase() {
	const firebaseConfig = {
		apiKey: 'AIzaSyD6o7Yq4_ORCXQqbCLo-w1MbR08EcDjeTo',
		authDomain: 'ididit-fyi.firebaseapp.com',
		projectId: 'ididit-fyi',
		storageBucket: 'ididit-fyi.appspot.com',
		messagingSenderId: '756131332156',
		appId: '1:756131332156:web:89739ebc181c25ddb80339',
		measurementId: 'G-0TD15L5HEY'
	};

	// Initialize Firebase
	let app;
	if (!getApps().length) {
		app = initializeApp(firebaseConfig);
	} else {
		app = getApp();
		deleteApp(app);
		app = initializeApp(firebaseConfig);
	}

	const analytics = getAnalytics(app);
}
