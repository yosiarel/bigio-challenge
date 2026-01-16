import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import prisma from './utils/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is running',
    version: '1.0.0'
  });
});
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

// Test database connection and start server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Database disconnected');
  process.exit(0);
});

startServer();