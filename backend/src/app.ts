import express, { Request, Response } from 'express';

const app: express.Application = express();
const port = process.env.PORT || 3000;

//API routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { app, server };