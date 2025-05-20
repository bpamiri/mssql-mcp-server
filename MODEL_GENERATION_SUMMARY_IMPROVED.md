# CFWheels Model Generation for SQL Server Database (Improved)

This project creates enhanced CFWheels model files for a SQL Server database using the Model-Context Protocol (MCP) server as a bridge between Node.js and SQL Server.

## Components

1. **MSSQL MCP Server** (`server.mjs`): Serves as a bridge between Model-Context Protocol clients and SQL Server databases. It exposes database functionalities through a standardized API.

2. **Improved Model Generator** (`generate-wheels-models-improved.js`): An enhanced standalone script that generates CFWheels model files based on the database schema extracted from `SRP_tables.sql`.

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

## Improvements

The improved model generator includes the following enhancements:

1. **Correct Singular Model Names**: Fixed singularization function to properly handle special cases like "Cycles" → "Cycle" and "IndividualPhones" → "IndividualPhone".

2. **Enhanced Documentation**:
   - Added table-level descriptions
   - Included property-level descriptions with the purpose of each field
   - Added comprehensive comments for relationships

3. **Self-References Support**:
   - Properly handles self-referencing tables (like parent-child relationships in StudyItems)
   - Implements both belongsTo and hasMany sides of the relationship

4. **Model Methods**:
   - Added `toString()` method to each model for better display in UI and debugging

5. **Organized Layouts**:
   - Better code organization with intuitive section grouping
   - Clear separation of configuration, validations, and relationships

## Model Features

Each generated model includes:

1. **Table Configuration**: Proper table name and primary key mapping.
2. **Timestamps**: Standard CFWheels timestamp properties for CreatedTimestamp and LastUpdatedTimestamp columns.
3. **Relationships**:
   - belongsTo: Relationships inferred from foreign key constraints.
   - hasMany: Inverse relationships derived from foreign key references.
   - self-references: Explicit parent-child relationships within the same table.
4. **Validation Rules**: Based on column nullability, data types, and length constraints.
5. **Description Comments**: Human-readable descriptions of each property's purpose.
6. **Naming Convention**: Models follow CFWheels conventions with singular model names and camelCase relationship names.

## Usage

The generated models can be used in a CFWheels application by:

1. Copying the `.cfc` files to the `models` directory of your CFWheels application.
2. Ensuring that your CFWheels application is configured to connect to the SQL Server database with the appropriate schema.
3. Adding any custom methods or additional validation rules as needed.

## Sample Model Structure

Here's an example of an improved generated model:

```coldfusion
/**
 * StudyItem Model
 * Table: StudyItems
 * 
 * Description: Represents studyitems in the system
 * 
 * Belongs to:
 * - StudyItem (via ParentStudyItemId)
 * 
 * Has many:
 * - ActivityStudyItemIndividuals (via StudyItemId)
 * - ActivityStudyItems (via StudyItemId)
 * - LocalizedStudyItems (via StudyItemId)
 * 
 * Self-references:
 * - Parent/child relationship via ParentStudyItemId
 * 
 * Generated with Improved CFWheels Model Generator
 * Date: 2025-05-20T02:18:30.727Z
 */
component extends="Model" output="false" {

    /**
     * Model initialization
     * Sets up table mapping, keys, properties, validations, and relationships
     */
    function init() {
        // Database table configuration
        table("StudyItems");
        primaryKey("Id");

        // Timestamp columns
        property(name="createdAt", column="CreatedTimestamp");
        property(name="updatedAt", column="LastUpdatedTimestamp");

        // Property validations
        validates("ActivityType", {required=true, type="integer"});
        validates("ActivityStudyItemType", {required=true, type="string", maxLength=50});
        validates("Sequence", {required=true, type="integer"});
        validates("ParentStudyItemId", {type="integer"});
        validates("IsReleased", {required=true, type="boolean"});

        // Properties
        property(name="Id");
        property(name="ActivityType");
        property(name="ActivityStudyItemType");
        property(name="Sequence");
        property(name="ParentStudyItemId");
        property(name="IsReleased");

        // Belongs To relationships
        // References the parent StudyItem
        belongsTo(name="studyItem", foreignKey="ParentStudyItemId");

        // Has Many relationships
        // Contains multiple ActivityStudyItemIndividuals
        hasMany(name="activityStudyItemIndividuals", foreignKey="StudyItemId");
        // Contains multiple ActivityStudyItems
        hasMany(name="activityStudyItems", foreignKey="StudyItemId");
        // Contains multiple LocalizedStudyItems
        hasMany(name="localizedStudyItems", foreignKey="StudyItemId");

        // Self-referencing relationships
        // Reference to the parent StudyItem
        belongsTo(name="parentStudyItem", foreignKey="ParentStudyItemId");
        // References to child StudyItems
        hasMany(name="childStudyItems", foreignKey="ParentStudyItemId");

        return this;
    }

    /**
     * Properties Documentation
     * @property Id bigint (autoIncrement) - Primary key identifier
     * @property ActivityType tinyint - Numeric value
     * @property ActivityStudyItemType varchar(50) - Text field
     * @property Sequence int - Numeric value
     * @property CreatedTimestamp datetime - When this record was created
     * @property LastUpdatedTimestamp datetime - Date/time value
     * @property ParentStudyItemId bigint (nullable) - Foreign key reference to Parentstudyitem
     * @property IsReleased bit - Boolean flag indicating released
     */

    /**
     * Get a string representation of this StudyItem
     * Returns a human-readable identifier for this record
     */
    public string function toString() {
        return "StudyItem ##" & this.Id;
    }
}
```

## Next Steps

1. **Extend Models**: Add custom methods and validations to the generated models as needed.
2. **Integrate with CFWheels**: Configure your CFWheels application to use the models.
3. **Add Business Logic**: Implement specific business rules within each model.
4. **Create Custom Methods**: Add methods to facilitate common queries or operations.
5. **Customize Relationships**: Further refine relationship definitions as needed for your application logic.

## Conclusion

This improved model generation approach provides a quick way to bootstrap a CFWheels application with comprehensive data models from an existing SQL Server database. The generated models follow CFWheels conventions, include detailed documentation, and properly handle complex relationship scenarios, making it easy to start working with the data immediately.

The model generation can be re-run whenever the database schema changes, allowing for easy synchronization between the database and the application models.