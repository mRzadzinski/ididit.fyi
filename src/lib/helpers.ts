import { init } from '@paralleldrive/cuid2';

export const uniqueID: () => string = init({
	length: 24,
	fingerprint: 'a-custom-host-fingerprint'
});

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

export function generateRandomEmail() {
	const strValues = 'abcdefghijklmnopqrstuvwxyz1234567890';
	let strEmail = '';
	let strTmp: string;
	for (let i = 0; i < 10; i++) {
		strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
		strEmail = strEmail + strTmp;
	}
	strTmp = '';
	strEmail = strEmail + '@gmail.com';

	return strEmail;
}

export function shuffleArray(array: unknown[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
