# Connector Setup

## Goal

BIRD should support configuring real data connectors through forms instead of requiring code edits.

## Available UI

- Web page: `/connectors`
- Read API: `GET /api/v1/connector-configs`
- Save API: `PUT /api/v1/connector-configs/{source_name}`

## Local Persistence

Saved connector settings are written to:

- `apps/api/data/connector_configs.local.json`

This file is ignored by Git so each machine can keep different local credentials.

## Recommended First Connectors

### eBird

- `enabled`
- `provider`
- `baseUrl`
- `apiKey`
- `regionCode`
- `pollingMinutes`
- `notes`

Configured values are consumed by these endpoints:

- `GET /api/v1/connectors/ebird/recent-observations?region_code=CN-SH&days_back=3&max_results=10`
- `GET /api/v1/connectors/ebird/recent-observations?region_code=CN-SH&species_code=whtfri1`
- `GET /api/v1/connectors/ebird/hotspots?region_code=CN-SH&max_results=20`

### BirdReport

- `enabled`
- `provider`
- `baseUrl`
- `regionCode`
- `pollingMinutes`
- `notes`

### Maps

- `enabled`
- `provider`
- `baseUrl`
- `apiKey`
- `regionCode`
- `notes`

### Weather

- `enabled`
- `provider`
- `baseUrl`
- `apiKey`
- `pollingMinutes`
- `notes`

### WeChat / Xiaohongshu

Keep these in assisted mode for now. Suggested fields:

- `enabled`
- `provider`
- `userAgent`
- `cookie`
- `notes`

## Suggested Workflow

1. Start the backend API.
2. Open the `/connectors` page in the web app.
3. Fill in the minimum required values for a connector.
4. Save the form.
5. Confirm persistence with `GET /api/v1/connector-configs`.
6. Test eBird with `GET /api/v1/connectors/ebird/recent-observations`.
6. Wire the saved settings into the real provider implementation later.

## Security Note

The prototype stores secrets in a local JSON file for speed. Before production use, move API keys and cookies into a secret manager or encrypted backend store.
