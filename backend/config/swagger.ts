import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import path from "path";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "QuestLog API Documentation",
    version: "1.0.0",
    description: "Este sistema é projetado para gerenciar logs de eventos durante sessões de RPG no universo de Ordem Paranormal. Ele permite que mestres e jogadores acompanhem a evolução das campanhas, personagens e eventos de forma organizada.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "QuestLog backend",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "../src/routes/*.ts")],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Application): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs-json", (_req, res) => {
    res.json(swaggerSpec);
  });
}
