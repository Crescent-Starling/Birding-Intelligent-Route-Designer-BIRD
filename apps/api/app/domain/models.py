from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


def to_camel(value: str) -> str:
    parts = value.split("_")
    return parts[0] + "".join(part.capitalize() for part in parts[1:])


class DomainModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        use_enum_values=True,
    )


class SourceType(str, Enum):
    WECHAT = "wechat"
    XIAOHONGSHU = "xiaohongshu"
    EBIRD = "ebird"
    BIRDREPORT = "birdreport"
    ATLAS = "atlas"
    SEARCH = "search"
    MAP = "map"
    WEATHER = "weather"
    MANUAL = "manual"


class Recommendation(str, Enum):
    GO = "GO"
    GO_WITH_RISK = "GO_WITH_RISK"
    SKIP = "SKIP"
    SAVE_FOR_FUTURE_TRIP = "SAVE_FOR_FUTURE_TRIP"


class ConnectorMode(str, Enum):
    AUTOMATIC = "automatic"
    ASSISTED = "assisted"
    MANUAL_FALLBACK = "manual_fallback"


class GeoPoint(DomainModel):
    lat: float
    lon: float
    label: str | None = None


class ObservationSignal(DomainModel):
    id: str
    source_type: SourceType
    source_label: str
    source_url: str | None = None
    captured_at: datetime
    observed_at: datetime | None = None
    geo_point: GeoPoint | None = None
    raw_text: str
    media_refs: list[str] = Field(default_factory=list)
    extracted_species: list[str] = Field(default_factory=list)
    confidence: float = Field(ge=0.0, le=1.0)
    extracted_fields: dict[str, Any] = Field(default_factory=dict)


class BirdAlert(DomainModel):
    bird_id: str
    species_name: str
    rarity_level: str
    is_lifer: bool
    region: str
    detected_at: datetime
    trigger_reason: str


class UserProfile(DomainModel):
    id: str
    display_name: str
    home_city: str
    departure_hub: str
    budget_band: str
    stamina_level: str
    max_walking_km: float
    transport_preferences: list[str] = Field(default_factory=list)
    schedule_constraints: list[str] = Field(default_factory=list)
    target_species: list[str] = Field(default_factory=list)
    life_list: list[str] = Field(default_factory=list)


class SpeciesKnowledge(DomainModel):
    species_name: str
    distribution: list[str] = Field(default_factory=list)
    migration_window: str
    habitat: str
    identification_notes: list[str] = Field(default_factory=list)
    rarity_context: str
    alternative_hotspots: list[str] = Field(default_factory=list)


class BirdingEvent(DomainModel):
    event_id: str
    species: str
    location: str
    active_window: str
    status: str
    latest_position: str
    confidence: float = Field(ge=0.0, le=1.0)
    rarity_level: str
    recent_signals: list[ObservationSignal] = Field(default_factory=list)
    knowledge: SpeciesKnowledge


class DecisionDimension(DomainModel):
    key: str
    label: str
    score: int = Field(ge=0, le=100)
    summary: str


class DecisionReport(DomainModel):
    recommendation: Recommendation
    score: int = Field(ge=0, le=100)
    confidence: float = Field(ge=0.0, le=1.0)
    rationale: list[str] = Field(default_factory=list)
    risks: list[str] = Field(default_factory=list)
    opportunity_cost: str
    alternatives: list[str] = Field(default_factory=list)
    dimensions: list[DecisionDimension] = Field(default_factory=list)
    evidence_ids: list[str] = Field(default_factory=list)
    generated_by_version: str


class RouteStep(DomainModel):
    title: str
    detail: str
    eta: str


class RoutePlan(DomainModel):
    candidate_date: str
    depart_time: str
    duration: str
    walking_distance_km: float
    transfers: int
    weather_summary: str
    supplies: list[str] = Field(default_factory=list)
    cautions: list[str] = Field(default_factory=list)
    route_steps: list[RouteStep] = Field(default_factory=list)


class FutureDestinationItem(DomainModel):
    species: str
    destination: str
    best_season: str
    expected_value: str
    notes: str


class TripLog(DomainModel):
    id: str
    species: str
    location: str
    outcome: str
    notes: str
    reflections: list[str] = Field(default_factory=list)
    logged_at: datetime


class ConnectorStatus(DomainModel):
    source_name: str
    mode: ConnectorMode
    status: str
    note: str


class ConnectorFieldType(str, Enum):
    TEXT = "text"
    PASSWORD = "password"
    NUMBER = "number"
    BOOLEAN = "boolean"
    SELECT = "select"


class ConnectorFieldSpec(DomainModel):
    key: str
    label: str
    field_type: ConnectorFieldType
    placeholder: str | None = None
    help_text: str
    options: list[str] = Field(default_factory=list)
    required: bool = False
    sensitive: bool = False


class ConnectorConfig(DomainModel):
    source_name: str
    mode: ConnectorMode
    enabled: bool
    status: str
    provider: str
    base_url: str | None = None
    region_code: str | None = None
    polling_minutes: int | None = None
    api_key: str | None = None
    cookie: str | None = None
    user_agent: str | None = None
    notes: str | None = None
    api_key_configured: bool = False
    cookie_configured: bool = False
    fields: list[ConnectorFieldSpec] = Field(default_factory=list)


class ConnectorConfigUpdate(DomainModel):
    enabled: bool | None = None
    provider: str | None = None
    base_url: str | None = None
    region_code: str | None = None
    polling_minutes: int | None = None
    api_key: str | None = None
    cookie: str | None = None
    user_agent: str | None = None
    notes: str | None = None


class EbirdObservation(DomainModel):
    species_code: str
    common_name: str
    scientific_name: str
    observation_datetime: str
    location_id: str
    location_name: str
    country_code: str | None = None
    subnational1_code: str | None = None
    subnational2_code: str | None = None
    how_many: int | None = None
    latitude: float | None = None
    longitude: float | None = None
    is_notable: bool = False
    is_validated: bool | None = None
    user_display_name: str | None = None
    checklist_id: str | None = None


class EbirdHotspot(DomainModel):
    location_id: str
    name: str
    country_code: str | None = None
    subnational1_code: str | None = None
    subnational2_code: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    latest_observation_date: str | None = None
    num_species_all_time: int | None = None


class EbirdPreview(DomainModel):
    source_name: str = "eBird"
    provider: str
    region_code: str
    used_base_url: str
    used_days_back: int
    used_max_results: int
    species_code: str | None = None
    observations: list[EbirdObservation] = Field(default_factory=list)


class EbirdHotspotPreview(DomainModel):
    source_name: str = "eBird"
    provider: str
    region_code: str
    used_base_url: str
    hotspots: list[EbirdHotspot] = Field(default_factory=list)


class WorkbenchSnapshot(DomainModel):
    generated_at: datetime
    release_channel: str
    profile: UserProfile
    alerts: list[BirdAlert]
    featured_event: BirdingEvent
    decision: DecisionReport
    route_plan: RoutePlan
    future_destinations: list[FutureDestinationItem]
    archive: list[TripLog]
    connectors: list[ConnectorStatus]


class EventIngestRequest(DomainModel):
    source_type: SourceType
    payload: str
    source_url: str | None = None


class IngestedSignalResponse(DomainModel):
    signal: ObservationSignal
    parsing_notes: list[str] = Field(default_factory=list)
    generated_by_version: str = "ingest_rules:v0.1"
