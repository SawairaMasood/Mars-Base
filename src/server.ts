import app from './app';
import prisma from './config/db';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('[MARSBASE SIMULATION ENGINE] SQLite database connected successfully via Prisma.');

    app.listen(PORT, () => {
      console.log(`[MARSBASE SIMULATION ENGINE] Server listening on http://localhost:${PORT}`);
      console.log(`[MARSBASE SIMULATION ENGINE] Health status at http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('Failed to start MARSBASE server:', err);
    process.exit(1);
  }
}

bootstrap();
