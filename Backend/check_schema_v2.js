import sequelize from './server/db.js';

async function check() {
  try {
    const [results] = await sequelize.query("DESCRIBE mascota_clase;");
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
