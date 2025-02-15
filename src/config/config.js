// src/config/config.js
import { initializeApp, cert, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';
import fs from 'fs';

config(); // Carga las variables de entorno

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
let firebaseConfig = { credential: applicationDefault() };

if (credentialsPath) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    firebaseConfig = { credential: cert(serviceAccount) };
  } catch (error) {
    console.error(`❌ Error al cargar credenciales: ${error.message}`);
    process.exit(1);
  }
}

if (!getApps().length) {
  initializeApp(firebaseConfig);
  console.log('✅ Firebase conectado correctamente');
}

export const db = getFirestore();
