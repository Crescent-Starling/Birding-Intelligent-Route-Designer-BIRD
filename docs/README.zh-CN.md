# BIRD 中文说明

`BIRD (Birding Intelligent Route Designer)` 是一个观鸟决策与规划系统，目标是支持更有体系、也更可持续的观鸟。

它希望解决的不是单一问题，而是一整条连续的观鸟工作流：

- 眼前这只鸟值不值得追
- 未来一趟旅行该怎么规划更划算
- 在有限的时间、预算和精力下，如何逐步形成自己的观鸟人生计划
- 如何把照片、视频、随笔、记录与复盘沉淀下来

## 当前结构

- `Twitcher Mode`
  - 面向短期决策
  - 关注鸟讯、时间窗口、路线、天气、风险和机会成本
- `World Mode`
  - 面向中长期旅行规划
  - 关注目的地、季节、成本、交通与潜在新增物种价值
- `Flyway Atlas`
  - 底层建模基础设施
  - 用于组织世界鸟点、季节窗口、可达性、成本和覆盖价值

## 项目定位

- 当前仓库是 `personal-use / research prototype`
- 它既是一个实际想用的个人工具，也是一个用来锻炼产品建模、数据处理与规划算法能力的项目
- 仓库中不包含私有 API key、cookie、私聊导出或受限原始数据

## 当前进度

- 已实现 `Twitcher Mode` 的原型工作台
- 已有 FastAPI 后端、Next.js 前端、共享类型和基础文档
- 已接入 connector 配置框架，并初步打通 eBird 接口骨架
- 已开始设计 `Flyway Atlas` 的第一版 schema

## 相关文档

- [产品需求文档](PRD.md)
- [World Mode Planning](WORLD_MODE_PRD.md)
- [Flyway Atlas v1 Schema](FLYWAY_ATLAS_V1_SCHEMA.md)
- [系统架构](ARCHITECTURE.md)
- [Connector 配置说明](CONNECTOR_SETUP.md)
