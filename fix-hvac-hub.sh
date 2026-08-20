#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Adding SmartHvacUnit Model to Prisma Schema"
echo "=================================================="

mkdir -p prisma
mkdir -p src/lib

cat << 'SCHEMA' > prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model School {
  id                     String                  @id @default(uuid())
  name                   String
  code                   String?                 @unique
  subdomain              String?                 @unique
  email                  String?
  tier                   String                  @default("ENTERPRISE")
  maxStudents            Int                     @default(1000)
  logoUrl                String?
  stripeCustomerId       String?                 @unique
  stripeSubscription     String?                 @unique
  stripeStatus           String                  @default("ACTIVE")
  createdAt              DateTime                @default(now())
  updatedAt              DateTime                @updatedAt
  facilities             Facility[]
  students               Student[]
  placements             Placement[]
  alerts                 Alert[]
  auditLogs              AuditLog[]
  webhookLogs            WebhookLog[]
  apiKeys                ApiKey[]
  backupSnapshots        BackupSnapshot[]
  invoices               Invoice[]
  alumniEndowments       AlumniEndowment[]
  smartAssetTrackers     SmartAssetTracker[]
  aiChats                AiChat[]
  emergencyBroadcasts    EmergencyBroadcast[]
  cafeteriaOrders        CafeteriaOrder[]
  counselingSessions     CounselingSession[]
  digitalCredentials     DigitalCredential[]
  crisisIncidents        CrisisIncident[]
  deliveryFleets         DeliveryFleet[]
  autonomousDronePatrols AutonomousDronePatrol[]
  smartEnergyGrids       SmartEnergyGrid[]
  esgMetrics             EsgMetric[]
  eventClubs             EventClub[]
  smartFireSafetySystems SmartFireSafetySystem[]
  medicalRecords         MedicalRecord[]
  hostelRooms            HostelRoom[]
  smartHvacUnits         SmartHvacUnit[]
}

model Facility {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name        String   @default("Campus Zone")
  type        String   @default("Assembly")
  zoneName    String?
  solar       String?
  hvac        String?
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Student {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name        String
  rollNo      String?
  cgpa        Float?
  email       String?  @unique
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Placement {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  company     String
  role        String
  package     Float?
  ctc         Float?
  offers      Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Alert {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title       String
  message     String
  severity    String   @default("INFO")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model AuditLog {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  action      String
  details     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model WebhookLog {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  endpoint    String
  payload     String?
  status      String   @default("SUCCESS")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ApiKey {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name        String
  key         String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BackupSnapshot {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  filename    String
  size        String?
  status      String   @default("SUCCESS")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Invoice {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  items       String   @default("Enterprise SaaS Tier License")
  amount      Float
  status      String   @default("PAID")
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model AlumniEndowment {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  donorName   String
  gradYear    Int?
  amount      Float
  campaign    String?
  status      String   @default("COMPLETED")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SmartAssetTracker {
  id           String   @id @default(uuid())
  schoolId     String
  school       School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  assetCode    String
  assetName    String
  category     String?
  buildingName String?
  currentRoom  String?
  batteryPct   Float?
  status       String   @default("ACTIVE")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model AiChat {
  id        String   @id @default(uuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  prompt    String
  reply     String?
  response  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model EmergencyBroadcast {
  id             String   @id @default(uuid())
  schoolId       String
  school         School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title          String
  message        String?
  severity       String   @default("HIGH")
  channel        String   @default("SMS")
  recipientCount Int      @default(0)
  status         String   @default("SENT")
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model CafeteriaOrder {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName String
  items       String?
  amount      Float?
  mealType    String?
  itemTitle   String?
  dietaryTag  String?
  price       Float?
  status      String   @default("PENDING")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model CounselingSession {
  id            String    @id @default(uuid())
  schoolId      String
  school        School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName   String
  counselorName String?
  topic         String?
  issueCategory String?
  sessionDate   DateTime?
  status        String    @default("SCHEDULED")
  scheduledAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model DigitalCredential {
  id              String    @id @default(uuid())
  schoolId        String
  school          School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName     String
  rollNo          String?
  credentialTitle String?
  credentialType  String?
  issueDate       DateTime?
  issueHash       String?
  status          String    @default("ISSUED")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model CrisisIncident {
  id           String    @id @default(uuid())
  schoolId     String
  school       School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title        String?
  description  String?
  incidentType String?
  severity     String    @default("HIGH")
  status       String    @default("ACTIVE")
  location     String?
  reportedBy   String?
  assignedTeam String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model DeliveryFleet {
  id                 String    @id @default(uuid())
  schoolId           String
  school             School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  vehicleName        String?
  vehicleType        String?
  driverName         String?
  status             String    @default("ACTIVE")
  currentLocation    String?
  batteryPct         Float?
  currentBattery     Float?
  route              String?
  payloadDescription String?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model AutonomousDronePatrol {
  id               String    @id @default(uuid())
  schoolId         String
  school           School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  droneName        String?
  droneCode        String?
  sectorName       String?
  status           String    @default("ACTIVE")
  patrolStatus     String    @default("PATROLLING")
  batteryPct       Float?
  currentLocation  String?
  mission          String?
  altitude         Float?
  speed            Float?
  aiIntrusions     Int?      @default(0)
  currentAltitudeM Int?      @default(45)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}

model SmartEnergyGrid {
  id                String    @id @default(uuid())
  schoolId          String
  school            School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  sectorName        String?
  zoneName          String?
  solarKw           Float?
  solarOutputKw     Float?
  gridDrawKw        Float?
  batteryStoragePct Float?
  batteryLevel      Float?
  aiMode            String?   @default("ECO_PEAK")
  gridStatus        String    @default("STABLE")
  powerUsageKw      Float?
  status            String    @default("ACTIVE")
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

model EsgMetric {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  metricName  String?
  category    String?
  value       Float?
  targetValue Float?
  unit        String?
  status      String   @default("TRACKING")
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model EventClub {
  id            String    @id @default(uuid())
  schoolId      String
  school        School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  eventName     String?
  clubName      String?
  category      String?
  venue         String?
  budget        Float?
  eventDate     DateTime?
  location      String?
  status        String    @default("UPCOMING")
  description   String?
  attendeeCount Int?      @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model SmartFireSafetySystem {
  id            String    @id @default(uuid())
  schoolId      String
  school        School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  zoneName      String?
  sensorCode    String?
  panelCode     String?
  locationName  String?
  smokePpm      Float?
  sprinklerPsi  Float?
  temperatureC  Float?
  status        String    @default("ACTIVE")
  smokeLevel    Float?
  temperature   Float?
  batteryPct    Float?
  alarmState    String    @default("NORMAL")
  alarmStatus   String    @default("NORMAL")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model MedicalRecord {
  id          String    @id @default(uuid())
  schoolId    String
  school      School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName String?
  rollNo      String?
  symptoms    String?
  diagnosis   String?
  treatment   String?
  severity    String    @default("MODERATE")
  doctorName  String?
  visitDate   DateTime?
  status      String    @default("ACTIVE")
  notes       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model HostelRoom {
  id               String    @id @default(uuid())
  schoolId         String
  school           School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  roomNo           String?
  roomNumber       String?
  blockName        String?
  roomType         String?   @default("STANDARD")
  capacity         Int?      @default(2)
  occupancy        Int?      @default(0)
  currentOccupants Int?      @default(0)
  wardenName       String?
  status           String    @default("AVAILABLE")
  notes            String?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}

model SmartHvacUnit {
  id           String    @id @default(uuid())
  schoolId     String
  school       School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  unitCode     String?
  zoneName     String?
  buildingName String?
  temperatureC Float?
  targetTempC  Float?
  humidity     Float?
  mode         String?   @default("AUTO")
  status       String    @default("ACTIVE")
  fanSpeed     String?   @default("MEDIUM")
  batteryPct   Float?
  notes        String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
SCHEMA

rm -rf .next
rm -rf node_modules/.prisma

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Running Next.js Production Build..."
npm run build

echo "✨ Build completed successfully!"
