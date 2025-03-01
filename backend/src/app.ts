import express, { Request, Response } from 'express';
import { setupSwagger } from '../config/swagger';
import { userRoutes } from './routes/UserRoutes';
import { rpgRoutes } from './routes/RpgRoutes';
import { characterRoutes } from './routes/CharacterRoutes';
import { eventTypeRoutes } from './routes/EventTypeRoutes';
import { eventRoutes } from './routes/EventRoutes';
import cors from "cors";

const app: express.Application = express();
const port = process.env.PORT || 3000;

//Configurations
app.use(express.json());

app.use(
  cors({
    origin: ["https://editor.swagger.io/", "http://localhost:3000/", "https://app.swaggerhub.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//API routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});
app.use(userRoutes);
app.use(rpgRoutes);
app.use(characterRoutes);
app.use(eventTypeRoutes);
app.use(eventRoutes);

// Setup Swagger
setupSwagger(app);
app.get('/api-docs-json', (req, res) => {
  res.json(swaggerDocument);
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Swagger available at http://localhost:${port}/api-docs`);
});

export { app, server };