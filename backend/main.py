import time
import os
import asyncio
import json
from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError, IntegrityError
from database import engine, SessionLocal, Base
import models
from seed import seed_database
from openai import OpenAI

def init_db():
    max_retries = 10
    retry_delay = 2
    for attempt in range(max_retries):
        try:
            Base.metadata.create_all(bind=engine)
            db = SessionLocal()
            seed_database(db)
            db.close()
            print("Successfully connected and initialized the database!")
            return
        except OperationalError:
            print(f"Database not ready yet (attempt {attempt + 1}/{max_retries}), waiting {retry_delay}s...")
            time.sleep(retry_delay)
    raise Exception("Could not connect to the database after multiple attempts.")

init_db()

app = FastAPI(title="Smart Campus AI API - ERP & CRM Suite")

# --- WebSocket Connection Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Smart Campus AI ERP & CRM Backend is live!"}

# --- Sensor Endpoints ---
@app.post("/sensors/")
def create_sensor(name: str, location: str, sensor_type: str, db: Session = Depends(get_db)):
    db_sensor = db.query(models.CampusSensor).filter(models.CampusSensor.name == name).first()
    if db_sensor:
        raise HTTPException(status_code=400, detail="Sensor already registered")
    new_sensor = models.CampusSensor(name=name, location=location, sensor_type=sensor_type)
    db.add(new_sensor)
    db.commit()
    db.refresh(new_sensor)
    return {"status": "success", "sensor": new_sensor.name}

@app.get("/sensors/")
def list_sensors(db: Session = Depends(get_db)):
    return db.query(models.CampusSensor).all()

@app.post("/sensors/{sensor_id}/reading")
def update_sensor_reading(sensor_id: int, reading: float, db: Session = Depends(get_db)):
    sensor = db.query(models.CampusSensor).filter(models.CampusSensor.id == sensor_id).first()
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
    
    sensor.last_reading = reading
    
    # --- AI Anomaly Detection & Notification Dispatch ---
    anomaly_detected = False
    anomaly_message = ""
    if sensor.sensor_type.lower() == "temperature" and (reading > 30.0 or reading < 15.0):
        anomaly_detected = True
        anomaly_message = f"Abnormal temperature reading of {reading}°C recorded at {sensor.location}."

    ticket_created_id = None
    notifications_sent = 0
    
    if anomaly_detected:
        asset = db.query(models.FacilityAsset).filter(models.FacilityAsset.location == sensor.location).first()
        asset_id = asset.id if asset else None

        ticket = models.MaintenanceTicket(
            title=f"AI Alert: Thermal Anomaly on {sensor.name}",
            description=f"Automated Anomaly Detection: {anomaly_message}",
            priority="High",
            status="Open",
            asset_id=asset_id
        )
        db.add(ticket)
        db.commit()
        db.refresh(ticket)
        ticket_created_id = ticket.id

        staff_users = db.query(models.CampusUser).filter(models.CampusUser.role.in_(["Staff", "Admin"])).all()
        for staff in staff_users:
            notif = models.NotificationLog(
                recipient_email=staff.email,
                subject=f"URGENT: Thermal Anomaly at {sensor.location}",
                message=f"Hello {staff.name}, an automated maintenance ticket (#{ticket.id}) was created due to abnormal sensor reading ({reading}°C)."
            )
            db.add(notif)
            notifications_sent += 1
        db.commit()

    db.commit()
    db.refresh(sensor)
    
    # WebSocket Broadcast Payload
    event_payload = {
        "event": "telemetry_update",
        "sensor_id": sensor.id,
        "sensor_name": sensor.name,
        "location": sensor.location,
        "reading": sensor.last_reading,
        "anomaly_detected": anomaly_detected,
        "ticket_id": ticket_created_id
    }
    
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.create_task(manager.broadcast(event_payload))
    except RuntimeError:
        pass
    
    return {
        "status": "success",
        "sensor_id": sensor.id,
        "updated_reading": sensor.last_reading,
        "anomaly_detected": anomaly_detected,
        "automated_maintenance_ticket_id": ticket_created_id,
        "notifications_dispatched": notifications_sent
    }

# --- ERP Endpoints ---
@app.post("/erp/assets/")
def create_asset(name: str, asset_type: str, location: str, db: Session = Depends(get_db)):
    existing = db.query(models.FacilityAsset).filter(models.FacilityAsset.name == name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Asset with this name already exists")
    try:
        asset = models.FacilityAsset(name=name, asset_type=asset_type, location=location)
        db.add(asset)
        db.commit()
        db.refresh(asset)
        return {"status": "success", "asset_id": asset.id, "name": asset.name}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database integrity error while creating asset")

@app.get("/erp/assets/")
def list_assets(db: Session = Depends(get_db)):
    return db.query(models.FacilityAsset).all()

@app.post("/erp/maintenance/")
def create_maintenance_ticket(title: str, description: str, priority: str = "Medium", asset_id: int = None, db: Session = Depends(get_db)):
    ticket = models.MaintenanceTicket(title=title, description=description, priority=priority, asset_id=asset_id)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return {"status": "success", "ticket_id": ticket.id}

@app.get("/erp/maintenance/")
def list_maintenance_tickets(db: Session = Depends(get_db)):
    return db.query(models.MaintenanceTicket).all()

# --- CRM Endpoints ---
@app.post("/crm/users/")
def register_user(name: str, email: str, role: str, db: Session = Depends(get_db)):
    existing = db.query(models.CampusUser).filter(models.CampusUser.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User email already exists")
    user = models.CampusUser(name=name, email=email, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"status": "success", "user_id": user.id, "email": user.email}

@app.get("/crm/users/")
def list_users(db: Session = Depends(get_db)):
    return db.query(models.CampusUser).all()

@app.post("/crm/support/")
def create_support_ticket(subject: str, message: str, user_id: int, db: Session = Depends(get_db)):
    ticket = models.SupportTicket(subject=subject, message=message, user_id=user_id)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return {"status": "success", "support_ticket_id": ticket.id}

@app.get("/crm/support/")
def list_support_tickets(db: Session = Depends(get_db)):
    return db.query(models.SupportTicket).all()

@app.get("/notifications/")
def list_notifications(db: Session = Depends(get_db)):
    return db.query(models.NotificationLog).all()

# --- AI Intelligence Layer ---
@app.get("/ai/campus-summary")
def get_campus_summary(db: Session = Depends(get_db)):
    sensors_count = db.query(models.CampusSensor).count()
    assets_count = db.query(models.FacilityAsset).count()
    users_count = db.query(models.CampusUser).count()
    support_tickets_count = db.query(models.SupportTicket).filter(models.SupportTicket.status == "Pending").count()
    maintenance_count = db.query(models.MaintenanceTicket).filter(models.MaintenanceTicket.status == "Open").count()
    
    summary_text = (
        f"Smart Campus Status Report: Monitoring {sensors_count} active environmental sensors, "
        f"tracking {assets_count} facility assets across campus. "
        f"Currently, there are {maintenance_count} open maintenance tickets and "
        f"{support_tickets_count} pending user support requests from {users_count} registered campus stakeholders."
    )
    return {
        "status": "success",
        "ai_summary": summary_text,
        "metrics": {
            "sensors": sensors_count,
            "assets": assets_count,
            "open_maintenance_tickets": maintenance_count,
            "pending_support_tickets": support_tickets_count,
            "stakeholders": users_count
        }
    }

@app.post("/ai/query")
def ai_natural_language_query(question: str, db: Session = Depends(get_db)):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        q = question.lower()
        sensors = db.query(models.CampusSensor).all()
        assets = db.query(models.FacilityAsset).all()
        maintenance = db.query(models.MaintenanceTicket).all()
        if "sensor" in q:
            names = [f"{s.name} at {s.location} (Reading: {s.last_reading})" for s in sensors]
            return {"answer": f"Registered sensors: " + ", ".join(names)}
        elif "asset" in q or "hvac" in q:
            names = [f"{a.name} ({a.asset_type}) at {a.location} - Status: {a.status}" for a in assets]
            return {"answer": f"Facility assets: " + " | ".join(names)}
        else:
            return {"answer": f"Smart Campus Assistant (Offline Mode): Monitoring {len(sensors)} sensors and {len(assets)} assets."}

    client = OpenAI(api_key=api_key)

    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_all_sensors",
                "description": "Retrieve all environmental sensors, their locations, types, and latest readings.",
                "parameters": {"type": "object", "properties": {}}
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_all_assets",
                "description": "Retrieve all facility assets and their operational status.",
                "parameters": {"type": "object", "properties": {}}
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_maintenance_tickets",
                "description": "Retrieve all maintenance tickets and anomaly details.",
                "parameters": {"type": "object", "properties": {}}
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_support_tickets",
                "description": "Retrieve user support requests.",
                "parameters": {"type": "object", "properties": {}}
            }
        }
    ]

    messages = [
        {"role": "system", "content": "You are an advanced Smart Campus AI agent. Use the provided tools to fetch real-time database records and answer user questions accurately."},
        {"role": "user", "content": question}
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )
        
        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls

        if tool_calls:
            messages.append(response_message)
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_output = ""

                if function_name == "get_all_sensors":
                    sensors = db.query(models.CampusSensor).all()
                    function_output = json.dumps([s.__dict__ for s in sensors], default=str)
                elif function_name == "get_all_assets":
                    assets = db.query(models.FacilityAsset).all()
                    function_output = json.dumps([a.__dict__ for a in assets], default=str)
                elif function_name == "get_maintenance_tickets":
                    tickets = db.query(models.MaintenanceTicket).all()
                    function_output = json.dumps([t.__dict__ for t in tickets], default=str)
                elif function_name == "get_support_tickets":
                    support = db.query(models.SupportTicket).all()
                    function_output = json.dumps([st.__dict__ for st in support], default=str)

                messages.append({
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": function_name,
                    "content": function_output
                })

            second_response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages
            )
            return {"answer": second_response.choices[0].message.content}
        
        return {"answer": response_message.content}

    except Exception as e:
        return {"answer": f"AI Agent Error: {str(e)}"}
