import { db } from '$lib/firebase/firebase';
import { syncInProgress, userDocs } from '$lib/stores/dbStores';
import { doc, updateDoc } from 'firebase/firestore';
import { get } from 'svelte/store';

export const seedsOrderByOptions = ['Date', 'Name'];

export async function changeSeedsSortMethod(sortMethod: string) {
	// Get parent doc that contains settings
	const document = get(userDocs).filter((d) => d.doc.settings)[0];
	const id = document.docID;

	const docRef = doc(db, 'users', id);
	syncInProgress.set(true);
	await updateDoc(docRef, {
		'settings.decksOrderBy': sortMethod
	});
	syncInProgress.set(false);
	return;
}
