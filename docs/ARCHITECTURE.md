# BIRD Architecture

## Runtime Shape

BIRD is currently implemented as a `modular monolith` with explicit seams for later service extraction.

- `apps/api`: API layer, domain models, agent orchestration, rule engine, connector stubs
- `apps/web`: operator-facing workbench
- `packages/shared`: frontend-facing contracts and mock fixtures

The current codebase implements `Twitch`, but the product architecture should support two long-term modes on the same foundation:

- `Twitch`: event-driven short-horizon decisions
- `Travel`: atlas-driven long-horizon global planning

## Core Modules

### API

- `app/domain/models.py`: canonical backend data models
- `app/services/connectors.py`: connector registry and assisted-ingest parser
- `app/services/decision_engine.py`: rule-based scoring
- `app/services/planning.py`: route planning synthesis
- `app/services/orchestrator.py`: workbench snapshot assembly

Future `Travel` modules should be added alongside these primitives rather than as a separate stack:

- `world_atlas`: global birding-site catalog, seasonality, and access metadata
- `coverage_engine`: marginal species gain, clade coverage, and user-specific value ranking
- `world_planner`: multi-stop itinerary generation and cost/time optimization
- `world_map_service`: map tile overlays, heat layers, and month-based visualization

### Frontend

- `app/alerts/page.tsx`: decision workbench
- `app/events/[id]/page.tsx`: single-event deep dive
- `app/future-destinations/page.tsx`: saved future trips
- `app/profile/page.tsx`: user constraints and life-list profile
- `app/archive/page.tsx`: review and reflection history

The future frontend split should remain mode-based, not product-based:

- `Twitch` workbench for alerts, events, and near-term logistics
- `Travel` workbench for atlas exploration, seasonal maps, and long-horizon coverage planning

These two mode surfaces should exchange state rather than operate as silos:

- `Twitch -> Travel`: deferred targets, archived outcomes, and accumulated site evidence
- `Travel -> Twitch`: target rankings, seasonal priorities, and destination watchlists

## Agent Mapping

The v0.1 code models the agent system as service modules:

- `Alert Agent`: alert generation from profile + event mismatch
- `Evidence Agent`: source ingestion and normalization
- `Knowledge Agent`: species background and alternative hotspots
- `Decision Agent`: recommendation scoring and explanation
- `Planning Agent`: day-of logistics synthesis
- `Archive Agent`: post-trip memory and reuse

Future `Travel` agent additions should include:

- `Atlas Agent`: curates and scores high-value birding sites globally
- `Coverage Agent`: estimates species or clade coverage gain by site, season, and trip bundle
- `World Planning Agent`: generates personalized multi-stop itineraries under cost and time constraints

`Ten Thousand Birds Plan` should be treated as the data and optimization substrate used by `Atlas Agent`, `Coverage Agent`, and `World Planning Agent`.

Detailed product and implementation notes for this layer live in [WORLD_MODE_PRD.md](WORLD_MODE_PRD.md).
The first schema draft for this layer lives in [FLYWAY_ATLAS_V1_SCHEMA.md](FLYWAY_ATLAS_V1_SCHEMA.md).

## Data Flow

1. A connector produces `ObservationSignal`
2. Signals attach to a `BirdingEvent`
3. Knowledge and user profile context enrich the event
4. The decision engine emits a `DecisionReport`
5. The planning service emits a `RoutePlan`
6. The orchestrator returns a `WorkbenchSnapshot`

For `Travel`, the analogous flow should be:

1. Global site sources and species-distribution datasets feed a `World Atlas`
2. Seasonal, geographic, and cost metadata attach to each candidate site
3. User profile, life list, and target interests feed a `Coverage Engine`
4. The planner emits ranked site sets, seasonal map layers, and route candidates
5. The world orchestrator returns a personalized `Travel` planning snapshot

The long-term target architecture should also include an explicit cross-mode loop:

1. `Twitch` produces decisions, route outcomes, archive entries, and deferred-target candidates
2. Deferred targets and archived evidence update `Travel` priorities and atlas-linked user state
3. `Travel` produces seasonal plans, destination watchlists, and target rankings
4. Those priorities feed back into `Twitch` alert ranking and opportunity evaluation

## Ten Thousand Birds Plan as Infrastructure

`Ten Thousand Birds Plan` (`万鸟计划`) should be modeled as infrastructure, not as a standalone user-facing subsystem.

It should provide:

- a world-scale birding site atlas
- a species-to-site and season-to-site coverage layer
- rough travel cost and access layers
- optimization support for `lowest cost`, `shortest time`, and `highest personal coverage` planning

Its public visibility may be high, but architecturally it should remain a shared foundation for `Travel` and a reusable intelligence layer for `Twitch`.

## Dependency Baseline

These dependency baselines were chosen using official package indexes on April 24, 2026:

- FastAPI `0.121.x` via PyPI
- Pydantic `2.13.x` via PyPI
- Uvicorn `0.43.x` via PyPI
- Next.js `15.5.2` via npm
- React `19.1.1` via npm
- TypeScript `5.9.2` via npm

## Extraction Path

If the system grows, extract in this order:

1. Connector workers
2. Alerting jobs
3. Retrieval and knowledge indexing
4. Planning and routing providers
5. World atlas ingestion and coverage optimization services
