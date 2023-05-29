import express, { Application } from 'express';
import { config } from 'dotenv';
import authRoutes from './routes/authRoutes';

config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
