const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

initializeApp({
  projectId: 'ez-commerce-ptrk',
});

const db = getFirestore();
const auth = getAuth();

module.exports = {
  db,
  auth,
};