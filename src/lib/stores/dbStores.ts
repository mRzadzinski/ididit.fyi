import { db } from '$lib/firebase/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

// const uid = 'yP2rYrmayId1laFevRDg2cD1401k';
export const snap = await getDoc(doc(db, 'user', 'cvCgQebgCcGfW1IIeY8K'));

if (snap.exists()) {
	console.log('Document exists');
	console.log(snap.data());
} else {
	console.log('No such document');
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
