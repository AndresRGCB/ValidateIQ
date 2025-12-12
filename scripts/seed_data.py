"""
Script to seed the database with test data.
Run with: python scripts/seed_data.py
"""
import sys
sys.path.insert(0, '.')

from backend.database import SessionLocal, engine, Base
from backend.models import Visitor, PageView, Event, Signup
from datetime import datetime, timedelta
import random

# Create all tables
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()

    try:
        # Clear existing data
        db.query(Event).delete()
        db.query(PageView).delete()
        db.query(Signup).delete()
        db.query(Visitor).delete()
        db.commit()

        # Create sample visitors
        devices = ['mobile', 'desktop', 'tablet']
        browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']
        referrers = [None, 'https://google.com', 'https://twitter.com', 'https://reddit.com', 'https://producthunt.com']
        features = ['ai_research', 'landing_pages', 'analytics', 'waitlist', 'dashboard', 'all']

        visitors = []
        for i in range(50):
            visitor = Visitor(
                ip_address=f"192.168.1.{i+1}",
                browser=random.choice(browsers),
                browser_version=f"{random.randint(90, 120)}.0",
                os=random.choice(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
                device_type=random.choice(devices),
                original_referrer=random.choice(referrers),
                total_visits=random.randint(1, 5),
                total_events=random.randint(5, 50),
                total_time_seconds=random.randint(30, 600),
                first_seen=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
            )
            db.add(visitor)
            visitors.append(visitor)

        db.commit()

        # Create page views for each visitor
        for visitor in visitors:
            for _ in range(visitor.total_visits):
                page_view = PageView(
                    visitor_id=visitor.id,
                    referrer=visitor.original_referrer,
                    screen_width=random.choice([1920, 1440, 1366, 390, 414]),
                    screen_height=random.choice([1080, 900, 768, 844, 896]),
                    time_on_page_seconds=random.randint(10, 300),
                    max_scroll_depth=random.randint(20, 100),
                    reached_form=random.random() > 0.4,
                )
                db.add(page_view)

        db.commit()

        # Create some signups (conversion rate ~20%)
        signup_visitors = random.sample(visitors, k=10)
        for i, visitor in enumerate(signup_visitors):
            signup = Signup(
                visitor_id=visitor.id,
                email=f"founder{i+1}@startup.com",
                most_wanted_feature=random.choice(features),
                marketing_consent=random.random() > 0.3,
                waitlist_position=i + 1,
                time_to_signup_seconds=random.randint(60, 300),
                page_views_before_signup=random.randint(1, 5),
                events_before_signup=random.randint(5, 30),
            )
            visitor.converted = True
            visitor.converted_at = datetime.utcnow() - timedelta(days=random.randint(0, 7))
            db.add(signup)

        db.commit()

        # Create events for visitors
        event_types = [
            ('section_view', 'engagement'),
            ('scroll_milestone', 'scroll'),
            ('cta_click', 'navigation'),
            ('form_focus', 'form'),
            ('form_field_blur', 'form'),
            ('feature_card_hover', 'engagement'),
        ]
        sections = ['hero', 'problem', 'features', 'social_proof', 'waitlist_form']

        for visitor in visitors:
            num_events = random.randint(5, 20)
            for _ in range(num_events):
                event_type, category = random.choice(event_types)
                event = Event(
                    visitor_id=visitor.id,
                    event_type=event_type,
                    event_category=category,
                    section=random.choice(sections),
                    scroll_position=random.randint(0, 3000),
                    time_since_page_load=random.randint(1000, 300000),
                )
                db.add(event)

        db.commit()

        print("Seeded database with:")
        print(f"  - {len(visitors)} visitors")
        print(f"  - {len(signup_visitors)} signups")
        print(f"  - Multiple page views and events")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
