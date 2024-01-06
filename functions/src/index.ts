import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { userMainDocFactory } from './docsBoilerplate';
// import { HttpsError, onCall } from 'firebase-functions/v1/https';
// import { FieldValue } from 'firebase-admin/firestore';
// import { getAuth } from 'firebase-admin/auth';

admin.initializeApp();

export const onRegister = functions.auth.user().onCreate(async (user) => {
	// Create user document in firestore

	// Anonymous account with predefined data
	const docs = await admin
		.firestore()
		.collection('users')
		.where('uid', '==', '4yPfnKzJGDR77QqmXxbwFbLngCQ2')
		.get();

	let predefinedData = undefined;
	if (docs.docs[0]) {
		predefinedData = (await docs.docs[0].ref.get()).data();
	}

	if (user.providerData.length === 0 && predefinedData) {
		predefinedData.uid = user.uid;
		await admin.firestore().collection('users').doc(user.uid).set(predefinedData);
	}
	// Normal account
	else {
		await admin.firestore().collection('users').doc(user.uid).set(userMainDocFactory(user.uid));
	}
	return null;
});

export const onUserDelete = functions.auth.user().onDelete(async (user) => {
	// Delete all user data
	const docs = await admin.firestore().collection('users').where('uid', '==', user.uid).get();
	for (let i = 0; i < docs.size; i++) {
		docs.docs[i].ref.delete();
	}

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
// // let thousands = 0;
// const listAllUsers = (nextPageToken?: string) => {
// 	// List batch of users, 1000 at a time.
// 	getAuth()
// 		.listUsers(1000, nextPageToken)
// 		.then((listUsersResult) => {
// 			listUsersResult.users.forEach(async (userRecord) => {
// 				console.log('user', userRecord.toJSON());

// 				// get old doc
// 				const docs = await admin
// 					.firestore()
// 					.collection('users')
// 					.where('uid', '==', userRecord.uid)
// 					.get();
// 				const oldDoc = (await docs.docs[0].ref.get()).data();
// 				console.log('user document');
// 				console.log(oldDoc);

// 				// Create doc for users without main doc
// 				if (!oldDoc) {
// 					await admin
// 						.firestore()
// 						.collection('users')
// 						.doc(userRecord.uid)
// 						.set(userMainDocFactory(userRecord.uid));
// 				}
// 			});
// 		})
// 		.catch((error) => {
// 			console.log('Error listing users:', error);
// 		});
// };
// // Start listing users from the beginning, 1000 at a time.
// listAllUsers();
