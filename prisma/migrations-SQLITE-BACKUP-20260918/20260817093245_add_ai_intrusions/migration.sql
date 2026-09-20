-- AlterTable
ALTER TABLE "AiChat" ADD COLUMN "response" TEXT;

-- AlterTable
ALTER TABLE "AlumniEndowment" ADD COLUMN "campaign" TEXT;
ALTER TABLE "AlumniEndowment" ADD COLUMN "gradYear" INTEGER;

-- AlterTable
ALTER TABLE "AutonomousDronePatrol" ADD COLUMN "aiIntrusions" INTEGER;
ALTER TABLE "AutonomousDronePatrol" ADD COLUMN "batteryPct" INTEGER;
ALTER TABLE "AutonomousDronePatrol" ADD COLUMN "currentAltitudeM" INTEGER;
ALTER TABLE "AutonomousDronePatrol" ADD COLUMN "droneCode" TEXT;
ALTER TABLE "AutonomousDronePatrol" ADD COLUMN "patrolStatus" TEXT DEFAULT 'PATROLLING';
ALTER TABLE "AutonomousDronePatrol" ADD COLUMN "sectorName" TEXT;

-- AlterTable
ALTER TABLE "CafeteriaOrder" ADD COLUMN "dietaryTag" TEXT;
ALTER TABLE "CafeteriaOrder" ADD COLUMN "itemTitle" TEXT;
ALTER TABLE "CafeteriaOrder" ADD COLUMN "mealType" TEXT;
ALTER TABLE "CafeteriaOrder" ADD COLUMN "price" REAL;

-- AlterTable
ALTER TABLE "CounselingSession" ADD COLUMN "counselorName" TEXT;
ALTER TABLE "CounselingSession" ADD COLUMN "issueCategory" TEXT;
ALTER TABLE "CounselingSession" ADD COLUMN "sessionDate" TEXT;

-- AlterTable
ALTER TABLE "CrisisIncident" ADD COLUMN "assignedTeam" TEXT;
ALTER TABLE "CrisisIncident" ADD COLUMN "incidentType" TEXT;
ALTER TABLE "CrisisIncident" ADD COLUMN "location" TEXT;
ALTER TABLE "CrisisIncident" ADD COLUMN "severity" TEXT DEFAULT 'HIGH';

-- AlterTable
ALTER TABLE "DeliveryFleet" ADD COLUMN "currentBattery" INTEGER;
ALTER TABLE "DeliveryFleet" ADD COLUMN "currentLocation" TEXT;
ALTER TABLE "DeliveryFleet" ADD COLUMN "payloadDescription" TEXT;
ALTER TABLE "DeliveryFleet" ADD COLUMN "vehicleType" TEXT;

-- AlterTable
ALTER TABLE "DigitalCredential" ADD COLUMN "credentialTitle" TEXT;
ALTER TABLE "DigitalCredential" ADD COLUMN "credentialType" TEXT;
ALTER TABLE "DigitalCredential" ADD COLUMN "issueHash" TEXT;
ALTER TABLE "DigitalCredential" ADD COLUMN "rollNo" TEXT;

-- AlterTable
ALTER TABLE "SmartAssetTracker" ADD COLUMN "assetCode" TEXT;
ALTER TABLE "SmartAssetTracker" ADD COLUMN "assignedTo" TEXT;
ALTER TABLE "SmartAssetTracker" ADD COLUMN "batteryPct" INTEGER;
ALTER TABLE "SmartAssetTracker" ADD COLUMN "buildingName" TEXT;
ALTER TABLE "SmartAssetTracker" ADD COLUMN "category" TEXT;
ALTER TABLE "SmartAssetTracker" ADD COLUMN "currentRoom" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN "cgpa" REAL;
ALTER TABLE "Student" ADD COLUMN "email" TEXT;
ALTER TABLE "Student" ADD COLUMN "rollNo" TEXT;
ALTER TABLE "Student" ADD COLUMN "status" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmergencyBroadcast" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schoolId" TEXT NOT NULL,
    "title" TEXT,
    "message" TEXT,
    "channel" TEXT,
    "recipientCount" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'DISPATCHED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmergencyBroadcast_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EmergencyBroadcast" ("createdAt", "id", "schoolId", "status", "title", "updatedAt") SELECT "createdAt", "id", "schoolId", "status", "title", "updatedAt" FROM "EmergencyBroadcast";
DROP TABLE "EmergencyBroadcast";
ALTER TABLE "new_EmergencyBroadcast" RENAME TO "EmergencyBroadcast";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
