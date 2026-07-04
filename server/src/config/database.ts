import mongoose from 'mongoose';

let mongoMemoryServer: any = null;

/**
 * Connects to MongoDB using the URI from environment variables.
 * Falls back to an in-memory MongoDB server in development if the connection fails.
 */
const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  // Mongoose connection event listeners
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      if (mongoMemoryServer) {
        await mongoMemoryServer.stop();
        console.log('🛑 In-memory MongoDB stopped');
      }
    } catch (err) {
      console.error('Error during database shutdown:', err);
    }
    console.log('🔌 MongoDB connection closed due to app termination');
    process.exit(0);
  });

  try {
    console.log('📡 Attempting to connect to configured MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000, // Fast failover to in-memory db
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    const err = error as Error;
    console.warn(`⚠️  MongoDB connection failed: ${err.message}`);

    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Spinning up in-memory MongoDB server as fallback...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        const memoryUri = mongoMemoryServer.getUri();
        console.log(`🚀 In-memory MongoDB running at: ${memoryUri}`);

        await mongoose.connect(memoryUri, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        });
      } catch (fallbackError) {
        const fErr = fallbackError as Error;
        console.error(`❌ Failed to connect to in-memory MongoDB fallback: ${fErr.message}`);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;

