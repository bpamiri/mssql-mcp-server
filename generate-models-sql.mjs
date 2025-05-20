#!/usr/bin/env node

/**
 * CFWheels Model Generator Script
 * This script connects to a SQL Server database using the MSSQL-MCP server,
 * gets table information, and generates CFWheels model files.
 * This version uses direct SQL queries instead of MCP resources for better compatibility.
 */

import fs from 'fs';
import path from 'path';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Client configuration
const clientConfig = {
    name: "MSSQL-MCP-Model-Generator",
    version: "1.0.0"
};

// Capabilities configuration
const capabilities = {
    capabilities: {
        resources: {},
        tools: {},
        prompts: {}
    }
};

// Configuration
const DEFAULT_OUTPUT_DIR = path.join(__dirname, 'output', 'models');
const DEFAULT_TRANSPORT = 'sse'; // Change default to SSE for simplicity
const EXCLUDED_TABLES = ['sysdiagrams', 'DBScriptHistories', 'ApplicationConfigurations', 'ApplicationHistories', 'LoadDataFiles'];

// CFWheels validation mapping
const VALIDATION_MAP = {
    'int': 'numeric',
    'bigint': 'numeric',
    'smallint': 'numeric',
    'tinyint': 'numeric',
    'decimal': 'numeric',
    'numeric': 'numeric',
    'float': 'numeric',
    'real': 'numeric',
    'money': 'numeric',
    'smallmoney': 'numeric',
    'datetime': 'datetime',
    'date': 'date',
    'time': 'time',
    'datetime2': 'datetime',
    'datetimeoffset': 'datetime',
    'smalldatetime': 'datetime',
    'char': 'string',
    'varchar': 'string', 
    'text': 'string',
    'nchar': 'string',
    'nvarchar': 'string',
    'ntext': 'string',
    'binary': 'binary',
    'varbinary': 'binary',
    'image': 'binary',
    'uniqueidentifier': 'guid',
    'xml': 'string',
    'bit': 'boolean'
};

async function connectToServer() {
    console.log('\n=======================================');
    console.log('      🔧 CFWheels Model Generator 🔧');
    console.log('=======================================');
    console.log('🚀 Starting MSSQL MCP Client...');
    
    // Create appropriate transport based on environment variable
    const transportType = process.env.TRANSPORT || DEFAULT_TRANSPORT;
    console.log(`🔄 Connecting to MCP server using ${transportType} transport...`);
    
    let transport;
    
    // Create appropriate transport
    if (transportType === 'stdio') {
        transport = new StdioClientTransport();
    } else if (transportType === 'sse') {
        // For SSE transport
        let serverUrl = process.env.SERVER_URL || 'http://localhost:3333';
        
        // Make sure serverUrl doesn't have a trailing slash
        if (serverUrl.endsWith('/')) {
            serverUrl = serverUrl.slice(0, -1);
        }
        
        console.log(`🌐 Connecting to server at ${serverUrl}`);
        console.log(`   Make sure the server is running with: TRANSPORT=sse npm start`);
        
        // Create SSE transport with properly formatted URLs
        const sseEndpoint = `${serverUrl}/sse`;
        
        try {
            transport = new SSEClientTransport(new URL(sseEndpoint));
            console.log('   Created SSE transport successfully');
        } catch (err) {
            console.error(`   ❌ Error creating SSE transport: ${err.message}`);
            throw err;
        }
    } else {
        throw new Error(`Unknown transport type: ${transportType}`);
    }

    // Create client
    const client = new Client(clientConfig, capabilities);

    // Connect to the transport
    try {
        await client.connect(transport);
        console.log(`✅ Connected to MCP server using ${transportType} transport`);
        return client;
    } catch (err) {
        console.error(`❌ Connection error: ${err.message}`);
        throw err;
    }
}

async function getAllTables(client) {
    try {
        console.log('📊 Retrieving list of all tables...');
        
        const sql = `
            SELECT 
                TABLE_SCHEMA,
                TABLE_NAME,
                TABLE_TYPE
            FROM 
                INFORMATION_SCHEMA.TABLES
            WHERE 
                TABLE_TYPE = 'BASE TABLE'
                AND TABLE_NAME NOT IN (${EXCLUDED_TABLES.map(t => `'${t}'`).join(',')})
            ORDER BY 
                TABLE_SCHEMA, TABLE_NAME
        `;
        
        const result = await client.callTool('mcp_execute_query', { sql });
        
        if (!result || !result.result || !result.result.results) {
            console.log('Response structure:', JSON.stringify(result, null, 2));
            throw new Error('Invalid response from execute_query tool');
        }
        
        const tables = result.result.results;
        console.log(`✅ Found ${tables.length} tables`);
        
        return tables.map(t => t.TABLE_NAME);
    } catch (err) {
        console.error(`❌ Error retrieving tables: ${err.message}`);
        return [];
    }
}

async function getTableColumns(client, tableName) {
    try {
        const sql = `
            SELECT 
                COLUMN_NAME,
                DATA_TYPE,
                CHARACTER_MAXIMUM_LENGTH,
                IS_NULLABLE,
                COLUMN_DEFAULT
            FROM 
                INFORMATION_SCHEMA.COLUMNS
            WHERE 
                TABLE_NAME = '${tableName}'
            ORDER BY 
                ORDINAL_POSITION
        `;
        
        const result = await client.callTool('mcp_execute_query', { sql });
        
        if (!result || !result.result || !result.result.results) {
            return [];
        }
        
        return result.result.results.map(col => ({
            name: col.COLUMN_NAME,
            dataType: col.DATA_TYPE,
            maxLength: col.CHARACTER_MAXIMUM_LENGTH !== null ? col.CHARACTER_MAXIMUM_LENGTH : null,
            nullable: col.IS_NULLABLE === 'YES',
            defaultValue: col.COLUMN_DEFAULT
        }));
    } catch (err) {
        console.error(`❌ Error retrieving columns for ${tableName}: ${err.message}`);
        return [];
    }
}

async function getPrimaryKeys(client, tableName) {
    try {
        const sql = `
            SELECT 
                c.name AS ColumnName
            FROM 
                sys.indexes i
            INNER JOIN 
                sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
            INNER JOIN 
                sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
            INNER JOIN 
                sys.tables t ON i.object_id = t.object_id
            WHERE 
                t.name = '${tableName}'
                AND i.is_primary_key = 1
            ORDER BY 
                ic.key_ordinal
        `;
        
        const result = await client.callTool('mcp_execute_query', { sql });
        
        if (!result || !result.result || !result.result.results) {
            return [];
        }
        
        return result.result.results.map(row => row.ColumnName);
    } catch (err) {
        console.error(`❌ Error retrieving primary keys for ${tableName}: ${err.message}`);
        return [];
    }
}

async function getForeignKeys(client, tableName) {
    try {
        const sql = `
            SELECT 
                fk.name AS FKName,
                OBJECT_NAME(fk.parent_object_id) AS TableName,
                c1.name AS ColumnName,
                OBJECT_NAME(fk.referenced_object_id) AS ReferencedTableName,
                c2.name AS ReferencedColumnName
            FROM 
                sys.foreign_keys fk
            INNER JOIN 
                sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
            INNER JOIN 
                sys.columns c1 ON fkc.parent_object_id = c1.object_id AND fkc.parent_column_id = c1.column_id
            INNER JOIN 
                sys.columns c2 ON fkc.referenced_object_id = c2.object_id AND fkc.referenced_column_id = c2.column_id
            WHERE 
                OBJECT_NAME(fk.parent_object_id) = '${tableName}'
            ORDER BY 
                c1.column_id
        `;
        
        const result = await client.callTool('mcp_execute_query', { sql });
        
        if (!result || !result.result || !result.result.results) {
            return [];
        }
        
        return result.result.results;
    } catch (err) {
        console.error(`❌ Error retrieving foreign keys for ${tableName}: ${err.message}`);
        return [];
    }
}

async function getReferencingTables(client, tableName) {
    try {
        const sql = `
            SELECT 
                fk.name AS FKName,
                OBJECT_NAME(fk.parent_object_id) AS TableName,
                c1.name AS ColumnName,
                OBJECT_NAME(fk.referenced_object_id) AS ReferencedTableName,
                c2.name AS ReferencedColumnName
            FROM 
                sys.foreign_keys fk
            INNER JOIN 
                sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
            INNER JOIN 
                sys.columns c1 ON fkc.parent_object_id = c1.object_id AND fkc.parent_column_id = c1.column_id
            INNER JOIN 
                sys.columns c2 ON fkc.referenced_object_id = c2.object_id AND fkc.referenced_column_id = c2.column_id
            WHERE 
                OBJECT_NAME(fk.referenced_object_id) = '${tableName}'
            ORDER BY 
                c1.column_id
        `;
        
        const result = await client.callTool('mcp_execute_query', { sql });
        
        if (!result || !result.result || !result.result.results) {
            return [];
        }
        
        return result.result.results;
    } catch (err) {
        console.error(`❌ Error retrieving referencing tables for ${tableName}: ${err.message}`);
        return [];
    }
}

async function getTableDetails(client, tableName) {
    try {
        console.log(`📋 Getting details for table: ${tableName}`);
        
        // Get columns
        const columns = await getTableColumns(client, tableName);
        
        if (columns.length === 0) {
            console.error(`❌ No columns found for table: ${tableName}`);
            return null;
        }
        
        // Get primary keys
        const primaryKeys = await getPrimaryKeys(client, tableName);
        
        // Get foreign keys
        const foreignKeys = await getForeignKeys(client, tableName);
        
        return {
            name: tableName,
            columns,
            primaryKeys,
            foreignKeys
        };
    } catch (err) {
        console.error(`❌ Error retrieving table details for ${tableName}: ${err.message}`);
        return null;
    }
}

function pascalCase(str) {
    // Handle empty or non-string
    if (!str || typeof str !== 'string') return '';
    
    // Remove non-alphanumeric characters and spaces
    str = str.replace(/[^a-zA-Z0-9\s]/g, '');
    
    // Split by spaces, underscores, or camelCase
    const words = str.split(/[\s_]+|(?=[A-Z])/);
    
    // Capitalize first letter of each word
    return words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
}

function camelCase(str) {
    const pascal = pascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function singularize(word) {
    if (!word) return word;
    
    // Simple rules for singularizing English words
    if (word.endsWith('ies')) {
        return word.slice(0, -3) + 'y';
    } else if (word.endsWith('es')) {
        return word.slice(0, -2);
    } else if (word.endsWith('s') && !word.endsWith('ss')) {
        return word.slice(0, -1);
    }
    
    return word;
}

function generateModelContent(tableInfo, referencingTables) {
    const modelName = pascalCase(singularize(tableInfo.name));
    const tableName = tableInfo.name;
    
    // Start building the component
    let content = '';
    
    // Component header
    content += `/**\n`;
    content += ` * Model: ${modelName}\n`;
    content += ` * Table: ${tableName}\n`;
    content += ` * \n`;
    content += ` * Generated with CFWheels Model Generator\n`;
    content += ` * Date: ${new Date().toISOString()}\n`;
    content += ` */\n`;
    content += `component extends="Model" output="false" {\n\n`;
    
    // Init function
    content += `    /**\n`;
    content += `     * Component initialization\n`;
    content += `     */\n`;
    content += `    function init() {\n`;
    content += `        table("${tableName}");\n`;
    
    // Primary keys
    if (tableInfo.primaryKeys && tableInfo.primaryKeys.length > 0) {
        const pkList = tableInfo.primaryKeys.map(pk => `"${pk}"`).join(', ');
        content += `        primaryKey(${pkList});\n`;
    }
    
    // Belongs To relationships (from foreign keys)
    if (tableInfo.foreignKeys && tableInfo.foreignKeys.length > 0) {
        content += '\n        // "Belongs to" relationships\n';
        
        tableInfo.foreignKeys.forEach(fk => {
            const singularName = singularize(fk.ReferencedTableName);
            const modelName = pascalCase(singularName);
            const relationName = camelCase(singularName);
            
            content += `        belongsTo("${relationName}", foreignKey="${fk.ColumnName}");\n`;
        });
    }
    
    // Has Many relationships (from referencing tables)
    if (referencingTables && referencingTables.length > 0) {
        // Group by table name to avoid duplicates
        const tablesMap = {};
        referencingTables.forEach(ref => {
            if (!tablesMap[ref.TableName]) {
                tablesMap[ref.TableName] = ref;
            }
        });
        
        const uniqueRefs = Object.values(tablesMap);
        
        if (uniqueRefs.length > 0) {
            content += '\n        // "Has many" relationships\n';
            
            uniqueRefs.forEach(ref => {
                const pluralName = ref.TableName; // Already plural typically
                const relationName = camelCase(pluralName);
                
                content += `        hasMany("${relationName}", foreignKey="${ref.ColumnName}");\n`;
            });
        }
    }
    
    // Property validations
    if (tableInfo.columns && tableInfo.columns.length > 0) {
        content += '\n        // Validations\n';
        
        tableInfo.columns.forEach(column => {
            const validations = [];
            
            // Not null validation
            if (!column.nullable) {
                validations.push(`presence=true`);
            }
            
            // Type validation
            const baseType = column.dataType.split('(')[0].toLowerCase();
            if (VALIDATION_MAP[baseType]) {
                validations.push(`validatesAs="${VALIDATION_MAP[baseType]}"`);
            }
            
            // Length validation for string types
            if (['char', 'varchar', 'nchar', 'nvarchar'].includes(baseType) && column.maxLength && column.maxLength !== 'N/A' && column.maxLength !== -1) {
                validations.push(`maxLength=${column.maxLength}`);
            }
            
            if (validations.length > 0) {
                content += `        validates("${column.name}", ${validations.join(', ')});\n`;
            }
        });
    }

    // Timestamp columns
    const createdAtField = tableInfo.columns.find(col => col.name === 'CreatedTimestamp');
    const updatedAtField = tableInfo.columns.find(col => col.name === 'LastUpdatedTimestamp');
    
    if (createdAtField && updatedAtField) {
        content += '\n        // Timestamp columns\n';
        content += `        property(name="createdAt", column="CreatedTimestamp");\n`;
        content += `        property(name="updatedAt", column="LastUpdatedTimestamp");\n`;
    }
    
    content += '\n        return this;\n';
    content += '    }\n\n';
    
    // Add property documentation
    content += '    /**\n';
    content += '     * Properties:\n';
    
    tableInfo.columns.forEach(column => {
        const baseType = column.dataType.split('(')[0].toLowerCase();
        const cfType = VALIDATION_MAP[baseType] || 'any';
        
        content += `     * @property {${cfType}} ${column.name}`;
        
        if (column.nullable) {
            content += ' (nullable)';
        }
        
        if (column.defaultValue && column.defaultValue !== 'NULL') {
            content += ` (default: ${column.defaultValue})`;
        }
        
        content += '\n';
    });
    
    content += '     */\n\n';
    
    // Close component
    content += `}\n`;
    
    return content;
}

async function generateModel(client, tableName, outputDir) {
    try {
        // Get detailed information about the table
        const tableInfo = await getTableDetails(client, tableName);
        
        if (!tableInfo) {
            console.error(`❌ Could not generate model for ${tableName}`);
            return false;
        }
        
        // Get tables referencing this table (for hasMany relationships)
        const referencingTables = await getReferencingTables(client, tableName);
        
        // Generate model content
        const modelContent = generateModelContent(tableInfo, referencingTables);
        
        // Create model file name (singularized and pascal-cased)
        const modelName = pascalCase(singularize(tableName));
        const fileName = `${modelName}.cfc`;
        const filePath = path.join(outputDir, fileName);
        
        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Write model to file
        fs.writeFileSync(filePath, modelContent);
        
        console.log(`✅ Generated model for ${tableName} -> ${filePath}`);
        return true;
    } catch (err) {
        console.error(`❌ Error generating model for ${tableName}: ${err.message}`);
        return false;
    }
}

async function main() {
    try {
        // Get command line arguments
        const args = process.argv.slice(2);
        let outputDir = DEFAULT_OUTPUT_DIR;
        let specificTables = [];
        
        // Process command line arguments
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '--output' || args[i] === '-o') {
                if (i + 1 < args.length) {
                    outputDir = args[i + 1];
                    i++;
                }
            } else if (args[i] === '--tables' || args[i] === '-t') {
                if (i + 1 < args.length) {
                    specificTables = args[i + 1].split(',').map(t => t.trim());
                    i++;
                }
            } else if (args[i] === '--help' || args[i] === '-h') {
                console.log('Usage: node generate-models-sql.mjs [options]');
                console.log('Options:');
                console.log('  --output, -o <dir>      Output directory for model files');
                console.log('  --tables, -t <tables>   Comma-separated list of specific tables to process');
                console.log('  --help, -h              Show this help message');
                process.exit(0);
            }
        }
        
        // Connect to MCP server
        const client = await connectToServer();
        
        // Get tables list
        let tables = [];
        
        if (specificTables.length > 0) {
            tables = specificTables;
            console.log(`📄 Processing ${tables.length} specified tables`);
        } else {
            tables = await getAllTables(client);
        }
        
        if (tables.length === 0) {
            console.error('❌ No tables found to process');
            process.exit(1);
        }
        
        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log(`📁 Created output directory: ${outputDir}`);
        }
        
        // Generate models for each table
        console.log(`🔧 Generating models for ${tables.length} tables in ${outputDir}`);
        
        let successCount = 0;
        
        for (const tableName of tables) {
            const success = await generateModel(client, tableName, outputDir);
            if (success) successCount++;
        }
        
        console.log('\n=======================================');
        console.log(`✅ Generated ${successCount} of ${tables.length} models`);
        console.log(`📁 Output directory: ${outputDir}`);
        console.log('=======================================');
        
        process.exit(0);
    } catch (err) {
        console.error(`❌ Error in script execution: ${err.message}`);
        process.exit(1);
    }
}

// Run main function
main();