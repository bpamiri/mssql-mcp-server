// query_nationalcommunities.mjs
import sql from 'mssql';

// Configuration for SQL Server connection
const config = {
    user: 'sa',
    password: 'ItsGerr8!',
    server: 'localhost',
    port: 1433,
    database: 'SRP',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
};

async function queryNationalCommunities() {
    try {
        // Connect to the database
        console.log('Connecting to SQL Server...');
        const pool = await sql.connect(config);
        
        // Get table schema
        console.log('\nTable Schema:');
        const schema = await pool.request().query(`
            SELECT 
                COLUMN_NAME,
                DATA_TYPE,
                CHARACTER_MAXIMUM_LENGTH,
                IS_NULLABLE
            FROM 
                INFORMATION_SCHEMA.COLUMNS
            WHERE 
                TABLE_NAME = 'NationalCommunities'
            ORDER BY 
                ORDINAL_POSITION
        `);
        
        console.log(JSON.stringify(schema.recordset, null, 2));
        
        // Query sample data
        console.log('\nSample Data:');
        const result = await pool.request().query(`
            SELECT TOP 10 * 
            FROM NationalCommunities
        `);
        
        console.log(JSON.stringify(result.recordset, null, 2));
        
        // Close the connection
        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

queryNationalCommunities();