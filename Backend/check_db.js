import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './db.env' });

async function checkSchema() {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
  });

  console.log('--- Tables ---');
  const [tables] = await connection.query('SHOW TABLES');
  console.log(tables);

  for (const tableRow of tables) {
    const tableName = Object.values(tableRow)[0];
    console.log(`\n--- Schema for ${tableName} ---`);
    const [schema] = await connection.query(`DESCRIBE ${tableName}`);
    console.table(schema);
  }

  await connection.end();
}

checkSchema().catch(console.error);
