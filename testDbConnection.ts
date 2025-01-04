import pool from './src/config/db'; // Replace with the actual path to your db.ts file

const testDatabaseConnection = async () => {
  try {
    // Test a simple query
    const result = await pool.query('SELECT 1 + 1 AS result');
    console.log('Database connection successful! Test result:', result.rows);
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    // Always release the pool at the end of the test
    await pool.end();
  }
};

testDatabaseConnection();
