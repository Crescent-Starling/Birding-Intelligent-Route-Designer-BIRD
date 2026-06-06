"use client";

import { useState } from "react";

import type { ConnectorConfig, ConnectorConfigUpdate } from "@bird/shared";

import { updateConnectorConfig } from "../lib/api";
import { Chip } from "./primitives";

type SaveState = "idle" | "saving" | "saved" | "error";

const fieldKeyMap = {
  enabled: "enabled",
  provider: "provider",
  base_url: "baseUrl",
  baseUrl: "baseUrl",
  region_code: "regionCode",
  regionCode: "regionCode",
  polling_minutes: "pollingMinutes",
  pollingMinutes: "pollingMinutes",
  api_key: "apiKey",
  apiKey: "apiKey",
  cookie: "cookie",
  user_agent: "userAgent",
  userAgent: "userAgent",
  notes: "notes"
} as const;

type FormState = {
  enabled: boolean;
  provider: string;
  baseUrl: string;
  regionCode: string;
  pollingMinutes: string;
  apiKey: string;
  cookie: string;
  userAgent: string;
  notes: string;
};

function toInputValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

export function ConnectorForm({ config }: { config: ConnectorConfig }) {
  const [form, setForm] = useState<FormState>({
    enabled: config.enabled,
    provider: config.provider ?? "",
    baseUrl: config.baseUrl ?? "",
    regionCode: config.regionCode ?? "",
    pollingMinutes: config.pollingMinutes ? String(config.pollingMinutes) : "",
    apiKey: config.apiKey ?? "",
    cookie: config.cookie ?? "",
    userAgent: config.userAgent ?? "",
    notes: config.notes ?? ""
  });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveState("saving");
    setMessage("");

    const payload: ConnectorConfigUpdate = {
      enabled: form.enabled,
      provider: form.provider || undefined,
      baseUrl: form.baseUrl || undefined,
      regionCode: form.regionCode || undefined,
      pollingMinutes: form.pollingMinutes ? Number(form.pollingMinutes) : undefined,
      apiKey: form.apiKey || undefined,
      cookie: form.cookie || undefined,
      userAgent: form.userAgent || undefined,
      notes: form.notes || undefined
    };

    try {
      const updated = await updateConnectorConfig(config.sourceName, payload);
      setForm({
        enabled: updated.enabled,
        provider: updated.provider ?? "",
        baseUrl: updated.baseUrl ?? "",
        regionCode: updated.regionCode ?? "",
        pollingMinutes: updated.pollingMinutes ? String(updated.pollingMinutes) : "",
        apiKey: updated.apiKey ?? "",
        cookie: updated.cookie ?? "",
        userAgent: updated.userAgent ?? "",
        notes: updated.notes ?? ""
      });
      setSaveState("saved");
      setMessage("配置已保存。");
    } catch {
      setSaveState("error");
      setMessage("保存失败，请确认 API 已启动并可访问。");
    }
  }

  return (
    <form className="card connector-form" onSubmit={handleSubmit}>
      <div className="card-title">
        <div>
          <p className="eyebrow">Connector Settings</p>
          <h3>{config.sourceName}</h3>
        </div>
        <Chip
          tone={
            config.status === "healthy"
              ? "accent"
              : config.status === "limited"
                ? "warning"
                : "muted"
          }
        >
          {config.mode}
        </Chip>
      </div>
      <p className="card-subtitle">
        通过表单填写 provider、key、base URL、地区和轮询频率。敏感字段当前只做本地保存。
      </p>
      <div className="chip-row">
        {config.apiKeyConfigured ? (
          <Chip tone="accent">API key saved locally</Chip>
        ) : (
          <Chip tone="warning">API key not saved</Chip>
        )}
        {config.cookieConfigured ? <Chip tone="accent">Cookie saved locally</Chip> : null}
      </div>

      <div className="connector-fields">
        {config.fields.map((field) => {
          const inputKey = fieldKeyMap[field.key as keyof typeof fieldKeyMap];
          if (!inputKey) {
            return null;
          }
          const currentValue = form[inputKey];

          if (field.fieldType === "boolean") {
            return (
              <label key={field.key} className="field-block field-checkbox">
                <span>
                  <strong>{field.label}</strong>
                  <small className="muted">{field.helpText}</small>
                </span>
                <input
                  type="checkbox"
                  checked={Boolean(currentValue)}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      [inputKey]: event.target.checked
                    }))
                  }
                />
              </label>
            );
          }

          if (field.fieldType === "select") {
            return (
              <label key={field.key} className="field-block">
                <span>
                  <strong>{field.label}</strong>
                  <small className="muted">{field.helpText}</small>
                </span>
                <select
                  value={toInputValue(currentValue)}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      [inputKey]: event.target.value
                    }))
                  }
                >
                  {(field.options ?? []).map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          return (
            <label key={field.key} className="field-block">
              <span>
                <strong>{field.label}</strong>
                <small className="muted">{field.helpText}</small>
              </span>
              <input
                type={field.fieldType === "password" ? "password" : field.fieldType === "number" ? "number" : "text"}
                placeholder={field.placeholder}
                value={toInputValue(currentValue)}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    [inputKey]: event.target.value
                  }))
                }
              />
            </label>
          );
        })}
      </div>

      <div className="connector-actions">
        <button type="submit" disabled={saveState === "saving"}>
          {saveState === "saving" ? "Saving..." : "Save Connector"}
        </button>
        {message ? (
          <Chip
            tone={
              saveState === "saved"
                ? "accent"
                : saveState === "error"
                  ? "danger"
                  : "muted"
            }
          >
            {message}
          </Chip>
        ) : null}
      </div>
    </form>
  );
}
