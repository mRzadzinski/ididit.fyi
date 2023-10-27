import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import { getAuth } from 'firebase-admin/auth';

admin.initializeApp();

export const onRegister = functions.auth.user().onCreate((user) => {
	return admin.firestore().collection('users').doc(user.uid).set({
		email: user.email,
		uid: user.uid,
		upvotedOn: []
	});
});

export const onUserDelete = functions.auth.user().onDelete((user) => {
	const doc = admin.firestore().collection('users').doc(user.uid);
	return doc.delete();
});



// // Iterate through all users
// let thousands = 0;
// const listAllUsers = (nextPageToken?: string) => {
// 	// List batch of users, 1000 at a time.
// 	getAuth()
// 		.listUsers(1000, nextPageToken)
// 		.then((listUsersResult) => {
// 			listUsersResult.users.forEach((userRecord) => {
// 				admin.firestore().collection('users').doc(userRecord.uid).set({
// 					email: userRecord.email,
// 					uid: userRecord.uid,
// 					friends: ['poor Joe', 'nobody']
// 				});
// 			});
// 			thousands++;
// 			if (listUsersResult.pageToken && thousands < 10) {
// 				// List next batch of users.
// 				listAllUsers(listUsersResult.pageToken);
// 			}
// 		})
// 		.catch((error) => {
// 			console.log('Error listing users:', error);
// 		});
// };
// // Start listing users from the beginning, 1000 at a time.
// listAllUsers();
