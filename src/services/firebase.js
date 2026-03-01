import app from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Initialize Firebase (React Native Firebase auto-initializes with google-services.json)
// But we export the module instances for clean usage across the app.

export const firebaseApp = app;
export const firebaseAuth = auth;
export const firebaseFirestore = firestore;
export const firebaseStorage = storage;

export default {
    app,
    auth,
    firestore,
    storage
};
