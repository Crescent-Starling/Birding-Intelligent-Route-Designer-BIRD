from app.domain.models import (
    BirdAlert,
    BirdingEvent,
    ConnectorConfigUpdate,
    EventIngestRequest,
    SpeciesKnowledge,
    UserProfile,
)
from app.services.connector_configs import list_connector_configs, update_connector_config
from app.services.connectors import parse_assisted_signal
from app.services import ebird
from app.services.decision_engine import build_decision_report
from app.services.sample_data import build_alerts, build_featured_event, build_profile


def test_featured_event_prefers_go_with_risk() -> None:
    profile = build_profile()
    alert = build_alerts()[0]
    event = build_featured_event()

    report = build_decision_report(event, profile, alert)

    assert report.recommendation == "GO_WITH_RISK"
    assert report.score >= 65
    assert "sig-wechat-001" in report.evidence_ids


def test_future_trip_wins_when_event_is_stale() -> None:
    profile_data = build_profile().model_dump()
    profile = UserProfile(
        **{**profile_data, "max_walking_km": 3.0, "schedule_constraints": ["exam_next_week", "no_overnight"]},
    )
    alert = BirdAlert(**build_alerts()[0].model_dump())
    event_data = build_featured_event().model_dump()
    knowledge_data = build_featured_event().knowledge.model_dump()
    event = BirdingEvent(
        **{
            **event_data,
            "confidence": 0.41,
            "knowledge": SpeciesKnowledge(
                **{
                    **knowledge_data,
                    "alternative_hotspots": ["雅加达外海", "巽他海峡", "巴厘海峡", "龙目海峡"],
                }
            ),
        },
    )

    report = build_decision_report(event, profile, alert)

    assert report.recommendation in {"SAVE_FOR_FUTURE_TRIP", "SKIP"}


def test_assisted_ingest_extracts_species_and_window() -> None:
    response = parse_assisted_signal(
        EventIngestRequest(
            source_type="wechat",
            payload="白斑军舰鸟还在，06:00-09:00 活跃，东边更近。",
            source_url=None,
        )
    )

    assert response.signal.extracted_species == ["白斑军舰鸟"]
    assert response.signal.extracted_fields["active_window"] == "06:00-09:00"


def test_connector_config_update_changes_provider_and_enabled() -> None:
    original = list_connector_configs()
    target = next(item for item in original if item.source_name == "Weather")

    updated = update_connector_config(
        "Weather",
        ConnectorConfigUpdate(
            enabled=True,
            provider="qweather",
            polling_minutes=10,
        ),
    )

    assert updated.source_name == "Weather"
    assert updated.enabled is True
    assert updated.provider == "qweather"
    assert updated.polling_minutes == 10

    update_connector_config(
        "Weather",
        ConnectorConfigUpdate(
            enabled=target.enabled,
            provider=target.provider,
            polling_minutes=target.polling_minutes,
            base_url=target.base_url,
            api_key=target.api_key,
            notes=target.notes,
        ),
    )


def test_ebird_recent_observations_maps_response(monkeypatch) -> None:
    original = next(item for item in list_connector_configs() if item.source_name == "eBird")
    update_connector_config(
        "eBird",
        ConnectorConfigUpdate(
            enabled=True,
            api_key="test-ebird-key",
            base_url="https://api.ebird.org/v2",
            region_code="CN-SH",
            provider="ebird-public-api",
        ),
    )

    class FakeResponse:
        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb):
            return False

        def read(self) -> bytes:
            return (
                b'[{"speciesCode":"whtfri1","comName":"White-spotted Frigatebird","sciName":"Fregata andrewsi",'
                b'"obsDt":"2026-04-24 06:15","locId":"L123","locName":"Chongming Dongtan",'
                b'"countryCode":"CN","subnational1Code":"CN-SH","howMany":1,"lat":31.56,"lng":121.95,'
                b'"obsValid":true,"obsReviewed":false,"subId":"S123"}]'
            )

    def fake_urlopen(request, timeout=20):
        assert request.full_url.startswith("https://api.ebird.org/v2/data/obs/CN-SH/recent")
        assert request.headers["X-ebirdapitoken"] == "test-ebird-key"
        return FakeResponse()

    monkeypatch.setattr(ebird, "urlopen", fake_urlopen)

    preview = ebird.fetch_recent_observations(days_back=2, max_results=5)

    assert preview.region_code == "CN-SH"
    assert preview.used_days_back == 2
    assert preview.observations[0].common_name == "White-spotted Frigatebird"
    assert preview.observations[0].location_name == "Chongming Dongtan"

    update_connector_config(
        "eBird",
        ConnectorConfigUpdate(
            enabled=original.enabled,
            provider=original.provider,
            base_url=original.base_url,
            region_code=original.region_code,
            polling_minutes=original.polling_minutes,
            api_key=original.api_key,
            notes=original.notes,
        ),
    )


def test_ebird_hotspots_maps_response(monkeypatch) -> None:
    original = next(item for item in list_connector_configs() if item.source_name == "eBird")
    update_connector_config(
        "eBird",
        ConnectorConfigUpdate(
            enabled=True,
            api_key="test-ebird-key",
            base_url="https://api.ebird.org/v2",
            region_code="CN-SH",
            provider="ebird-public-api",
        ),
    )

    class FakeResponse:
        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb):
            return False

        def read(self) -> bytes:
            return (
                b'[{"locId":"L999","locName":"Shanghai Nanhui","countryCode":"CN","subnational1Code":"CN-SH",'
                b'"lat":30.91,"lng":121.93}]'
            )

    def fake_urlopen(request, timeout=20):
        assert request.full_url.startswith("https://api.ebird.org/v2/ref/hotspot/CN-SH")
        return FakeResponse()

    monkeypatch.setattr(ebird, "urlopen", fake_urlopen)

    preview = ebird.fetch_hotspots(region_code="CN-SH", max_results=10)

    assert preview.region_code == "CN-SH"
    assert preview.hotspots[0].name == "Shanghai Nanhui"

    update_connector_config(
        "eBird",
        ConnectorConfigUpdate(
            enabled=original.enabled,
            provider=original.provider,
            base_url=original.base_url,
            region_code=original.region_code,
            polling_minutes=original.polling_minutes,
            api_key=original.api_key,
            notes=original.notes,
        ),
    )
