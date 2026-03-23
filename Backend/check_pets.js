import sequelize from "./server/db.js";

async function checkPets() {
  try {
    const [results] = await sequelize.query(`SELECT id, nombre FROM mascota LIMIT 10;`);
    console.table(results);
    process.exit(0);
  } catch (error) {
    console.error("Error checking pets:", error);
    process.exit(1);
  }
}

checkPets();
