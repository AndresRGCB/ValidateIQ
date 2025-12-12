"""
Endpoints para el waitlist signup.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from backend.database import get_db
from backend import models

router = APIRouter(prefix="/api/signups", tags=["signups"])


class SignupRequest(BaseModel):
    visitor_id: int
    email: EmailStr
    most_wanted_feature: str
    marketing_consent: bool
    signup_source: str = "main_form"
    time_to_signup_seconds: Optional[int] = None


@router.post("/")
async def create_signup(
    data: SignupRequest,
    db: Session = Depends(get_db)
):
    # Check duplicate email
    existing = db.query(models.Signup).filter(
        models.Signup.email == data.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="This email is already on the waitlist!"
        )

    # Get visitor
    visitor = db.query(models.Visitor).filter(
        models.Visitor.id == data.visitor_id
    ).first()

    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    # Calculate stats
    page_views_count = db.query(models.PageView).filter(
        models.PageView.visitor_id == data.visitor_id
    ).count()

    events_count = db.query(models.Event).filter(
        models.Event.visitor_id == data.visitor_id
    ).count()

    # Get current waitlist position
    current_count = db.query(models.Signup).count()

    # Create signup
    signup = models.Signup(
        visitor_id=data.visitor_id,
        email=data.email,
        most_wanted_feature=data.most_wanted_feature,
        marketing_consent=data.marketing_consent,
        signup_source=data.signup_source,
        time_to_signup_seconds=data.time_to_signup_seconds,
        page_views_before_signup=page_views_count,
        events_before_signup=events_count,
        waitlist_position=current_count + 1
    )

    db.add(signup)

    # Update visitor as converted
    visitor.converted = True
    visitor.converted_at = datetime.utcnow()

    db.commit()
    db.refresh(signup)

    return {
        "success": True,
        "position": signup.waitlist_position,
        "spots_left": max(100 - signup.waitlist_position, 0),
        "message": "You're in! Check your inbox for confirmation."
    }


@router.get("/count")
async def get_signup_count(db: Session = Depends(get_db)):
    count = db.query(models.Signup).count()
    return {
        "count": count,
        "spots_left": max(100 - count, 0)
    }
