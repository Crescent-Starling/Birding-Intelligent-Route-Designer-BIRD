import { FutureDestinationsCard } from "../../components/dashboard";
import { Chip } from "../../components/primitives";
import { Shell } from "../../components/shell";
import { getFutureDestinations } from "../../lib/api";

export default async function FutureDestinationsPage() {
  const items = await getFutureDestinations();

  return (
    <Shell activePath="/future-destinations">
      <div className="page-header">
        <div>
          <p className="eyebrow">Deferred Decisions</p>
          <h2>Future Destinations</h2>
        </div>
        <Chip tone="accent">{items.length} saved opportunities</Chip>
      </div>
      <div className="list-grid">
        <FutureDestinationsCard items={items} />
        <section className="card">
          <div className="card-title">
            <div>
              <p className="eyebrow">Why This Exists</p>
              <h3>Save, do not lose</h3>
            </div>
          </div>
          <div className="signal-list">
            <div className="compact-item">
              <strong>Use case</strong>
              <p>
                When immediate twitching is too expensive or too fragile, BIRD stores the bird,
                place, and season for later trip planning.
              </p>
            </div>
            <div className="compact-item">
              <strong>Next step</strong>
              <p>
                These entries become seed objects for the future `World Mode`, where the system
                bundles species, seasons, and routes into longer birding itineraries.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
