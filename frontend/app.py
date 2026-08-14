import streamlit as st
import requests
import pandas as pd

BACKEND_URL = "http://smartcampus-backend:8000"

st.set_page_config(page_title="Smart Campus AI Dashboard", page_icon="🏫", layout="wide")

st.title("🏫 Smart Campus AI Command Center")
st.markdown("Unified ERP, CRM, IoT Telemetry, and Autonomous AI Intelligence Dashboard")

# --- Sidebar: IoT Telemetry Simulator ---
with st.sidebar:
    st.header("⚡ IoT Telemetry Simulator")
    st.markdown("Simulate live environmental sensor readings to test automated anomaly detection.")
    
    try:
        sensors_res = requests.get(f"{BACKEND_URL}/sensors/").json()
        sensor_options = {s["name"]: s["id"] for s in sensors_res} if sensors_res else {}
    except:
        sensor_options = {}
        
    if sensor_options:
        selected_sensor_name = st.selectbox("Select Sensor", list(sensor_options.keys()))
        selected_sensor_id = sensor_options[selected_sensor_name]
        
        sim_reading = st.slider("Simulated Reading (°C / %)", 10.0, 45.0, 22.0)
        
        if st.button("📡 Send Telemetry Reading", type="primary"):
            res = requests.post(f"{BACKEND_URL}/sensors/{selected_sensor_id}/reading", params={"reading": sim_reading})
            if res.status_code == 200:
                data = res.json()
                if data.get("anomaly_detected"):
                    st.error(f"🚨 **Thermal Anomaly Detected!**\n\nTicket #{data.get('automated_maintenance_ticket_id')} created. Notifications dispatched: {data.get('notifications_dispatched')}")
                else:
                    st.success(f"Reading of {sim_reading} recorded successfully (Normal Status).")
            else:
                st.error("Failed to transmit telemetry reading.")
    else:
        st.info("No sensors found.")

# --- Fetch Summary Metrics ---
try:
    response = requests.get(f"{BACKEND_URL}/ai/campus-summary")
    if response.status_code == 200:
        data = response.json()
        metrics = data.get("metrics", {})
        ai_summary = data.get("ai_summary", "")

        st.info(f"🤖 **AI Summary:** {ai_summary}")

        col1, col2, col3, col4, col5 = st.columns(5)
        col1.metric("Sensors", metrics.get("sensors", 0))
        col2.metric("ERP Assets", metrics.get("assets", 0))
        col3.metric("Open Maintenance", metrics.get("open_maintenance_tickets", 0))
        col4.metric("Pending Support", metrics.get("pending_support_tickets", 0))
        col5.metric("Stakeholders", metrics.get("stakeholders", 0))
    else:
        st.error("Failed to fetch campus summary from backend.")
except Exception as e:
    st.warning(f"Could not connect to backend service at {BACKEND_URL}.")

st.markdown("---")

# --- Dashboard Tabs ---
tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
    "🤖 AI Assistant Chat", 
    "📈 Analytics & Trends",
    "📡 Sensors & Telemetry", 
    "🏗️ ERP Facility Assets", 
    "💬 CRM Support & Users",
    "🔔 Notifications & Alerts"
])

with tab1:
    st.subheader("💬 Smart Campus AI Assistant")
    st.markdown("Ask questions about sensors, assets, maintenance, or campus metrics in plain English.")

    if "messages" not in st.session_state:
        st.session_state.messages = []

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("e.g., What is the status of our HVAC assets?"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            try:
                res = requests.post(f"{BACKEND_URL}/ai/query", params={"question": prompt})
                if res.status_code == 200:
                    answer = res.json().get("answer", "No response generated.")
                else:
                    answer = "Error communicating with AI intelligence layer."
            except Exception as ex:
                answer = f"Connection error: {ex}"
            
            st.markdown(answer)
            st.session_state.messages.append({"role": "assistant", "content": answer})

with tab2:
    st.subheader("📊 Campus Telemetry & Performance Analytics")
    st.markdown("Real-time telemetry distribution across registered environmental sensors.")
    try:
        sensors_data = requests.get(f"{BACKEND_URL}/sensors/").json()
        if sensors_data:
            df_sensors = pd.DataFrame(sensors_data)
            col_chart1, col_chart2 = st.columns(2)
            with col_chart1:
                st.write("**Sensor Last Readings Overview**")
                st.bar_chart(df_sensors, x="name", y="last_reading")
            with col_chart2:
                st.write("**Sensor Telemetry Table**")
                st.dataframe(df_sensors, use_container_width=True)
        else:
            st.info("No sensor data available for charting.")
    except:
        st.error("Unable to load analytics data.")

with tab3:
    st.subheader("Registered Campus Sensors")
    try:
        sensors_data = requests.get(f"{BACKEND_URL}/sensors/").json()
        if sensors_data:
            st.dataframe(sensors_data, use_container_width=True)
        else:
            st.info("No sensors registered yet.")
    except:
        st.error("Unable to load sensors.")

with tab4:
    st.subheader("Facility Assets & Maintenance")
    col_a, col_m = st.columns(2)
    with col_a:
        st.write("**Facility Assets**")
        try:
            assets = requests.get(f"{BACKEND_URL}/erp/assets/").json()
            if assets:
                st.dataframe(assets, use_container_width=True)
            else:
                st.info("No assets registered yet.")
        except:
            st.error("Unable to load assets.")
    with col_m:
        st.write("**Maintenance Tickets**")
        try:
            tickets = requests.get(f"{BACKEND_URL}/erp/maintenance/").json()
            if tickets:
                st.dataframe(tickets, use_container_width=True)
            else:
                st.info("No maintenance tickets found.")
        except:
            st.error("Unable to load maintenance tickets.")

with tab5:
    st.subheader("Campus Stakeholders & Support Tickets")
    col_u, col_t = st.columns(2)
    with col_u:
        st.write("**Registered Users**")
        try:
            users = requests.get(f"{BACKEND_URL}/crm/users/").json()
            if users:
                st.dataframe(users, use_container_width=True)
            else:
                st.info("No users registered.")
        except:
            st.error("Unable to load users.")
    with col_t:
        st.write("**Support Tickets**")
        try:
            support = requests.get(f"{BACKEND_URL}/crm/support/").json()
            if support:
                st.dataframe(support, use_container_width=True)
            else:
                st.info("No support tickets found.")
        except:
            st.error("Unable to load tickets.")

with tab6:
    st.subheader("🚨 Automated Stakeholder Notification Audit Log")
    st.markdown("Real-time log of autonomous notifications dispatched to staff and administrators during system anomalies.")
    try:
        notifications = requests.get(f"{BACKEND_URL}/notifications/").json()
        if notifications:
            st.dataframe(notifications, use_container_width=True)
        else:
            st.info("No notifications dispatched yet.")
    except:
        st.error("Unable to load notifications.")
