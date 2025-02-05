import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "QuestLog API Documentation",
    version: "1.0.0",
    description: "Este sistema é projetado para gerenciar logs de eventos durante sessões de RPG no universo de Ordem Paranormal. Ele permite que mestres e jogadores acompanhem a evolução das campanhas, personagens e eventos de forma organizada.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "QuestLog backend",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["../src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Application): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
