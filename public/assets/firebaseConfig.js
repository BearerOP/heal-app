const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: process.env.fb_apiKey,
  authDomain: process.env.fb_authDomain,
  projectId: process.env.fb_projectId,
  storageBucket: process.env.fb_storageBucket,
  messagingSenderId: process.env.fb_messagingSenderId,
  appId: process.env.fb_appId,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage };
