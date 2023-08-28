import mysql from "mysql2/promise";

async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
  });

  return connection;
}

async function query(query: string, values?: Array<string | number | null>) {
  try {
    const connection = await getConnection();
    let response = await connection.query(query, values);

    await connection.end();

    return response[0];
  } catch (error) {
    throw new Error("Could not connect to the database");
  }
}

const database = {
  query,
};

export default Object.freeze({
  query,
});
