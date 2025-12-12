from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from backend.models import PageView, Event, Visitor


def create_page_view(
    db: Session,
    visitor_id: int,
    referrer: Optional[str] = None,
    utm_source: Optional[str] = None,
    utm_medium: Optional[str] = None,
    utm_campaign: Optional[str] = None,
    utm_content: Optional[str] = None,
    screen_width: Optional[int] = None,
    screen_height: Optional[int] = None,
    viewport_width: Optional[int] = None,
    viewport_height: Optional[int] = None,
) -> PageView:
    """Create a new page view record."""
    page_view = PageView(
        visitor_id=visitor_id,
        referrer=referrer,
        utm_source=utm_source,
        utm_medium=utm_medium,
        utm_campaign=utm_campaign,
        utm_content=utm_content,
        screen_width=screen_width,
        screen_height=screen_height,
        viewport_width=viewport_width,
        viewport_height=viewport_height,
    )

    db.add(page_view)
    db.commit()
    db.refresh(page_view)

    return page_view


def create_event(
    db: Session,
    visitor_id: int,
    event_type: str,
    page_view_id: Optional[int] = None,
    event_category: Optional[str] = None,
    element_id: Optional[str] = None,
    element_class: Optional[str] = None,
    element_text: Optional[str] = None,
    section: Optional[str] = None,
    properties: Optional[Dict[str, Any]] = None,
    scroll_position: Optional[int] = None,
    time_since_page_load: Optional[int] = None,
) -> Event:
    """Create a new event record."""
    event = Event(
        visitor_id=visitor_id,
        page_view_id=page_view_id,
        event_type=event_type,
        event_category=event_category,
        element_id=element_id,
        element_class=element_class,
        element_text=element_text,
        section=section,
        properties=properties,
        scroll_position=scroll_position,
        time_since_page_load=time_since_page_load,
    )

    db.add(event)

    # Update visitor's total events count
    visitor = db.query(Visitor).filter(Visitor.id == visitor_id).first()
    if visitor:
        visitor.total_events += 1

    db.commit()
    db.refresh(event)

    return event


def update_page_view(
    db: Session,
    page_view_id: int,
    time_on_page_seconds: Optional[int] = None,
    max_scroll_depth: Optional[int] = None,
    reached_form: Optional[bool] = None,
) -> Optional[PageView]:
    """Update page view metrics."""
    page_view = db.query(PageView).filter(PageView.id == page_view_id).first()

    if not page_view:
        return None

    if time_on_page_seconds is not None:
        page_view.time_on_page_seconds = time_on_page_seconds

    if max_scroll_depth is not None:
        # Only update if new depth is greater
        if page_view.max_scroll_depth is None or max_scroll_depth > page_view.max_scroll_depth:
            page_view.max_scroll_depth = max_scroll_depth

    if reached_form is not None:
        page_view.reached_form = reached_form

    db.commit()
    db.refresh(page_view)

    return page_view


def finalize_page_view(
    db: Session,
    page_view_id: int,
    time_on_page_seconds: int,
    max_scroll_depth: int,
) -> Optional[PageView]:
    """Finalize page view when user leaves (beacon)."""
    page_view = db.query(PageView).filter(PageView.id == page_view_id).first()

    if not page_view:
        return None

    page_view.time_on_page_seconds = time_on_page_seconds
    page_view.max_scroll_depth = max_scroll_depth

    # Update visitor's total time
    visitor = db.query(Visitor).filter(Visitor.id == page_view.visitor_id).first()
    if visitor:
        visitor.total_time_seconds += time_on_page_seconds

    db.commit()

    return page_view
