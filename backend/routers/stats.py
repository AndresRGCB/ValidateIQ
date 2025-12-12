"""
Endpoints para ver estadisticas (para ti, no publico).
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.database import get_db
from backend import models

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("/dashboard")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Stats completos para tu dashboard.
    Proteger con auth en produccion.
    """
    # Total visitors
    total_visitors = db.query(models.Visitor).count()

    # Total page views
    total_page_views = db.query(models.PageView).count()

    # Total signups
    total_signups = db.query(models.Signup).count()

    # Conversion rate
    conversion_rate = (total_signups / total_visitors * 100) if total_visitors > 0 else 0

    # Average time on page
    avg_time = db.query(func.avg(models.PageView.time_on_page_seconds)).scalar() or 0

    # Average scroll depth
    avg_scroll = db.query(func.avg(models.PageView.max_scroll_depth)).scalar() or 0

    # Feature votes
    feature_votes = db.query(
        models.Signup.most_wanted_feature,
        func.count(models.Signup.id)
    ).group_by(models.Signup.most_wanted_feature).all()

    # Device breakdown
    device_breakdown = db.query(
        models.Visitor.device_type,
        func.count(models.Visitor.id)
    ).group_by(models.Visitor.device_type).all()

    # Referrer breakdown
    referrer_breakdown = db.query(
        models.Visitor.original_referrer,
        func.count(models.Visitor.id)
    ).group_by(models.Visitor.original_referrer).limit(10).all()

    # Events breakdown
    events_breakdown = db.query(
        models.Event.event_type,
        func.count(models.Event.id)
    ).group_by(models.Event.event_type).all()

    # Section engagement (cuantos vieron cada seccion)
    section_views = db.query(
        models.Event.section,
        func.count(func.distinct(models.Event.visitor_id))
    ).filter(
        models.Event.event_type == "section_view"
    ).group_by(models.Event.section).all()

    # Form funnel
    form_started = db.query(func.count(func.distinct(models.Event.visitor_id))).filter(
        models.Event.event_type == "form_focus"
    ).scalar() or 0

    form_email_filled = db.query(func.count(func.distinct(models.Event.visitor_id))).filter(
        models.Event.event_type == "form_field_blur"
    ).scalar() or 0

    return {
        "overview": {
            "total_visitors": total_visitors,
            "total_page_views": total_page_views,
            "total_signups": total_signups,
            "conversion_rate": round(conversion_rate, 2),
            "avg_time_on_page_seconds": round(float(avg_time), 1),
            "avg_scroll_depth": round(float(avg_scroll), 1)
        },
        "feature_votes": {f[0]: f[1] for f in feature_votes if f[0]},
        "device_breakdown": {d[0] or "unknown": d[1] for d in device_breakdown},
        "referrer_breakdown": {r[0] or "direct": r[1] for r in referrer_breakdown},
        "events_breakdown": {e[0]: e[1] for e in events_breakdown if e[0]},
        "section_engagement": {s[0] or "unknown": s[1] for s in section_views},
        "form_funnel": {
            "visitors": total_visitors,
            "reached_form": form_started,
            "filled_email": form_email_filled,
            "completed_signup": total_signups
        }
    }
