from app.domain.models import BirdingEvent, RoutePlan, RouteStep, UserProfile


def build_route_plan(event: BirdingEvent, profile: UserProfile) -> RoutePlan:
    max_walk_note = "你的步行上限可覆盖当前海塘路线。"
    if profile.max_walking_km < 7:
        max_walk_note = "建议优先拼车或减少深度步行。"

    return RoutePlan(
        candidate_date="2026-04-26",
        depart_time="04:55",
        duration="约 11 小时往返",
        walking_distance_km=7.6,
        transfers=3,
        weather_summary="多云转晴，东北风 3 级，体感偏凉",
        supplies=["2L 水", "轻食", "遮阳帽", "充电宝", "望远镜", "离线地图"],
        cautions=[
            "海塘补给少，尽量一次带齐。",
            "若 08:30 前仍无有效更新，考虑提前止损返程。",
            max_walk_note,
        ],
        route_steps=[
            RouteStep(
                title="地铁出发",
                detail=f"{profile.departure_hub} 乘首班车前往换乘枢纽。",
                eta="04:55",
            ),
            RouteStep(
                title="城际转运",
                detail="转乘前往崇明方向的早班大巴。",
                eta="05:45",
            ),
            RouteStep(
                title="末段接驳",
                detail="到海塘入口后步行或视现场情况拼车。",
                eta="08:05",
            ),
            RouteStep(
                title="窗口观察",
                detail=f"优先覆盖 {event.active_window} 记录最密集的海塘东段。",
                eta="08:20",
            ),
        ],
    )

