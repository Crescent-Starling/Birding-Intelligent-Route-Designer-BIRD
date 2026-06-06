from __future__ import annotations

import json
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from app.domain.models import ConnectorConfig, EbirdHotspot, EbirdHotspotPreview, EbirdObservation, EbirdPreview
from app.services.connector_configs import get_connector_config


class EbirdConfigurationError(ValueError):
    pass


class EbirdAPIError(RuntimeError):
    pass


def _get_ebird_config() -> ConnectorConfig:
    config = get_connector_config("eBird")
    if not config.enabled:
        raise EbirdConfigurationError("eBird connector is disabled. Enable it on /connectors first.")
    if not config.base_url:
        raise EbirdConfigurationError("eBird connector is missing baseUrl.")
    if not config.api_key:
        raise EbirdConfigurationError("eBird connector is missing apiKey.")
    if not config.region_code:
        raise EbirdConfigurationError("eBird connector is missing regionCode.")
    return config


def _build_request(config: ConnectorConfig, path: str, query: dict[str, Any]) -> Request:
    base_url = config.base_url.rstrip("/")
    clean_query = {key: value for key, value in query.items() if value is not None}
    url = f"{base_url}{path}"
    if clean_query:
        url = f"{url}?{urlencode(clean_query)}"

    return Request(
        url=url,
        headers={
            "X-eBirdApiToken": config.api_key or "",
            "Accept": "application/json",
        },
    )


def _fetch_json(request: Request) -> list[dict[str, Any]]:
    try:
        with urlopen(request, timeout=20) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as exc:  # pragma: no cover - network stack varies by platform
        raise EbirdAPIError(f"eBird request failed: {exc}") from exc


def _map_observation(item: dict[str, Any]) -> EbirdObservation:
    return EbirdObservation(
        species_code=item.get("speciesCode", ""),
        common_name=item.get("comName", ""),
        scientific_name=item.get("sciName", ""),
        observation_datetime=item.get("obsDt", ""),
        location_id=item.get("locId", ""),
        location_name=item.get("locName", ""),
        country_code=item.get("countryCode"),
        subnational1_code=item.get("subnational1Code"),
        subnational2_code=item.get("subnational2Code"),
        how_many=item.get("howMany"),
        latitude=item.get("lat"),
        longitude=item.get("lng"),
        is_notable=bool(item.get("obsValid", False) and item.get("obsReviewed", False)),
        is_validated=item.get("obsValid"),
        user_display_name=item.get("userDisplayName"),
        checklist_id=item.get("subId"),
    )


def _map_hotspot(item: dict[str, Any]) -> EbirdHotspot:
    return EbirdHotspot(
        location_id=item.get("locId", ""),
        name=item.get("locName", ""),
        country_code=item.get("countryCode"),
        subnational1_code=item.get("subnational1Code"),
        subnational2_code=item.get("subnational2Code"),
        latitude=item.get("lat"),
        longitude=item.get("lng"),
        latest_observation_date=item.get("latestObsDt"),
        num_species_all_time=item.get("numSpeciesAllTime"),
    )


def fetch_recent_observations(
    region_code: str | None = None,
    days_back: int = 3,
    max_results: int = 10,
    species_code: str | None = None,
) -> EbirdPreview:
    config = _get_ebird_config()
    resolved_region = region_code or config.region_code
    path = f"/data/obs/{resolved_region}/recent"
    if species_code:
        path = f"{path}/{species_code}"

    request = _build_request(
        config,
        path,
        {
            "back": days_back,
            "maxResults": max_results,
            "detail": "simple",
            "hotspot": "true",
        },
    )
    payload = _fetch_json(request)

    return EbirdPreview(
        provider=config.provider,
        region_code=resolved_region,
        used_base_url=config.base_url or "",
        used_days_back=days_back,
        used_max_results=max_results,
        species_code=species_code,
        observations=[_map_observation(item) for item in payload],
    )


def fetch_hotspots(region_code: str | None = None, max_results: int = 20) -> EbirdHotspotPreview:
    config = _get_ebird_config()
    resolved_region = region_code or config.region_code

    request = _build_request(
        config,
        f"/ref/hotspot/{resolved_region}",
        {
            "fmt": "json",
        },
    )
    payload = _fetch_json(request)
    hotspots = [_map_hotspot(item) for item in payload[:max_results]]

    return EbirdHotspotPreview(
        provider=config.provider,
        region_code=resolved_region,
        used_base_url=config.base_url or "",
        hotspots=hotspots,
    )
