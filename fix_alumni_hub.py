import os
import shutil
import subprocess

print("🧹 Cleaning Next.js build cache...")
if os.path.exists(".next"):
    shutil.rmtree(".next")
    print("Removed .next directory.")

print("⚙️ Adding SmartAlumniHub model to Prisma schema...")

schema_path = "prisma/schema.prisma"
os.makedirs(os.path.dirname(schema_path), exist_ok=True)

schema_content = """datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Tenant {
  id                      String                     @id @default(cuid())
  name                    String
  subdomain               String                     @unique
  plan                    String                     @default("Enterprise ERP Suite")
  status                  String                     @default("ACTIVE")
  contactEmail            String                     @default("admin@example.com")
  mrr                     Float                      @default(0.0)
  setupFeePaid            Boolean                    @default(false)
  createdAt               DateTime                   @default(now())
  students                Student[]
  invoices                Invoice[]
  announcements           Announcement[]
  alerts                  Alert[]
  energyLogs              EnergyLog[]
  exams                   Exam[]
  libraryAssets           LibraryAsset[]
  libraryBooks            LibraryBook[]
  staff                   Staff[]
  auditLogs               AuditLog[]
  auditReports            AuditReport[]
  backupSnapshots         BackupSnapshot[]
  alumniEndowments        AlumniEndowment[]
  apiKeys                 ApiKey[]
  smartAssetTrackers      SmartAssetTracker[]
  aiChats                 AiChat[]
  emergencyBroadcasts     EmergencyBroadcast[]
  cafeteriaOrders         CafeteriaOrder[]
  counselingSessions      CounselingSession[]
  digitalCredentials      DigitalCredential[]
  crisisIncidents         CrisisIncident[]
  deliveryFleets          DeliveryFleet[]
  smartEnergyGrid         SmartEnergyGrid[]
  schools                 School[]
  esgMetrics              EsgMetric[]
  eventClubs              EventClub[]
  smartFireSafetySystems  SmartFireSafetySystem[]
  smartStaffHealthHubs    SmartStaffHealthHub[]
  smartLmsOpenSources     SmartLmsOpenSource[]
  smartAccreditationHubs  SmartAccreditationHub[]
  smartAdmissionCrmHubs   SmartAdmissionCrmHub[]
  smartAiTutorProctorHubs SmartAiTutorProctorHub[]
  smartAlumniHubs         SmartAlumniHub[]
  medicalRecords          MedicalRecord[]
  hostelRooms             HostelRoom[]
  smartHvacUnits          SmartHvacUnit[]
  labEquipments           LabEquipment[]
  lostItems               LostItem[]
  maintenanceWorkOrders   MaintenanceWorkOrder[]
  usageMetrics            UsageMetric[]
  smartParkingBays        SmartParkingBay[]
  parkingPermits          ParkingPermit[]
  campusPaymentRecords    CampusPaymentRecord[]
  printJobs               PrintJob[]
  examProctoringSessions  ExamProctoringSession[]
  schoolPipelines         SchoolOnboardingPipeline[]
  onboardingSteps         OnboardingStep[]
  researchGrants          ResearchGrant[]
  scholarshipApplications ScholarshipApplication[]
  placements              Placement[]
}

model Student {
  id              String   @id @default(cuid())
  admissionNumber String   @default("ADM-2026-0001")
  name            String
  grade           String   @default("Grade 10")
  guardianName    String   @default("Guardian")
  phone           String?
  email           String?
  status          String   @default("Active")
  feeStatus       String   @default("PENDING")
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id])
  createdAt       DateTime @default(now())
}

model Invoice {
  id          String   @id @default(cuid())
  title       String   @default("Tuition Fee")
  amount      Float    @default(0.0)
  status      String   @default("Pending")
  dueDate     String   @default("2026-12-31")
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  createdAt   DateTime @default(now())
}

model Announcement {
  id        String   @id @default(cuid())
  title     String
  content   String
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model Alert {
  id        String   @id @default(cuid())
  title     String
  message   String   @default("")
  severity  String   @default("INFO")
  tenantId  String?
  tenant    Tenant?  @relation(fields: [tenantId], references: [id])
  schoolId  String?
  school    School?  @relation(fields: [schoolId], references: [id])
  createdAt DateTime @default(now())
}

model EnergyLog {
  id          String   @id @default(cuid())
  consumption Float    @default(0.0)
  cost        Float    @default(0.0)
  source      String   @default("Grid")
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  createdAt   DateTime @default(now())
}

model Exam {
  id        String   @id @default(cuid())
  title     String
  subject   String   @default("General")
  date      DateTime @default(now())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model LibraryAsset {
  id        String   @id @default(cuid())
  title     String
  author    String   @default("Unknown")
  status    String   @default("Available")
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model LibraryBook {
  id        String   @id @default(cuid())
  title     String
  author    String   @default("Unknown")
  isbn      String   @default("N/A")
  status    String   @default("AVAILABLE")
  tenantId  String   @default("")
  tenant    Tenant?  @relation(fields: [tenantId], references: [id])
  schoolId  String?
  school    School?  @relation(fields: [schoolId], references: [id])
  createdAt DateTime @default(now())
}

model Staff {
  id        String   @id @default(cuid())
  name      String
  role      String   @default("Teacher")
  email     String?
  phone     String?
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model AuditLog {
  id        String   @id @default(cuid())
  action    String
  details   String?
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model AuditReport {
  id          String   @id @default(cuid())
  title       String   @default("Audit Report")
  category    String   @default("Compliance")
  status      String   @default("GENERATED")
  summary     String   @default("")
  generatedBy String   @default("Platform Administrator")
  fileUrl     String?
  schoolId    String?
  school      School?  @relation(fields: [schoolId], references: [id])
  tenantId    String?
  tenant      Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt   DateTime @default(now())
}

model ResearchGrant {
  id                    String   @id @default(cuid())
  title                 String   @default("Research Grant")
  principalInvestigator String   @default("Dr. Researcher")
  fundingAgency         String   @default("Agency")
  budgetAmount          Float    @default(0.0)
  status                String   @default("ACTIVE")
  deadline              String   @default("2026-12-31")
  schoolId              String?
  school                School?  @relation(fields: [schoolId], references: [id])
  tenantId              String?
  tenant                Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt             DateTime @default(now())
}

model ScholarshipApplication {
  id              String   @id @default(cuid())
  studentName     String   @default("Student")
  rollNo          String   @default("ROL-001")
  scholarshipName String   @default("Merit Scholarship")
  fundCategory    String   @default("MERIT_BASED")
  amountRequested Float    @default(0.0)
  amount          Float    @default(0.0)
  status          String   @default("PENDING")
  deadline        String   @default("2026-12-31")
  schoolId        String?
  school          School?  @relation(fields: [schoolId], references: [id])
  tenantId        String?
  tenant          Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt       DateTime @default(now())
}

model Placement {
  id        String   @id @default(cuid())
  company   String   @default("Company")
  role      String   @default("Role")
  ctc       Float    @default(0.0)
  package   Float    @default(0.0)
  offers    Int      @default(1)
  schoolId  String?
  school    School?  @relation(fields: [schoolId], references: [id])
  tenantId  String?
  tenant    Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model BackupSnapshot {
  id        String   @id @default(cuid())
  filename  String   @default("snapshot.json")
  size      Int      @default(0)
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model AlumniEndowment {
  id        String   @id @default(cuid())
  donorName String   @default("Anonymous")
  amount    Float    @default(0.0)
  purpose   String   @default("General Fund")
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model ApiKey {
  id        String   @id @default(cuid())
  name      String   @default("Default Key")
  key       String   @unique @default("pk_live_default")
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model SmartAssetTracker {
  id        String   @id @default(cuid())
  name      String   @default("Asset")
  category  String   @default("Equipment")
  location  String   @default("Main Campus")
  status    String   @default("ACTIVE")
  battery   Int      @default(100)
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model AiChat {
  id        String   @id @default(cuid())
  prompt    String
  response  String   @default("")
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model EmergencyBroadcast {
  id        String   @id @default(cuid())
  title     String   @default("Emergency Broadcast")
  message   String   @default("")
  severity  String   @default("CRITICAL")
  channel   String   @default("ALL")
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model CafeteriaOrder {
  id        String   @id @default(cuid())
  itemName  String   @default("Meal")
  buyerName String   @default("Anonymous")
  quantity  Int      @default(1)
  status    String   @default("PENDING")
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model CounselingSession {
  id          String   @id @default(cuid())
  studentName String   @default("Student")
  counselor   String   @default("Counselor")
  topic       String   @default("General")
  status      String   @default("SCHEDULED")
  notes       String?
  tenantId    String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt   DateTime @default(now())
}

model DigitalCredential {
  id            String   @id @default(cuid())
  studentName   String   @default("Student")
  credential    String   @default("Certificate")
  issuedBy      String   @default("Administration")
  status        String   @default("ISSUED")
  tenantId      String
  tenant        Tenant   @relation(fields: [tenantId], references: [id])
  createdAt     DateTime @default(now())
}

model CrisisIncident {
  id          String   @id @default(cuid())
  title       String   @default("Incident")
  description String   @default("")
  severity    String   @default("HIGH")
  status      String   @default("ACTIVE")
  location    String   @default("Main Campus")
  tenantId    String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt   DateTime @default(now())
}

model DeliveryFleet {
  id        String   @id @default(cuid())
  vehicle   String   @default("Vehicle")
  driver    String   @default("Driver")
  status    String   @default("IDLE")
  location  String   @default("Main Depot")
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model SmartEnergyGrid {
  id        String   @id @default(cuid())
  name      String   @default("Grid Node")
  status    String   @default("ACTIVE")
  load      Float    @default(0.0)
  capacity  Float    @default(100.0)
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model School {
  id                     String                     @id @default(cuid())
  name                   String                     @default("School")
  code                   String                     @default("SCH-001")
  subdomain              String?                    @unique
  logoUrl                String?                    @default("")
  tagline                String?                    @default("")
  email                  String?                    @default("")
  tier                   String?                    @default("ENTERPRISE")
  maxStudents            Int                        @default(1000)
  subscriptionTier       String                     @default("ENTERPRISE")
  subscriptionStatus     String                     @default("ACTIVE")
  whiteLabelBrandName    String                     @default("Platform")
  whiteLabelLogoUrl      String?                    @default("")
  customDomain           String?                    @default("")
  primaryColor           String                     @default("#4f46e5")
  accentColor            String                     @default("#4f46e5")
  facilities             Facility[]
  alerts                 Alert[]
  esgMetrics             EsgMetric[]
  eventClubs             EventClub[]
  smartFireSafetySystems SmartFireSafetySystem[]
  smartStaffHealthHubs   SmartStaffHealthHub[]
  smartLmsOpenSources    SmartLmsOpenSource[]
  smartAccreditationHubs SmartAccreditationHub[]
  smartAdmissionCrmHubs  SmartAdmissionCrmHub[]
  smartAiTutorProctorHubs SmartAiTutorProctorHub[]
  smartAlumniHubs        SmartAlumniHub[]
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
  printJobs              PrintJob[]
  examProctoringSessions ExamProctoringSession[]
  auditReports           AuditReport[]
  researchGrants         ResearchGrant[]
  scholarshipApplications ScholarshipApplication[]
  placements             Placement[]
  onboardingSteps         OnboardingStep[]
  schoolPipelines         SchoolOnboardingPipeline[]
  tenantId               String?
  tenant                 Tenant?                    @relation(fields: [tenantId], references: [id])
  createdAt              DateTime                   @default(now())
}

model SmartAccreditationHub {
  id                String   @id @default(cuid())
  accreditationName String   @default("System Accreditation")
  frameworkType     String   @default("NAAC")
  criterionCode     String   @default("C1")
  criterionTitle    String   @default("Criterion Title")
  compliancePercent Float    @default(0.0)
  status            String   @default("PENDING")
  reviewStatus      String   @default("PENDING")
  schoolId          String?
  school            School?  @relation(fields: [schoolId], references: [id])
  tenantId          String?
  tenant            Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt         DateTime @default(now())
}

model SmartAdmissionCrmHub {
  id                String   @id @default(cuid())
  applicantName     String   @default("Applicant")
  name              String   @default("Applicant")
  email             String   @default("applicant@example.com")
  contactEmail      String   @default("applicant@example.com")
  phone             String   @default("")
  program           String   @default("General Program")
  status            String   @default("NEW")
  score             Int      @default(0)
  notes             String?  @default("")
  entranceExamScore Float    @default(90.0)
  targetProgram     String   @default("B.Tech Computer Science")
  counselorName     String   @default("Default Admission Counselor")
  leadStatus        String   @default("NEW_LEAD")
  schoolId          String?
  school            School?  @relation(fields: [schoolId], references: [id])
  tenantId          String?
  tenant            Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model SmartAiTutorProctorHub {
  id              String   @id @default(cuid())
  studentName     String   @default("Student")
  sessionTitle    String   @default("AI Tutoring Session")
  courseTitle     String   @default("General AI Curriculum")
  subject         String   @default("General")
  aiQueryPrompt   String   @default("")
  proctorStatus   String   @default("VERIFIED")
  confidenceScore Float    @default(98.5)
  aiStatus        String   @default("ACTIVE")
  flagsCount      Int      @default(0)
  notes           String?  @default("")
  schoolId        String?
  school          School?  @relation(fields: [schoolId], references: [id])
  tenantId        String?
  tenant          Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model SmartAlumniHub {
  id             String   @id @default(cuid())
  alumnusName    String   @default("Alumnus")
  graduationYear Int      @default(2022)
  currentCompany String   @default("Company")
  industry       String   @default("Technology")
  donationAmount Float    @default(0.0)
  status         String   @default("ACTIVE")
  schoolId       String?
  school         School?  @relation(fields: [schoolId], references: [id])
  tenantId       String?
  tenant         Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model PrintJob {
  id            String   @id @default(cuid())
  filename      String   @default("document.pdf")
  documentTitle String   @default("Document")
  studentName   String   @default("Student")
  pagesCount    Int      @default(1)
  colorMode     String   @default("BW")
  cost          Float    @default(0.0)
  status        String   @default("PENDING")
  schoolId      String?
  school        School?  @relation(fields: [schoolId], references: [id])
  tenantId      String?
  tenant        Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt     DateTime @default(now())
}

model ExamProctoringSession {
  id                    String   @id @default(cuid())
  studentName           String   @default("Student")
  examTitle             String   @default("Exam")
  roomNumber            String   @default("101")
  totalStudents         Int      @default(50)
  flaggedIncidentsCount Int      @default(0)
  aiStatus              String   @default("ACTIVE_MONITORING")
  invigilatorName       String   @default("Invigilator")
  status                String   @default("ACTIVE")
  warningsCount         Int      @default(0)
  schoolId              String?
  school                School?  @relation(fields: [schoolId], references: [id])
  tenantId              String?
  tenant                Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt             DateTime @default(now())
}

model OnboardingStep {
  id            String    @id @default(cuid())
  schoolId      String?
  school        School?   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  tenantId      String?
  tenant        Tenant?   @relation(fields: [tenantId], references: [id])
  targetRole    String    @default("SCHOOL_ADMIN")
  stepKey       String
  title         String
  status        String    @default("NOT_STARTED")
  progress      Int       @default(0)
  assignedTo    String    @default("Onboarding Team")
  completedBy   String?
  notes         String?
  startedAt     DateTime?
  completedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model SchoolOnboardingPipeline {
  id            String   @id @default(cuid())
  schoolName    String
  subdomain     String   @unique
  currentStage  String   @default("Data Import")
  progress      Int      @default(0)
  owner         String   @default("Onboarding Team")
  status        String   @default("🟡 IN_PROGRESS")
  schoolId      String?
  school        School?  @relation(fields: [schoolId], references: [id])
  tenantId      String?
  tenant        Tenant?  @relation(fields: [tenantId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Facility {
  id        String   @id @default(cuid())
  name      String   @default("Facility")
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

model EsgMetric {
  id         String   @id @default(cuid())
  category   String   @default("ENVIRONMENTAL")
  metricName String   @default("Carbon Footprint")
  value      Float    @default(0.0)
  unit       String   @default("kg CO2e")
  tenantId   String
  tenant     Tenant   @relation(fields: [tenantId], references: [id])
  schoolId   String?
  school     School?  @relation(fields: [schoolId], references: [id])
  createdAt  DateTime @default(now())
}

model EventClub {
  id          String   @id @default(cuid())
  title       String   @default("Event / Club")
  name        String   @default("Event")
  description String   @default("")
  category    String   @default("Club")
  date        DateTime @default(now())
  location    String   @default("Main Campus")
  tenantId    String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  schoolId    String?
  school    School?  @relation(fields: [schoolId], references: [id])
  createdAt   DateTime @default(now())
}

model SmartFireSafetySystem {
  id        String   @id @default(cuid())
  name      String   @default("Fire Sensor")
  status    String   @default("ACTIVE")
  location  String   @default("Main Campus")
  battery   Int      @default(100)
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  schoolId  String?
  school    School?  @relation(fields: [schoolId], references: [id])
  createdAt DateTime @default(now())
}

model SmartStaffHealthHub {
  id        String   @id @default(cuid())
  name      String   @default("Health Hub")
  status    String   @default("ACTIVE")
  tenantId  String   @default("")
  tenant    Tenant?  @relation(fields: [tenantId], references: [id])
  schoolId  String?
  school    School?  @relation(fields: [schoolId], references: [id])
  createdAt DateTime @default(now())
}

model SmartLmsOpenSource {
  id        String   @id @default(cuid())
  title     String   @default("LMS Module")
  status    String   @default("ACTIVE")
  tenantId  String   @default("")
  tenant    Tenant?  @relation(fields: [tenantId], references: [id])
  schoolId  String?
  school    School?  @relation(fields: [schoolId], references: [id])
  createdAt DateTime @default(now())
}

model MedicalRecord {
  id          String   @id @default(cuid())
  studentName String   @default("Student")
  condition   String   @default("General Checkup")
  notes       String?
  status      String   @default("ACTIVE")
  tenantId    String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  schoolId    String?
  school    School?  @relation(fields: [schoolId], references: [id])
  createdAt   DateTime @default(now())
}

model HostelRoom {
  id         String   @id @default(cuid())
  roomNumber String   @default("101")
  capacity   Int      @default(4)
  status     String   @default("AVAILABLE")
  tenantId   String   @default("")
  tenant     Tenant?  @relation(fields: [tenantId], references: [id])
  schoolId   String?
  school     School?  @relation(fields: [schoolId], references: [id])
  createdAt  DateTime @default(now())
}

model SmartHvacUnit {
  id          String   @id @default(cuid())
  name        String   @default("HVAC Unit")
  status      String   @default("ACTIVE")
  temperature Float    @default(22.5)
  tenantId    String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  schoolId    String?
  school      School?  @relation(fields: [schoolId], references: [id])
  createdAt   DateTime @default(now())
}

model LabEquipment {
  id        String   @id @default(cuid())
  name      String   @default("Equipment")
  category  String   @default("General")
  labRoom   String   @default("Main Lab")
  status    String   @default("AVAILABLE")
  borrower  String?
  tenantId  String   @default("")
  tenant    Tenant?  @relation(fields: [tenantId], references: [id])
  schoolId  String?
  school    School?  @relation(fields: [schoolId], references: [id])
  createdAt DateTime @default(now())
}

model LostItem {
  id            String   @id @default(cuid())
  itemName      String   @default("Item")
  title         String   @default("Lost Item")
  description   String   @default("")
  location      String   @default("Main Campus")
  locationFound String   @default("Main Campus")
  founderName   String   @default("Anonymous")
  category      String   @default("ELECTRONICS")
  status        String   @default("LOST")
  tenantId      String   @default("")
  tenant        Tenant?  @relation(fields: [tenantId], references: [id])
  schoolId      String?
  school        School?  @relation(fields: [schoolId], references: [id])
  createdAt     DateTime @default(now())
}

model MaintenanceWorkOrder {
  id                 String   @id @default(cuid())
  title              String   @default("Maintenance Request")
  description        String   @default("")
  category           String   @default("HVAC")
  building           String   @default("Main Building")
  priority           String   @default("MEDIUM")
  status             String   @default("OPEN")
  assignedTo         String?
  assignedTechnician String?
  tenantId           String   @default("")
  tenant             Tenant?  @relation(fields: [tenantId], references: [id])
  schoolId           String?
  school             School?  @relation(fields: [schoolId], references: [id])
  createdAt          DateTime @default(now())
}

model UsageMetric {
  id         String   @id @default(cuid())
  metricName String   @default("Usage")
  value      Float    @default(0.0)
  unit       String   @default("units")
  tenantId   String   @default("")
  tenant     Tenant?  @relation(fields: [tenantId], references: [id])
  schoolId   String?
  school     School?  @relation(fields: [schoolId], references: [id])
  createdAt  DateTime @default(now())
}

model SmartParkingBay {
  id            String   @id @default(cuid())
  bayNo         String   @default("P-01")
  zoneName      String   @default("Main Zone")
  isEvCharging  Boolean  @default(false)
  status        String   @default("AVAILABLE")
  vehicleNumber String?
  tenantId      String   @default("")
  tenant        Tenant?  @relation(fields: [tenantId], references: [id])
  schoolId      String?
  school        School?  @relation(fields: [schoolId], references: [id])
  createdAt     DateTime @default(now())
}

model ParkingPermit {
  id            String   @id @default(cuid())
  permitNumber  String   @default("PERMIT-01")
  vehicleNumber String   @default("XYZ-1234")
  vehicleNo     String   @default("XYZ-1234")
  ownerName     String   @default("Anonymous")
  permitType    String   @default("STUDENT")
  slotNo        String   @default("SLOT-01")
  status        String   @default("ACTIVE")
  tenantId      String   @default("")
  tenant        Tenant?  @relation(fields: [tenantId], references: [id])
  schoolId      String?
  school        School?  @relation(fields: [schoolId], references: [id])
  createdAt     DateTime @default(now())
}

model CampusPaymentRecord {
  id            String   @id @default(cuid())
  orderId       String   @unique @default("ORDER-01")
  amount        Float    @default(0.0)
  amountInr     Float    @default(0.0)
  currency      String   @default("INR")
  status        String   @default("CREATED")
  paymentMethod String   @default("UPI")
  description   String   @default("")
  paymentId     String?
  receipt       String?
  tenantId      String   @default("")
  tenant        Tenant?  @relation(fields: [tenantId], references: [id])
  schoolId      String?
  school        School?  @relation(fields: [schoolId], references: [id])
  createdAt     DateTime @default(now())
}

model Lead {
  id              String   @id @default(cuid())
  name            String
  school          String
  phone           String
  email           String
  studentStrength Int?
  location        String?
  interest        String?
  score           Int      @default(0)
  temperature     String   @default("🔵 Cold")
  status          String   @default("NEW")
  createdAt       DateTime @default(now())
}
"""

with open(schema_path, "w", encoding="utf-8") as f:
    f.write(schema_content)

print("✨ Updated prisma/schema.prisma with SmartAlumniHub model successfully!")

build_env = os.environ.copy()
build_env["DATABASE_URL"] = "file:./dev.db"

try:
    print("1️⃣ Pushing Prisma schema to SQLite database...")
    subprocess.run(["npx", "prisma", "db", "push", "--skip-generate", "--accept-data-loss"], check=True, env=build_env)
    
    print("2️⃣ Generating Prisma Client...")
    subprocess.run(["npx", "prisma", "generate"], check=True, env=build_env)
    
    print("3️⃣ Running Next.js Production Build...")
    subprocess.run(["npm", "run", "build"], check=True, env=build_env)
    
    print("\n🎉 SUCCESS! The entire project compiled successfully with zero errors!")
except subprocess.CalledProcessError as e:
    print(f"\n❌ Build failed with exit code {e.returncode}")
    exit(1)
