<script lang="ts">
	import SeedsDeck from '$components/seeds/SeedsDeck.svelte';
	import { seedsData, userDocs } from '$lib/stores/dbStores';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import Muuri from 'muuri';
	import sizeof from 'firestore-size';
	import { getDocInfoByDeckID } from './seedsLogic';
	import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { userDataDocFactory } from '$lib/db/docsBoilerplate';
	import { get } from 'svelte/store';
	import { user } from '$lib/stores/authStores';

	let listContainer: HTMLElement;
	let grid: Muuri;
	let muuriItems: (Element | null)[] = [];
	let seedListVisibilityTimeout: NodeJS.Timeout;
	let initialListFill = true;

	onMount(() => {
		// Initialize drag & drop
		grid = new Muuri(listContainer, {
			dragEnabled: true,
			dragAxis: 'y',
			dragStartPredicate: { distance: 1 },
			dragSortHeuristics: {
				sortInterval: 0,
				minDragDistance: 0
			},
			dragSortPredicate: {
				threshold: 30
			},
			itemDraggingClass: 'drag-item'
		});
		// Clear grid if not empty
		grid.remove(grid.getItems());

		// Grid events
		grid.on('dragInit', function (item, event) {
			console.log(item.getElement()?.id);
			console.log(grid.getItems().indexOf(item));
		});
		grid.on('dragEnd', function (item, event) {
			console.log(grid.getItems().indexOf(item));
		});
	});

	afterUpdate(async () => {
		// Add item to muuri if missing
		for (let i = 0; i < listContainer.children.length; i++) {
			const el = listContainer.children.item(i);
			if (!muuriItems.includes(el) && el !== null) {
				const htmlEl = el as HTMLElement;
				// Add items as hidden during initial fill (bulk adding doesn't look good)
				if (initialListFill) {
					grid.add(htmlEl, { active: false });
				} else {
					grid.add(htmlEl);
				}
				muuriItems.push(el);
			}
		}
		// Show list after initial fill
		if (initialListFill) {
			grid.show(grid.getItems());
			initialListFill = false;
		}

		// Remove muuri item if not in listContainer HTMLcollection
		muuriItems.forEach((muuriItem) => {
			let found = false;
			for (let i = 0; i < listContainer.children.length; i++) {
				if (listContainer.children.item(i) === muuriItem) {
					found = true;
				}
			}
			if (!found) {
				grid.remove(grid.getItems(muuriItem as HTMLElement));
				muuriItems = muuriItems.filter((item) => item !== muuriItem);
			}
		});
		// Sort dnd list by item order
		grid.sort(function (itemA, itemB) {
			const elA = itemA.getElement();
			const elB = itemB.getElement();
			let orderAttrA = elA ? elA.getAttribute('data-order') : null;
			let orderAttrB = elB ? elB.getAttribute('data-order') : null;

			if (orderAttrA && orderAttrB) {
				return parseInt(orderAttrA) - parseInt(orderAttrB);
			} else {
				return 0;
			}
		});
	});

	onDestroy(() => {
		if (seedListVisibilityTimeout) {
			clearTimeout(seedListVisibilityTimeout);
		}
		grid.destroy();
	});

	async function updateDeck(updatedDeck: SeedsDeckType) {
		const docInfo = getDocInfoByDeckID(updatedDeck.id);
		const parentDocID = docInfo?.doc.docID;
		const parentDocRemainingSpace = docInfo?.doc.remainingSpace;
		const prevDeck = docInfo?.doc.doc.seedsData.decks[docInfo.oldDeckIndex];
		const prevDeckSize = sizeof(prevDeck);
		const updatedDeckSize = sizeof(updatedDeck);
		let changingDeckLocation = false;
		let newDeckArray: SeedsDeckType[] = [];

		if (docInfo) {
			// Check if deck size increased
			let enoughSpaceInDoc = true;
			if (updatedDeckSize > prevDeckSize) {
				// Check if there in enough space in doc
				const spaceToAdd = updatedDeckSize - prevDeckSize;
				const spaceLeft = parentDocRemainingSpace - spaceToAdd;
				spaceLeft > 0 ? (enoughSpaceInDoc = true) : (enoughSpaceInDoc = false);
			}

			// If not enough space in parent doc, check remaining docs and add deck if possible
			// userDocs are already sorted by space left, ascending
			if (!enoughSpaceInDoc) {
				for (let i = 0; i < $userDocs.length; i++) {
					const document = $userDocs[i];
					const docSize = document.remainingSpace;
					const spaceLeft = docSize - updatedDeckSize;

					if (spaceLeft > 0 && document.docID !== parentDocID) {
						const docRef = doc(db, 'users', document.docID);
						await updateDoc(docRef, {
							'seedsData.decks': arrayUnion(updatedDeck)
						});
						console.log(docRef.id);
						changingDeckLocation = true;
						enoughSpaceInDoc = true;
						break;
					}
				}
			}

			// If none of docs can fit updated deck, create new doc and add here
			if (!enoughSpaceInDoc) {
				console.log('all docs full')
				let docObj;
				if ($user && typeof $user === 'object') {
					docObj = userDataDocFactory($user?.uid);
				}
				docObj?.seedsData.decks.push(updatedDeck);
				const docRef = await addDoc(collection(db, 'users'), docObj);
				console.log(docRef.id)
			}

			// if (enoughSpaceInDoc) {
			// 	// Prepare new decks array to replace the old one
			// 	newDeckArray = docInfo.doc.doc.seedsData.decks;
			// 	newDeckArray[docInfo.oldDeckIndex] = updatedDeck;
			// 	// Update doc in firestore
			// 	const docRef = doc(db, 'users', parentDocID);
			// 	await updateDoc(docRef, {
			// 		'seedsData.decks': newDeckArray
			// 		// toRemove: generateRandomPassword(1000000)
			// 	});
			// } else {
			// 	// Check remaining documents if there's enough space

			// 	console.log('not enough space');
			// 	// Create new doc object and populate it with deckUpdate
			// 	// const userID = docInfo.doc.doc.uid;
			// 	// const newDoc = userDataDocFactory(userID);
			// 	// newDoc.seedsData.decks.push(deckUpdate);

			// 	// // Create new doc for user
			// 	// const docRef = await addDoc(collection(db, 'users'), newDoc);
			// }
		}
	}

	export function generateRandomPassword(passLength: number) {
		const strValues = 'abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+-=';
		let password = '';
		let tempStr: string;
		for (let i = 0; i < passLength; i++) {
			tempStr = strValues.charAt(Math.round(strValues.length * Math.random()));
			password = password + tempStr;
		}
		return password;
	}
</script>

<main class="h-full w-full p-10 m-0">
	<h1 class="text-3xl mb-5">Decks</h1>
	<button class="btn mb-6">New Deck</button>
	<div class="flex flex-col gap-3 relative h-full" bind:this={listContainer}>
		{#each $seedsData.decks as deck}
			<SeedsDeck {deck} {updateDeck} />
		{/each}
	</div>
</main>
