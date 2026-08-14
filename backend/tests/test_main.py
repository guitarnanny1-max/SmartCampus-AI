import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from database import Base
import models
from main import app, get_db

# Use an in-memory SQLite database for fast, isolated testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Smart Campus AI ERP & CRM Backend is live!"}

def test_create_and_list_sensors():
    response = client.post("/sensors/", params={
        "name": "Test-Sensor",
        "location": "Lab-1",
        "sensor_type": "Temperature"
    })
    assert response.status_code == 200
    assert response.json()["sensor"] == "Test-Sensor"

    list_res = client.get("/sensors/")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1

def test_anomaly_detection_trigger():
    # 1. Register Sensor
    client.post("/sensors/", params={"name": "ServerRoom-Temp", "location": "ServerRoom", "sensor_type": "Temperature"})
    
    # 2. Register Admin User for notifications
    client.post("/crm/users/", params={"name": "Admin Test", "email": "admin@test.edu", "role": "Admin"})

    # 3. Send normal reading
    res_normal = client.post("/sensors/1/reading", params={"reading": 22.0})
    assert res_normal.status_code == 200
    assert res_normal.json()["anomaly_detected"] == False

    # 4. Send abnormal reading (> 30°C) to trigger anomaly & notification
    res_anomaly = client.post("/sensors/1/reading", params={"reading": 35.0})
    assert res_anomaly.status_code == 200
    data = res_anomaly.json()
    assert data["anomaly_detected"] == True
    assert data["automated_maintenance_ticket_id"] is not None
    assert data["notifications_dispatched"] == 1

def test_campus_summary():
    res = client.get("/ai/campus-summary")
    assert res.status_code == 200
    data = res.json()
    assert "metrics" in data
    assert data["status"] == "success"
