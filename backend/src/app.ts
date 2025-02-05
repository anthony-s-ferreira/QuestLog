import express, { Request, Response } from 'express';
import { setupSwagger } from '../config/swagger';
import sequelize from '../config/database';
import { error } from 'console';
import { userRoutes } from './routes/userRoutes';


const app: express.Application = express();
const port = process.env.PORT || 3000;

//Configurations
app.use(express.json());


//API routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});
app.use(userRoutes);

// Setup Swagger
setupSwagger(app);
sequelize.sync({force: true}).then(() => {
  console.log('Database connected');
}).catch((error) => {
  console.log('An error during bd connection occurred: ', error);
  process.exit();
});
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Swagger available at http://localhost:${port}/api-docs`);
});

export { app, server };