from fastapi import APIRouter, HTTPException

from app.domain.models import (
    BirdAlert,
    BirdingEvent,
    ConnectorConfig,
    ConnectorConfigUpdate,
    ConnectorStatus,
    EbirdHotspotPreview,
    EbirdPreview,
    EventIngestRequest,
    FutureDestinationItem,
    IngestedSignalResponse,
    TripLog,
    UserProfile,
    WorkbenchSnapshot,
)
from app.services.connector_configs import list_connector_configs, update_connector_config
from app.services.connectors import parse_assisted_signal
from app.services.ebird import (
    EbirdAPIError,
    EbirdConfigurationError,
    fetch_hotspots,
    fetch_recent_observations,
)
from app.services.orchestrator import (
    build_archive,
    build_connectors,
    build_featured_event,
    build_future_destinations,
    build_profile,
    build_snapshot,
)

router = APIRouter(prefix="/api/v1")


@router.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": "bird-api"}


@router.get("/dashboard", response_model=WorkbenchSnapshot, tags=["dashboard"])
def get_dashboard() -> WorkbenchSnapshot:
    return build_snapshot()


@router.get("/alerts", response_model=list[BirdAlert], tags=["dashboard"])
def get_alerts() -> list[BirdAlert]:
    return build_snapshot().alerts


@router.get("/events/{event_id}", response_model=BirdingEvent, tags=["events"])
def get_event(event_id: str) -> BirdingEvent:
    event = build_featured_event()
    if event.event_id != event_id:
        raise HTTPException(status_code=404, detail=f"Unknown event: {event_id}")
    return event


@router.get("/future-destinations", response_model=list[FutureDestinationItem], tags=["planning"])
def get_future_destinations() -> list[FutureDestinationItem]:
    return build_future_destinations()


@router.get("/profile", response_model=UserProfile, tags=["profile"])
def get_profile() -> UserProfile:
    return build_profile()


@router.get("/archive", response_model=list[TripLog], tags=["archive"])
def get_archive() -> list[TripLog]:
    return build_archive()


@router.get("/connectors", response_model=list[ConnectorStatus], tags=["connectors"])
def get_connectors() -> list[ConnectorStatus]:
    return build_connectors()


@router.get("/connector-configs", response_model=list[ConnectorConfig], tags=["connectors"])
def get_connector_configs() -> list[ConnectorConfig]:
    return list_connector_configs()


@router.put("/connector-configs/{source_name}", response_model=ConnectorConfig, tags=["connectors"])
def put_connector_config(source_name: str, payload: ConnectorConfigUpdate) -> ConnectorConfig:
    try:
        return update_connector_config(source_name, payload)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/connectors/ebird/recent-observations", response_model=EbirdPreview, tags=["connectors"])
def get_ebird_recent_observations(
    region_code: str | None = None,
    days_back: int = 3,
    max_results: int = 10,
    species_code: str | None = None,
) -> EbirdPreview:
    try:
        return fetch_recent_observations(
            region_code=region_code,
            days_back=days_back,
            max_results=max_results,
            species_code=species_code,
        )
    except EbirdConfigurationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except EbirdAPIError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/connectors/ebird/hotspots", response_model=EbirdHotspotPreview, tags=["connectors"])
def get_ebird_hotspots(region_code: str | None = None, max_results: int = 20) -> EbirdHotspotPreview:
    try:
        return fetch_hotspots(region_code=region_code, max_results=max_results)
    except EbirdConfigurationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except EbirdAPIError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.post("/signals/ingest", response_model=IngestedSignalResponse, tags=["connectors"])
def ingest_signal(payload: EventIngestRequest) -> IngestedSignalResponse:
    return parse_assisted_signal(payload)
