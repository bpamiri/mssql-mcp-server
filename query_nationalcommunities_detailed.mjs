// query_nationalcommunities_detailed.mjs
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

async function queryNationalCommunitiesDetailed() {
    try {
        // Connect to the database
        console.log('Connecting to SQL Server...');
        const pool = await sql.connect(config);
        
        // Get all national communities
        console.log('\nAll National Communities:');
        const allNations = await pool.request().query(`
            SELECT Id, Name, LatinName, CreatedTimestamp, LastUpdatedTimestamp, IsAnonymized
            FROM NationalCommunities
            ORDER BY Name
        `);
        
        console.log(JSON.stringify(allNations.recordset, null, 2));
        
        // Get regions for each national community
        console.log('\nRegions by National Community:');
        const regionsQuery = await pool.request().query(`
            SELECT 
                nc.Name as NationalCommunity,
                r.Id as RegionId,
                r.Name as RegionName,
                r.LatinName as RegionLatinName,
                r.HasBahaiCouncil
            FROM 
                NationalCommunities nc
                INNER JOIN Regions r ON nc.Id = r.NationalCommunityId
            ORDER BY 
                nc.Name, r.Name
        `);
        
        console.log(JSON.stringify(regionsQuery.recordset, null, 2));
        
        // Get a summary count of clusters by national community
        console.log('\nCluster Count by National Community:');
        const clusterCountQuery = await pool.request().query(`
            SELECT 
                nc.Name as NationalCommunity, 
                COUNT(c.Id) as ClusterCount
            FROM 
                NationalCommunities nc
                INNER JOIN Regions r ON nc.Id = r.NationalCommunityId
                INNER JOIN Clusters c ON r.Id = c.RegionId
            GROUP BY 
                nc.Name
            ORDER BY 
                nc.Name
        `);
        
        console.log(JSON.stringify(clusterCountQuery.recordset, null, 2));
        
        // Close the connection
        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

queryNationalCommunitiesDetailed();