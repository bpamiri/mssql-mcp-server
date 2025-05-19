// query_clusters.mjs
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

async function queryClusters() {
    try {
        // Connect to the database
        console.log('Connecting to SQL Server...');
        const pool = await sql.connect(config);
        
        // Get all clusters in California region
        console.log('\nClusters in California:');
        const clusters = await pool.request().query(`
            SELECT 
                c.Id as ClusterId,
                c.Name as ClusterName,
                c.LatinName as ClusterLatinName,
                c.StageOfDevelopment,
                c.TotalPopulation,
                c.Comments
            FROM 
                Clusters c
                INNER JOIN Regions r ON c.RegionId = r.Id
            WHERE 
                r.Name = 'California'
            ORDER BY 
                c.Name
        `);
        
        console.log(JSON.stringify(clusters.recordset, null, 2));
        
        // Get locality count by cluster
        console.log('\nLocality Count by Cluster:');
        const localityCount = await pool.request().query(`
            SELECT 
                c.Name as ClusterName, 
                COUNT(l.Id) as LocalityCount
            FROM 
                Clusters c
                INNER JOIN Localities l ON c.Id = l.ClusterId
                INNER JOIN Regions r ON c.RegionId = r.Id
            WHERE 
                r.Name = 'California'
            GROUP BY 
                c.Name
            ORDER BY 
                c.Name
        `);
        
        console.log(JSON.stringify(localityCount.recordset, null, 2));
        
        // Get activities count by cluster
        console.log('\nActivities Count by Cluster:');
        const activitiesCount = await pool.request().query(`
            SELECT 
                c.Name as ClusterName, 
                COUNT(a.Id) as ActivityCount
            FROM 
                Clusters c
                INNER JOIN Localities l ON c.Id = l.ClusterId
                INNER JOIN Activities a ON l.Id = a.LocalityId
                INNER JOIN Regions r ON c.RegionId = r.Id
            WHERE 
                r.Name = 'California'
            GROUP BY 
                c.Name
            ORDER BY 
                c.Name
        `);
        
        console.log(JSON.stringify(activitiesCount.recordset, null, 2));
        
        // Close the connection
        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

queryClusters();