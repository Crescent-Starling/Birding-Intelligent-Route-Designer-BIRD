import {
  AlertCard,
  ArchiveCard,
  ConnectorStatusCard,
  DecisionCard,
  EvidenceCard,
  FutureDestinationsCard,
  ProfileCard,
  RouteCard,
  WorkbenchHero
} from "../components/dashboard";
import { Shell } from "../components/shell";
import { getDashboard } from "../lib/api";

export default async function HomePage() {
  const dashboard = await getDashboard();

  return (
    <Shell activePath="/">
      <WorkbenchHero decision={dashboard.decision} event={dashboard.featuredEvent} />
      <div className="dashboard-grid">
        <div className="section-stack">
          <AlertCard alerts={dashboard.alerts} />
          <DecisionCard decision={dashboard.decision} />
          <EvidenceCard event={dashboard.featuredEvent} />
        </div>
        <div className="section-stack">
          <RouteCard routePlan={dashboard.routePlan} />
          <ProfileCard profile={dashboard.profile} />
          <FutureDestinationsCard items={dashboard.futureDestinations} />
          <ConnectorStatusCard connectors={dashboard.connectors} />
          <ArchiveCard items={dashboard.archive} />
        </div>
      </div>
    </Shell>
  );
}

