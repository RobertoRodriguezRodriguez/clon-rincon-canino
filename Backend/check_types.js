import sequelize from "./server/db.js";

async function checkSchema() {
  try {
    const [results] = await sequelize.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('cliente', 'admin')
      ORDER BY table_name, column_name;
    `);
    console.log("Database Schema Info:");
    console.table(results);
    process.exit(0);
  } catch (error) {
    console.error("Error checking schema:", error);
    process.exit(1);
  }
}

checkSchema();
