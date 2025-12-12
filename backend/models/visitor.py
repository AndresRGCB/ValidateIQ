"""
Cada IP unica es un visitante. Trackeamos todo lo que podamos de ellos.
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base


class Visitor(Base):
    __tablename__ = "visitors"

    id = Column(Integer, primary_key=True, index=True)

    # Identificacion
    ip_address = Column(String(45), unique=True, index=True, nullable=False)
    fingerprint = Column(String(255), nullable=True)

    # Primera visita
    first_seen = Column(DateTime(timezone=True), server_default=func.now())

    # Ultima actividad
    last_seen = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Info del dispositivo/browser (parseado del User-Agent)
    user_agent = Column(Text, nullable=True)
    browser = Column(String(100), nullable=True)
    browser_version = Column(String(50), nullable=True)
    os = Column(String(100), nullable=True)
    os_version = Column(String(50), nullable=True)
    device_type = Column(String(50), nullable=True)  # mobile, tablet, desktop
    device_brand = Column(String(100), nullable=True)
    device_model = Column(String(100), nullable=True)
    is_bot = Column(Boolean, default=False)

    # Geolocalizacion (si agregas un servicio de GeoIP despues)
    country = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)

    # Referrer original (de donde llego por primera vez)
    original_referrer = Column(Text, nullable=True)
    utm_source = Column(String(255), nullable=True)
    utm_medium = Column(String(255), nullable=True)
    utm_campaign = Column(String(255), nullable=True)

    # Metricas agregadas
    total_visits = Column(Integer, default=1)
    total_events = Column(Integer, default=0)
    total_time_seconds = Column(Integer, default=0)

    # Se convirtio en signup?
    converted = Column(Boolean, default=False)
    converted_at = Column(DateTime(timezone=True), nullable=True)

    # Relaciones
    events = relationship("Event", back_populates="visitor")
    page_views = relationship("PageView", back_populates="visitor")
    signup = relationship("Signup", back_populates="visitor", uselist=False)
