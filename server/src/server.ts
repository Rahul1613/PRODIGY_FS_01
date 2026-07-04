import 'dotenv/config';
import app from './app';
import connectDB from './config/database';

const PORT = parseInt(process.env.PORT || '5000', 10);

// ─── Start Server ──────────────────────────────────────────────────────────────
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ─────────────────────────────────────────');
      console.log(`   PRODIGY_FS_01 Server Running`);
      console.log(`   🌐 http://localhost:${PORT}`);
      console.log(`   📋 Health: http://localhost:${PORT}/api/health`);
      console.log(`   🔧 Environment: ${process.env.NODE_ENV}`);
      console.log('─────────────────────────────────────────── 🚀');
      console.log('');
    });
  } catch (error) {
    const err = error as Error;
    console.error(`❌ Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();
