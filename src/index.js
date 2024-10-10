import app from './app.js';
import { PORT } from './config.js';
import { connectDB } from "./db.js";

async function main() {
  await connectDB();
  
  // Asegúrate de escuchar en todas las interfaces (0.0.0.0) y en el puerto correcto
  app.listen(PORT || 4486, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
  });
}

main();
