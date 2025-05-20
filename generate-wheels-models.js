/**
 * Simple CFWheels Model Generator
 * 
 * This script generates CFWheels model files based on the SQL Server SRP_tables.sql schema.
 * It doesn't require a database connection, since we'll use the schema directly.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output directory for models
const OUTPUT_DIR = path.join(__dirname, 'output', 'models');

// Table schema from SRP_tables.sql with columns
const TABLES = [
    { 
        name: 'Activities', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'ActivityType', type: 'tinyint', nullable: false },
            { name: 'DisplayStartDate', type: 'varchar', length: 20, nullable: false },
            { name: 'StartDate', type: 'datetime', nullable: false },
            { name: 'DisplayEndDate', type: 'varchar', length: 20, nullable: true },
            { name: 'EndDate', type: 'datetime', nullable: true },
            { name: 'Comments', type: 'nvarchar', length: -1, nullable: true },
            { name: 'IsCompleted', type: 'bit', nullable: false },
            { name: 'HasServiceProjects', type: 'bit', nullable: true },
            { name: 'Participants', type: 'int', nullable: true },
            { name: 'BahaiParticipants', type: 'int', nullable: true },
            { name: 'LocalityId', type: 'bigint', nullable: false },
            { name: 'SubdivisionId', type: 'bigint', nullable: true },
            { name: 'IsOverrideParticipantCounts', type: 'bit', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true },
            { name: 'GUID', type: 'uniqueidentifier', nullable: false },
            { name: 'LegacyId', type: 'nvarchar', length: 255, nullable: true },
            { name: 'InstituteId', type: 'nvarchar', length: 50, nullable: true }
        ]
    },
    { 
        name: 'ActivityStudyItemIndividuals', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'IndividualType', type: 'tinyint', nullable: false },
            { name: 'IndividualRole', type: 'tinyint', nullable: false },
            { name: 'IsCurrent', type: 'bit', nullable: false },
            { name: 'IsCompleted', type: 'bit', nullable: false },
            { name: 'DisplayEndDate', type: 'varchar', length: 20, nullable: true },
            { name: 'EndDate', type: 'datetime', nullable: true },
            { name: 'IndividualId', type: 'bigint', nullable: false },
            { name: 'ActivityId', type: 'bigint', nullable: true },
            { name: 'StudyItemId', type: 'bigint', nullable: true },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true },
            { name: 'ActivityStudyItemId', type: 'bigint', nullable: true }
        ]
    },
    { 
        name: 'ActivityStudyItems', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'DisplayStartDate', type: 'varchar', length: 20, nullable: true },
            { name: 'StartDate', type: 'datetime', nullable: true },
            { name: 'DisplayEndDate', type: 'varchar', length: 20, nullable: true },
            { name: 'EndDate', type: 'datetime', nullable: true },
            { name: 'IsCompleted', type: 'bit', nullable: false },
            { name: 'ActivityId', type: 'bigint', nullable: false },
            { name: 'StudyItemId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true }
        ]
    },
    { 
        name: 'Individuals', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'FirstName', type: 'nvarchar', length: 255, nullable: true },
            { name: 'FamilyName', type: 'nvarchar', length: 255, nullable: true },
            { name: 'Gender', type: 'tinyint', nullable: true },
            { name: 'EstimatedYearOfBirthDate', type: 'smallint', nullable: true },
            { name: 'IsSelectedEstimatedYearOfBirthDate', type: 'bit', nullable: false },
            { name: 'DisplayBirthDate', type: 'varchar', length: 20, nullable: true },
            { name: 'BirthDate', type: 'datetime', nullable: false },
            { name: 'IsRegisteredBahai', type: 'bit', nullable: false },
            { name: 'DisplayRegistrationDate', type: 'varchar', length: 20, nullable: true },
            { name: 'RegistrationDate', type: 'datetime', nullable: true },
            { name: 'UnRegisteredTimestamp', type: 'datetime', nullable: true },
            { name: 'Address', type: 'nvarchar', length: -1, nullable: true },
            { name: 'IsArchived', type: 'bit', nullable: false },
            { name: 'IsNonDuplicate', type: 'bit', nullable: true },
            { name: 'LegacyDataHadCurrentlyAttendingChildrensClass', type: 'bit', nullable: false },
            { name: 'LegacyDataHadCurrentlyParticipatingInAJuniorYouthGroup', type: 'bit', nullable: false },
            { name: 'Comments', type: 'nvarchar', length: -1, nullable: true },
            { name: 'LocalityId', type: 'bigint', nullable: false },
            { name: 'SubdivisionId', type: 'bigint', nullable: true },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ArchivedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true },
            { name: 'GUID', type: 'uniqueidentifier', nullable: false },
            { name: 'LegacyId', type: 'nvarchar', length: 255, nullable: true },
            { name: 'InstituteId', type: 'nvarchar', length: 50, nullable: true },
            { name: 'WasLegacyRecord', type: 'bit', nullable: false }
        ]
    },
    { 
        name: 'Localities', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Name', type: 'nvarchar', length: 255, nullable: false },
            { name: 'LatinName', type: 'nvarchar', length: 255, nullable: true },
            { name: 'HasLocalSpiritualAssembly', type: 'bit', nullable: true },
            { name: 'HasLocalFund', type: 'bit', nullable: true },
            { name: 'IsObservesNineteenDayFeast', type: 'bit', nullable: true },
            { name: 'NineteenDayFeastAttendance', type: 'int', nullable: true },
            { name: 'IsObservesHolyDays', type: 'bit', nullable: true },
            { name: 'HolyDayAttendance', type: 'int', nullable: true },
            { name: 'HasDevotionalMeetings', type: 'bit', nullable: true },
            { name: 'DevotionalMeetings', type: 'int', nullable: true },
            { name: 'DevotionalMeetingAttendance', type: 'int', nullable: true },
            { name: 'DevotionalMeetingFriendAttendance', type: 'int', nullable: true },
            { name: 'IsConductsHomeVisits', type: 'bit', nullable: true },
            { name: 'HomesVisited', type: 'int', nullable: true },
            { name: 'Comments', type: 'nvarchar', length: -1, nullable: true },
            { name: 'ClusterId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true },
            { name: 'GUID', type: 'uniqueidentifier', nullable: false },
            { name: 'LegacyId', type: 'nvarchar', length: 255, nullable: true },
            { name: 'InstituteId', type: 'nvarchar', length: 50, nullable: true },
            { name: 'ElectoralUnitId', type: 'bigint', nullable: true }
        ]
    },
    { 
        name: 'Clusters', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Name', type: 'nvarchar', length: 255, nullable: false },
            { name: 'LatinName', type: 'nvarchar', length: 255, nullable: true },
            { name: 'StageOfDevelopment', type: 'varchar', length: 50, nullable: true },
            { name: 'GeographicSize', type: 'int', nullable: true },
            { name: 'GeographicSizeUnit', type: 'nvarchar', length: 10, nullable: true },
            { name: 'TotalPopulation', type: 'int', nullable: true },
            { name: 'ChildrenClassCoordinators', type: 'int', nullable: true },
            { name: 'JuniorYouthGroupCoordinators', type: 'int', nullable: true },
            { name: 'StudyCircleCoordinators', type: 'int', nullable: true },
            { name: 'Comments', type: 'nvarchar', length: -1, nullable: true },
            { name: 'RegionId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true },
            { name: 'GUID', type: 'uniqueidentifier', nullable: false },
            { name: 'LegacyId', type: 'nvarchar', length: 255, nullable: true },
            { name: 'InstituteId', type: 'nvarchar', length: 50, nullable: true },
            { name: 'SubregionId', type: 'bigint', nullable: true },
            { name: 'GroupOfClusterId', type: 'bigint', nullable: true }
        ]
    },
    { 
        name: 'ApplicationConfigurations', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Name', type: 'varchar', length: 50, nullable: false },
            { name: 'Value', type: 'varchar', length: -1, nullable: false },
            { name: 'Order', type: 'int', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false }
        ]
    },
    { 
        name: 'ApplicationHistories', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'ApplicationVersion', type: 'varchar', length: 50, nullable: false },
            { name: 'Action', type: 'varchar', length: 50, nullable: false },
            { name: 'ActionTimestamp', type: 'datetime', nullable: false },
            { name: 'ApplicationGUID', type: 'uniqueidentifier', nullable: true },
            { name: 'IsRestored', type: 'bit', nullable: true },
            { name: 'Timestamp', type: 'datetime', nullable: true }
        ]
    },
    { 
        name: 'ClusterAuxiliaryBoardMembers', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'BoardMemberName', type: 'nvarchar', length: 255, nullable: false },
            { name: 'Order', type: 'smallint', nullable: false },
            { name: 'ClusterId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true }
        ]
    },
    { 
        name: 'Cycles', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'DisplayStartDate', type: 'varchar', length: 20, nullable: false },
            { name: 'StartDate', type: 'datetime', nullable: false },
            { name: 'DisplayEndDate', type: 'varchar', length: 20, nullable: false },
            { name: 'EndDate', type: 'datetime', nullable: false },
            { name: 'FriendsParticipatingInExpansionPhase', type: 'int', nullable: true },
            { name: 'CompletedBook1', type: 'int', nullable: true },
            { name: 'CompletedBook2', type: 'int', nullable: true },
            { name: 'CompletedBook3G1', type: 'int', nullable: true },
            { name: 'CompletedBook3G2', type: 'int', nullable: true },
            { name: 'CompletedBook3G3', type: 'int', nullable: true },
            { name: 'CompletedBook4', type: 'int', nullable: true },
            { name: 'CompletedBook5', type: 'int', nullable: true },
            { name: 'CompletedBook6', type: 'int', nullable: true },
            { name: 'CompletedBook7', type: 'int', nullable: true },
            { name: 'CompletedBook9U1', type: 'int', nullable: true },
            { name: 'CompletedBook9U2', type: 'int', nullable: true },
            { name: 'IsOverrideCompletedBookData', type: 'bit', nullable: false },
            { name: 'DevotionalMeetingsNumber', type: 'int', nullable: true },
            { name: 'DevotionalMeetingsAttendance', type: 'int', nullable: true },
            { name: 'DevotionalMeetingsFriendsOfFaith', type: 'int', nullable: true },
            { name: 'IsOverrideDevotionalMeetingsData', type: 'bit', nullable: false },
            { name: 'ChildrenClassesNumber', type: 'int', nullable: true },
            { name: 'ChildrenClassesAttendance', type: 'int', nullable: true },
            { name: 'ChildrenClassesFriendsOfFaith', type: 'int', nullable: true },
            { name: 'JuniorYouthGroupsNumber', type: 'int', nullable: true },
            { name: 'JuniorYouthGroupsAttendance', type: 'int', nullable: true },
            { name: 'JuniorYouthGroupsFriendsOfFaith', type: 'int', nullable: true },
            { name: 'IsOverrideJuniorYouthGroupsData', type: 'bit', nullable: false },
            { name: 'StudyCirclesNumber', type: 'int', nullable: true },
            { name: 'StudyCirclesAttendance', type: 'int', nullable: true },
            { name: 'StudyCirclesFriendsOfFaith', type: 'int', nullable: true },
            { name: 'IsOverrideStudyCirclesData', type: 'bit', nullable: false },
            { name: 'ChildrenAndJuniorYouthRegisteredDuringCycle', type: 'int', nullable: true },
            { name: 'YouthAndAdultsEnrolledDuringCycle', type: 'int', nullable: true },
            { name: 'NewlyEnrolledBelieversInInstituteProcess', type: 'int', nullable: true },
            { name: 'IsOverrideExpansionDuringCycleData', type: 'bit', nullable: false },
            { name: 'BahaiChildren', type: 'int', nullable: true },
            { name: 'BahaiJuniorYouth', type: 'int', nullable: true },
            { name: 'BahaiYouth', type: 'int', nullable: true },
            { name: 'BahaiAdultMen', type: 'int', nullable: true },
            { name: 'BahaiAdultWomen', type: 'int', nullable: true },
            { name: 'TotalBahaiBelievers', type: 'int', nullable: true },
            { name: 'IsOverrideBahaiPopulationData', type: 'bit', nullable: false },
            { name: 'HomesVisitedForDeepening', type: 'int', nullable: true },
            { name: 'LocalitiesInNineteenDayFeastHeld', type: 'int', nullable: true },
            { name: 'NineteenDayFeastAttendanceEstimated', type: 'int', nullable: true },
            { name: 'LocalitiesObservedOneOrMoreHolyDays', type: 'int', nullable: true },
            { name: 'HolyDayAttendanceEstimated', type: 'int', nullable: true },
            { name: 'IsOverrideCommunityDevelopmentData', type: 'bit', nullable: false },
            { name: 'ClusterId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true },
            { name: 'IsCycleDateChanged', type: 'bit', nullable: false },
            { name: 'IsLocalityDataChanged', type: 'bit', nullable: false },
            { name: 'IsRecalculated', type: 'bit', nullable: false },
            { name: 'GUID', type: 'uniqueidentifier', nullable: false },
            { name: 'LegacyId', type: 'nvarchar', length: 255, nullable: true },
            { name: 'InstituteId', type: 'nvarchar', length: 50, nullable: true },
            { name: 'Comments', type: 'nvarchar', length: -1, nullable: true }
        ]
    },
    { 
        name: 'DBScriptHistories', 
        primaryKey: 'ScriptName, Version',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'ScriptName', type: 'nvarchar', length: 50, nullable: false },
            { name: 'Version', type: 'varchar', length: 50, nullable: false },
            { name: 'TimeStamp', type: 'datetime', nullable: true }
        ]
    },
    { 
        name: 'ElectoralUnits', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Name', type: 'nvarchar', length: 255, nullable: false },
            { name: 'LatinName', type: 'nvarchar', length: 255, nullable: true },
            { name: 'DelegatesAllocated', type: 'int', nullable: true },
            { name: 'Comments', type: 'nvarchar', length: -1, nullable: true },
            { name: 'RegionId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true },
            { name: 'GUID', type: 'uniqueidentifier', nullable: false }
        ]
    },
    { 
        name: 'GroupOfClusters', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Name', type: 'nvarchar', length: 255, nullable: false },
            { name: 'LatinName', type: 'nvarchar', length: 255, nullable: true },
            { name: 'Comments', type: 'nvarchar', length: -1, nullable: true },
            { name: 'RegionId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true },
            { name: 'GUID', type: 'uniqueidentifier', nullable: false }
        ]
    },
    { 
        name: 'GroupOfRegions', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Name', type: 'nvarchar', length: 255, nullable: false },
            { name: 'LatinName', type: 'nvarchar', length: 255, nullable: true },
            { name: 'Comments', type: 'nvarchar', length: -1, nullable: true },
            { name: 'NationalCommunityId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true },
            { name: 'GUID', type: 'uniqueidentifier', nullable: false }
        ]
    },
    { 
        name: 'IndividualEmails', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Email', type: 'nvarchar', length: 255, nullable: false },
            { name: 'Order', type: 'smallint', nullable: false },
            { name: 'IndividualId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true }
        ]
    },
    { 
        name: 'IndividualPhones', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Phone', type: 'nvarchar', length: 255, nullable: false },
            { name: 'Order', type: 'smallint', nullable: false },
            { name: 'IndividualId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true }
        ]
    },
    { 
        name: 'ListColumns', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false },
            { name: 'EntityType', type: 'varchar', length: 50, nullable: false },
            { name: 'TableName', type: 'varchar', length: 50, nullable: false },
            { name: 'ColumnName', type: 'varchar', length: 100, nullable: false },
            { name: 'SortColumnName', type: 'varchar', length: 100, nullable: true },
            { name: 'FilterColumnName', type: 'varchar', length: 100, nullable: true },
            { name: 'Name', type: 'varchar', length: 100, nullable: false },
            { name: 'DisplayName', type: 'varchar', length: 100, nullable: true },
            { name: 'IsCalculated', type: 'bit', nullable: false },
            { name: 'Expression', type: 'varchar', length: -1, nullable: true },
            { name: 'IsAvailableListColumn', type: 'bit', nullable: false },
            { name: 'IsRequiredListColumn', type: 'bit', nullable: false },
            { name: 'IsSelectableListColumn', type: 'bit', nullable: false },
            { name: 'IsOrderableListColumn', type: 'bit', nullable: false },
            { name: 'IsFilterableListColumn', type: 'bit', nullable: false },
            { name: 'IsAvailableReportColumn', type: 'bit', nullable: false },
            { name: 'IsRequiredReportColumn', type: 'bit', nullable: false },
            { name: 'IsSelectableReportColumn', type: 'bit', nullable: false },
            { name: 'IsOrderableReportColumn', type: 'bit', nullable: false },
            { name: 'IsFilterableReportColumn', type: 'bit', nullable: false },
            { name: 'ColumnType', type: 'varchar', length: 50, nullable: false },
            { name: 'Order', type: 'smallint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'IsAvailableExportColumn', type: 'bit', nullable: false },
            { name: 'ListColumnGroupId', type: 'bigint', nullable: true },
            { name: 'ColumnCategory', type: 'varchar', length: 50, nullable: false },
            { name: 'DBSortColumnName', type: 'varchar', length: 100, nullable: true },
            { name: 'DBFilterColumnName', type: 'varchar', length: 100, nullable: true },
            { name: 'IsInvalidColumn', type: 'bit', nullable: false },
            { name: 'SortFilterCategory1', type: 'varchar', length: 100, nullable: true },
            { name: 'SortFilterCategory2', type: 'varchar', length: 100, nullable: true },
            { name: 'SortFilterCategory3', type: 'varchar', length: 100, nullable: true },
            { name: 'StudyItemId', type: 'bigint', nullable: true }
        ]
    },
    { 
        name: 'ListDisplayColumns', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Order', type: 'smallint', nullable: false },
            { name: 'ListId', type: 'bigint', nullable: false },
            { name: 'ListColumnId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false }
        ]
    },
    { 
        name: 'ListFilterColumns', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'ParentId', type: 'bigint', nullable: true },
            { name: 'Operator', type: 'varchar', length: 100, nullable: false },
            { name: 'Value', type: 'nvarchar', length: 100, nullable: true },
            { name: 'Order', type: 'smallint', nullable: false },
            { name: 'ListId', type: 'bigint', nullable: false },
            { name: 'ListColumnId', type: 'bigint', nullable: true },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false }
        ]
    },
    { 
        name: 'Lists', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Name', type: 'nvarchar', length: 255, nullable: false },
            { name: 'ListType', type: 'varchar', length: 10, nullable: false },
            { name: 'ListSubType', type: 'varchar', length: 50, nullable: false },
            { name: 'EntityType', type: 'varchar', length: 50, nullable: true },
            { name: 'ListKey', type: 'varchar', length: 255, nullable: false },
            { name: 'ListGroup', type: 'varchar', length: 50, nullable: false },
            { name: 'QueryPattern', type: 'varchar', length: 100, nullable: true },
            { name: 'MainTable', type: 'varchar', length: 100, nullable: true },
            { name: 'IsPredefined', type: 'bit', nullable: false },
            { name: 'Order', type: 'smallint', nullable: true },
            { name: 'IsDefault', type: 'bit', nullable: false },
            { name: 'ReferenceId', type: 'bigint', nullable: true },
            { name: 'HasQuickFilter', type: 'bit', nullable: false },
            { name: 'HasListDetails', type: 'bit', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ExportListId', type: 'bigint', nullable: true },
            { name: 'IsIncludeSummaryRow', type: 'bit', nullable: false }
        ]
    },
    { 
        name: 'ListSortColumns', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'SortDirection', type: 'varchar', length: 100, nullable: false },
            { name: 'Order', type: 'smallint', nullable: false },
            { name: 'ListId', type: 'bigint', nullable: false },
            { name: 'ListColumnId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false }
        ]
    },
    { 
        name: 'LoadDataFiles', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'FileName', type: 'nvarchar', length: 255, nullable: false },
            { name: 'FileType', type: 'varchar', length: 50, nullable: false },
            { name: 'FileDate', type: 'datetime', nullable: false },
            { name: 'LoadedDate', type: 'datetime', nullable: false },
            { name: 'LoadedItem', type: 'nvarchar', length: -1, nullable: false },
            { name: 'SourceApplicationGUID', type: 'uniqueidentifier', nullable: true },
            { name: 'SourceApplicationVersion', type: 'varchar', length: 16, nullable: false },
            { name: 'LoadedToLocation', type: 'nvarchar', length: -1, nullable: true },
            { name: 'ApplicationType', type: 'varchar', length: 50, nullable: false },
            { name: 'DBVersion', type: 'varchar', length: 16, nullable: false }
        ]
    },
    { 
        name: 'LocalizedStudyItems', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Title', type: 'nvarchar', length: 255, nullable: true },
            { name: 'StudyItemId', type: 'bigint', nullable: false },
            { name: 'Language', type: 'varchar', length: 10, nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'Name', type: 'nvarchar', length: 255, nullable: true },
            { name: 'ShortName', type: 'nvarchar', length: 10, nullable: true },
            { name: 'CondensedName', type: 'nvarchar', length: 10, nullable: true }
        ]
    },
    { 
        name: 'NationalCommunities', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Name', type: 'nvarchar', length: 255, nullable: false },
            { name: 'LatinName', type: 'nvarchar', length: 255, nullable: true },
            { name: 'Comments', type: 'nvarchar', length: -1, nullable: true },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true },
            { name: 'GUID', type: 'uniqueidentifier', nullable: false },
            { name: 'LegacyId', type: 'nvarchar', length: 255, nullable: true },
            { name: 'InstituteId', type: 'nvarchar', length: 50, nullable: true },
            { name: 'IsAnonymized', type: 'bit', nullable: false }
        ]
    },
    { 
        name: 'Regions', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Name', type: 'nvarchar', length: 255, nullable: false },
            { name: 'LatinName', type: 'nvarchar', length: 255, nullable: true },
            { name: 'HasBahaiCouncil', type: 'bit', nullable: false },
            { name: 'Comments', type: 'nvarchar', length: -1, nullable: true },
            { name: 'NationalCommunityId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true },
            { name: 'GUID', type: 'uniqueidentifier', nullable: false },
            { name: 'LegacyId', type: 'nvarchar', length: 255, nullable: true },
            { name: 'InstituteId', type: 'nvarchar', length: 50, nullable: true },
            { name: 'GroupOfRegionId', type: 'bigint', nullable: true }
        ]
    },
    { 
        name: 'StudyItems', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'ActivityType', type: 'tinyint', nullable: false },
            { name: 'ActivityStudyItemType', type: 'varchar', length: 50, nullable: false },
            { name: 'Sequence', type: 'int', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'ParentStudyItemId', type: 'bigint', nullable: true },
            { name: 'IsReleased', type: 'bit', nullable: false }
        ]
    },
    { 
        name: 'Subdivisions', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Name', type: 'nvarchar', length: 255, nullable: false },
            { name: 'LatinName', type: 'nvarchar', length: 255, nullable: true },
            { name: 'Comments', type: 'nvarchar', length: -1, nullable: true },
            { name: 'LocalityId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true },
            { name: 'GUID', type: 'uniqueidentifier', nullable: false },
            { name: 'LegacyId', type: 'nvarchar', length: 255, nullable: true },
            { name: 'InstituteId', type: 'nvarchar', length: 50, nullable: true }
        ]
    },
    { 
        name: 'Subregions', 
        primaryKey: 'Id',
        columns: [
            { name: 'Id', type: 'bigint', nullable: false, autoIncrement: true },
            { name: 'Name', type: 'nvarchar', length: 255, nullable: false },
            { name: 'LatinName', type: 'nvarchar', length: 255, nullable: true },
            { name: 'Comments', type: 'nvarchar', length: -1, nullable: true },
            { name: 'RegionId', type: 'bigint', nullable: false },
            { name: 'CreatedTimestamp', type: 'datetime', nullable: false },
            { name: 'CreatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'LastUpdatedTimestamp', type: 'datetime', nullable: false },
            { name: 'LastUpdatedBy', type: 'uniqueidentifier', nullable: false },
            { name: 'ImportedFrom', type: 'uniqueidentifier', nullable: true },
            { name: 'ImportedTimestamp', type: 'datetime', nullable: true },
            { name: 'ImportedFileType', type: 'varchar', length: 50, nullable: true },
            { name: 'GUID', type: 'uniqueidentifier', nullable: false }
        ]
    }
];

// Foreign key relationships from SRP_tables.sql
const RELATIONSHIPS = [
    { childTable: 'Activities', childKey: 'LocalityId', parentTable: 'Localities', parentKey: 'Id' },
    { childTable: 'Activities', childKey: 'SubdivisionId', parentTable: 'Subdivisions', parentKey: 'Id' },
    { childTable: 'ActivityStudyItemIndividuals', childKey: 'IndividualId', parentTable: 'Individuals', parentKey: 'Id' },
    { childTable: 'ActivityStudyItemIndividuals', childKey: 'ActivityStudyItemId', parentTable: 'ActivityStudyItems', parentKey: 'Id' },
    { childTable: 'ActivityStudyItemIndividuals', childKey: 'ActivityId', parentTable: 'Activities', parentKey: 'Id' },
    { childTable: 'ActivityStudyItemIndividuals', childKey: 'StudyItemId', parentTable: 'StudyItems', parentKey: 'Id' },
    { childTable: 'ActivityStudyItems', childKey: 'StudyItemId', parentTable: 'StudyItems', parentKey: 'Id' },
    { childTable: 'ActivityStudyItems', childKey: 'ActivityId', parentTable: 'Activities', parentKey: 'Id' },
    { childTable: 'ClusterAuxiliaryBoardMembers', childKey: 'ClusterId', parentTable: 'Clusters', parentKey: 'Id' },
    { childTable: 'Clusters', childKey: 'RegionId', parentTable: 'Regions', parentKey: 'Id' },
    { childTable: 'Clusters', childKey: 'SubregionId', parentTable: 'Subregions', parentKey: 'Id' },
    { childTable: 'Clusters', childKey: 'GroupOfClusterId', parentTable: 'GroupOfClusters', parentKey: 'Id' },
    { childTable: 'Cycles', childKey: 'ClusterId', parentTable: 'Clusters', parentKey: 'Id' },
    { childTable: 'ElectoralUnits', childKey: 'RegionId', parentTable: 'Regions', parentKey: 'Id' },
    { childTable: 'GroupOfClusters', childKey: 'RegionId', parentTable: 'Regions', parentKey: 'Id' },
    { childTable: 'GroupOfRegions', childKey: 'NationalCommunityId', parentTable: 'NationalCommunities', parentKey: 'Id' },
    { childTable: 'IndividualEmails', childKey: 'IndividualId', parentTable: 'Individuals', parentKey: 'Id' },
    { childTable: 'IndividualPhones', childKey: 'IndividualId', parentTable: 'Individuals', parentKey: 'Id' },
    { childTable: 'Individuals', childKey: 'LocalityId', parentTable: 'Localities', parentKey: 'Id' },
    { childTable: 'Individuals', childKey: 'SubdivisionId', parentTable: 'Subdivisions', parentKey: 'Id' },
    { childTable: 'ListDisplayColumns', childKey: 'ListColumnId', parentTable: 'ListColumns', parentKey: 'Id' },
    { childTable: 'ListDisplayColumns', childKey: 'ListId', parentTable: 'Lists', parentKey: 'Id' },
    { childTable: 'ListFilterColumns', childKey: 'ParentId', parentTable: 'ListFilterColumns', parentKey: 'Id' },
    { childTable: 'ListFilterColumns', childKey: 'ListId', parentTable: 'Lists', parentKey: 'Id' },
    { childTable: 'ListFilterColumns', childKey: 'ListColumnId', parentTable: 'ListColumns', parentKey: 'Id' },
    { childTable: 'ListSortColumns', childKey: 'ListColumnId', parentTable: 'ListColumns', parentKey: 'Id' },
    { childTable: 'ListSortColumns', childKey: 'ListId', parentTable: 'Lists', parentKey: 'Id' },
    { childTable: 'Localities', childKey: 'ElectoralUnitId', parentTable: 'ElectoralUnits', parentKey: 'Id' },
    { childTable: 'Localities', childKey: 'ClusterId', parentTable: 'Clusters', parentKey: 'Id' },
    { childTable: 'LocalizedStudyItems', childKey: 'StudyItemId', parentTable: 'StudyItems', parentKey: 'Id' },
    { childTable: 'Regions', childKey: 'GroupOfRegionId', parentTable: 'GroupOfRegions', parentKey: 'Id' },
    { childTable: 'Regions', childKey: 'NationalCommunityId', parentTable: 'NationalCommunities', parentKey: 'Id' },
    { childTable: 'StudyItems', childKey: 'ParentStudyItemId', parentTable: 'StudyItems', parentKey: 'Id' },
    { childTable: 'Subdivisions', childKey: 'LocalityId', parentTable: 'Localities', parentKey: 'Id' },
    { childTable: 'Subregions', childKey: 'RegionId', parentTable: 'Regions', parentKey: 'Id' }
];

// --------------------------------
// Helper functions
// --------------------------------

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

function camelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

// --------------------------------
// Main functionality
// --------------------------------

// Get belongsTo relationships for a table
function getBelongsToRelationships(tableName) {
    return RELATIONSHIPS.filter(rel => rel.childTable === tableName);
}

// Get hasMany relationships for a table
function getHasManyRelationships(tableName) {
    return RELATIONSHIPS.filter(rel => rel.parentTable === tableName);
}

// Map SQL Server type to CFWheels validation type
function getSqlValidationType(sqlType) {
    const typeMap = {
        'varchar': 'string',
        'nvarchar': 'string',
        'char': 'string',
        'nchar': 'string',
        'text': 'string',
        'ntext': 'string',
        'int': 'integer',
        'bigint': 'integer',
        'smallint': 'integer',
        'tinyint': 'integer',
        'decimal': 'numeric',
        'numeric': 'numeric',
        'float': 'numeric',
        'real': 'numeric',
        'money': 'numeric',
        'smallmoney': 'numeric',
        'bit': 'boolean',
        'datetime': 'datetime',
        'date': 'date',
        'time': 'time',
        'uniqueidentifier': 'guid'
    };
    
    return typeMap[sqlType] || 'any';
}

// Generate a model file for a table
function generateModel(table) {
    const tableName = table.name;
    const modelName = singularize(tableName);
    const primaryKey = table.primaryKey;
    const columns = table.columns || [];
    
    // Get relationships
    const belongsTo = getBelongsToRelationships(tableName);
    const hasMany = getHasManyRelationships(tableName);
    
    // Start building the model
    let content = '';
    
    // Component header
    content += `/**\n`;
    content += ` * ${modelName} Model\n`;
    content += ` * Table: ${tableName}\n`;
    content += ` * \n`;
    content += ` * Generated with CFWheels Model Generator\n`;
    content += ` * Date: ${new Date().toISOString()}\n`;
    content += ` */\n`;
    content += `component extends="Model" output="false" {\n\n`;
    
    // Init function
    content += `    function init() {\n`;
    content += `        // Database table configuration\n`;
    content += `        table("${tableName}");\n`;
    
    // Primary key
    if (primaryKey.includes(',')) {
        // Composite primary key
        const keys = primaryKey.split(',').map(k => `"${k.trim()}"`).join(', ');
        content += `        primaryKey(${keys});\n`;
    } else {
        content += `        primaryKey("${primaryKey}");\n`;
    }
    
    // Timestamp columns - common in this schema
    const createdAtField = columns.find(col => col.name === 'CreatedTimestamp');
    const updatedAtField = columns.find(col => col.name === 'LastUpdatedTimestamp');
    
    if (createdAtField && updatedAtField) {
        content += `\n        // Timestamp columns\n`;
        content += `        property(name="createdAt", column="CreatedTimestamp");\n`;
        content += `        property(name="updatedAt", column="LastUpdatedTimestamp");\n`;
    }
    
    // Column validations
    if (columns.length > 0) {
        content += `\n        // Property validations\n`;
        
        columns.forEach(column => {
            const validations = [];
            
            // Skip primary key and timestamps which are handled separately
            if (column.name === primaryKey || 
                column.name === 'CreatedTimestamp' || 
                column.name === 'LastUpdatedTimestamp' || 
                column.name === 'CreatedBy' || 
                column.name === 'LastUpdatedBy') {
                return;
            }
            
            // Required validation for non-nullable columns
            if (!column.nullable) {
                validations.push('required=true');
            }
            
            // Type validation
            const validationType = getSqlValidationType(column.type);
            if (validationType) {
                validations.push(`type="${validationType}"`);
            }
            
            // Length validation for string types with specific length
            if (['varchar', 'nvarchar', 'char', 'nchar'].includes(column.type) && 
                column.length && column.length > 0 && column.length !== -1) {
                validations.push(`maxLength=${column.length}`);
            }
            
            if (validations.length > 0) {
                content += `        validates("${column.name}", {${validations.join(', ')}});\n`;
            }
        });
    }
    
    // Properties for all columns
    if (columns.length > 0) {
        content += `\n        // Properties\n`;
        
        columns.forEach(column => {
            // Skip timestamp fields already defined above
            if ((column.name === 'CreatedTimestamp' && createdAtField) || 
                (column.name === 'LastUpdatedTimestamp' && updatedAtField)) {
                return;
            }
            
            content += `        property(name="${column.name}");\n`;
        });
    }
    
    // Belongs To relationships
    if (belongsTo.length > 0) {
        content += `\n        // Belongs To relationships\n`;
        belongsTo.forEach(rel => {
            const parentModel = singularize(rel.parentTable);
            content += `        belongsTo(name="${camelCase(parentModel)}", foreignKey="${rel.childKey}");\n`;
        });
    }
    
    // Has Many relationships
    if (hasMany.length > 0) {
        content += `\n        // Has Many relationships\n`;
        hasMany.forEach(rel => {
            if (rel.parentTable !== rel.childTable) { // Skip self-references for now
                content += `        hasMany(name="${camelCase(rel.childTable)}", foreignKey="${rel.childKey}");\n`;
            }
        });
    }
    
    // End init function
    content += `\n        return this;\n`;
    content += `    }\n\n`;
    
    // Add property documentation
    if (columns.length > 0) {
        content += `    /**\n`;
        content += `     * Properties Documentation\n`;
        
        columns.forEach(column => {
            const validationType = getSqlValidationType(column.type);
            content += `     * @property ${column.name} ${column.type}`;
            
            if (column.length && column.length > 0 && column.length !== -1) {
                content += `(${column.length})`;
            }
            
            if (column.nullable) {
                content += ` (nullable)`;
            }
            
            if (column.autoIncrement) {
                content += ` (autoIncrement)`;
            }
            
            content += `\n`;
        });
        
        content += `     */\n`;
    }
    
    // Close component
    content += `}\n`;
    
    return content;
}

// Generate all models
function generateAllModels() {
    console.log(`Generating ${TABLES.length} models...`);
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`Created output directory: ${OUTPUT_DIR}`);
    }
    
    // Generate each model
    TABLES.forEach(table => {
        const modelName = singularize(table.name);
        const modelContent = generateModel(table);
        const filePath = path.join(OUTPUT_DIR, `${modelName}.cfc`);
        
        // Write the model file
        fs.writeFileSync(filePath, modelContent);
        console.log(`Generated model: ${modelName}`);
    });
    
    console.log(`\nAll models generated successfully!`);
    console.log(`Output directory: ${OUTPUT_DIR}`);
}

// Run the generator
generateAllModels();