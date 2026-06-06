from datetime import datetime

from app.core.settings import settings
from app.domain.models import (
    BirdAlert,
    BirdingEvent,
    ConnectorStatus,
    FutureDestinationItem,
    RoutePlan,
    TripLog,
    UserProfile,
    WorkbenchSnapshot,
)
from app.services.decision_engine import build_decision_report
from app.services.planning import build_route_plan as build_route_plan_service
from app.services.sample_data import (
    build_alerts as _build_alerts,
    build_archive as _build_archive,
    build_connectors as _build_connectors,
    build_featured_event as _build_featured_event,
    build_future_destinations as _build_future_destinations,
    build_profile as _build_profile,
)


def build_profile() -> UserProfile:
    return _build_profile()


def build_alerts() -> list[BirdAlert]:
    return _build_alerts()


def build_featured_event() -> BirdingEvent:
    return _build_featured_event()


def build_future_destinations() -> list[FutureDestinationItem]:
    return _build_future_destinations()


def build_archive() -> list[TripLog]:
    return _build_archive()


def build_connectors() -> list[ConnectorStatus]:
    return _build_connectors()


def build_route_plan() -> RoutePlan:
    return build_route_plan_for(build_featured_event(), build_profile())


def build_route_plan_for(event: BirdingEvent, profile: UserProfile) -> RoutePlan:
    return build_route_plan_service(event, profile)


def build_snapshot() -> WorkbenchSnapshot:
    profile = build_profile()
    alerts = build_alerts()
    featured_event = build_featured_event()
    decision = build_decision_report(featured_event, profile, alerts[0])
    route_plan = build_route_plan_for(featured_event, profile)

    return WorkbenchSnapshot(
        generated_at=datetime.fromisoformat("2026-04-24T13:30:00+08:00"),
        release_channel=settings.release_channel,
        profile=profile,
        alerts=alerts,
        featured_event=featured_event,
        decision=decision,
        route_plan=route_plan,
        future_destinations=build_future_destinations(),
        archive=build_archive(),
        connectors=build_connectors(),
    )
