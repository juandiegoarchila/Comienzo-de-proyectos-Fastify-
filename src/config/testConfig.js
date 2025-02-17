//src/config/testConfig.js
export const db = {
    // Configuración de la base de datos para pruebas
    url: process.env.TEST_DB_URL || 'localhost:27017',
    name: 'test-database',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  };
  
  export const server = {
    port: process.env.TEST_PORT || 3000,
    host: 'localhost'
  };
  