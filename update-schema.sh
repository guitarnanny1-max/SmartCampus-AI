#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Updating Student Model & Rebuilding Project..."
echo "=================================================="

mkdir -p prisma

# Write the updated schema with rollNo and cgpa included
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
  tagline                String?
  code                   String?                 @unique
  subdomain              String?                 @unique
  email                  String?
  tier                   String                  @default("ENTERPRISE")
  subscriptionTier       String?                 @default("ENTERPRISE")
  subscriptionStatus     String?                 @default("ACTIVE")
  maxStudents            Int                     @default(1000)
  logoUrl                String?
  whiteLabelBrandName    String?
  whiteLabelLogoUrl      String?
  customDomain           String?                 @unique
  primaryColor           String?
  accentColor            String?
  stripeCustomerId       String?                 @unique
  stripeSubscription     String?                 @unique
  stripeStatus           String                  @default("ACTIVE")
  createdAt              DateTime                @default(now())
  updatedAt              DateTime                @updatedAt
  
  // Relations
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
  labEquipments          LabEquipment[]
  libraryBooks           LibraryBook[]
  lostItems              LostItem[]
  maintenanceWorkOrders  MaintenanceWorkOrder[]
  usageMetrics           UsageMetric[]
  smartParkingBays       SmartParkingBay[]
  parkingPermits         ParkingPermit[]
  campusPaymentRecords   CampusPaymentRecord[]
  smartStaffHealths      SmartStaffHealth[]
  smartLmsOpenSources    SmartLmsOpenSource[]
  printJobs              PrintJob[]
  examProctoringSessions ExamProctoringSession[]
  auditReports           AuditReport[]
  researchGrants         ResearchGrant[]
  scholarshipApplications ScholarshipApplication[]
  smartAccreditationHubs SmartAccreditationHub[]
}

model SmartAccreditationHub {
  id                String    @id @default(uuid())
  schoolId          String
  school            School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  accreditationName String    @default("General Accreditation")
  frameworkType     String    @default("NAAC")
  criterionCode     String?
  criterionTitle    String?
  compliancePercent Float?
  reviewStatus      String?
  score             Float?
  status            String    @default("IN_PROGRESS")
  reportUrl         String?
  nextReviewDate    DateTime?
  notes             String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

model Facility {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name        String   @default("Campus Zone")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Student {
  id        String   @id @default(uuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name      String
  rollNo    String?
  cgpa      Float?
  email     String?
  status    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
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
  id          String    @id @default(uuid())
  schoolId    String
  school      School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  items       String    @default("Enterprise SaaS Tier License")
  amount      Float     @default(999.00)
  status      String    @default("PAID")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model AlumniEndowment {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  donorName   String
  amount      Float
  status      String   @default("COMPLETED")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SmartAssetTracker {
  id           String   @id @default(uuid())
  schoolId     String
  school       School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  assetName    String
  status       String   @default("ACTIVE")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model AiChat {
  id        String   @id @default(uuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  prompt    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model EmergencyBroadcast {
  id             String   @id @default(uuid())
  schoolId       String
  school         School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title          String
  status         String   @default("SENT")
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model CafeteriaOrder {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName String
  status      String   @default("PENDING")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model CounselingSession {
  id            String    @id @default(uuid())
  schoolId      String
  school        School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName   String
  status        String    @default("SCHEDULED")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model DigitalCredential {
  id              String    @id @default(uuid())
  schoolId        String
  school          School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName     String
  status          String    @default("ISSUED")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model CrisisIncident {
  id           String    @id @default(uuid())
  schoolId     String
  school       School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title        String?
  status       String    @default("ACTIVE")
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model DeliveryFleet {
  id                 String    @id @default(uuid())
  schoolId           String
  school             School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  vehicleName        String?
  status             String    @default("ACTIVE")
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model AutonomousDronePatrol {
  id               String    @id @default(uuid())
  schoolId         String
  school           School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  droneName        String?
  status           String    @default("ACTIVE")
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}

model SmartEnergyGrid {
  id                String    @id @default(uuid())
  schoolId          String
  school            School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  gridStatus        String    @default("STABLE")
  status            String    @default("ACTIVE")
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

model EsgMetric {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  metricName  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model EventClub {
  id            String    @id @default(uuid())
  schoolId      String
  school        School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  eventName     String?
  status        String    @default("UPCOMING")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model SmartFireSafetySystem {
  id            String    @id @default(uuid())
  schoolId      String
  school        School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  status        String    @default("ACTIVE")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model MedicalRecord {
  id          String    @id @default(uuid())
  schoolId    String
  school      School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName String?
  status      String    @default("ACTIVE")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model HostelRoom {
  id               String    @id @default(uuid())
  schoolId         String
  school           School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  roomNo           String?
  status           String    @default("AVAILABLE")
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}

model SmartHvacUnit {
  id              String    @id @default(uuid())
  schoolId        String
  school          School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  status          String    @default("ACTIVE")
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model LabEquipment {
  id              String    @id @default(uuid())
  schoolId        String
  school          School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  equipmentName   String?
  status          String    @default("OPERATIONAL")
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model LibraryBook {
  id          String    @id @default(uuid())
  schoolId    String
  school      School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title       String?
  status      String    @default("AVAILABLE")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model LostItem {
  id            String    @id @default(uuid())
  schoolId      String
  school      School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  itemName      String?
  status        String    @default("LOST")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model MaintenanceWorkOrder {
  id                 String    @id @default(uuid())
  schoolId           String
  school             School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title              String?
  status             String    @default("PENDING")
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

model UsageMetric {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  metricName  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SmartParkingBay {
  id            String    @id @default(uuid())
  schoolId      String
  school        School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  bayNumber     String?
  status        String    @default("AVAILABLE")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model ParkingPermit {
  id            String    @id @default(uuid())
  schoolId      String
  school        School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  permitNumber  String?
  status        String    @default("ACTIVE")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model CampusPaymentRecord {
  id            String    @id @default(uuid())
  schoolId      String
  school      School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  status        String?   @default("CREATED")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model SmartStaffHealth {
  id        String   @id @default(uuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  status    String   @default("HEALTHY")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SmartLmsOpenSource {
  id         String   @id @default(uuid())
  schoolId   String
  school     School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  status     String   @default("ACTIVE")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model PrintJob {
  id            String   @id @default(uuid())
  schoolId      String
  school        School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  status        String   @default("PENDING")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model ExamProctoringSession {
  id                    String   @id @default(uuid())
  schoolId              String
  school                School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  status                String   @default("ACTIVE")
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model AuditReport {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  status      String   @default("COMPLETED")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ResearchGrant {
  id                    String    @id @default(uuid())
  schoolId              String
  school                School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  status                String    @default("ACTIVE")
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

model ScholarshipApplication {
  id              String    @id @default(uuid())
  schoolId        String
  school          School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  status          String    @default("PENDING")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
SCHEMA

echo "[1/4] Cleaning build and client caches..."
rm -rf .next
rm -rf node_modules/.prisma

echo "[2/4] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[3/4] Generating Prisma Client..."
npx prisma generate

echo "[4/4] Building Next.js application..."
npm run build

echo "✨ Build and schema update completed successfully!"
