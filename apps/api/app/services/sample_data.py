from datetime import datetime

from app.domain.models import (
    BirdAlert,
    BirdingEvent,
    ConnectorConfig,
    ConnectorFieldSpec,
    ConnectorFieldType,
    ConnectorMode,
    ConnectorStatus,
    FutureDestinationItem,
    GeoPoint,
    ObservationSignal,
    SourceType,
    SpeciesKnowledge,
    TripLog,
    UserProfile,
)


def build_profile() -> UserProfile:
    return UserProfile(
        id="user-sample-001",
        display_name="Sample Birder",
        home_city="Shanghai",
        departure_hub="Shanghai City Center",
        budget_band="student-flex",
        stamina_level="medium",
        max_walking_km=8.0,
        transport_preferences=["metro", "bus", "rideshare"],
        schedule_constraints=["exam_next_week", "prefer_same_day_return"],
        target_species=["白斑军舰鸟", "黑脸琵鹭", "仙八色鸫"],
        life_list=["黑卷尾", "白腹蓝鹟", "栗喉蜂虎"],
    )


def build_alerts() -> list[BirdAlert]:
    return [
        BirdAlert(
            bird_id="fregata-001",
            species_name="白斑军舰鸟",
            rarity_level="Shanghai mega",
            is_lifer=True,
            region="崇明东滩",
            detected_at=datetime.fromisoformat("2026-04-24T06:12:00+08:00"),
            trigger_reason="近期群聊与小红书同时出现新种级鸟讯，且不在你的 life list 中。",
        ),
        BirdAlert(
            bird_id="platalea-002",
            species_name="黑脸琵鹭",
            rarity_level="Target species",
            is_lifer=True,
            region="杭州湾湿地",
            detected_at=datetime.fromisoformat("2026-04-23T17:45:00+08:00"),
            trigger_reason="未来一周有稳定记录，但即时价值低于白斑军舰鸟。",
        ),
    ]


def build_signals() -> list[ObservationSignal]:
    return [
        ObservationSignal(
            id="sig-wechat-001",
            source_type=SourceType.WECHAT,
            source_label="微信群聊",
            captured_at=datetime.fromisoformat("2026-04-24T06:20:00+08:00"),
            observed_at=datetime.fromisoformat("2026-04-24T06:15:00+08:00"),
            geo_point=GeoPoint(lat=31.5603, lon=121.9581, label="崇明东滩北海塘"),
            raw_text="军舰鸟还在，今天早上 6 点后活跃，海塘东边飞得更近。",
            extracted_species=["白斑军舰鸟"],
            confidence=0.9,
            extracted_fields={
                "active_window": "06:00-09:00",
                "still_present": True,
                "walking_distance_km": 1.7,
            },
        ),
        ObservationSignal(
            id="sig-xhs-001",
            source_type=SourceType.XIAOHONGSHU,
            source_label="小红书",
            source_url="https://www.xiaohongshu.com/explore/sample",
            captured_at=datetime.fromisoformat("2026-04-24T07:05:00+08:00"),
            observed_at=datetime.fromisoformat("2026-04-23T08:10:00+08:00"),
            geo_point=GeoPoint(lat=31.5598, lon=121.9551, label="东滩观景堤"),
            raw_text="公交能到，但最后需要走很久，建议带水和遮阳。",
            media_refs=["xhs://cover/fregata"],
            extracted_species=["白斑军舰鸟"],
            confidence=0.73,
            extracted_fields={
                "terrain": "sea-dike",
                "supplies_needed": True,
                "walking_distance_km": 7.5,
            },
        ),
        ObservationSignal(
            id="sig-ebird-001",
            source_type=SourceType.EBIRD,
            source_label="eBird",
            source_url="https://ebird.org/checklist/sample",
            captured_at=datetime.fromisoformat("2026-04-24T09:00:00+08:00"),
            observed_at=datetime.fromisoformat("2026-04-23T07:42:00+08:00"),
            raw_text="Observed offshore over tidal flat with gull flock.",
            extracted_species=["White-spotted Frigatebird"],
            confidence=0.78,
            extracted_fields={
                "supporting_species": "燕鸥, 海鸥",
                "global_rarity_signal": "strong",
            },
        ),
    ]


def build_knowledge() -> SpeciesKnowledge:
    return SpeciesKnowledge(
        species_name="白斑军舰鸟",
        distribution=["印度洋", "东南亚海域", "印尼外海"],
        migration_window="华东内陆或近海为极偶发迷鸟",
        habitat="热带海域上空、近海岛屿、潮间带外缘",
        identification_notes=["长尾深叉", "翼下浅色斑", "雌鸟白腹明显"],
        rarity_context="上海级别 mega，未来本地稳定再见概率极低。",
        alternative_hotspots=["雅加达外海", "巽他海峡", "巴厘海峡"],
    )


def build_featured_event() -> BirdingEvent:
    return BirdingEvent(
        event_id="event-white-spotted-frigatebird",
        species="白斑军舰鸟",
        location="上海崇明东滩北侧海塘",
        active_window="06:00-09:00",
        status="active_with_mobility_risk",
        latest_position="北侧海塘补给点以东 1.7 km",
        confidence=0.82,
        rarity_level="Shanghai mega",
        recent_signals=build_signals(),
        knowledge=build_knowledge(),
    )


def build_future_destinations() -> list[FutureDestinationItem]:
    return [
        FutureDestinationItem(
            species="白斑军舰鸟",
            destination="雅加达外海",
            best_season="4-9 月海上观鸟季",
            expected_value="高",
            notes="可一并覆盖多种军舰鸟，但需要补充预算与安全评估。",
        ),
        FutureDestinationItem(
            species="圣鹮",
            destination="埃及尼罗河流域",
            best_season="10-3 月",
            expected_value="中高",
            notes="适合整合到后续 World Mode。",
        ),
    ]


def build_archive() -> list[TripLog]:
    return [
        TripLog(
            id="triplog-001",
            species="黄嘴白鹭",
            location="江苏如东",
            outcome="seen",
            notes="当天阴天但潮位理想，路线判断正确。",
            reflections=["更早到达提升了近距离观察机会。"],
            logged_at=datetime.fromisoformat("2026-04-01T18:30:00+08:00"),
        )
    ]


def build_connectors() -> list[ConnectorStatus]:
    return [
        ConnectorStatus(
            source_name="WeChat",
            mode=ConnectorMode.ASSISTED,
            status="limited",
            note="v0.1 通过文本/截图导入与解析接入。",
        ),
        ConnectorStatus(
            source_name="Xiaohongshu",
            mode=ConnectorMode.ASSISTED,
            status="limited",
            note="支持链接和截图级别解析，自动抓取待后续验证。",
        ),
        ConnectorStatus(
            source_name="eBird",
            mode=ConnectorMode.AUTOMATIC,
            status="healthy",
            note="优先用于历史与近期记录整合。",
        ),
        ConnectorStatus(
            source_name="BirdReport",
            mode=ConnectorMode.AUTOMATIC,
            status="healthy",
            note="用于中国本地记录中心补充。",
        ),
        ConnectorStatus(
            source_name="Maps",
            mode=ConnectorMode.AUTOMATIC,
            status="planned",
            note="当前以前端原型数据演示路线规划。",
        ),
        ConnectorStatus(
            source_name="Weather",
            mode=ConnectorMode.AUTOMATIC,
            status="planned",
            note="当前以规则占位，等待真实 provider。",
        ),
    ]


def build_connector_configs() -> list[ConnectorConfig]:
    return [
        ConnectorConfig(
            source_name="eBird",
            mode=ConnectorMode.AUTOMATIC,
            enabled=True,
            status="healthy",
            provider="ebird-public-api",
            base_url="https://api.ebird.org/v2",
            region_code="CN-SH",
            polling_minutes=15,
            api_key="",
            notes="优先配置地区代码与 key，用于近期记录和热点拉取。",
            api_key_configured=False,
            cookie_configured=False,
            fields=[
                ConnectorFieldSpec(key="enabled", label="Enable connector", field_type=ConnectorFieldType.BOOLEAN, help_text="打开后允许 BIRD 自动拉取 eBird 数据。"),
                ConnectorFieldSpec(key="provider", label="Provider", field_type=ConnectorFieldType.SELECT, help_text="v0.1 仅内置一个 provider。", options=["ebird-public-api"], required=True),
                ConnectorFieldSpec(key="base_url", label="Base URL", field_type=ConnectorFieldType.TEXT, placeholder="https://api.ebird.org/v2", help_text="eBird API 基础地址。", required=True),
                ConnectorFieldSpec(key="api_key", label="API Key", field_type=ConnectorFieldType.PASSWORD, placeholder="ebird-api-key", help_text="用于真实 API 请求。", sensitive=True),
                ConnectorFieldSpec(key="region_code", label="Region Code", field_type=ConnectorFieldType.TEXT, placeholder="CN-SH", help_text="如上海可填写 CN-SH。"),
                ConnectorFieldSpec(key="polling_minutes", label="Polling Minutes", field_type=ConnectorFieldType.NUMBER, help_text="拉取频率，建议先从 15 分钟开始。"),
                ConnectorFieldSpec(key="notes", label="Notes", field_type=ConnectorFieldType.TEXT, placeholder="internal notes", help_text="补充接入说明或限制。"),
            ],
        ),
        ConnectorConfig(
            source_name="BirdReport",
            mode=ConnectorMode.AUTOMATIC,
            enabled=True,
            status="healthy",
            provider="birdreport-web",
            base_url="https://www.birdreport.cn",
            region_code="上海",
            polling_minutes=20,
            notes="先按地区与时间窗口抓取近期记录。",
            api_key_configured=False,
            cookie_configured=False,
            fields=[
                ConnectorFieldSpec(key="enabled", label="Enable connector", field_type=ConnectorFieldType.BOOLEAN, help_text="允许自动使用中国观鸟记录中心数据。"),
                ConnectorFieldSpec(key="provider", label="Provider", field_type=ConnectorFieldType.SELECT, help_text="当前以 Web connector 为主。", options=["birdreport-web"], required=True),
                ConnectorFieldSpec(key="base_url", label="Base URL", field_type=ConnectorFieldType.TEXT, placeholder="https://www.birdreport.cn", help_text="记录中心入口地址。"),
                ConnectorFieldSpec(key="region_code", label="Region / Province", field_type=ConnectorFieldType.TEXT, placeholder="上海", help_text="可用于缩小抓取范围。"),
                ConnectorFieldSpec(key="polling_minutes", label="Polling Minutes", field_type=ConnectorFieldType.NUMBER, help_text="自动同步间隔。"),
                ConnectorFieldSpec(key="notes", label="Notes", field_type=ConnectorFieldType.TEXT, placeholder="selector or parsing notes", help_text="解析规则、字段映射或人工备注。"),
            ],
        ),
        ConnectorConfig(
            source_name="WeChat",
            mode=ConnectorMode.ASSISTED,
            enabled=False,
            status="limited",
            provider="assisted-import",
            user_agent="",
            cookie="",
            notes="v0.1 建议以文本/截图导入为主。",
            api_key_configured=False,
            cookie_configured=False,
            fields=[
                ConnectorFieldSpec(key="enabled", label="Enable connector", field_type=ConnectorFieldType.BOOLEAN, help_text="启用后在系统中开放辅助导入入口。"),
                ConnectorFieldSpec(key="provider", label="Provider", field_type=ConnectorFieldType.SELECT, help_text="当前不做全自动抓取。", options=["assisted-import", "manual-fallback"], required=True),
                ConnectorFieldSpec(key="user_agent", label="User Agent", field_type=ConnectorFieldType.TEXT, placeholder="browser user agent", help_text="仅在需要模拟浏览器请求时填写。"),
                ConnectorFieldSpec(key="cookie", label="Cookie / Session", field_type=ConnectorFieldType.PASSWORD, placeholder="session cookie", help_text="如未来接内部网页视图时使用。", sensitive=True),
                ConnectorFieldSpec(key="notes", label="Notes", field_type=ConnectorFieldType.TEXT, placeholder="group import notes", help_text="记录群来源、导入方式和人工审核要求。"),
            ],
        ),
        ConnectorConfig(
            source_name="Xiaohongshu",
            mode=ConnectorMode.ASSISTED,
            enabled=False,
            status="limited",
            provider="assisted-import",
            user_agent="",
            cookie="",
            notes="建议先做链接/截图/文本解析。",
            api_key_configured=False,
            cookie_configured=False,
            fields=[
                ConnectorFieldSpec(key="enabled", label="Enable connector", field_type=ConnectorFieldType.BOOLEAN, help_text="启用后允许事件页从小红书导入素材。"),
                ConnectorFieldSpec(key="provider", label="Provider", field_type=ConnectorFieldType.SELECT, help_text="当前默认半自动。", options=["assisted-import", "manual-fallback"], required=True),
                ConnectorFieldSpec(key="user_agent", label="User Agent", field_type=ConnectorFieldType.TEXT, placeholder="browser user agent", help_text="部分网页模式下可作为实验参数。"),
                ConnectorFieldSpec(key="cookie", label="Cookie / Session", field_type=ConnectorFieldType.PASSWORD, placeholder="session cookie", help_text="若后续做登录态抓取可用。", sensitive=True),
                ConnectorFieldSpec(key="notes", label="Notes", field_type=ConnectorFieldType.TEXT, placeholder="OCR and parsing rules", help_text="写入 OCR、抽取 prompt 或人工清洗约束。"),
            ],
        ),
        ConnectorConfig(
            source_name="Maps",
            mode=ConnectorMode.AUTOMATIC,
            enabled=False,
            status="planned",
            provider="amap",
            base_url="https://restapi.amap.com",
            api_key="",
            region_code="Shanghai",
            notes="地图 connector 建议先接高德，再抽象 provider。",
            api_key_configured=False,
            cookie_configured=False,
            fields=[
                ConnectorFieldSpec(key="enabled", label="Enable connector", field_type=ConnectorFieldType.BOOLEAN, help_text="允许规划引擎调用地图 provider。"),
                ConnectorFieldSpec(key="provider", label="Provider", field_type=ConnectorFieldType.SELECT, help_text="优先接一个 provider 先跑通。", options=["amap", "baidu-map"], required=True),
                ConnectorFieldSpec(key="base_url", label="Base URL", field_type=ConnectorFieldType.TEXT, placeholder="https://restapi.amap.com", help_text="地图 API 基础地址。"),
                ConnectorFieldSpec(key="api_key", label="API Key", field_type=ConnectorFieldType.PASSWORD, placeholder="map-api-key", help_text="用于路线、逆地理编码等接口。", sensitive=True),
                ConnectorFieldSpec(key="region_code", label="Default Region", field_type=ConnectorFieldType.TEXT, placeholder="Shanghai", help_text="用作默认搜索区域。"),
                ConnectorFieldSpec(key="notes", label="Notes", field_type=ConnectorFieldType.TEXT, placeholder="routing limitations", help_text="记录路线模式和站点覆盖限制。"),
            ],
        ),
        ConnectorConfig(
            source_name="Weather",
            mode=ConnectorMode.AUTOMATIC,
            enabled=False,
            status="planned",
            provider="open-meteo",
            base_url="https://api.open-meteo.com/v1",
            polling_minutes=30,
            api_key="",
            notes="优先使用免 key provider，后续再切商业源。",
            api_key_configured=False,
            cookie_configured=False,
            fields=[
                ConnectorFieldSpec(key="enabled", label="Enable connector", field_type=ConnectorFieldType.BOOLEAN, help_text="启用后允许规划引擎加入天气判断。"),
                ConnectorFieldSpec(key="provider", label="Provider", field_type=ConnectorFieldType.SELECT, help_text="先从一个稳定 provider 起步。", options=["open-meteo", "qweather"], required=True),
                ConnectorFieldSpec(key="base_url", label="Base URL", field_type=ConnectorFieldType.TEXT, placeholder="https://api.open-meteo.com/v1", help_text="天气接口地址。"),
                ConnectorFieldSpec(key="api_key", label="API Key", field_type=ConnectorFieldType.PASSWORD, placeholder="optional api key", help_text="部分 provider 可为空。", sensitive=True),
                ConnectorFieldSpec(key="polling_minutes", label="Polling Minutes", field_type=ConnectorFieldType.NUMBER, help_text="天气缓存刷新频率。"),
                ConnectorFieldSpec(key="notes", label="Notes", field_type=ConnectorFieldType.TEXT, placeholder="forecast rules", help_text="记录风速、降水等阈值。"),
            ],
        ),
    ]
