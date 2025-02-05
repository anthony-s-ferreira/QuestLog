import express, { Request, Response } from 'express';
import { setupSwagger } from '../config/swagger';
const app: express.Application = express();
const port = process.env.PORT || 3000;

//API routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// Setup Swagger
setupSwagger(app);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Swagger available at http://localhost:${port}/api-docs`);
});

export { app, server };