import { auth, db } from '$lib/firebase/firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { onAuthStateChanged } from 'firebase/auth';
import sizeof from 'firestore-size';

export const accountData = writable();

onAuthStateChanged(auth, async (currentUser) => {
	if (currentUser) {
		// Get subscription info from db
		onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
			accountData.set(doc.data());

			if (doc.data()) {
				console.log(sizeof(doc.data() as Record<string, unknown>));
			}
		});
	} else {
		accountData.set(undefined);
	}
});

// Firestore training code
export const snap = await getDoc(doc(db, 'user', 'cvCgQebgCcGfW1IIeY8K'));

if (snap.exists()) {
	console.log(snap.data());
} else {
	// console.log('No such document');
}

const q = query(collection(db, 'user'), where('uid', '==', 'yP2rYrmayId1laFevRDg2cD1401k'));

const querySnapshot = await getDocs(q);
// console.log(querySnapshot.empty);
querySnapshot.forEach((doc) => {
	// doc.data() is never undefined for query doc snapshots
	console.log(doc.id, ' => ', doc.data());
});

// await addDoc(collection(db, 'user'), {
// 	name: 'Tokyo',
// 	country: 'Japan'
// });
