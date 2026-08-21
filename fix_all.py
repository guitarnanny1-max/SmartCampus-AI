import subprocess
import os
import re

SCHEMA_PATH = "prisma/schema.prisma"

def update_schema():
    if not os.path.exists(SCHEMA_PATH):
        print(f"❌ Error: {SCHEMA_PATH} not found. Please ensure you are in the project root.")
        return False

    with open(SCHEMA_PATH, "r") as f:
        schema = f.read()

    models_to_add = {
        "SmartFusionEnergyHub": """model SmartFusionEnergyHub {
  id                      String   @id @default(uuid())
  tenantId                String?
  tenant                  Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId                String?
  school                  School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  reactorName             String?
  reactorCode             String?
  facilityName            String?
  plasmaTempMillionsK     Float    @default(150.0)
  magneticConfinementTesla Float   @default(13.5)
  energyOutputMegawatts   Float    @default(450.0)
  aiInstabilityPrediction String?
  status                  String   @default("ACTIVE")
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
}""",
        "SmartFusionHub": """model SmartFusionHub {
  id                      String   @id @default(uuid())
  tenantId                String?
  tenant                  Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId                String?
  school                  School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  reactorName             String?
  reactorCode             String?
  facilityName            String?
  plasmaTempMillionsK     Float    @default(150.0)
  plasmaTempMillionCelsius Float   @default(150.0)
  magneticConfinementTesla Float    @default(13.5)
  magneticFieldTesla      Float    @default(12.0)
  containmentStabilityPct Float    @default(99.9)
  aiMhdInstabilityMode    String?
  energyOutputMegawatts   Float    @default(450.0)
  aiInstabilityPrediction String?
  status                  String   @default("ACTIVE")
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
}""",
        "SmartGeothermalEnergyHub": """model SmartGeothermalEnergyHub {
  id                  String   @id @default(uuid())
  tenantId            String?
  tenant              Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId            String?
  school              School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  plantName           String?
  plantCode           String?
  depthKm             Float    @default(3.5)
  temperatureCelsius  Float    @default(220.0)
  energyOutputMw      Float    @default(50.0)
  loopTempC           Float    @default(14.5)
  flowRateLpm         Float    @default(120.0)
  efficiencyPct       Float    @default(94.5)
  aiCirculationMode   String?
  status              String   @default("ACTIVE")
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}""",
        "SmartGlobalBoardroomHub": """model SmartGlobalBoardroomHub {
  id                          String   @id @default(uuid())
  tenantId                    String?
  tenant                      Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId                    String?
  school                      School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  regionName                  String?
  regionCode                  String?
  boardroomTitle              String?
  totalEnrolledStudents       Int      @default(12500)
  treasuryRevenueUsd          Float    @default(15000000.0)
  aiComputeEfficiencyPercent  Float    @default(98.0)
  boardroomStatus             String   @default("GLOBAL_SYNC")
  status                      String   @default("ACTIVE")
  createdAt                   DateTime @default(now())
  updatedAt                   DateTime @updatedAt
}""",
        "SmartGreenhouseBotany": """model SmartGreenhouseBotany {
  id                  String   @id @default(uuid())
  tenantId            String?
  tenant              Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId            String?
  school              School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  greenhouseName      String?
  greenhouseCode      String?
  temperatureCelsius  Float    @default(24.0)
  temperatureC        Float    @default(24.5)
  humidityPercent     Float    @default(65.0)
  humidityPct         Float    @default(75.0)
  soilMoisturePercent Float    @default(70.0)
  soilNutrientPpm     Float    @default(650.0)
  ledSpectrumMode     String?
  aiNutrientMode      String?
  aiHealthStatus      String?
  status              String   @default("ACTIVE")
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}""",
        "SmartGymEquipment": """model SmartGymEquipment {
  id                  String   @id @default(uuid())
  tenantId            String?
  tenant              Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId            String?
  school              School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  equipmentName       String?
  equipmentCode       String?
  category            String?
  resistanceLevel     Float    @default(50.0)
  aiPostureTracking   Boolean  @default(true)
  zoneName            String?
  occupancyStatus     String?  @default("AVAILABLE")
  sensorBattery       Int      @default(90)
  status              String   @default("ACTIVE")
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}""",
        "SmartHelpdeskTicket": """model SmartHelpdeskTicket {
  id                  String   @id @default(uuid())
  tenantId            String?
  tenant              Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId            String?
  school              School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  userId              String?
  question            String?
  aiResponse          String?
  status              String   @default("ACTIVE")
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}""",
        "SmartHologramHub": """model SmartHologramHub {
  id                  String   @id @default(uuid())
  tenantId            String?
  tenant              Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId            String?
  school              School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  podName             String?
  podCode             String?
  bandwidthGbps       Float    @default(40.0)
  latencyMs           Float    @default(2.5)
  holographicFps      Float    @default(120.0)
  spatialLatencyMs    Float    @default(2.5)
  aiImmersiveMode     String?
  status              String   @default("ACTIVE")
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}""",
        "SmartHolographicHub": """model SmartHolographicHub {
  id                        String   @id @default(uuid())
  tenantId                  String?
  tenant                    Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId                  String?
  school                    School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  hallName                  String?
  hallCode                  String?
  lectureHallCode           String?
  bandwidthGbps             Float    @default(40.0)
  latencyMs                 Float    @default(2.5)
  holographicFps            Float    @default(120.0)
  spatialLatencyMs          Float    @default(2.5)
  holographicFidelityPct    Float    @default(99.4)
  audioLatencyMs            Float    @default(4.2)
  concurrentAvatarsCount    Int      @default(300)
  aiRealTimeTranslationMode String?
  aiImmersiveMode           String?
  status                    String   @default("ACTIVE")
  createdAt                 DateTime @default(now())
  updatedAt                 DateTime @updatedAt
}""",
        "SmartHostelHub": """model SmartHostelHub {
  id                       String   @id @default(uuid())
  tenantId                 String?
  tenant                   Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId                 String?
  school                   School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  hostelName               String?
  hostelCode               String?
  buildingName             String?
  roomNumber               String?
  hostelBlock              String?
  studentName              String?
  roomType                 String?
  occupancyPct             Float    @default(85.0)
  occupancyStatus          String?  @default("OCCUPIED")
  messFeeInr               Float    @default(45000.0)
  aiEnergyOptimizationMode String?
  smartLockStatus          String?  @default("SECURE")
  status                   String   @default("ACTIVE")
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt
}""",
        "SmartIdCardHub": """model SmartIdCardHub {
  id                 String   @id @default(uuid())
  tenantId           String?
  tenant             Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId           String?
  school             School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  cardName           String?
  cardCode           String?
  cardholderName     String?
  holderName         String?
  role               String?
  department         String?
  rollOrEmpId        String?
  validThru          String?
  idStatus           String?  @default("ACTIVE")
  holderType         String?  @default("STUDENT")
  nfcStatus          String?  @default("ACTIVE")
  rfidStatus         String?  @default("ACTIVE")
  aiBiometricSync    Boolean  @default(true)
  accessLevel        String?  @default("STANDARD")
  status             String   @default("ACTIVE")
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}""",
        "SmartIndiaCelebrationHub": """model SmartIndiaCelebrationHub {
  id               String   @id @default(uuid())
  tenantId         String?
  tenant           Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId         String?
  school           School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  celebrationName  String?
  celebrationCode  String?
  festivalName     String?
  celebrationTitle String?
  eventName        String?
  celebrationDate  String?
  eventDate        String?
  category         String?
  description      String?
  aiCulturalSync   Boolean  @default(true)
  status           String   @default("ACTIVE")
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}""",
        "SmartLightingFixture": """model SmartLightingFixture {
  id                 String   @id @default(uuid())
  tenantId           String?
  tenant             Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId           String?
  school             School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  fixtureName        String?
  fixtureCode        String?
  unitCode           String?
  zoneName           String?
  brightnessPct      Float    @default(80.0)
  colorTempK         Int      @default(4000)
  aiDimmingMode      String?
  occupancySensing   Boolean  @default(true)
  motionSensing      Boolean  @default(true)
  energyUsageWatts   Float    @default(45.0)
  powerDrawWatts     Float    @default(45.0)
  status             String   @default("ACTIVE")
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}""",
        "SmartLmsOpenSourceHub": """model SmartLmsOpenSourceHub {
  id                 String   @id @default(uuid())
  tenantId           String?
  tenant             Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId           String?
  school             School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  platformName       String?
  platformCode       String?
  toolName           String?
  category           String?
  version            String?
  courseName         String?
  courseCode         String?
  repositoryUrl      String?
  activeUsersCount   Int      @default(150)
  aiTutorEnabled     Boolean  @default(true)
  integrationStatus  String   @default("ACTIVE")
  status             String   @default("ACTIVE")
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}""",
        "SmartLockerDelivery": """model SmartLockerDelivery {
  id                String   @id @default(uuid())
  tenantId          String?
  tenant            Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId          String?
  school            School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  lockerName        String?
  lockerCode        String?
  lockerBank        String?
  lockerNumber      String?
  recipientName     String?
  carrierName       String?
  trackingNumber    String?
  retrievalPin      String?
  deliveryStatus    String?  @default("DELIVERED")
  status            String   @default("ACTIVE")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}""",
        "SmartMedicalHospitalHub": """model SmartMedicalHospitalHub {
  id                   String   @id @default(uuid())
  tenantId             String?
  tenant               Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId             String?
  school               School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  departmentName       String?
  departmentCode       String?
  hospitalName         String?
  hospitalBedsCount    Int      @default(150)
  dailyOpdFootfall     Int      @default(450)
  residentDoctorsCount Int      @default(45)
  aiDiagnosticMode     String?  @default("AI_RADIOLOGY_DIAGNOSTIC_ASSISTANT")
  bedOccupancyPct      Float    @default(75.0)
  aiDiagnosticsMode    String?
  status               String   @default("ACTIVE")
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}""",
        "SmartMicroclimateHub": """model SmartMicroclimateHub {
  id                   String   @id @default(uuid())
  tenantId             String?
  tenant               Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId             String?
  school               School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  zoneName             String?
  zoneCode             String?
  temperatureCelsius   Float    @default(22.0)
  tempCelsius          Float    @default(20.0)
  humidityPct          Float    @default(60.0)
  airQualityIndex      Int      @default(50)
  co2Ppm               Float    @default(400.0)
  co2LevelsPpm         Float    @default(400.0)
  aiVentilationMode    String?
  aiClimateControlMode String?
  status               String   @default("ACTIVE")
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}""",
        "SmartMicrogridHub": """model SmartMicrogridHub {
  id                     String   @id @default(uuid())
  tenantId               String?
  tenant                 Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId               String?
  school                 School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  nodeName               String?
  nodeCode               String?
  gridNodeCode           String?
  gridName               String?
  facilityName           String?
  generationKw           Float    @default(100.0)
  storageCapacityKwh     Float    @default(250.0)
  batterySocPct          Float    @default(85.0)
  solarWindMixPct        Float    @default(75.5)
  batteryStorageMWh      Float    @default(5.2)
  gridStabilityStatus    String?
  aiDispatchOptimization String?
  aiLoadBalancingMode    String?
  status                 String   @default("ACTIVE")
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
}""",
        "SmartMobileAppHub": """model SmartMobileAppHub {
  id               String   @id @default(uuid())
  tenantId         String?
  tenant           Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId         String?
  school           School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  appName          String?
  appCode          String?
  platform         String?
  activeUsersCount Int      @default(500)
  version          String?  @default("1.0.0")
  aiAssistantSync  Boolean  @default(true)
  buildStatus      String?
  storeStatus      String?
  syncedWebpage    String?
  status           String   @default("ACTIVE")
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}"""
    }

    for model_name in models_to_add.keys():
        pattern = "model " + model_name + r"\s*\{[^}]*\}"
        schema = re.sub(pattern, "", schema)

    for model_name, model_def in models_to_add.items():
        schema += "\n\n" + model_def

    school_match = re.search(r"model School\s*\{([^}]*)\}", schema)
    if school_match:
        school_body = school_match.group(1)
        relations = [
            "  smartFusionEnergyHubs SmartFusionEnergyHub[]",
            "  smartFusionHubs SmartFusionHub[]",
            "  smartGeothermalEnergyHubs SmartGeothermalEnergyHub[]",
            "  smartGlobalBoardroomHubs SmartGlobalBoardroomHub[]",
            "  smartGreenhouseBotanies SmartGreenhouseBotany[]",
            "  smartGymEquipments SmartGymEquipment[]",
            "  smartHelpdeskTickets SmartHelpdeskTicket[]",
            "  smartHologramHubs SmartHologramHub[]",
            "  smartHolographicHubs SmartHolographicHub[]",
            "  smartHostelHubs SmartHostelHub[]",
            "  smartIdCardHubs SmartIdCardHub[]",
            "  smartIndiaCelebrationHubs SmartIndiaCelebrationHub[]",
            "  smartLightingFixtures SmartLightingFixture[]",
            "  smartLmsOpenSourceHubs SmartLmsOpenSourceHub[]",
            "  smartLockerDeliveries SmartLockerDelivery[]",
            "  smartMedicalHospitalHubs SmartMedicalHospitalHub[]",
            "  smartMicroclimateHubs SmartMicroclimateHub[]",
            "  smartMicrogridHubs SmartMicrogridHub[]",
            "  smartMobileAppHubs SmartMobileAppHub[]"
        ]
        for rel in relations:
            field_name = rel.strip().split()[0]
            if field_name not in school_body:
                school_body = school_body.rstrip() + "\n" + rel + "\n"
        schema = schema.replace(school_match.group(0), "model School {" + school_body + "}")

    tenant_match = re.search(r"model Tenant\s*\{([^}]*)\}", schema)
    if tenant_match:
        tenant_body = tenant_match.group(1)
        relations = [
            "  smartFusionEnergyHubs SmartFusionEnergyHub[]",
            "  smartFusionHubs SmartFusionHub[]",
            "  smartGeothermalEnergyHubs SmartGeothermalEnergyHub[]",
            "  smartGlobalBoardroomHubs SmartGlobalBoardroomHub[]",
            "  smartGreenhouseBotanies SmartGreenhouseBotany[]",
            "  smartGymEquipments SmartGymEquipment[]",
            "  smartHelpdeskTickets SmartHelpdeskTicket[]",
            "  smartHologramHubs SmartHologramHub[]",
            "  smartHolographicHubs SmartHolographicHub[]",
            "  smartHostelHubs SmartHostelHub[]",
            "  smartIdCardHubs SmartIdCardHub[]",
            "  smartIndiaCelebrationHubs SmartIndiaCelebrationHub[]",
            "  smartLightingFixtures SmartLightingFixture[]",
            "  smartLmsOpenSourceHubs SmartLmsOpenSourceHub[]",
            "  smartLockerDeliveries SmartLockerDelivery[]",
            "  smartMedicalHospitalHubs SmartMedicalHospitalHub[]",
            "  smartMicroclimateHubs SmartMicroclimateHub[]",
            "  smartMicrogridHubs SmartMicrogridHub[]",
            "  smartMobileAppHubs SmartMobileAppHub[]"
        ]
        for rel in relations:
            field_name = rel.strip().split()[0]
            if field_name not in tenant_body:
                tenant_body = tenant_body.rstrip() + "\n" + rel + "\n"
        schema = schema.replace(tenant_match.group(0), "model Tenant {" + tenant_body + "}")

    with open(SCHEMA_PATH, "w") as f:
        f.write(schema)
    
    print("✨ Successfully updated schema with SmartMobileAppHub fields!")
    return True

if __name__ == "__main__":
    if update_schema():
        print("⚙️ Running npx prisma generate...")
        subprocess.run(["npx", "prisma", "generate"], check=True)
        print("🚀 Running npm run build...")
        subprocess.run(["npm", "run", "build"], check=True)
        print("🎉 All errors fixed and build passed successfully!")
