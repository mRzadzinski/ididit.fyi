import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { userDataDoc, userMainDoc } from './helpers';
// import { getAuth } from 'firebase-admin/auth';
// import { HttpsError, onCall } from 'firebase-functions/v1/https';
// import { FieldValue } from 'firebase-admin/firestore';
// import { getAuth } from 'firebase-admin/auth';

admin.initializeApp();

export const onRegister = functions.auth.user().onCreate(async (user) => {
	// Create user documents in firestore
	await admin.firestore().collection('users').doc(user.uid).set(userMainDoc);
	await admin.firestore().collection('users').doc(user.uid).collection('data').add(userDataDoc);

	return null;
});

export const onUserDelete = functions.auth.user().onDelete(async (user) => {
	// Delete all user data
	const doc = admin.firestore().collection('users').doc(user.uid);
	const data = await admin.firestore().collection('users').doc(user.uid).collection('data').get();

	await doc.delete();
	data.docs.forEach(async (item) => await item.ref.delete());

	return null;
});

// // let user upvote only once
// export const upvote = onCall(async (requestData, context) => {
// 	// check auth state
// 	if (!context.auth) {
// 		throw new HttpsError('permission-denied', 'unauthenticated');
// 	}

// 	// get refs for user doc & course doc
// 	const user = admin.firestore().collection('users').doc(context.auth.uid);
// 	const course = admin.firestore().collection('courses').doc(requestData.id);

// 	const doc = await user.get();
// 	const userData = doc.data();
// 	// check if user hasn't already upvoted the course
// 	if (userData && userData.upvotedOn.includes(requestData.id)) {
// 		throw new HttpsError('permission-denied', 'already voted');
// 	}

// 	// update user upvoted array
// 	if (userData) {
// 		await user.update({
// 			upvotedOn: [...userData.upvotedOn, requestData.id]
// 		});
// 	}
// 	// update course vote count
// 	return course.update({
// 		upvotes: FieldValue.increment(1)
// 	});
// });

// // firestore trigger for tracking activity
// export const logActivities = functions.firestore
// 	.document('/{collection}/{id}')
// 	.onDelete((snap, context) => {
// 		console.log(snap.data());

// 		const collection = context.params.collection;
// 		const id = context.params.id;

// 		const activities = admin.firestore().collection('activities');

// 		if (collection === 'courses') {
// 			return activities.add({ text: 'a new course was added' });
// 		}
// 		if (collection === 'users') {
// 			return activities.add({ text: 'a new user registered' });
// 		}
// 		return null;
// 	});

// // Iterate through all users
// let thousands = 0;
// const listAllUsers = (nextPageToken?: string) => {
// 	// List batch of users, 1000 at a time.
// 	getAuth()
// 		.listUsers(1000, nextPageToken)
// 		.then((listUsersResult) => {
// 			listUsersResult.users.forEach((userRecord) => {
// 				// Do something for each user
// 				admin.firestore().collection('users').doc(userRecord.uid).set(userMainDoc);

// 				admin
// 					.firestore()
// 					.collection('users')
// 					.doc(userRecord.uid)
// 					.collection('data')
// 					.add(userDataDoc);
// 			});
// 			thousands++;
// 			if (listUsersResult.pageToken && thousands < 1) {
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
