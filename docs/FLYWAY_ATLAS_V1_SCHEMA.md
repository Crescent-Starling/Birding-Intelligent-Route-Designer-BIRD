# Flyway Atlas v1 Schema

## Purpose

This document defines the first practical schema for `Flyway Atlas`, the data foundation for BIRD's long-horizon planning mode.

The goal of v1 is not to solve world birding perfectly. The goal is to create a stable, explainable, and incrementally maintainable atlas that can support:

- global site browsing
- best-season visualization
- user-specific marginal coverage ranking
- regional trip candidate generation

## Design Principles

- `canonical IDs first`
- `source provenance preserved`
- `raw, normalized, and derived layers separated`
- `coarse truth beats fake precision`
- `schema should support both Twitch and Travel reuse where possible`

## Scope of v1

Flyway Atlas v1 should support:

- `300-500` elite birding sites, expandable later
- a single canonical species taxonomy backbone
- month-level seasonality rather than daily precision
- coarse cost and access scores rather than dynamic live prices
- user-specific marginal coverage estimates

Flyway Atlas v1 should not require:

- exact global optimum planning
- live airfare integrations
- perfect daily abundance forecasting
- global completeness from day one

## Layered Storage Model

### Raw Layer

Stores untouched source snapshots and imports.

Examples:
- guidebook extract files
- copied site tables
- imported PDFs metadata
- eBird-derived snapshots where allowed for personal use

Recommended tables:
- `raw_source`
- `raw_snapshot`
- `raw_snapshot_artifact`

### Normalized Layer

Stores canonical entities and standardized relationships.

Examples:
- species
- sites
- site aliases
- site month windows
- site-species coverage edges

Recommended tables:
- `taxonomy_release`
- `species`
- `site`
- `site_alias`
- `site_gateway`
- `site_month_profile`
- `site_species_coverage`
- `site_cost_profile`
- `site_access_profile`
- `travel_edge`

### Derived Layer

Stores recomputable planning outputs.

Examples:
- cumulative coverage curves
- personal site value ranking
- trip candidate scores
- route bundles

Recommended tables:
- `atlas_build`
- `coverage_curve_snapshot`
- `user_site_value_snapshot`
- `trip_candidate_snapshot`

## Core Canonical Entities

### 1. taxonomy_release

Purpose:
- define which taxonomy version the atlas currently uses

Suggested fields:
- `taxonomy_release_id`
- `source_name`
- `source_version`
- `published_at`
- `notes`
- `is_active`

### 2. species

Purpose:
- canonical species backbone

Suggested fields:
- `species_id`
- `taxonomy_release_id`
- `species_code`
- `common_name_en`
- `scientific_name`
- `order_name`
- `family_name`
- `genus_name`
- `clade_tags`
- `is_extant`
- `is_marine`
- `is_endemic_flag`
- `is_migratory_flag`
- `conservation_flag`

Notes:
- `clade_tags` can begin as text-array or JSON
- `species_code` should follow the operational backbone source

### 3. site

Purpose:
- canonical birding-site entity

Suggested fields:
- `site_id`
- `canonical_name`
- `country_code`
- `country_name`
- `admin1_name`
- `admin2_name`
- `latitude`
- `longitude`
- `geom_point`
- `bbox_json`
- `site_type`
- `habitat_tags`
- `is_pelagic`
- `curation_tier`
- `summary_text`
- `source_priority`
- `is_active`

Important v1 convention:
- do not try to store complex polygon geometry for every site initially
- point + optional bbox is enough

### 4. site_alias

Purpose:
- map multiple source names to one canonical site

Suggested fields:
- `site_alias_id`
- `site_id`
- `alias_name`
- `source_name`
- `source_record_id`
- `language_code`
- `is_preferred`

### 5. site_gateway

Purpose:
- represent the most common access gateway for a site

Suggested fields:
- `site_gateway_id`
- `site_id`
- `gateway_name`
- `gateway_type`
- `latitude`
- `longitude`
- `travel_notes`
- `priority_rank`

Examples:
- international airport
- domestic airport
- port town
- rail access town

### 6. site_month_profile

Purpose:
- represent seasonality at month granularity

Suggested fields:
- `site_month_profile_id`
- `site_id`
- `month`
- `birding_score`
- `weather_score`
- `access_score`
- `overall_score`
- `peak_flag`
- `notes`
- `evidence_summary`

Scoring guidance:
- `0-100`
- use interpretable coarse values

### 7. site_species_coverage

Purpose:
- main coverage edge between site and species

Suggested fields:
- `site_species_coverage_id`
- `site_id`
- `species_id`
- `coverage_confidence`
- `residency_type`
- `detectability_score`
- `rarity_context`
- `best_months_json`
- `minimum_trip_priority`
- `source_mix_summary`
- `last_reviewed_at`

Interpretation:
- this table is not a checklist dump
- it is a modeled planning edge

### 8. site_cost_profile

Purpose:
- capture coarse trip cost characteristics

Suggested fields:
- `site_cost_profile_id`
- `site_id`
- `currency_reference`
- `lodging_band`
- `food_band`
- `local_transport_band`
- `guide_requirement_band`
- `permit_band`
- `estimated_daily_cost_band`
- `notes`
- `updated_at`

Recommended band enums:
- `low`
- `medium`
- `high`
- `very_high`
- `expedition`

### 9. site_access_profile

Purpose:
- capture access realism and complexity

Suggested fields:
- `site_access_profile_id`
- `site_id`
- `international_access_score`
- `domestic_transfer_score`
- `road_access_score`
- `independent_travel_score`
- `requires_guide_flag`
- `requires_permit_flag`
- `safety_band`
- `seasonal_closure_risk_band`
- `notes`
- `updated_at`

### 10. travel_edge

Purpose:
- represent coarse travel relationship between two sites

Suggested fields:
- `travel_edge_id`
- `site_id_from`
- `site_id_to`
- `distance_km`
- `same_country_flag`
- `same_region_flag`
- `flight_needed_probability`
- `transfer_time_band`
- `transfer_cost_band`
- `visa_complexity_band`
- `route_notes`

Important note:
- v1 should not attempt exact routing graph completeness
- build edges only for plausible planning relationships

## Raw Provenance Tables

### raw_source

Suggested fields:
- `raw_source_id`
- `source_name`
- `source_type`
- `license_notes`
- `access_method`
- `default_refresh_policy`

### raw_snapshot

Suggested fields:
- `raw_snapshot_id`
- `raw_source_id`
- `captured_at`
- `source_locator`
- `content_hash`
- `parser_version`
- `status`
- `notes`

### raw_snapshot_artifact

Suggested fields:
- `raw_snapshot_artifact_id`
- `raw_snapshot_id`
- `artifact_type`
- `storage_path`
- `mime_type`
- `size_bytes`

## Derived Planning Tables

### atlas_build

Purpose:
- version a specific normalized + derived atlas state

Suggested fields:
- `atlas_build_id`
- `taxonomy_release_id`
- `build_label`
- `created_at`
- `site_count`
- `species_count`
- `notes`
- `coverage_method_version`

### coverage_curve_snapshot

Purpose:
- answer "how many species are covered by top N sites?"

Suggested fields:
- `coverage_curve_snapshot_id`
- `atlas_build_id`
- `rank_position`
- `site_id`
- `cumulative_species_count`
- `cumulative_species_ratio`
- `marginal_species_gain`

### user_site_value_snapshot

Purpose:
- store personal marginal value ranking

Suggested fields:
- `user_site_value_snapshot_id`
- `user_id`
- `atlas_build_id`
- `site_id`
- `unseen_species_gain`
- `target_clade_gain`
- `season_match_score`
- `cost_penalty_score`
- `difficulty_penalty_score`
- `final_value_score`
- `computed_at`

### trip_candidate_snapshot

Purpose:
- store candidate routes produced by planning jobs

Suggested fields:
- `trip_candidate_snapshot_id`
- `user_id`
- `atlas_build_id`
- `planning_region`
- `start_month`
- `optimization_goal`
- `site_sequence_json`
- `estimated_species_gain`
- `estimated_cost_band`
- `estimated_trip_days`
- `difficulty_score`
- `explanation_json`
- `computed_at`

## Minimal User-side Tables Needed for Atlas

Flyway Atlas depends on user state, but those user tables do not have to live inside the atlas namespace.

At minimum, World Mode needs access to:

- `user`
- `user_life_list_species`
- `user_target_group`
- `user_constraint_profile`

### user_life_list_species

Suggested fields:
- `user_life_list_species_id`
- `user_id`
- `species_id`
- `first_seen_at`
- `first_seen_site_id`
- `source_name`

### user_target_group

Suggested fields:
- `user_target_group_id`
- `user_id`
- `target_type`
- `target_value`
- `priority_weight`

Examples:
- `clade = pittas`
- `region = New Guinea`
- `goal = 5000_species`

### user_constraint_profile

Suggested fields:
- `user_constraint_profile_id`
- `user_id`
- `annual_budget_band`
- `max_trip_days`
- `international_trip_frequency`
- `comfort_with_guides`
- `comfort_with_remote_travel`
- `preferred_travel_style`
- `sustainability_preference_level`

## Data Types and Representation Choices

### Months

Use integer `1-12` for month fields.

### Bands

Use enums rather than fake currency or hour precision in v1.

### JSON fields

Allowed in v1 for:
- `clade_tags`
- `best_months_json`
- `site_sequence_json`
- `explanation_json`

But keep core joinable fields relational.

### Geometry

Use:
- point geometry first
- optional bbox JSON second
- polygons later if truly needed

## Candidate Database Layout

If implemented on PostgreSQL:

- `atlas.taxonomy_release`
- `atlas.species`
- `atlas.site`
- `atlas.site_alias`
- `atlas.site_gateway`
- `atlas.site_month_profile`
- `atlas.site_species_coverage`
- `atlas.site_cost_profile`
- `atlas.site_access_profile`
- `atlas.travel_edge`
- `atlas.atlas_build`
- `atlas.coverage_curve_snapshot`
- `atlas.user_site_value_snapshot`
- `atlas.trip_candidate_snapshot`

Raw source tables can live under:

- `raw.raw_source`
- `raw.raw_snapshot`
- `raw.raw_snapshot_artifact`

## Update and Maintenance Strategy

### Manual curation queue

Many site-level corrections will need manual review. v1 should include a lightweight review queue even if only used by one operator.

Recommended table:
- `atlas_review_queue`

Suggested fields:
- `atlas_review_queue_id`
- `entity_type`
- `entity_id`
- `issue_type`
- `priority`
- `status`
- `created_at`
- `resolved_at`
- `notes`

### Refresh policies

- taxonomy: monthly
- site atlas: monthly or manual batch
- seasonality: seasonal or monthly
- cost/access: quarterly unless major change
- derived ranking snapshots: on-demand or nightly

### Build philosophy

Recompute derived layers from normalized data rather than hand-editing them.

## First Algorithms This Schema Should Support

### Greedy coverage curve

Input:
- `site_species_coverage`

Output:
- `coverage_curve_snapshot`

### Personal marginal gain ranking

Inputs:
- `site_species_coverage`
- `user_life_list_species`
- `site_month_profile`
- `site_cost_profile`
- `site_access_profile`

Output:
- `user_site_value_snapshot`

### Regional trip candidate generation

Inputs:
- all of the above
- `travel_edge`

Output:
- `trip_candidate_snapshot`

## Implementation Order

### Step 1

Create:
- taxonomy tables
- site table
- site alias table

### Step 2

Create:
- site month profile
- site cost profile
- site access profile

### Step 3

Create:
- site species coverage
- atlas build
- coverage curve

### Step 4

Create:
- user-side life list joins
- personal ranking snapshot

### Step 5

Create:
- travel edge
- trip candidate snapshot

## What to Keep Deliberately Simple in v1

- use cost bands instead of real-time prices
- use month-level seasonality instead of weekly windows
- use elite curated sites before global long-tail expansion
- use explainable heuristics before exact optimization

This keeps the atlas useful, debuggable, and maintainable.
