import {
  type BirdAlert,
  type BirdingEvent,
  type DecisionReport,
  type FutureDestinationItem,
  type RoutePlan,
  type TripLog,
  type UserProfile,
  type WorkbenchSnapshot
} from "@bird/shared";

import { Chip, formatConfidence, RecommendationTone, ScoreBar } from "./primitives";

export function WorkbenchHero({
  decision,
  event
}: {
  decision: DecisionReport;
  event: BirdingEvent;
}) {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div>
          <p className="eyebrow">Decision-first Agent workbench</p>
          <h2>Should you twitch this bird right now?</h2>
          <p className="muted">
            BIRD fuses social sightings, record centers, species knowledge, logistics, and
            personal constraints into one decision surface.
          </p>
        </div>
        <div className="card">
          <div className="card-title">
            <div>
              <p className="eyebrow">Featured Event</p>
              <h3>{event.species}</h3>
            </div>
            <Chip tone={RecommendationTone(decision.recommendation)}>
              {decision.recommendation.replaceAll("_", " ")}
            </Chip>
          </div>
          <p className="card-subtitle">{event.location}</p>
          <div className="metric-row">
            <div className="metric">
              <span className="muted">Decision Score</span>
              <strong>{decision.score}</strong>
            </div>
            <div className="metric">
              <span className="muted">Evidence Confidence</span>
              <strong>{formatConfidence(decision.confidence)}</strong>
            </div>
            <div className="metric">
              <span className="muted">Active Window</span>
              <strong>{event.activeWindow}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AlertCard({ alerts }: { alerts: BirdAlert[] }) {
  return (
    <section className="card">
      <div className="card-title">
        <div>
          <p className="eyebrow">Alerts</p>
          <h3>待推预警</h3>
        </div>
        <Chip tone="danger">{alerts.length} active</Chip>
      </div>
      <div className="signal-list">
        {alerts.map((alert) => (
          <article key={alert.birdId} className="signal-item">
            <div className="card-title">
              <div>
                <h4>{alert.speciesName}</h4>
                <p className="card-subtitle">{alert.region}</p>
              </div>
              <Chip tone={alert.isLifer ? "accent" : "muted"}>
                {alert.isLifer ? "lifer" : "known"}
              </Chip>
            </div>
            <p>{alert.triggerReason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DecisionCard({
  decision
}: {
  decision: DecisionReport;
}) {
  return (
    <section className="card">
      <div className="card-title">
        <div>
          <p className="eyebrow">Decision</p>
          <h3>是否值得推</h3>
        </div>
        <Chip tone={RecommendationTone(decision.recommendation)}>
          {decision.recommendation.replaceAll("_", " ")}
        </Chip>
      </div>
      <div className="section-stack">
        <div className="chip-row">
          {decision.rationale.map((item) => (
            <Chip key={item} tone="accent">
              {item}
            </Chip>
          ))}
        </div>
        <div className="signal-list">
          {decision.dimensions.map((dimension) => (
            <div className="compact-item" key={dimension.key}>
              <div className="card-title">
                <strong>{dimension.label}</strong>
                <span>{dimension.score}</span>
              </div>
              <ScoreBar score={dimension.score} />
              <p className="muted">{dimension.summary}</p>
            </div>
          ))}
        </div>
        <div className="compact-item">
          <strong>Opportunity Cost</strong>
          <p>{decision.opportunityCost}</p>
        </div>
        <div className="compact-item">
          <strong>Primary Risks</strong>
          <ul>
            {decision.risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function EvidenceCard({ event }: { event: BirdingEvent }) {
  return (
    <section className="card">
      <div className="card-title">
        <div>
          <p className="eyebrow">Evidence</p>
          <h3>证据流与时间线</h3>
        </div>
        <Chip tone="muted">{event.recentSignals.length} signals</Chip>
      </div>
      <div className="timeline">
        {event.recentSignals.map((signal) => (
          <article className="timeline-item" key={signal.id}>
            <div className="card-title">
              <div>
                <strong>{signal.sourceLabel}</strong>
                <p className="card-subtitle">{signal.capturedAt}</p>
              </div>
              <Chip tone={signal.confidence > 0.8 ? "accent" : "warning"}>
                {formatConfidence(signal.confidence)}
              </Chip>
            </div>
            <p>{signal.rawText}</p>
            <div className="chip-row">
              {signal.extractedSpecies.map((species) => (
                <Chip key={species} tone="muted">
                  {species}
                </Chip>
              ))}
              {signal.extractedFields.activeWindow ? (
                <Chip tone="accent">{String(signal.extractedFields.activeWindow)}</Chip>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RouteCard({ routePlan }: { routePlan: RoutePlan }) {
  return (
    <section className="card">
      <div className="card-title">
        <div>
          <p className="eyebrow">Plan</p>
          <h3>实时路线与准备</h3>
        </div>
        <Chip tone="warning">{routePlan.duration}</Chip>
      </div>
      <div className="metric-row">
        <div className="metric">
          <span className="muted">Candidate Date</span>
          <strong>{routePlan.candidateDate}</strong>
        </div>
        <div className="metric">
          <span className="muted">Walking</span>
          <strong>{routePlan.walkingDistanceKm} km</strong>
        </div>
        <div className="metric">
          <span className="muted">Transfers</span>
          <strong>{routePlan.transfers}</strong>
        </div>
      </div>
      <div className="section-stack">
        <div className="compact-item">
          <strong>Weather</strong>
          <p>{routePlan.weatherSummary}</p>
        </div>
        <div className="compact-item">
          <strong>Supplies</strong>
          <div className="chip-row">
            {routePlan.supplies.map((item) => (
              <Chip key={item} tone="muted">
                {item}
              </Chip>
            ))}
          </div>
        </div>
        <div className="compact-item">
          <strong>Route Steps</strong>
          {routePlan.routeSteps.map((step) => (
            <div className="route-step" key={`${step.eta}-${step.title}`}>
              <strong>{step.eta}</strong>
              <div>
                <h4>{step.title}</h4>
                <p>{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProfileCard({ profile }: { profile: UserProfile }) {
  return (
    <section className="card">
      <div className="card-title">
        <div>
          <p className="eyebrow">Profile</p>
          <h3>用户约束</h3>
        </div>
        <Chip tone="muted">{profile.homeCity}</Chip>
      </div>
      <div className="signal-list">
        <div className="compact-item">
          <strong>{profile.displayName}</strong>
          <p className="muted">
            出发点 {profile.departureHub} · 预算 {profile.budgetBand} · 步行上限{" "}
            {profile.maxWalkingKm} km
          </p>
        </div>
        <div className="compact-item">
          <strong>Constraints</strong>
          <div className="chip-row">
            {profile.scheduleConstraints.map((item) => (
              <Chip key={item} tone="warning">
                {item}
              </Chip>
            ))}
          </div>
        </div>
        <div className="compact-item">
          <strong>Targets</strong>
          <div className="chip-row">
            {profile.targetSpecies.map((item) => (
              <Chip key={item} tone="accent">
                {item}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FutureDestinationsCard({
  items
}: {
  items: FutureDestinationItem[];
}) {
  return (
    <section className="card">
      <div className="card-title">
        <div>
          <p className="eyebrow">Future Trips</p>
          <h3>未来目的地仓库</h3>
        </div>
      </div>
      <div className="signal-list">
        {items.map((item) => (
          <article key={`${item.species}-${item.destination}`} className="signal-item">
            <div className="card-title">
              <div>
                <h4>{item.species}</h4>
                <p className="card-subtitle">{item.destination}</p>
              </div>
              <Chip tone="accent">{item.expectedValue}</Chip>
            </div>
            <p>{item.notes}</p>
            <small className="muted">Best season: {item.bestSeason}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ArchiveCard({ items }: { items: TripLog[] }) {
  return (
    <section className="card">
      <div className="card-title">
        <div>
          <p className="eyebrow">Archive</p>
          <h3>推后记录</h3>
        </div>
      </div>
      <div className="signal-list">
        {items.map((item) => (
          <article key={item.id} className="signal-item">
            <div className="card-title">
              <div>
                <h4>{item.species}</h4>
                <p className="card-subtitle">{item.location}</p>
              </div>
              <Chip tone={item.outcome === "seen" ? "accent" : "danger"}>{item.outcome}</Chip>
            </div>
            <p>{item.notes}</p>
            <div className="chip-row">
              {item.reflections.map((reflection) => (
                <Chip key={reflection} tone="muted">
                  {reflection}
                </Chip>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ConnectorStatusCard({
  connectors
}: {
  connectors: WorkbenchSnapshot["connectors"];
}) {
  return (
    <section className="card">
      <div className="card-title">
        <div>
          <p className="eyebrow">Connectors</p>
          <h3>信息源接入状态</h3>
        </div>
      </div>
      <div className="signal-list">
        {connectors.map((item) => (
          <article className="signal-item" key={item.sourceName}>
            <div className="card-title">
              <strong>{item.sourceName}</strong>
              <Chip
                tone={
                  item.status === "healthy"
                    ? "accent"
                    : item.status === "limited"
                      ? "warning"
                      : "muted"
                }
              >
                {item.mode}
              </Chip>
            </div>
            <p>{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

