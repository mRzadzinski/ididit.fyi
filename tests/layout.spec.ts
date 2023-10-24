import { test, expect } from '@playwright/test';
import { loginWithEmailAndPassword } from './helpers';

const email = 'orange.otter.966@example.com';
const password = 'LjA43iXderUhpkg';
// const userUID = 'yP2rYrmayId1laFevRDg2cD1401k';

test.beforeEach(async ({ page }) => {
	loginWithEmailAndPassword(page, email, password);
});

test.describe('Test app layout', () => {
    test('my test', async ({ page }) => {
        // await expect(page).toHaveURL('http://127.0.0.1:5000/app');
      });
})

