import app from './app.js';
import { PORT } from './config.js';
import { connectDB } from "./db.js";
import { syncDatabase as syncFileModel } from './models/file.model.js';

async function main() {
  await connectDB();
  await syncFileModel();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}
  
main();
