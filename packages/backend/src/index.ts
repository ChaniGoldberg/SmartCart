import dotenv from 'dotenv';
dotenv.config();
const swaggerJsdoc = require('swagger-jsdoc');
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import healthRoutes from './routes/health';
import itemsRoutes from './routes/items';
import tagsRoutes from './routes/tagRoutes';
import storeRoutes from './routes/storeRouter';
import userRoutes from './routes/userRoutes';
import { databaseService } from './services/database';
import { setupSwagger } from './swagger';
import searchItemsRoutes from './routes/searchItemsRoutes';
import tagRoutes from './routes/tagRoutes';
import searchStoreRoutes from './routes/searchStoreRoutes';
import fuzzySearchRoutes from './routes/fuzzySearchRoutes';
import cartRoutes from './routes/cartRoutes';
import promotionRoutes from './routes/promotionRoutes';
import notificationRoutes from './routes/notificationRoutes';
import shareCart from './routes/shareCart';
import searchProductRoute from './routes/searchProductRoute';

const app = express();
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartCart API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/items', itemsRoutes);
app.use("/api/stores", storeRoutes); 
app.use('/api/promotions', promotionRoutes);
app.use("/api/search", searchItemsRoutes); 
app.use("/api/tag", tagRoutes); 
app.use('/api/search', searchStoreRoutes);
app.use('/api/searchProduct', searchProductRoute);
app.use('/api/users', userRoutes)
app.use("/api/fuzzySearch", fuzzySearchRoutes); 
app.use("/api/cart",cartRoutes);
app.use("/api/notification",notificationRoutes);

app.use("/api", shareCart);

setupSwagger(app);

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);

  // Initialize DB
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('🗄️ Initializing database...');
    try {
      databaseService.canInitialize();
      try {
        await databaseService.initializeSampleData();
        console.log('✅ Database initialized successfully');
      } catch (error) {
        console.error('❌ Database sample-data initialization failed');
      }
    } catch (error) {
      console.error('❌ Database not connected');
    }
  } else {
    console.log('📝 Using mock data - Supabase not configured');
  }
});


