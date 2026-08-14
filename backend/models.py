from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class CampusSensor(Base):
    __tablename__ = "campus_sensors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    location = Column(String)
    sensor_type = Column(String)
    last_reading = Column(Float, default=0.0)

class FacilityAsset(Base):
    __tablename__ = "facility_assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    asset_type = Column(String)
    location = Column(String)
    status = Column(String, default="Operational")

    maintenance_tickets = relationship("MaintenanceTicket", back_populates="asset")

class MaintenanceTicket(Base):
    __tablename__ = "maintenance_tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    priority = Column(String, default="Medium") # Low, Medium, High, Critical
    status = Column(String, default="Open") # Open, In Progress, Resolved
    asset_id = Column(Integer, ForeignKey("facility_assets.id"), nullable=True)

    asset = relationship("FacilityAsset", back_populates="maintenance_tickets")

class CampusUser(Base):
    __tablename__ = "campus_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    role = Column(String) # Student, Staff, Admin

    support_tickets = relationship("SupportTicket", back_populates="user")

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String)
    message = Column(String)
    status = Column(String, default="Pending") # Pending, Resolved
    user_id = Column(Integer, ForeignKey("campus_users.id"))

    user = relationship("CampusUser", back_populates="support_tickets")

class NotificationLog(Base):
    __tablename__ = "notification_logs"

    id = Column(Integer, primary_key=True, index=True)
    recipient_email = Column(String)
    subject = Column(String)
    message = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
