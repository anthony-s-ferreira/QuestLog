import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { setupSwagger } from '../config/swagger';
import { userRoutes } from './routes/UserRoutes';
import { rpgRoutes } from './routes/RpgRoutes';
import { characterRoutes } from './routes/CharacterRoutes';
import { eventTypeRoutes } from './routes/EventTypeRoutes';
import { eventRoutes } from './routes/EventRoutes';
import cors from "cors";
import { adminRoutes } from './routes/AdminRoutes';

const app: express.Application = express();

app.use(
  cors({
    origin: ["https://editor.swagger.io/", "http://localhost:5000/", "https://app.swaggerhub.com", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const port = process.env.PORT || 3000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests limit from IP
  message: { error: 'Too many requests, try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

//Configurations
app.use(express.json());

app.use(limiter);
app.use(helmet());

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