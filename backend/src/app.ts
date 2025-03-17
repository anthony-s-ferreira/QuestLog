import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from '../config/swagger';
import { userRoutes } from './routes/UserRoutes';
import { rpgRoutes } from './routes/RpgRoutes';
import { characterRoutes } from './routes/CharacterRoutes';
import { eventTypeRoutes } from './routes/EventTypeRoutes';
import { eventRoutes } from './routes/EventRoutes';
import cors from "cors";
import { adminRoutes } from './routes/AdminRoutes';

const app: express.Application = express();
const port = process.env.PORT || 3000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: { error: 'Muitas requisições. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

//Configurations
app.use(express.json());
app.use(
  cors({
    origin: ["https://editor.swagger.io/", "http://localhost:3000/", "https://app.swaggerhub.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(limiter);

//API routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});
app.use(userRoutes);
app.use(rpgRoutes);
app.use(characterRoutes);
app.use(eventTypeRoutes);
app.use(eventRoutes);
app.use(adminRoutes);

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