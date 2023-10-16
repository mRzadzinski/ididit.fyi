import fetch from 'node-fetch';

interface OobCode {
	oobCodes: [
		{
			email: string;
			requestType: string;
			oobCode: string;
			oobLink: string;
		}
	];
}

export async function getFirebaseAuthLink() {
	try {
		const response = await fetch('http://localhost:9099/emulator/v1/projects/ididit-fyi/oobCodes');
		const obj = await response.json();
		const link = (obj as OobCode).oobCodes[(obj as OobCode).oobCodes.length - 1].oobLink;

		return link;
	} catch (error) {
		console.log(error);
		throw new Error('Getting firebase auth link failed.');
	}
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
