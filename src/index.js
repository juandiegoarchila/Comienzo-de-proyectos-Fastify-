//src/index.js

import app from './app.js';
import { config } from 'dotenv';

config(); // Cargar variables de entorno

const PORT = process.env.PORT || 5000;

app.listen({ port: PORT, host: '0.0.0.0' })
  .then(() => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  })
  .catch((err) => {
    console.error('❌ Error al iniciar el servidor:', err);
    process.exit(1);
  });

