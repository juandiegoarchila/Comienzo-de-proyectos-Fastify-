# 🚀SERVI - API Escalable con Fastify y Firebase

**SERVI** es una API REST escalable construida con Fastify y Firebase Firestore, diseñada para servir como base de proyectos empresariales con altos requerimientos de rendimiento y seguridad.Este proyecto surge para evitar configuraciones repetitivas en nuevos desarrollos, proporcionando una plantilla modular, organizada y fácilmente adaptable a otras bases de datos (como MongoDB, PostgreSQL, MySQL, etc.) con mínimos cambios.

## 🌟 Características Principales

- **Arquitectura Moderna**: Diseño modular con separación clara de responsabilidades.
- **Autenticación JWT**: Protección de endpoints con JSON Web Tokens.
- **Firebase Firestore**: Base de datos NoSQL escalable con transacciones y manejo de duplicados mediante ID determinístico.
- **Documentación Swagger**: Documentación de la API generada automáticamente (disponible en `/api-docs`).
- **Sistema de Pruebas Avanzado**: Pruebas automatizadas con Mocha, Chai y Supertest (incluye warm-up y reporte CLI).
- **Validación de Datos**: Esquemas JSON y validación con Joi.
- **Seguridad Robustecida**: Helmet, CORS y rate limiting integrados.
- **Paginación Inteligente**: Sistema de cursor para grandes volúmenes de datos.
- **Logging Estructurado**: Uso de Pino para logging y manejo de errores con páginas personalizadas.

---

## 📚 Estructura del Proyecto

```
src/
├── config/                    # Configuraciones globales (Firebase, Swagger, Test)
│   ├── config.js              # Inicialización de Firebase Admin y Firestore
│   ├── swagger.js             # Configuración de Swagger para la API│
├── controllers/               # Lógica de negocio
│   └── userController.js      # CRUD para usuarios
│
├── docs/                      # Documentación adicional
│   └── usersDocs.js           # Documentación Swagger de usuarios
│
├── routes/                    # Definición de endpoints y esquemas
│   ├── schemas/               # Esquemas JSON para validación
│   │   └── userSchema.js      # Validación de usuario
│   └── Users.js               # Rutas relacionadas con usuarios
│
├── tests/                     # Suite de pruebas automatizadas
│   ├── helpers/               # Helpers para pruebas (limpieza, reportes)
│   │   └── testHelpers.js
│   ├── utils/                 # Utilidades para pruebas (logging, validación)
│   │   ├── testUtils.js
│   │   └── validationUtils.js
│   └── userController.test.js # Pruebas del controlador de usuario
│
├── validators/                # Validaciones específicas con Joi
│   └── userValidator.js
│
├── app.js                     # Configuración principal de Fastify y registro de plugins
├── index.js                   # Inicialización y arranque del servidor
├── .env                       # Variables de entorno
├── .gitignore                 # Archivos a ignorar en Git
├── firebase.json              # Configuración de Firebase
├── package.json               # Dependencias y scripts del proyecto
├── package-lock.json          # Bloqueo de dependencias
└── README.md                  # Documentación del proyecto
```

Para crear la estructura y archivos rápidamente, ejecuta este comando en un futuro que los necesites:

```sh
mkdir src, src/config, src/controllers, src/docs, src/middleware, src/public, src/routes, src/tests, src/validators, src/views; New-Item src/index.js, src/app.js, src/config/config.js, src/config/swagger.js, src/controllers/userController.js, src/docs/usersDocs.js, src/middleware/errorHandler.js, src/middleware/notFoundHandler.js, src/middleware/validation.js, src/routes/Users.js, src/tests/userController.test.js, src/validators/userValidator.js, .env, .gitignore, README.md -ItemType File y npm install -g firebase-tools
```

## 🔑 Requisitos Previos

- Node.js 18+
- Cuenta de Firebase
- Credenciales de Firebase (archivo JSON)

## ⚙️ Instalación

### 1️⃣ Clonar el repositorio

```sh
git clone https://github.com/juandiegoarchila/Comienzo-de-proyectos-Fastify.git
cd Comienzo-de-proyectos-Fastify
code .
```

### 2️⃣ Instalar dependencias

```bash
npm init -y
npm install fastify @fastify/cors @fastify/helmet @fastify/jwt @fastify/swagger @fastify/swagger-ui firebase-admin dotenv joi pino
npm install --save-dev chai mocha nodemon supertest husky lint-staged eslint prettier Y npm install cli-table3 y npm install @fastify/rate-limit
 y npm install @fastify/jwt
```

## 3️⃣🌐 Variables de Entorno
# 🔧 Configuración Avanzada

## Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Descarga las credenciales y guárdalas como `firebase-credentials.json`.
3. Coloca el archivo en la raíz del proyecto.

## Variables de Entorno

Configura las variables de entorno creando un archivo `.env` en la raíz del proyecto:

```ini
PORT=5000
GOOGLE_APPLICATION_CREDENTIALS=./firebase-credentials.json
JWT_SECRET=tu_super_secreto_seguro
```

Para entornos `Linux/macOS`, ajusta la ruta de las credenciales de Firebase:

```sh
GOOGLE_APPLICATION_CREDENTIALS=/home/usuario/proyecto/firebase.json
```

## 🛠 Automatización de Linting y Formateo con Husky y lint-staged

Para garantizar que el código mantenga siempre el formato y estilo establecidos, se automatizará el proceso de linting y formateo antes de cada commit.

### 1. Inicializar ESLint

```sh
npx eslint --init
```

### 2. Configurar Prettier

Crea un archivo `.prettierrc` en la raíz del proyecto:

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### 3. Configurar Husky y lint-staged

```sh
npx husky install
npm set-script prepare "husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "*.js": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

### 4. Formateo de código manual

Si deseas formatear el código manualmente en cualquier momento, usa el siguiente comando:

```sh
npx prettier --write .
```

💡 **Nota:** El formateo de código también se ejecuta automáticamente cada vez que realizas un commit gracias a Husky y lint-staged.

### 4. Iniciar servidor:

## 🏃‍♂️ Ejecución del Proyecto

Para iniciar el servidor en modo producción:

```sh
npm start
```

Para iniciar en modo desarrollo con recarga automática:

```sh
npm run dev
```

## 🧪 Sistema de Pruebas

Ejecuta las pruebas con:

```sh
npm test
```

### Características
- Reportes detallados con tabla CLI.
- Limpieza automática de datos de prueba.
- Pruebas de concurrencia.
- Validación de esquemas.
- Warm-up automático de Firebase.

### ⏱️ Detalles de Tiempo por Prueba

```sh
┌─────┬───────────────────────────────┬──────────────────────────────────────────┬────────────┬──────────┐
│ #   │ Prueba                        │ Descripción                              │ Estado     │ Tiempo   │
├─────┼───────────────────────────────┼──────────────────────────────────────────┼────────────┼──────────┤
│ 0   │ [GET] /api/users              │ Obtener todos los usuarios               │ ✅ PASÓ   │ 452ms    │
│ 1   │ [POST] /api/users             │ Crear un nuevo usuario                   │ ✅ PASÓ   │ 680ms    │
└─────┴───────────────────────────────┴──────────────────────────────────────────┴────────────┴──────────┘
```

## 🛑 Manejo de Errores

La API incluye:
- Páginas de error HTML personalizadas.
- Validación automática de datos de entrada.
- Logging estructurado de errores.
- Códigos de estado HTTP precisos.

## 📚 Documentación de la API

Accede a la documentación interactiva en:
- **Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Esquema OpenAPI**: [http://localhost:5000/api-docs/json](http://localhost:5000/api-docs/json)

## 🔒 Autenticación

Todos los endpoints protegidos requieren un **JWT** en el header:

```http
Authorization: Bearer <token>
```

Para generar tokens de prueba:

```javascript
const token = app.jwt.sign({ user: "test" });

```

## 🛡️ Endpoints Principales

| Método | Endpoint       | Descripción                 | Autenticación |
| ------ | -------------- | --------------------------- | ------------- |
| GET    | /api/users     | Lista usuarios paginados    | Requerida     |
| POST   | /api/users     | Crea nuevo usuario          | Pública       |
| PUT    | /api/users/:id | Actualiza usuario existente | Requerida     |
| DELETE | /api/users/:id | Elimina usuario             | Requerida     |

Ejemplo de creación de usuario:

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan Perez", "email": "juan@example.com"}'
```

## 🛠 Automatización de Linting y Formateo con Husky y lint-staged

Para garantizar que el código mantenga siempre el formato y estilo establecidos, se automatizará el proceso de linting y formateo antes de cada commit.

### 1. Inicializar ESLint

```sh
npx eslint --init
```

### 2. Configurar Prettier

Crea un archivo `.prettierrc` en la raíz del proyecto:

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### 3. Agregar Scripts en package.json

```json
"scripts": {
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "mocha --reporter spec --exit \"src/tests/**/*.test.js\"",
    "prepare": "husky install"
  },
"type": "module"
```

### 4. Configurar Husky y lint-staged

```sh
npx husky install
npm set-script prepare "husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "*.js": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

### 5. Formateo de código manual

Si deseas formatear el código manualmente en cualquier momento, usa el siguiente comando:

```sh
npx prettier --write .
```

💡 **Nota:** El formateo de código también se ejecuta automáticamente cada vez que realizas un commit gracias a Husky y lint-staged.

## 📌 Contribuciones

Si deseas contribuir, por favor abre un issue o un pull request con tus mejoras.

## 📝 Licencia

Este proyecto está bajo la licencia **ISC**.

📌 **Autor**: Juan Diego
