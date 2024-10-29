const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { getDatabase } = require('firebase-admin/database');

initializeApp({
  projectId: 'ez-commerce-ptrk',
  databaseURL: 'http://127.0.0.1:9000/?ns=ez-commerce-ptrk-default-rtdb',
});

const db = getFirestore();
const auth = getAuth();
const realtimeDB = getDatabase();

module.exports = {
  db,
  auth,
  realtimeDB,
};
