import { ConnectorForm } from "../../components/connector-form";
import { Chip } from "../../components/primitives";
import { Shell } from "../../components/shell";
import { getConnectorConfigs } from "../../lib/api";

export default async function ConnectorsPage() {
  const configs = await getConnectorConfigs();

  return (
    <Shell activePath="/connectors">
      <div className="page-header">
        <div>
          <p className="eyebrow">Configuration</p>
          <h2>Real Data Connectors</h2>
        </div>
        <Chip tone="accent">{configs.length} sources</Chip>
      </div>
      <section className="card">
        <div className="card-title">
          <div>
            <p className="eyebrow">How to use</p>
            <h3>表单式配置流程</h3>
          </div>
        </div>
        <div className="signal-list">
          <div className="compact-item">
            <strong>1. 先配结构化源</strong>
            <p>优先配置 eBird、BirdReport、Maps、Weather。微信和小红书先维持 assisted 模式。</p>
          </div>
          <div className="compact-item">
            <strong>2. 填最小必要字段</strong>
            <p>通常只需要 provider、base URL、API key、region code、polling minutes 和 notes。</p>
          </div>
          <div className="compact-item">
            <strong>3. 保存并验证</strong>
            <p>保存后后端会把本机配置写到 `apps/api/data/connector_configs.local.json`。</p>
          </div>
        </div>
      </section>
      <div className="list-grid">
        {configs.map((config) => (
          <ConnectorForm key={config.sourceName} config={config} />
        ))}
      </div>
    </Shell>
  );
}
