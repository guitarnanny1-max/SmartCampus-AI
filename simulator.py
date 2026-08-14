import time
import random
import httpx

API_URL = "http://localhost:8000"

print("📡 Starting Smart Campus IoT Telemetry Simulator...")
print("Press Ctrl+C to stop.\n")

while True:
    try:
        # Fetch existing sensors to pick a random one
        res = httpx.get(f"{API_URL}/sensors/")
        if res.status_code == 200:
            sensors = res.json()
            if sensors:
                sensor = random.choice(sensors)
                
                # Generate normal or spike reading (occasionally > 30°C to trigger anomaly)
                is_anomaly_test = random.random() < 0.25 # 25% chance of thermal anomaly
                reading = round(random.uniform(32.0, 42.0) if is_anomaly_test else random.uniform(18.0, 26.0), 2)
                
                # Send telemetry reading
                post_res = httpx.post(f"{API_URL}/sensors/{sensor['id']}/reading", params={"reading": reading})
                data = post_res.json()
                
                status_icon = "🔥 [ANOMALY DETECTED]" if data.get("anomaly_detected") else "✅ [Normal]"
                print(f"{status_icon} Sensor: {sensor['name']} ({sensor['location']}) -> Reading: {reading}°C | Ticket ID: {data.get('automated_maintenance_ticket_id')}")
            else:
                print("⚠️ No sensors found in database. Waiting for initialization...")
        else:
            print("⚠️ Backend not reachable yet...")
    except Exception as e:
        print(f"❌ Simulator connection error: {e}")
    
    time.sleep(5)
