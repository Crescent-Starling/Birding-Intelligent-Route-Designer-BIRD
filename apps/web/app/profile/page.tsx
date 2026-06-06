import { ConnectorStatusCard, ProfileCard } from "../../components/dashboard";
import { Chip } from "../../components/primitives";
import { Shell } from "../../components/shell";
import { getConnectors, getProfile } from "../../lib/api";

export default async function ProfilePage() {
  const profile = await getProfile();
  const connectors = await getConnectors();

  return (
    <Shell activePath="/profile">
      <div className="page-header">
        <div>
          <p className="eyebrow">User Model</p>
          <h2>Profile & Constraints</h2>
        </div>
        <Chip tone="muted">{profile.lifeList.length} species in life list</Chip>
      </div>
      <div className="dashboard-grid">
        <ProfileCard profile={profile} />
        <ConnectorStatusCard connectors={connectors} />
      </div>
    </Shell>
  );
}

