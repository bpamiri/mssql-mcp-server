# CFWheels Model Generation for SQL Server Database

This project creates CFWheels model files for a SQL Server database using the Model-Context Protocol (MCP) server as a bridge between Node.js and SQL Server.

## Components

1. **MSSQL MCP Server** (`server.mjs`): Serves as a bridge between Model-Context Protocol clients and SQL Server databases. It exposes database functionalities through a standardized API.

2. **Model Generator** (`generate-wheels-models.js`): A standalone script that generates CFWheels model files based on the database schema extracted from `SRP_tables.sql`.

## Generated Models

The generator created the following CFWheels models based on the SQL Server database tables:

1. Activity
2. ActivityStudyItemIndividual
3. ActivityStudyItem
4. ApplicationConfiguration
5. ApplicationHistory
6. ClusterAuxiliaryBoardMember
7. Cluster
8. Cycle
9. DBScriptHistory
10. ElectoralUnit
11. GroupOfCluster
12. GroupOfRegion
13. IndividualEmail
14. IndividualPhone
15. Individual
16. ListColumn
17. ListDisplayColumn
18. ListFilterColumn
19. List
20. ListSortColumn
21. LoadDataFile
22. Locality
23. LocalizedStudyItem
24. NationalCommunity
25. Region
26. StudyItem
27. Subdivision
28. Subregion

## Model Features

Each generated model includes:

1. **Table Configuration**: Proper table name and primary key mapping.
2. **Timestamps**: Standard CFWheels timestamp properties for CreatedTimestamp and LastUpdatedTimestamp columns.
3. **Relationships**:
   - belongsTo: Relationships inferred from foreign key constraints.
   - hasMany: Inverse relationships derived from foreign key references.
4. **Naming Convention**: Models follow CFWheels conventions with singular model names and camelCase relationship names.

## Usage

The generated models can be used in a CFWheels application by:

1. Copying the `.cfc` files to the `models` directory of your CFWheels application.
2. Ensuring that your CFWheels application is configured to connect to the SQL Server database with the appropriate schema.

## Sample Model Structure

Here's an example of a generated model:

```coldfusion
/**
 * Individual Model
 * Table: Individuals
 * 
 * Generated with CFWheels Model Generator
 * Date: 2025-05-20T01:46:14.056Z
 */
component extends="Model" output="false" {

    function init() {
        // Database table configuration
        table("Individuals");
        primaryKey("Id");

        // Timestamp columns
        property(name="createdAt", column="CreatedTimestamp");
        property(name="updatedAt", column="LastUpdatedTimestamp");

        // Belongs To relationships
        belongsTo(name="locality", foreignKey="LocalityId");
        belongsTo(name="subdivision", foreignKey="SubdivisionId");

        // Has Many relationships
        hasMany(name="activityStudyItemIndividuals", foreignKey="IndividualId");
        hasMany(name="individualEmails", foreignKey="IndividualId");
        hasMany(name="individualPhones", foreignKey="IndividualId");

        return this;
    }
}
```

## Next Steps

1. **Extend Models**: Add custom methods and validations to the generated models as needed.
2. **Integrate with CFWheels**: Configure your CFWheels application to use the models.
3. **Add Documentation**: Consider adding more detailed property documentation based on column definitions.
4. **Update Relationships**: Review and update relationship definitions as needed for your application logic.

## Conclusion

This model generation approach provides a quick way to bootstrap a CFWheels application with all the necessary data models from an existing SQL Server database. The generated models follow CFWheels conventions and include all necessary relationships, making it easy to start working with the data immediately.

The model generation can be re-run whenever the database schema changes, allowing for easy synchronization between the database and the application models.