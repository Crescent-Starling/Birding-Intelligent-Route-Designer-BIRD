# BIRD PRD

## Product Statement

`BIRD (Birding Intelligent Route Designer)` is a multi-timescale decision and planning system for birders.

BIRD is one product with two long-term operating modes:

- `Twitch`: short-horizon rare-bird chasing and near-term decision support
- `Travel`: long-horizon global birding coverage and long-distance trip planning

The first implemented mode is `Twitch`, optimized for rare-bird chasing in China with support for global reference data.

## Target User

- Individual birders with an active `life list`
- Users who regularly make `go / skip / save for future trip` decisions
- Users who need structured reasoning instead of raw birding chatter
- Advanced birders who want to plan lifetime-scale coverage of species, regions, or target clades

## Core Loop

1. Detect or ingest a rare-bird event
2. Aggregate evidence from social, record centers, knowledge sources, maps, and weather
3. Produce a recommendation with confidence, rationale, and risk notes
4. Turn a positive decision into a practical route plan
5. Archive the outcome and learn from it

## Product Modes

### Twitch

- Core question: `Should I go for this bird now?`
- Time horizon: hours to days
- Primary objective: maximize near-term success while controlling time, travel, and schedule costs
- Typical outputs:
  - `GO / GO_WITH_RISK / SKIP / SAVE_FOR_FUTURE_TRIP`
  - same-day or short-horizon logistics
  - evidence-backed explanations

### Travel

- Core question: `How should I plan future birding travel to see the most birds that matter to me?`
- Time horizon: months to years
- Primary objective: maximize species or clade coverage subject to budget, seasonality, travel time, and user preference constraints
- Typical outputs:
  - regional or global birding maps
  - best-season planning windows
  - multi-stop trip candidates
  - personalized long-distance coverage plans

## Mode Interaction

`Twitch` and `Travel` are two interacting modes of the same product, not separate tools.

- `Twitch -> Travel`
  - events that are skipped, missed, or intentionally deferred should become future planning inputs
  - archived outcomes and field notes should improve long-horizon destination judgment
  - repeated evidence around sites, seasons, and logistics should accumulate reusable planning knowledge
- `Travel -> Twitch`
  - long-horizon priorities should affect short-horizon alert ranking
  - destination watchlists and target species plans should influence whether a new bird signal is considered high value
  - seasonal strategy should help decide when a near-term opportunity is worth chasing versus saving for a better future trip

## Ten Thousand Birds Plan

`Ten Thousand Birds Plan` (`万鸟计划`) is not a separate product. It is the foundational infrastructure layer for `Travel`.

Internally, it should be treated as:

- a global birding atlas
- a coverage engine
- a cost-and-seasonality planning substrate

Externally, it can act as BIRD's flagship narrative and growth hook:

- a world map of high-value birding sites
- a way to show users what it would take to see `95%+` of extant birds or `10,000+` species
- a personalized planning surface where users can generate their own version of a lifetime birding plan

This dual role is intentional:

- `inside the product`: infrastructure for Travel
- `outside the product`: an aspirational, shareable entry point that communicates BIRD's long-term vision

## Travel Foundation

The first conceptual layer of `Travel` is a global coverage atlas built from leading birding sites worldwide. The initial design target is `top 1000` sites, but this number should remain adjustable if needed to cover `95%+` of extant bird species.

Each site should eventually support:

- representative or high-yield species coverage
- best birding months or finer seasonal windows
- cost and access difficulty proxies
- geography and trip-combination potential
- contribution to a user's missing-species coverage

The atlas must support two planning directions:

- `coverage-first`: see as much of the world's avifauna as possible at the lowest cost or shortest time
- `interest-first`: optimize for specific taxonomic groups, regions, rarity goals, or user-defined preferences

## v0.1 Scope

- Single mode: `Twitch`
- Single primary sample event: `白斑军舰鸟`
- Rule-based decision engine
- Mockable connectors with backend-first contracts
- Web workbench with a professional, map-centric layout

## v0.2+ Direction

- eBird life list import
- Assisted ingestion for WeChat and Xiaohongshu screenshots or pasted text
- More events and user profiles
- Real async jobs, alerts, and email
- `Travel` built on the same evidence, mapping, and decision layers
- `Ten Thousand Birds Plan` as the atlas and optimization foundation for Travel
- A dedicated `Travel / World Planning` specification in [WORLD_MODE_PRD.md](WORLD_MODE_PRD.md)

## Travel Roadmap

### Phase 1: Atlas

- Build a global birding-site atlas with coarse seasonal and cost metadata
- Visualize the atlas on a world map
- Support filtering by region, month, and target coverage value

### Phase 2: Coverage

- Estimate how many unseen species each site or region contributes for a given user
- Rank sites by personal marginal value rather than public popularity alone

### Phase 3: Planning

- Generate regional or intercontinental trip candidates
- Optimize for cost, time, season, and coverage gain

### Phase 4: Lifetime Planning

- Support `see 95%+ of extant birds` or `10,000+ species` style planning goals
- Support custom clade-oriented plans such as seabirds, pittas, hornbills, or hummingbirds

## Design Principles

- Decision before itinerary
- Evidence before recommendation
- Explainability before black-box optimization
- Automatic where stable, assisted where platform constraints exist
- Professional tool feel over travel-marketing presentation
- One product, multiple time horizons
- Infrastructure can double as product narrative when it increases clarity and user motivation
