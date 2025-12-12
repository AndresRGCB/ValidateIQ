"""
Cada click, scroll, hover, etc. que queramos trackear.
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    visitor_id = Column(Integer, ForeignKey("visitors.id"), nullable=False)
    page_view_id = Column(Integer, ForeignKey("page_views.id"), nullable=True)

    # Timestamp exacto
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Tipo de evento
    event_type = Column(String(100), nullable=False, index=True)
    # Ejemplos:
    # - "scroll" (con depth en properties)
    # - "section_view" (que seccion vieron)
    # - "form_focus" (empezaron a llenar el form)
    # - "form_field_focus" (que campo tocaron)
    # - "form_submit_attempt" (intentaron enviar)
    # - "form_submit_success"
    # - "form_submit_error"
    # - "cta_click"
    # - "external_link_click"
    # - "copy_text" (si copian algo)
    # - "feature_card_hover"
    # - "feature_card_click"
    # - "faq_expand" (si agregas FAQ)
    # - "video_play", "video_pause", "video_complete" (si agregas video)
    # - "exit_intent" (cuando mueven el mouse hacia cerrar)
    # - "tab_hidden" (cambiaron de tab)
    # - "tab_visible" (volvieron)

    # Categoria del evento
    event_category = Column(String(100), nullable=True)
    # Ejemplos: "scroll", "form", "navigation", "engagement", "video"

    # Elemento especifico
    element_id = Column(String(255), nullable=True)  # ID del elemento HTML
    element_class = Column(String(255), nullable=True)
    element_text = Column(Text, nullable=True)  # Texto del boton/link clickeado

    # Seccion de la pagina
    section = Column(String(100), nullable=True)
    # Ejemplos: "hero", "problem", "features", "social_proof", "waitlist_form", "footer"

    # Propiedades adicionales (JSON flexible)
    properties = Column(JSON, nullable=True)
    # Ejemplos:
    # - scroll: {"depth": 75, "direction": "down"}
    # - form_field: {"field_name": "email", "field_value_length": 15}
    # - feature_card: {"feature_name": "AI Research Agent"}
    # - cta: {"button_text": "Join Waitlist", "button_position": "hero"}

    # Posicion en la pagina cuando ocurrio
    scroll_position = Column(Integer, nullable=True)

    # Tiempo desde que cargo la pagina (ms)
    time_since_page_load = Column(Integer, nullable=True)

    # Relaciones
    visitor = relationship("Visitor", back_populates="events")
