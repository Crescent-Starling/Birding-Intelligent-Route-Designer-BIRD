import Link from "next/link";

import { AlertCard, DecisionCard, WorkbenchHero } from "../../components/dashboard";
import { Chip } from "../../components/primitives";
import { Shell } from "../../components/shell";
import { getDashboard } from "../../lib/api";

export default async function AlertsPage() {
  const dashboard = await getDashboard();

  return (
    <Shell activePath="/alerts">
      <div className="page-header">
        <div>
          <p className="eyebrow">Alerting</p>
          <h2>Twitch Alerts</h2>
        </div>
        <Chip tone="danger">{dashboard.alerts.length} active cases</Chip>
      </div>
      <WorkbenchHero decision={dashboard.decision} event={dashboard.featuredEvent} />
      <div className="dashboard-grid">
        <AlertCard alerts={dashboard.alerts} />
        <section className="section-stack">
          <DecisionCard decision={dashboard.decision} />
          <section className="card">
            <div className="card-title">
              <div>
                <p className="eyebrow">Featured Event</p>
                <h3>{dashboard.featuredEvent.species}</h3>
              </div>
              <Link href={`/events/${dashboard.featuredEvent.eventId}`}>
                <Chip tone="accent">Open event</Chip>
              </Link>
            </div>
            <p>{dashboard.featuredEvent.location}</p>
            <div className="chip-row">
              <Chip tone="warning">Latest position: {dashboard.featuredEvent.latestPosition}</Chip>
              <Chip tone="muted">Window: {dashboard.featuredEvent.activeWindow}</Chip>
            </div>
          </section>
        </section>
      </div>
    </Shell>
  );
}

