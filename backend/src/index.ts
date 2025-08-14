import app from './app';
import * as db from './db';

async function startServer() {
  try {
    await db.init();
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Patients API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();