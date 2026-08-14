from sqlalchemy.orm import Session
import models

def seed_database(db: Session):
    # Check if sensors already exist
    if db.query(models.CampusSensor).first():
        return # Already seeded

    print("🌱 Seeding initial Smart Campus data...")

    # 1. Create Sensors
    sensors = [
        models.CampusSensor(name="Building-A-Temp", location="Building-A", sensor_type="Temperature", last_reading=22.5),
        models.CampusSensor(name="DataCenter-AC", location="Server-Room", sensor_type="Temperature", last_reading=21.0),
        models.CampusSensor(name="Library-Air", location="Library", sensor_type="Humidity", last_reading=45.0)
    ]
    db.add_all(sensors)

    # 2. Create Facility Assets
    assets = [
        models.FacilityAsset(name="HVAC-Unit-Alpha", asset_type="HVAC", location="Building-A", status="Operational"),
        models.FacilityAsset(name="Main-Server-Chiller", asset_type="Cooling", location="Server-Room", status="Operational"),
        models.FacilityAsset(name="Library-Ventilation", asset_type="HVAC", location="Library", status="Operational")
    ]
    db.add_all(assets)

    # 3. Create Users / Stakeholders
    users = [
        models.CampusUser(name="Facility Director", email="director@campus.edu", role="Admin"),
        models.CampusUser(name="Campus IT Staff", email="it-support@campus.edu", role="Staff"),
        models.CampusUser(name="Student Rep", email="student@campus.edu", role="Student")
    ]
    db.add_all(users)
    db.commit()

    print("✨ Database successfully seeded with default sensors, assets, and users!")
