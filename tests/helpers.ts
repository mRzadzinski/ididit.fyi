import type { Page } from '@playwright/test';
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
		const response = await fetch('http://127.0.0.1:9099/emulator/v1/projects/ididit-fyi/oobCodes');
		const obj = await response.json();
		const link = (obj as OobCode).oobCodes[(obj as OobCode).oobCodes.length - 1].oobLink;

		return link;
	} catch (error) {
		console.log(error);
		throw new Error('Getting firebase auth link failed.');
	}
}

export async function loginWithEmailAndPassword(page: Page, email: string, password: string) {
	await page.goto('http://127.0.0.1:5000/auth/logout');
	await page.getByPlaceholder('email').fill(email);
	await page.getByPlaceholder('password', { exact: true }).fill(password);
	await page.getByRole('button', { name: 'Log In', exact: true }).click();
}
