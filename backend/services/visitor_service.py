from sqlalchemy.orm import Session
from typing import Optional
from user_agents import parse
from backend.models import Visitor


def get_or_create_visitor(
    db: Session,
    ip_address: str,
    user_agent: str,
    referrer: Optional[str] = None,
    utm_source: Optional[str] = None,
    utm_medium: Optional[str] = None,
    utm_campaign: Optional[str] = None,
) -> Visitor:
    """
    Get an existing visitor by IP or create a new one.
    """
    visitor = db.query(Visitor).filter(Visitor.ip_address == ip_address).first()

    if visitor:
        # Update visit count and last seen
        visitor.total_visits += 1
        db.commit()
        db.refresh(visitor)
        return visitor

    # Parse user agent
    ua = parse(user_agent) if user_agent else None

    # Create new visitor
    visitor = Visitor(
        ip_address=ip_address,
        user_agent=user_agent,
        browser=ua.browser.family if ua else None,
        browser_version=ua.browser.version_string if ua else None,
        os=ua.os.family if ua else None,
        os_version=ua.os.version_string if ua else None,
        device_type=get_device_type(ua) if ua else None,
        device_brand=ua.device.brand if ua else None,
        device_model=ua.device.model if ua else None,
        is_bot=ua.is_bot if ua else False,
        original_referrer=referrer,
        utm_source=utm_source,
        utm_medium=utm_medium,
        utm_campaign=utm_campaign,
    )

    db.add(visitor)
    db.commit()
    db.refresh(visitor)

    return visitor


def get_device_type(ua) -> str:
    """Determine device type from user agent."""
    if ua.is_mobile:
        return "mobile"
    elif ua.is_tablet:
        return "tablet"
    elif ua.is_pc:
        return "desktop"
    elif ua.is_bot:
        return "bot"
    return "unknown"
