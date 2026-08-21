# 中煤 AI 创新应用平台 Vue 工程

## 当前状态

本目录是后续唯一开发入口，已完成从单文件 Demo 到 **Vue 3 原生工程** 的结构迁移。

- 页面由 Vue 单文件组件实现，不再加载旧 HTML、旧内联脚本或 `v-html` 兼容层。
- Vue Router 负责页面和 Agent 流程路由。
- Pinia 负责登录身份、界面偏好、历史任务和创新性分析过程状态。
- 六个 Agent 的名称、图标、输入提示、步骤和来源在 `src/data/agents.js` 统一配置。
- 当前仍是本地高保真演示，数据、运行过程、导出和接口行为均为模拟。

`../创新性分析Agent-Demo-单文件版-0818.html` 只保留为历史视觉与需求核对来源，不再参与 Vue 工程运行。

## 本地运行

```bash
npm install
npm run dev
```

构建和预览：

```bash
npm run build
npm run preview
```

## 目录职责

```text
src/
├─ components/   可复用组件：步骤栏、图表、抽屉、页面标题
├─ data/         Agent 定义与演示业务记录
├─ layouts/      顶部栏、侧边栏和 Agent 聚焦工作区
├─ pages/        各业务页面和六个 Agent 工作流
├─ router/       原生路由和旧 cmRoute 地址兼容跳转
├─ stores/       登录、界面、任务、创新性分析状态
└─ styles/       统一设计变量、组件样式与响应式规则
```

详细分工见 `ARCHITECTURE.md`。

两人协作方式、文件分区与合并检查见 `COLLABORATION.md`。

## 协作规则

1. 修改功能时优先改对应 `pages/` 页面；跨页面能力放到 `components/`。
2. Agent 名称、提示词、流程步骤和数据源说明优先改 `data/agents.js`，避免多处重复。
3. 共享业务状态放到 `stores/`，不要重新使用全局变量或手工操作整页 DOM。
4. 公共颜色、字号、间距和响应式规则统一维护在 `styles/index.css`。
5. 新增路由时同步维护 `router/index.js`，并设置正确的角色访问条件。
6. 合并前至少执行 `npm run build`，并检查桌面和窄浏览器下的溢出、遮挡和按钮对齐。
