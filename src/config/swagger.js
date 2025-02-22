//src/config/swagger.js
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const swaggerConfig = {
  openapi: {
    info: {
      title: "API de Usuarios",
      version: "1.0.0",
      description: "API RESTful para la gestión de usuarios con Firebase",
    },
  },
  ui: {
    routePrefix: "/api-docs",
    uiConfig: { docExpansion: "list", deepLinking: false },
    staticCSP: true,
  },
};

export default function registerSwagger(app) {
  app.register(fastifySwagger, swaggerConfig);
  app.register(fastifySwaggerUi, swaggerConfig.ui);
}
