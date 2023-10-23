import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const citiesRef = collection(db, 'cities');

await setDoc(doc(citiesRef, 'SF'), {
	name: 'San Francisco',
	state: 'CA',
	country: 'USA',
	capital: false,
	population: 860000,
	regions: ['west_coast', 'norcal']
});
await setDoc(doc(citiesRef, 'LA'), {
	name: 'Los Angeles',
	state: 'CA',
	country: 'USA',
	capital: false,
	population: 3900000,
	regions: ['west_coast', 'socal']
});
await setDoc(doc(citiesRef, 'DC'), {
	name: 'Washington, D.C.',
	state: null,
	country: 'USA',
	capital: true,
	population: 680000,
	regions: ['east_coast']
});
await setDoc(doc(citiesRef, 'TOK'), {
	name: 'Tokyo',
	state: null,
	country: 'Japan',
	capital: true,
	population: 9000000,
	regions: ['kanto', 'honshu']
});
await setDoc(doc(citiesRef, 'BJ'), {
	name: 'Beijing',
	state: null,
	country: 'China',
	capital: true,
	population: 21500000,
	regions: ['jingjinji', 'hebei']
});


const docSnap = await getDoc(doc(db, 'cities', 'SF', 'homes', 'w7PY7LlH5SHEEYhuGKL7'));
console.log(docSnap.data())