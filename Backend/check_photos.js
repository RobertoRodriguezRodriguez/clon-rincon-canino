import sequelize from "./server/db.js";

async function checkPhotos() {
  try {
    const [results] = await sequelize.query(`SELECT * FROM fotos LIMIT 10;`);
    console.table(results);
    process.exit(0);
  } catch (error) {
    console.error("Error checking photos:", error);
    process.exit(1);
  }
}

checkPhotos();
