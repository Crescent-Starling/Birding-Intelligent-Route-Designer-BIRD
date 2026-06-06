export type SourceType =
  | "wechat"
  | "xiaohongshu"
  | "ebird"
  | "birdreport"
  | "atlas"
  | "search"
  | "map"
  | "weather"
  | "manual";

export type Recommendation =
  | "GO"
  | "GO_WITH_RISK"
  | "SKIP"
  | "SAVE_FOR_FUTURE_TRIP";

export type ConnectorMode = "automatic" | "assisted" | "manual_fallback";

export interface GeoPoint {
  lat: number;
  lon: number;
  label?: string;
}

export interface ObservationSignal {
  id: string;
  sourceType: SourceType;
  sourceLabel: string;
  sourceUrl?: string;
  capturedAt: string;
  observedAt?: string;
  geoPoint?: GeoPoint;
  rawText: string;
  mediaRefs: string[];
  extractedSpecies: string[];
  confidence: number;
  extractedFields: Record<string, string | number | boolean>;
}

export interface BirdAlert {
  birdId: string;
  speciesName: string;
  rarityLevel: string;
  isLifer: boolean;
  region: string;
  detectedAt: string;
  triggerReason: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  homeCity: string;
  departureHub: string;
  budgetBand: string;
  staminaLevel: string;
  maxWalkingKm: number;
  transportPreferences: string[];
  scheduleConstraints: string[];
  targetSpecies: string[];
  lifeList: string[];
}

export interface SpeciesKnowledge {
  speciesName: string;
  distribution: string[];
  migrationWindow: string;
  habitat: string;
  identificationNotes: string[];
  rarityContext: string;
  alternativeHotspots: string[];
}

export interface BirdingEvent {
  eventId: string;
  species: string;
  location: string;
  activeWindow: string;
  status: string;
  latestPosition: string;
  confidence: number;
  rarityLevel: string;
  recentSignals: ObservationSignal[];
  knowledge: SpeciesKnowledge;
}

export interface DecisionDimension {
  key: string;
  label: string;
  score: number;
  summary: string;
}

export interface DecisionReport {
  recommendation: Recommendation;
  score: number;
  confidence: number;
  rationale: string[];
  risks: string[];
  opportunityCost: string;
  alternatives: string[];
  dimensions: DecisionDimension[];
  evidenceIds: string[];
  generatedByVersion: string;
}

export interface RouteStep {
  title: string;
  detail: string;
  eta: string;
}

export interface RoutePlan {
  candidateDate: string;
  departTime: string;
  duration: string;
  walkingDistanceKm: number;
  transfers: number;
  weatherSummary: string;
  supplies: string[];
  cautions: string[];
  routeSteps: RouteStep[];
}

export interface FutureDestinationItem {
  species: string;
  destination: string;
  bestSeason: string;
  expectedValue: string;
  notes: string;
}

export interface TripLog {
  id: string;
  species: string;
  location: string;
  outcome: string;
  notes: string;
  reflections: string[];
  loggedAt: string;
}

export interface ConnectorStatus {
  sourceName: string;
  mode: ConnectorMode;
  status: "healthy" | "limited" | "planned";
  note: string;
}

export type ConnectorFieldType = "text" | "password" | "number" | "boolean" | "select";

export interface ConnectorFieldSpec {
  key: string;
  label: string;
  fieldType: ConnectorFieldType;
  placeholder?: string;
  helpText: string;
  options?: string[];
  required?: boolean;
  sensitive?: boolean;
}

export interface ConnectorConfig {
  sourceName: string;
  mode: ConnectorMode;
  enabled: boolean;
  status: "healthy" | "limited" | "planned";
  provider: string;
  baseUrl?: string;
  regionCode?: string;
  pollingMinutes?: number;
  apiKey?: string;
  cookie?: string;
  userAgent?: string;
  notes?: string;
  apiKeyConfigured?: boolean;
  cookieConfigured?: boolean;
  fields: ConnectorFieldSpec[];
}

export interface ConnectorConfigUpdate {
  enabled?: boolean;
  provider?: string;
  baseUrl?: string;
  regionCode?: string;
  pollingMinutes?: number;
  apiKey?: string;
  cookie?: string;
  userAgent?: string;
  notes?: string;
}

export interface WorkbenchSnapshot {
  generatedAt: string;
  releaseChannel: string;
  profile: UserProfile;
  alerts: BirdAlert[];
  featuredEvent: BirdingEvent;
  decision: DecisionReport;
  routePlan: RoutePlan;
  futureDestinations: FutureDestinationItem[];
  archive: TripLog[];
  connectors: ConnectorStatus[];
}

export const mockDashboard: WorkbenchSnapshot = {
  generatedAt: "2026-04-24T13:30:00+08:00",
  releaseChannel: "v0.1-prototype",
  profile: {
    id: "user-sample-001",
    displayName: "Sample Birder",
    homeCity: "Shanghai",
    departureHub: "Shanghai City Center",
    budgetBand: "student-flex",
    staminaLevel: "medium",
    maxWalkingKm: 8,
    transportPreferences: ["metro", "bus", "rideshare"],
    scheduleConstraints: ["exam_next_week", "prefer_same_day_return"],
    targetSpecies: ["白斑军舰鸟", "黑脸琵鹭", "仙八色鸫"],
    lifeList: ["黑卷尾", "白腹蓝鹟", "栗喉蜂虎"]
  },
  alerts: [
    {
      birdId: "fregata-001",
      speciesName: "白斑军舰鸟",
      rarityLevel: "Shanghai mega",
      isLifer: true,
      region: "崇明东滩",
      detectedAt: "2026-04-24T06:12:00+08:00",
      triggerReason: "近期群聊与小红书同时出现新种级鸟讯，且不在你的 life list 中。"
    },
    {
      birdId: "platalea-002",
      speciesName: "黑脸琵鹭",
      rarityLevel: "Target species",
      isLifer: true,
      region: "杭州湾湿地",
      detectedAt: "2026-04-23T17:45:00+08:00",
      triggerReason: "未来一周有稳定记录，但即时价值低于白斑军舰鸟。"
    }
  ],
  featuredEvent: {
    eventId: "event-white-spotted-frigatebird",
    species: "白斑军舰鸟",
    location: "上海崇明东滩北侧海塘",
    activeWindow: "06:00-09:00",
    status: "active_with_mobility_risk",
    latestPosition: "北侧海塘补给点以东 1.7 km",
    confidence: 0.82,
    rarityLevel: "Shanghai mega",
    recentSignals: [
      {
        id: "sig-wechat-001",
        sourceType: "wechat",
        sourceLabel: "微信群聊",
        capturedAt: "2026-04-24T06:20:00+08:00",
        observedAt: "2026-04-24T06:15:00+08:00",
        geoPoint: { lat: 31.5603, lon: 121.9581, label: "崇明东滩北海塘" },
        rawText: "军舰鸟还在，今天早上 6 点后活跃，海塘东边飞得更近。",
        mediaRefs: [],
        extractedSpecies: ["白斑军舰鸟"],
        confidence: 0.9,
        extractedFields: {
          activeWindow: "06:00-09:00",
          stillPresent: true,
          walkingDistanceKm: 1.7
        }
      },
      {
        id: "sig-xhs-001",
        sourceType: "xiaohongshu",
        sourceLabel: "小红书",
        sourceUrl: "https://www.xiaohongshu.com/explore/sample",
        capturedAt: "2026-04-24T07:05:00+08:00",
        observedAt: "2026-04-23T08:10:00+08:00",
        geoPoint: { lat: 31.5598, lon: 121.9551, label: "东滩观景堤" },
        rawText: "公交能到，但最后需要走很久，建议带水和遮阳。",
        mediaRefs: ["xhs://cover/fregata"],
        extractedSpecies: ["白斑军舰鸟"],
        confidence: 0.73,
        extractedFields: {
          terrain: "sea-dike",
          suppliesNeeded: true,
          walkingDistanceKm: 7.5
        }
      },
      {
        id: "sig-ebird-001",
        sourceType: "ebird",
        sourceLabel: "eBird",
        sourceUrl: "https://ebird.org/checklist/sample",
        capturedAt: "2026-04-24T09:00:00+08:00",
        observedAt: "2026-04-23T07:42:00+08:00",
        rawText: "Observed offshore over tidal flat with gull flock.",
        mediaRefs: [],
        extractedSpecies: ["White-spotted Frigatebird"],
        confidence: 0.78,
        extractedFields: {
          supportingSpecies: "燕鸥, 海鸥",
          globalRaritySignal: "strong"
        }
      }
    ],
    knowledge: {
      speciesName: "白斑军舰鸟",
      distribution: ["印度洋", "东南亚海域", "印尼外海"],
      migrationWindow: "华东内陆或近海为极偶发迷鸟",
      habitat: "热带海域上空、近海岛屿、潮间带外缘",
      identificationNotes: ["长尾深叉", "翼下浅色斑", "雌鸟白腹明显"],
      rarityContext: "上海级别 mega，未来本地稳定再见概率极低。",
      alternativeHotspots: ["雅加达外海", "巽他海峡", "巴厘海峡"]
    }
  },
  decision: {
    recommendation: "GO_WITH_RISK",
    score: 73,
    confidence: 0.8,
    rationale: [
      "这是明显的 lifer 级别事件，本地再次覆盖概率极低。",
      "多源证据显示该鸟仍在，且早晨窗口相对稳定。",
      "交通和步行成本较高，但仍在你的可承受上限内。"
    ],
    risks: [
      "单程约 4 小时，末段步行 7-8 km 会压缩体力和复习时间。",
      "如果天气转差或鸟位移动，现场收益可能快速下降。"
    ],
    opportunityCost: "如果不去，未来更高概率在印尼海上旅行中看到，但成本、时间和安全性仍然未知。",
    alternatives: [
      "选择天气更稳定的工作日清晨",
      "与其他观鸟者拼车降低步行与时间成本",
      "若两天内鸟讯消退，则转存到未来目的地仓库"
    ],
    dimensions: [
      { key: "rarity", label: "罕见度与 life list 价值", score: 95, summary: "上海 mega 且为新种。" },
      { key: "freshness", label: "近期记录强度", score: 82, summary: "今早仍有多源鸟讯。" },
      { key: "travel", label: "交通与步行成本", score: 48, summary: "单程耗时长，末段步行重。" },
      { key: "schedule", label: "日程冲突", score: 44, summary: "下周考试带来机会成本。" },
      { key: "future", label: "未来替代观看机会", score: 63, summary: "印尼旅行更稳，但不一定近期成行。" }
    ],
    evidenceIds: ["sig-wechat-001", "sig-xhs-001", "sig-ebird-001"],
    generatedByVersion: "decision_rules:v0.1"
  },
  routePlan: {
    candidateDate: "2026-04-26",
    departTime: "04:55",
    duration: "约 11 小时往返",
    walkingDistanceKm: 7.6,
    transfers: 3,
    weatherSummary: "多云转晴，东北风 3 级，体感偏凉",
    supplies: ["2L 水", "轻食", "遮阳帽", "充电宝", "望远镜", "离线地图"],
    cautions: [
      "海塘补给少，尽量一次带齐。",
      "若 08:30 前仍无有效更新，考虑提前止损返程。"
    ],
    routeSteps: [
      { title: "地铁出发", detail: "人民广场乘首班车前往上海科技馆方向换乘。", eta: "04:55" },
      { title: "城际转运", detail: "转乘前往崇明方向的早班大巴。", eta: "05:45" },
      { title: "末段接驳", detail: "到海塘入口后步行或视现场情况拼车。", eta: "08:05" },
      { title: "窗口观察", detail: "优先覆盖 06:00-09:00 记录最密集的海塘东段。", eta: "08:20" }
    ]
  },
  futureDestinations: [
    {
      species: "白斑军舰鸟",
      destination: "雅加达外海",
      bestSeason: "4-9 月海上观鸟季",
      expectedValue: "高",
      notes: "可一并覆盖多种军舰鸟，但需要补充预算与安全评估。"
    },
    {
      species: "圣鹮",
      destination: "埃及尼罗河流域",
      bestSeason: "10-3 月",
      expectedValue: "中高",
      notes: "适合整合到后续 Trip Mode。"
    }
  ],
  archive: [
    {
      id: "triplog-001",
      species: "黄嘴白鹭",
      location: "江苏如东",
      outcome: "seen",
      notes: "当天阴天但潮位理想，路线判断正确。",
      reflections: ["更早到达提升了近距离观察机会。"],
      loggedAt: "2026-04-01T18:30:00+08:00"
    }
  ],
  connectors: [
    { sourceName: "WeChat", mode: "assisted", status: "limited", note: "v0.1 通过文本/截图导入与解析接入。" },
    { sourceName: "Xiaohongshu", mode: "assisted", status: "limited", note: "支持链接和截图级别解析，自动抓取待后续验证。" },
    { sourceName: "eBird", mode: "automatic", status: "healthy", note: "优先用于历史与近期记录整合。" },
    { sourceName: "BirdReport", mode: "automatic", status: "healthy", note: "用于中国本地记录中心补充。" },
    { sourceName: "Maps", mode: "automatic", status: "planned", note: "当前以前端原型数据演示路线规划。" },
    { sourceName: "Weather", mode: "automatic", status: "planned", note: "当前以规则占位，等待真实 provider。" }
  ]
};

export const mockConnectorConfigs: ConnectorConfig[] = [
  {
    sourceName: "eBird",
    mode: "automatic",
    enabled: true,
    status: "healthy",
    provider: "ebird-public-api",
    baseUrl: "https://api.ebird.org/v2",
    regionCode: "CN-SH",
    pollingMinutes: 15,
    apiKey: "",
    notes: "优先配置地区代码与 key，用于近期记录和热点拉取。",
    fields: [
      { key: "enabled", label: "Enable connector", fieldType: "boolean", helpText: "打开后允许 BIRD 自动拉取 eBird 数据。" },
      { key: "provider", label: "Provider", fieldType: "select", helpText: "v0.1 仅内置一个 provider。", options: ["ebird-public-api"], required: true },
      { key: "baseUrl", label: "Base URL", fieldType: "text", placeholder: "https://api.ebird.org/v2", helpText: "eBird API 基础地址。", required: true },
      { key: "apiKey", label: "API Key", fieldType: "password", placeholder: "ebird-api-key", helpText: "用于真实 API 请求。", sensitive: true },
      { key: "regionCode", label: "Region Code", fieldType: "text", placeholder: "CN-SH", helpText: "如上海可填写 CN-SH。" },
      { key: "pollingMinutes", label: "Polling Minutes", fieldType: "number", helpText: "拉取频率，建议先从 15 分钟开始。" },
      { key: "notes", label: "Notes", fieldType: "text", placeholder: "internal notes", helpText: "补充接入说明或限制。" }
    ]
  },
  {
    sourceName: "BirdReport",
    mode: "automatic",
    enabled: true,
    status: "healthy",
    provider: "birdreport-web",
    baseUrl: "https://www.birdreport.cn",
    regionCode: "上海",
    pollingMinutes: 20,
    notes: "先按地区与时间窗口抓取近期记录。",
    fields: [
      { key: "enabled", label: "Enable connector", fieldType: "boolean", helpText: "允许自动使用中国观鸟记录中心数据。" },
      { key: "provider", label: "Provider", fieldType: "select", helpText: "当前以 Web connector 为主。", options: ["birdreport-web"], required: true },
      { key: "baseUrl", label: "Base URL", fieldType: "text", placeholder: "https://www.birdreport.cn", helpText: "记录中心入口地址。" },
      { key: "regionCode", label: "Region / Province", fieldType: "text", placeholder: "上海", helpText: "可用于缩小抓取范围。" },
      { key: "pollingMinutes", label: "Polling Minutes", fieldType: "number", helpText: "自动同步间隔。" },
      { key: "notes", label: "Notes", fieldType: "text", placeholder: "selector or parsing notes", helpText: "解析规则、字段映射或人工备注。" }
    ]
  },
  {
    sourceName: "WeChat",
    mode: "assisted",
    enabled: false,
    status: "limited",
    provider: "assisted-import",
    userAgent: "",
    cookie: "",
    notes: "v0.1 建议以文本/截图导入为主。",
    fields: [
      { key: "enabled", label: "Enable connector", fieldType: "boolean", helpText: "启用后在系统中开放辅助导入入口。" },
      { key: "provider", label: "Provider", fieldType: "select", helpText: "当前不做全自动抓取。", options: ["assisted-import", "manual-fallback"], required: true },
      { key: "userAgent", label: "User Agent", fieldType: "text", placeholder: "browser user agent", helpText: "仅在需要模拟浏览器请求时填写。" },
      { key: "cookie", label: "Cookie / Session", fieldType: "password", placeholder: "session cookie", helpText: "如未来接内部网页视图时使用。", sensitive: true },
      { key: "notes", label: "Notes", fieldType: "text", placeholder: "group import notes", helpText: "记录群来源、导入方式和人工审核要求。" }
    ]
  },
  {
    sourceName: "Xiaohongshu",
    mode: "assisted",
    enabled: false,
    status: "limited",
    provider: "assisted-import",
    userAgent: "",
    cookie: "",
    notes: "建议先做链接/截图/文本解析。",
    fields: [
      { key: "enabled", label: "Enable connector", fieldType: "boolean", helpText: "启用后允许事件页从小红书导入素材。" },
      { key: "provider", label: "Provider", fieldType: "select", helpText: "当前默认半自动。", options: ["assisted-import", "manual-fallback"], required: true },
      { key: "userAgent", label: "User Agent", fieldType: "text", placeholder: "browser user agent", helpText: "部分网页模式下可作为实验参数。" },
      { key: "cookie", label: "Cookie / Session", fieldType: "password", placeholder: "session cookie", helpText: "若后续做登录态抓取可用。", sensitive: true },
      { key: "notes", label: "Notes", fieldType: "text", placeholder: "OCR and parsing rules", helpText: "写入 OCR、抽取 prompt 或人工清洗约束。" }
    ]
  },
  {
    sourceName: "Maps",
    mode: "automatic",
    enabled: false,
    status: "planned",
    provider: "amap",
    baseUrl: "https://restapi.amap.com",
    apiKey: "",
    regionCode: "Shanghai",
    notes: "地图 connector 建议先接高德，再抽象 provider。",
    fields: [
      { key: "enabled", label: "Enable connector", fieldType: "boolean", helpText: "允许规划引擎调用地图 provider。" },
      { key: "provider", label: "Provider", fieldType: "select", helpText: "优先接一个 provider 先跑通。", options: ["amap", "baidu-map"], required: true },
      { key: "baseUrl", label: "Base URL", fieldType: "text", placeholder: "https://restapi.amap.com", helpText: "地图 API 基础地址。" },
      { key: "apiKey", label: "API Key", fieldType: "password", placeholder: "map-api-key", helpText: "用于路线、逆地理编码等接口。", sensitive: true },
      { key: "regionCode", label: "Default Region", fieldType: "text", placeholder: "Shanghai", helpText: "用作默认搜索区域。" },
      { key: "notes", label: "Notes", fieldType: "text", placeholder: "routing limitations", helpText: "记录路线模式和站点覆盖限制。" }
    ]
  },
  {
    sourceName: "Weather",
    mode: "automatic",
    enabled: false,
    status: "planned",
    provider: "open-meteo",
    baseUrl: "https://api.open-meteo.com/v1",
    pollingMinutes: 30,
    apiKey: "",
    notes: "优先使用免 key provider，后续再切商业源。",
    fields: [
      { key: "enabled", label: "Enable connector", fieldType: "boolean", helpText: "启用后允许规划引擎加入天气判断。" },
      { key: "provider", label: "Provider", fieldType: "select", helpText: "先从一个稳定 provider 起步。", options: ["open-meteo", "qweather"], required: true },
      { key: "baseUrl", label: "Base URL", fieldType: "text", placeholder: "https://api.open-meteo.com/v1", helpText: "天气接口地址。" },
      { key: "apiKey", label: "API Key", fieldType: "password", placeholder: "optional api key", helpText: "部分 provider 可为空。", sensitive: true },
      { key: "pollingMinutes", label: "Polling Minutes", fieldType: "number", helpText: "天气缓存刷新频率。" },
      { key: "notes", label: "Notes", fieldType: "text", placeholder: "forecast rules", helpText: "记录风速、降水等阈值。" }
    ]
  }
];
