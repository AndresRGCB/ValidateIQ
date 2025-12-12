"""
Cuando alguien deja su email.
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base


class Signup(Base):
    __tablename__ = "signups"

    id = Column(Integer, primary_key=True, index=True)
    visitor_id = Column(Integer, ForeignKey("visitors.id"), nullable=False)

    # Email
    email = Column(String(255), unique=True, index=True, nullable=False)

    # Feature que mas quieren
    most_wanted_feature = Column(String(100), nullable=False)

    # Consent
    marketing_consent = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Posicion en la waitlist (calculado)
    waitlist_position = Column(Integer, nullable=True)

    # Contexto del signup
    signup_source = Column(String(100), nullable=True)  # "hero_cta", "bottom_form", etc.
    time_to_signup_seconds = Column(Integer, nullable=True)  # Tiempo desde first_seen hasta signup
    page_views_before_signup = Column(Integer, nullable=True)
    events_before_signup = Column(Integer, nullable=True)

    # Relacion
    visitor = relationship("Visitor", back_populates="signup")
