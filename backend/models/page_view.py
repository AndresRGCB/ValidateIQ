"""
Cada vez que un visitante carga la pagina.
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base


class PageView(Base):
    __tablename__ = "page_views"

    id = Column(Integer, primary_key=True, index=True)
    visitor_id = Column(Integer, ForeignKey("visitors.id"), nullable=False)

    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # De donde vienen en esta sesion especifica
    referrer = Column(Text, nullable=True)

    # URL params
    utm_source = Column(String(255), nullable=True)
    utm_medium = Column(String(255), nullable=True)
    utm_campaign = Column(String(255), nullable=True)
    utm_content = Column(String(255), nullable=True)

    # Info de pantalla
    screen_width = Column(Integer, nullable=True)
    screen_height = Column(Integer, nullable=True)
    viewport_width = Column(Integer, nullable=True)
    viewport_height = Column(Integer, nullable=True)

    # Tiempo en pagina (se actualiza con beacon al salir)
    time_on_page_seconds = Column(Integer, nullable=True)

    # Scroll depth maximo alcanzado (0-100%)
    max_scroll_depth = Column(Integer, nullable=True)

    # Llego al form?
    reached_form = Column(Boolean, default=False)

    # Session ID para agrupar actividad
    session_id = Column(String(255), nullable=True)

    # Relacion
    visitor = relationship("Visitor", back_populates="page_views")
