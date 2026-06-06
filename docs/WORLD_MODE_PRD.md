# BIRD World Mode / Ten Thousand Birds Plan

## Product Role

`World Mode` is BIRD's long-horizon planning mode. It is designed for users who want to optimize future birding travel across regions, countries, or the entire world.

`Ten Thousand Birds Plan` (`万鸟计划`) is the infrastructure layer underneath World Mode:

- a global birding-site atlas
- a species-coverage engine
- a seasonality and access model
- a cost-aware route optimization substrate

Externally, `Ten Thousand Birds Plan` is also BIRD's flagship narrative:

- "How would I see 95%+ of the world's birds?"
- "What is the cheapest or fastest path to 10,000 species?"
- "How would I build my own global birding plan around seabirds / pittas / antbirds / endemics?"

## Primary User Stories

### Coverage Planner

- "I want to maximize my lifetime species count under a fixed annual budget."
- "I only have two international trips in the next three years; where should I go first?"
- "I want to reach 5,000, 7,500, or 10,000 species as efficiently as possible."

### Clade Specialist

- "I mainly care about hornbills and pittas; what regions and seasons matter most?"
- "I want a hummingbird-first South America plan."

### Atlas Explorer

- "Show me the world's most valuable birding sites for overall coverage."
- "Show me the best months for each major site."
- "Show me what I gain if I add this site to my existing life list."

## Product Outputs

World Mode should eventually produce four classes of output:

1. `Atlas View`
- global map of major birding sites
- seasonality heat or color layers
- coarse cost and difficulty overlays

2. `Coverage Insight`
- species gain from a site, route, or region
- value ranking personalized by the user's current life list
- target-clade value instead of general coverage value when requested

3. `Trip Candidate`
- recommended multi-stop route
- best months
- expected new species count
- coarse budget and trip-length estimates

4. `Lifetime Plan`
- sequence of trips over years
- cumulative coverage curve
- tradeoffs between `lowest cost`, `shortest time`, and `highest coverage`

## MVP Boundaries

World Mode should not start with a true "global optimum to see 95% of all birds." That framing is compelling for marketing, but it is too large for the first usable version.

Recommended rollout:

### MVP 1: Atlas

- build a global atlas of top birding sites
- support map browsing, filters, and best-month visualization
- include coarse cost and access difficulty fields
- support user save/favorite actions

### MVP 2: Personal Coverage Ranking

- connect the atlas to the user's life list
- estimate marginal new-species gain per site
- rank sites by personal value rather than popularity alone

### MVP 3: Regional Route Planning

- support one-trip planning across a limited geography such as:
  - Southeast Asia
  - East Africa
  - Northwest South America
- optimize for budget, duration, or target-group coverage

### MVP 4: Lifetime Strategy

- build multi-trip planning across years
- support user-defined world-coverage targets

## Data Model

World Mode should use a canonical graph-like data layer rather than ad hoc page-level JSON.

The first concrete schema draft for this layer is documented in [FLYWAY_ATLAS_V1_SCHEMA.md](FLYWAY_ATLAS_V1_SCHEMA.md).

### Core Entities

#### Species

- species ID
- taxonomy source and version
- common and scientific names
- clade tags
- endemism flags
- conservation importance flags

#### Site

- site ID
- canonical site name
- country / region / subregion
- coordinates and geometry
- habitat tags
- access difficulty
- default transport gateways
- risk notes

#### SiteSeasonWindow

- site ID
- month or finer time window
- quality score for birding in that period
- weather suitability notes
- special-event notes such as lekking, migration, pelagic windows

#### SiteSpeciesCoverage

- site ID
- species ID
- confidence score
- seasonality profile
- abundance / detectability proxy
- source provenance

#### TravelEdge

- site A -> site B
- nearest airport / port / rail gateway
- transfer time estimate
- transfer cost estimate
- visa or border complexity flags

#### CostSnapshot

- site ID or route ID
- lodging proxy
- local transport proxy
- guide cost proxy
- permit fee proxy
- update timestamp

#### UserCoverageState

- user life list
- user target clades
- budget tolerance
- max trip length
- risk tolerance
- preferred continents / languages / trip styles

## Data Acquisition Strategy

The hardest part of World Mode is not the UI. It is building and maintaining a usable world-scale atlas with enough coverage quality to support planning.

The practical strategy should be `layered`, `provenance-aware`, and `incremental`.

### Layer 1: Taxonomy Backbone

Goal:
- keep a stable species universe and clade hierarchy

Suggested inputs:
- eBird taxonomy as a practical operational backbone
- optional secondary references for reconciliation if needed later

Update cadence:
- monthly or when upstream taxonomy changes

Why:
- all later coverage and user life-list computations depend on a stable taxonomy ID space

### Layer 2: Site Atlas Seed

Goal:
- build a curated list of globally meaningful birding sites

Suggested inputs:
- hotspot sources
- well-known birding route literature
- guidebooks and curated site lists
- manual curation for the first few hundred sites

Practical recommendation:
- do not begin with "1,000 sites no matter what"
- begin with `300-500` elite sites and measure coverage gain
- expand until the coverage curve flattens enough for the chosen threshold

Why:
- a small, high-quality atlas is more useful than a noisy giant list

### Layer 3: Species Coverage by Site

Goal:
- estimate which species each site contributes, and in which season

Suggested inputs:
- eBird recent and historical signals where permitted
- personal-use accessible references and imported materials
- regional birdfinding literature
- manually curated target-species lists for iconic sites

Important rule:
- maintain a distinction between:
  - raw occurrence evidence
  - modeled site coverage
  - public UI summaries

Why:
- the system should not depend on a single source's raw representation

### Layer 4: Seasonality Layer

Goal:
- answer "when is this site good?"

Suggested structure:
- month-by-month score from `0-100`
- optional sub-window tags such as:
  - early April to mid May
  - late November pelagic peak
  - December to February dry-season access

Initial data sources:
- expert curation
- literature summaries
- aggregated observation timing patterns

Why:
- seasonal suitability is central to long-distance route quality

### Layer 5: Cost and Access Layer

Goal:
- support real-world planning, not fantasy optimization

Suggested fields:
- international access score
- domestic transfer complexity
- daily on-ground cost band
- permit / guide dependence
- safety / political / remoteness notes

Initial strategy:
- use coarse bands instead of fake precision
- for example:
  - lodging cost: `low / medium / high / extreme`
  - access: `easy / moderate / hard / expedition`

Why:
- a rough, honest model is better than a pseudo-exact but brittle one

## Data Organization and Maintenance

The world atlas should be maintained as a pipeline with three storage layers.

### 1. Raw Source Layer

Contains:
- fetched source payloads
- imported files
- snapshots
- parsing metadata

Properties:
- append-only where possible
- never treated as canonical user-facing truth

### 2. Normalized Layer

Contains:
- standardized species IDs
- canonical sites
- normalized timestamps, geographies, and month windows
- source-level confidence and provenance

Properties:
- deduplicated
- stable IDs
- source attribution preserved

### 3. Derived Planning Layer

Contains:
- site-level seasonality scores
- user-specific marginal coverage values
- route candidate scores
- optimization outputs

Properties:
- recomputable
- versioned by algorithm and source snapshot

## Update Cadence

Different data classes should update at different speeds.

### Slow-moving

- taxonomy
- site identity and geometry
- broad habitat categories
- long-term access difficulty

Update cadence:
- monthly or manual review

### Medium-moving

- seasonality windows
- coverage weights
- country-level cost bands

Update cadence:
- monthly or seasonal

### Fast-moving

- airfare-like access signals
- temporary closures
- safety notes
- weather anomalies

Update cadence:
- weekly or on-demand

### Principle

World Mode should prefer `stability` over `false real-time precision`.

Twitcher Mode is the real-time layer. World Mode is the strategic layer.

## Algorithms

World Mode needs several algorithm families, not one single "master optimizer."

### 1. Coverage Curve Construction

Problem:
- determine how many top sites are needed to cover `95%+` of species

Practical method:
- greedy set coverage over site-to-species incidence
- compute cumulative marginal gain per added site
- stop when the curve reaches threshold or marginal gain becomes negligible

Output:
- "Top N sites cover X% of the modeled species universe"

This is the right first algorithm because it is simple, explainable, and useful.

### 2. Personalized Site Ranking

Problem:
- the best site for one user is not the best site for another

Method:
- weighted marginal coverage score
- score components:
  - unseen species count
  - target-clade relevance
  - season match
  - cost penalty
  - access penalty
  - uniqueness / endemism bonus

Output:
- a ranked site list per user

### 3. Seasonal Feasibility Filtering

Problem:
- some site combinations are theoretically high-value but seasonally incompatible

Method:
- represent each site with one or more feasible month windows
- filter candidate bundles that do not overlap with the user's time horizon

Output:
- only seasonally coherent route candidates survive to later optimization

### 4. Trip Construction

Problem:
- choose a subset and order of sites within a trip

Suggested initial formulation:
- prize-collecting routing or orienteering-style approximation
- reward = expected personal coverage gain
- penalty = transfer time, cost, access complexity

Why not exact optimization first:
- exact global routing is expensive and fragile
- approximate route construction is enough for an MVP

### 5. Multi-objective Planning

Problem:
- users do not all optimize the same thing

Method:
- generate a Pareto frontier across:
  - species gain
  - total cost
  - total trip days
  - difficulty

Output:
- "cheap plan", "fast plan", "coverage-max plan", rather than a fake single best answer

### 6. Clade-specific Planning

Problem:
- some users optimize for hummingbirds, seabirds, or regional endemics

Method:
- same planning stack, but with a filtered species universe and clade-weighted rewards

This is one of the biggest product advantages because it turns the atlas into a personalized planning engine.

## Suggested Technical Stack

The current BIRD stack can support a first World Mode foundation.

### Storage

- relational DB for canonical entities
- search or vector layer for guidebook and site-text retrieval
- object storage for raw imports and source snapshots

### Compute

- batch jobs for atlas updates
- scheduled recomputation for site-season and coverage layers
- on-demand planning jobs for user-specific route generation

### Recommended Pipeline Structure

- `ingest`
- `normalize`
- `score`
- `optimize`
- `render`

Each stage should store versioned outputs so recommendations remain explainable.

## Explainability Requirements

World Mode is only useful if it can explain itself.

Every recommendation should be able to answer:

- why this site is high-value
- which unseen species it contributes
- why this month is recommended
- what cost assumptions were used
- why this route beats alternatives

This is especially important if the product makes bold claims such as:

- `95%+ of the world's birds`
- `lowest-cost path`
- `fastest route to 10,000+ species`

Those claims should be expressed as `modeled planning outputs`, not absolute truth.

## Product Risks

### Data quality risk

- site coverage can become noisy if built from weak inputs

### False precision risk

- exact-looking cost numbers may imply more confidence than the system deserves

### Coverage claim risk

- "95% of all birds" depends on taxonomy choice, evidence quality, and planning assumptions

### Maintenance risk

- a world atlas is a living asset, not a one-time dataset

## Recommended Product Positioning

The public-facing message should be:

- BIRD helps users create `their own` Ten Thousand Birds Plan
- not a fixed universal list
- not a generic travel app
- a personalized global birding strategy tool

That phrasing turns infrastructure into user value without confusing internal architecture with external messaging.
