//src/app.js
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swaggerConfig from "./config/swagger.js";
import userRoutes from "./routes/Users.js";
import fastifyJWT from "@fastify/jwt";

const app = Fastify({
  logger: { level: "info" },
});

app.register(cors);
app.register(helmet);
swaggerConfig(app);
app.register(userRoutes, { prefix: "/api" });

app.register(fastifyJWT, {
  secret: process.env.JWT_SECRET || "supersecret", // Define un secreto robusto en producción
});

// Decorador para autenticación
app.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ message: "Token inválido o expirado" });
  }
});

app.setNotFoundHandler((request, reply) => {
  reply.status(404).type("text/html").send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error 404 - Página No Encontrada</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap" rel="stylesheet">
        <style>
            /* Estilos Generales */
            body {
                font-family: 'Poppins', sans-serif;
                background: #121212;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            /* Contenedor principal */
            .container {
                background: #22223b;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
                max-width: 500px;
                text-align: center;
                animation: fadeIn 0.8s ease-in-out;
            }
            /* Título */
            h1 {
                font-size: 22px;
                font-weight: 700;
                color: #ff4b5c;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            /* Icono de error */
            h1 .icon {
                font-size: 26px;
            }
            /* Texto de error */
            p {
                font-size: 16px;
                margin: 10px 0;
            }
            /* Ruta en negrita */
            .ruta {
                font-weight: bold;
            }
            /* Link de la documentación */
            .link {
                color: #ff4b5c;
                font-weight: bold;
                text-decoration: none;
                pointer-events: all;
            }
            .link:hover {
                text-decoration: none;
                color: #ff4b5c;
            }
            /* Botón de regreso */
            .back-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 12px 24px;
                font-size: 16px;
                font-weight: 500;
                color: white;
                background: #007bff;
                border: none;
                border-radius: 8px;
                text-decoration: none;
                margin-top: 20px;
                transition: 0.3s;
                box-shadow: 0px 5px 15px rgba(0, 123, 255, 0.2);
            }
            .back-btn:hover {
                background: #0056b3;
                transform: scale(1.05);
            }
            /* Animación de aparición */
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1><span>❌</span> Error 404 - Página No Encontrada</h1>
            <p>La ruta <strong>'${request.url}'</strong> no existe en este servidor.</p>
            <p>Verifica la URL o revisa la <a href="/api-docs" class="link">documentación de la API</a>.</p>
            <a href="/" class="back-btn">🔙 Regresar al inicio</a>
        </div>
    </body>
    </html>
  `);
});

app.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    reply.status(400).send({
      error: "Bad Request",
      message: error.message,
      details: error.validation,
    });
  } else {
    console.error(`[❌ ERROR] ${error.name}: ${error.message}`);
    reply.status(500).send({
      error: "Internal Server Error",
      message: error.message,
      status: 500,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

export default app;