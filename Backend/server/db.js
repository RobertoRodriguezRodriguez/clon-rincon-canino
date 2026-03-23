import { Sequelize } from 'sequelize';
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../db.env') });

// Configuración de Sequelize
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('supabase.co');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: (msg) => console.log(`[Sequelize Log]: ${msg}`),
  dialectOptions: {
    ssl: isProduction ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
});

// Probar la conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
    console.log("Detalles de conexión:");
    console.log(`  Host: ${process.env.HOST}`);
    console.log(`  Puerto: ${process.env.PORT}`);
    console.log(`  Base de datos: ${process.env.DATABASE}`);
    console.log(`  Usuario: ${process.env.USER}`);
  })
  .catch((err) => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

// Escuchar eventos importantes
sequelize.addHook('beforeConnect', (config) => {
  console.log('[Sequelize Hook]: Intentando conectar a la base de datos...');
  console.log(`  Host: ${config.host}`);
  console.log(`  Puerto: ${config.port}`);
  console.log(`  Base de datos: ${config.database}`);
  console.log(`  Usuario: ${config.username}`);
});

sequelize.addHook('afterConnect', () => {
  console.log('[Sequelize Hook]: Conexión establecida con éxito.');
});

sequelize.addHook('beforeDisconnect', () => {
  console.log('[Sequelize Hook]: Cerrando conexión...');
});

sequelize.addHook('afterDisconnect', () => {
  console.log('[Sequelize Hook]: Conexión cerrada con éxito.');
});

// Exportar la instancia de Sequelize
export default sequelize;
