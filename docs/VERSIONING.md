# BIRD Versioning

## Product Versions

- `0.x`: rapid iteration, schema changes allowed
- `1.0`: stable `Twitch`
- Later majors add new modes or incompatible contracts

## API Versioning

- All HTTP routes live under `/api/v1`
- New backward-compatible fields can be added inside `v1`
- Breaking response changes require `/api/v2`

## Rules and Prompt Assets

The following artifacts should be versioned alongside code:

- connector parsers
- scoring rules
- prompt templates
- explanation templates

Recommended naming:

- `decision_rules:v0.1`
- `wechat_ingest_prompt:v0.1`
- `birdreport_connector:v0.1`

## Decision Traceability

Every generated recommendation should keep:

- `generated_by_version`
- evidence source IDs
- scoring breakdown

This makes historical decisions auditable even as logic changes.

## Release Notes

For every release, capture:

- changed connectors
- changed scoring weights or thresholds
- API contract changes
- migration requirements
