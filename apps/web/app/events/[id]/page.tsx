import { notFound } from "next/navigation";

import { ConnectorStatusCard, DecisionCard, EvidenceCard, RouteCard } from "../../../components/dashboard";
import { Chip } from "../../../components/primitives";
import { Shell } from "../../../components/shell";
import { getDashboard, getEvent } from "../../../lib/api";

export default async function EventPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  const dashboard = await getDashboard();

  if (!event) {
    notFound();
  }

  return (
    <Shell activePath="/alerts">
      <div className="page-header">
        <div>
          <p className="eyebrow">Event Detail</p>
          <h2>{event.species}</h2>
        </div>
        <Chip tone="warning">{event.rarityLevel}</Chip>
      </div>
      <div className="detail-grid">
        <div className="section-stack">
          <section className="card">
            <div className="card-title">
              <div>
                <p className="eyebrow">Latest Known State</p>
                <h3>{event.location}</h3>
              </div>
              <Chip tone="accent">{event.activeWindow}</Chip>
            </div>
            <p>{event.latestPosition}</p>
            <div className="chip-row">
              <Chip tone="muted">{event.status}</Chip>
              <Chip tone="accent">Confidence {Math.round(event.confidence * 100)}%</Chip>
            </div>
          </section>
          <DecisionCard decision={dashboard.decision} />
          <EvidenceCard event={event} />
        </div>
        <div className="section-stack">
          <RouteCard routePlan={dashboard.routePlan} />
          <section className="card">
            <div className="card-title">
              <div>
                <p className="eyebrow">Knowledge</p>
                <h3>Species context</h3>
              </div>
            </div>
            <div className="signal-list">
              <div className="compact-item">
                <strong>Distribution</strong>
                <div className="chip-row">
                  {event.knowledge.distribution.map((entry) => (
                    <Chip key={entry} tone="muted">
                      {entry}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className="compact-item">
                <strong>Alternative Hotspots</strong>
                <div className="chip-row">
                  {event.knowledge.alternativeHotspots.map((entry) => (
                    <Chip key={entry} tone="accent">
                      {entry}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <ConnectorStatusCard connectors={dashboard.connectors} />
        </div>
      </div>
    </Shell>
  );
}

