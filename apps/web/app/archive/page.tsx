import { ArchiveCard } from "../../components/dashboard";
import { Chip } from "../../components/primitives";
import { Shell } from "../../components/shell";
import { getArchive } from "../../lib/api";

export default async function ArchivePage() {
  const archive = await getArchive();

  return (
    <Shell activePath="/archive">
      <div className="page-header">
        <div>
          <p className="eyebrow">Archive</p>
          <h2>Trip Logs & Reflections</h2>
        </div>
        <Chip tone="accent">{archive.length} logged trips</Chip>
      </div>
      <div className="list-grid">
        <ArchiveCard items={archive} />
        <section className="card">
          <div className="card-title">
            <div>
              <p className="eyebrow">Feedback Loop</p>
              <h3>Why archive matters</h3>
            </div>
          </div>
          <div className="signal-list">
            <div className="compact-item">
              <strong>Memory</strong>
              <p>
                BIRD should remember what worked, what failed, and how your field constraints
                changed so future recommendations improve.
              </p>
            </div>
            <div className="compact-item">
              <strong>Future extension</strong>
              <p>
                This page is also where photo links, eBird checklist sync, and field note exports
                will land in later versions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}

