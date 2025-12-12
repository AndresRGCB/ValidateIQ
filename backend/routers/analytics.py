"""
Endpoints para recibir eventos de tracking del frontend.
"""
from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from backend.database import get_db
from backend.services import visitor_service, analytics_service

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


# ============================================
# SCHEMAS
# ============================================


class InitVisitorRequest(BaseModel):
    """Se envia cuando carga la pagina"""
    referrer: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    screen_width: Optional[int] = None
    screen_height: Optional[int] = None
    viewport_width: Optional[int] = None
    viewport_height: Optional[int] = None


class TrackEventRequest(BaseModel):
    """Para trackear cualquier evento"""
    event_type: str
    event_category: Optional[str] = None
    element_id: Optional[str] = None
    element_class: Optional[str] = None
    element_text: Optional[str] = None
    section: Optional[str] = None
    properties: Optional[dict] = None
    scroll_position: Optional[int] = None
    time_since_page_load: Optional[int] = None


class UpdatePageViewRequest(BaseModel):
    """Para actualizar metricas de la pagina (scroll, tiempo)"""
    page_view_id: int
    time_on_page_seconds: Optional[int] = None
    max_scroll_depth: Optional[int] = None
    reached_form: Optional[bool] = None


class BeaconRequest(BaseModel):
    """Se envia cuando el usuario sale de la pagina (sendBeacon)"""
    page_view_id: int
    time_on_page_seconds: int
    max_scroll_depth: int
    events_count: int


# ============================================
# ENDPOINTS
# ============================================


@router.post("/init")
async def init_visitor(
    request: Request,
    data: InitVisitorRequest,
    db: Session = Depends(get_db)
):
    """
    Se llama cuando carga la pagina.
    Crea o actualiza el visitor, crea un page_view.
    Retorna visitor_id y page_view_id para usar en subsequent calls.
    """
    ip = get_client_ip(request)
    user_agent = request.headers.get("user-agent", "")

    visitor = visitor_service.get_or_create_visitor(
        db=db,
        ip_address=ip,
        user_agent=user_agent,
        referrer=data.referrer,
        utm_source=data.utm_source,
        utm_medium=data.utm_medium,
        utm_campaign=data.utm_campaign
    )

    page_view = analytics_service.create_page_view(
        db=db,
        visitor_id=visitor.id,
        referrer=data.referrer,
        utm_source=data.utm_source,
        utm_medium=data.utm_medium,
        utm_campaign=data.utm_campaign,
        utm_content=data.utm_content,
        screen_width=data.screen_width,
        screen_height=data.screen_height,
        viewport_width=data.viewport_width,
        viewport_height=data.viewport_height
    )

    return {
        "visitor_id": visitor.id,
        "page_view_id": page_view.id,
        "is_returning": visitor.total_visits > 1,
        "visit_count": visitor.total_visits
    }


@router.post("/event")
async def track_event(
    request: Request,
    data: TrackEventRequest,
    visitor_id: int,
    page_view_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Trackea cualquier evento del usuario.
    """
    event = analytics_service.create_event(
        db=db,
        visitor_id=visitor_id,
        page_view_id=page_view_id,
        event_type=data.event_type,
        event_category=data.event_category,
        element_id=data.element_id,
        element_class=data.element_class,
        element_text=data.element_text,
        section=data.section,
        properties=data.properties,
        scroll_position=data.scroll_position,
        time_since_page_load=data.time_since_page_load
    )

    return {"event_id": event.id}


@router.post("/pageview/update")
async def update_page_view(
    data: UpdatePageViewRequest,
    db: Session = Depends(get_db)
):
    """
    Actualiza metricas del page view (scroll depth, tiempo, etc.)
    Se puede llamar periodicamente o en eventos especificos.
    """
    analytics_service.update_page_view(
        db=db,
        page_view_id=data.page_view_id,
        time_on_page_seconds=data.time_on_page_seconds,
        max_scroll_depth=data.max_scroll_depth,
        reached_form=data.reached_form
    )
    return {"success": True}


@router.post("/beacon")
async def beacon(
    data: BeaconRequest,
    db: Session = Depends(get_db)
):
    """
    Se llama con sendBeacon cuando el usuario sale de la pagina.
    Guarda las metricas finales.
    """
    analytics_service.finalize_page_view(
        db=db,
        page_view_id=data.page_view_id,
        time_on_page_seconds=data.time_on_page_seconds,
        max_scroll_depth=data.max_scroll_depth
    )
    return {"success": True}


# ============================================
# HELPERS
# ============================================


def get_client_ip(request: Request) -> str:
    """Obtiene la IP real del cliente, considerando proxies."""
    # Railway y otros servicios ponen la IP real en X-Forwarded-For
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"
