import {
  mockConnectorConfigs,
  mockDashboard,
  type BirdingEvent,
  type ConnectorConfig,
  type ConnectorConfigUpdate,
  type ConnectorStatus,
  type FutureDestinationItem,
  type TripLog,
  type UserProfile,
  type WorkbenchSnapshot
} from "@bird/shared";

const apiBase = process.env.NEXT_PUBLIC_BIRD_API_URL;

async function fetchOrFallback<T>(path: string, fallback: T): Promise<T> {
  if (!apiBase) {
    return fallback;
  }

  try {
    const response = await fetch(`${apiBase}${path}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function getDashboard(): Promise<WorkbenchSnapshot> {
  return fetchOrFallback("/api/v1/dashboard", mockDashboard);
}

export async function getEvent(eventId: string): Promise<BirdingEvent | null> {
  const fallback =
    mockDashboard.featuredEvent.eventId === eventId ? mockDashboard.featuredEvent : null;
  return fetchOrFallback(`/api/v1/events/${eventId}`, fallback);
}

export function getFutureDestinations(): Promise<FutureDestinationItem[]> {
  return fetchOrFallback("/api/v1/future-destinations", mockDashboard.futureDestinations);
}

export function getProfile(): Promise<UserProfile> {
  return fetchOrFallback("/api/v1/profile", mockDashboard.profile);
}

export function getArchive(): Promise<TripLog[]> {
  return fetchOrFallback("/api/v1/archive", mockDashboard.archive);
}

export function getConnectors(): Promise<ConnectorStatus[]> {
  return fetchOrFallback("/api/v1/connectors", mockDashboard.connectors);
}

export function getConnectorConfigs(): Promise<ConnectorConfig[]> {
  return fetchOrFallback("/api/v1/connector-configs", mockConnectorConfigs);
}

export async function updateConnectorConfig(
  sourceName: string,
  payload: ConnectorConfigUpdate
): Promise<ConnectorConfig> {
  if (!apiBase) {
    const existing = mockConnectorConfigs.find((item) => item.sourceName === sourceName);
    if (!existing) {
      throw new Error(`Unknown connector: ${sourceName}`);
    }
    return { ...existing, ...payload };
  }

  const response = await fetch(
    `${apiBase}/api/v1/connector-configs/${encodeURIComponent(sourceName)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update connector ${sourceName}`);
  }

  return (await response.json()) as ConnectorConfig;
}
