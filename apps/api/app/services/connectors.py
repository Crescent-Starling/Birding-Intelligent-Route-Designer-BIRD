from __future__ import annotations

from datetime import datetime
import re

from app.domain.models import EventIngestRequest, GeoPoint, IngestedSignalResponse, ObservationSignal, SourceType

SPECIES_PATTERNS = ("白斑军舰鸟", "黑脸琵鹭", "仙八色鸫", "黄嘴白鹭")
TIME_RE = re.compile(r"(\d{1,2}[:：]\d{2}(?:\s*-\s*\d{1,2}[:：]\d{2})?)")


def parse_assisted_signal(payload: EventIngestRequest) -> IngestedSignalResponse:
    source_value = str(payload.source_type)
    extracted_species = [species for species in SPECIES_PATTERNS if species in payload.payload]
    time_match = TIME_RE.search(payload.payload)
    active_window = time_match.group(1).replace("：", ":") if time_match else "unknown"

    notes = ["v0.1 parser uses keyword extraction and lightweight heuristics."]
    if source_value in {SourceType.WECHAT.value, SourceType.XIAOHONGSHU.value}:
        notes.append("Recommended next step: OCR screenshot + LLM field extraction.")

    signal = ObservationSignal(
        id=f"ingested-{source_value}-{int(datetime.now().timestamp())}",
        source_type=source_value,
        source_label=source_value.title(),
        source_url=payload.source_url,
        captured_at=datetime.now().astimezone(),
        observed_at=None,
        geo_point=GeoPoint(lat=31.5603, lon=121.9581, label="Pending geocoding"),
        raw_text=payload.payload,
        media_refs=[],
        extracted_species=extracted_species or ["unknown"],
        confidence=0.62 if extracted_species else 0.35,
        extracted_fields={
            "active_window": active_window,
            "still_present": "还在" in payload.payload,
            "needs_review": True,
        },
    )
    return IngestedSignalResponse(signal=signal, parsing_notes=notes)
