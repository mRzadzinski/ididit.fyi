import { db } from '$lib/firebase/firebase';
import { syncInProgress, userDocs } from '$lib/stores/dbStores';
import { doc, updateDoc } from 'firebase/firestore';
import { get } from 'svelte/store';

export async function updateSortMethod(target: string, sortMethod: string) {
	const orderByProp = `${target}OrderBy`;

	// Get parent doc that contains settings
	const document = get(userDocs).filter((d) => d.doc.settings)[0];
	const id = document.docID;
	const settingsOrderPath = `settings.${orderByProp}`;

	const docRef = doc(db, 'users', id);
	syncInProgress.set(true);
	await updateDoc(docRef, {
		[settingsOrderPath]: sortMethod
	});
	syncInProgress.set(false);
}