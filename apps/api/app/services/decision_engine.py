from __future__ import annotations

from statistics import mean

from app.domain.models import BirdAlert, BirdingEvent, DecisionDimension, DecisionReport, Recommendation, UserProfile


def _dim(key: str, label: str, score: int, summary: str) -> DecisionDimension:
    return DecisionDimension(key=key, label=label, score=max(0, min(100, score)), summary=summary)


def build_decision_report(event: BirdingEvent, profile: UserProfile, alert: BirdAlert) -> DecisionReport:
    freshness = round(event.confidence * 100)
    rarity = 95 if alert.is_lifer else 72

    travel_penalty = 52
    if profile.max_walking_km >= 8:
        travel_penalty -= 4

    schedule_penalty = 56 if "exam_next_week" in profile.schedule_constraints else 28
    future_trip_value = 63 if event.knowledge.alternative_hotspots else 20

    dimensions = [
        _dim("rarity", "罕见度与 life list 价值", rarity, "上海 mega 且为新种。"),
        _dim("freshness", "近期记录强度", freshness, "今早仍有多源鸟讯。"),
        _dim("travel", "交通与步行成本", 100 - travel_penalty, "单程耗时长，末段步行重。"),
        _dim("schedule", "日程冲突", 100 - schedule_penalty, "下周考试带来机会成本。"),
        _dim("future", "未来替代观看机会", future_trip_value, "印尼旅行更稳，但不一定近期成行。"),
    ]

    overall_score = round(
        mean(
            [
                rarity,
                freshness,
                100 - travel_penalty,
                100 - schedule_penalty,
                100 - max(0, future_trip_value - 30),
            ]
        )
    )

    if overall_score >= 78 and freshness >= 80:
        recommendation = Recommendation.GO
    elif overall_score >= 65 and freshness >= 70:
        recommendation = Recommendation.GO_WITH_RISK
    elif future_trip_value >= 75 and overall_score < 60:
        recommendation = Recommendation.SAVE_FOR_FUTURE_TRIP
    else:
        recommendation = Recommendation.SKIP

    rationale = [
        "这是明显的 lifer 级别事件，本地再次覆盖概率极低。",
        "多源证据显示该鸟仍在，且早晨窗口相对稳定。",
        "交通和步行成本较高，但仍在你的可承受上限内。",
    ]
    risks = [
        "单程约 4 小时，末段步行 7-8 km 会压缩体力和复习时间。",
        "如果天气转差或鸟位移动，现场收益可能快速下降。",
    ]
    alternatives = [
        "选择天气更稳定的工作日清晨",
        "与其他观鸟者拼车降低步行与时间成本",
        "若两天内鸟讯消退，则转存到未来目的地仓库",
    ]

    return DecisionReport(
        recommendation=recommendation,
        score=overall_score,
        confidence=0.80,
        rationale=rationale,
        risks=risks,
        opportunity_cost=(
            "如果不去，未来更高概率在印尼海上旅行中看到，但成本、时间和安全性仍然未知。"
        ),
        alternatives=alternatives,
        dimensions=dimensions,
        evidence_ids=[signal.id for signal in event.recent_signals],
        generated_by_version="decision_rules:v0.1",
    )

