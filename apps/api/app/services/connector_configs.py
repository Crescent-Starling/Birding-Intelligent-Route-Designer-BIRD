from __future__ import annotations

import json
from pathlib import Path

from app.domain.models import ConnectorConfig, ConnectorConfigUpdate
from app.services.sample_data import build_connector_configs

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
DATA_FILE = DATA_DIR / "connector_configs.local.json"


def _serialize_configs(configs: list[ConnectorConfig]) -> list[dict]:
    return [config.model_dump(mode="json", by_alias=True) for config in configs]


def _redact(config: ConnectorConfig) -> ConnectorConfig:
    return config.model_copy(
        update={
            "api_key_configured": bool(config.api_key),
            "cookie_configured": bool(config.cookie),
            "api_key": "",
            "cookie": "",
        }
    )


def _read_persisted() -> list[ConnectorConfig] | None:
    if not DATA_FILE.exists():
        return None
    raw = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    return [ConnectorConfig.model_validate(item) for item in raw]


def _persist(configs: list[ConnectorConfig]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(
        json.dumps(_serialize_configs(configs), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def list_connector_configs() -> list[ConnectorConfig]:
    persisted = _read_persisted()
    configs = persisted if persisted is not None else build_connector_configs()
    return [_redact(config) for config in configs]


def update_connector_config(source_name: str, update: ConnectorConfigUpdate) -> ConnectorConfig:
    persisted = _read_persisted()
    configs = persisted if persisted is not None else build_connector_configs()
    updated_config: ConnectorConfig | None = None

    for index, config in enumerate(configs):
        if config.source_name.lower() != source_name.lower():
            continue

        payload = {key: value for key, value in update.model_dump(exclude_none=True).items()}
        if "api_key" in payload and payload["api_key"] == "":
            payload.pop("api_key")
        if "cookie" in payload and payload["cookie"] == "":
            payload.pop("cookie")

        merged = config.model_copy(update=payload)
        merged = merged.model_copy(
            update={
                "api_key_configured": bool(merged.api_key),
                "cookie_configured": bool(merged.cookie),
            }
        )
        configs[index] = merged
        updated_config = merged
        break

    if updated_config is None:
        available = ", ".join(config.source_name for config in configs)
        raise ValueError(f"Unknown connector '{source_name}'. Available: {available}")

    _persist(configs)
    return _redact(updated_config)


def get_connector_config(source_name: str) -> ConnectorConfig:
    persisted = _read_persisted()
    configs = persisted if persisted is not None else build_connector_configs()
    for config in configs:
        if config.source_name.lower() == source_name.lower():
            return config

    available = ", ".join(config.source_name for config in configs)
    raise ValueError(f"Unknown connector '{source_name}'. Available: {available}")
