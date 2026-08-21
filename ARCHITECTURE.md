# Vue 工程协作地图

## 页面与文件

| 功能位置 | Vue 页面 | 主要状态或数据 |
|---|---|---|
| 登录 | `src/pages/LoginPage.vue` | `stores/auth.js` |
| Agent 工作台 | `src/pages/AgentHubPage.vue` | `data/agents.js` |
| 语义检索、预研报告、可行性分析、交底书 | `src/pages/AgentPage.vue` | `data/agents.js`、`stores/tasks.js` |
| 技术问答 | `src/pages/QaAgentPage.vue` | `stores/tasks.js` |
| 创新性分析双角色 | `src/pages/InnovationPage.vue` | `stores/innovation.js` |
| 历史中心 | `src/pages/HistoryPage.vue` | `stores/tasks.js` |
| 全景驾驶舱 | `src/pages/CockpitPage.vue` | `data/demo.js` |
| 个人中心 | `src/pages/ProfilePage.vue` | `stores/auth.js`、`stores/ui.js` |
| 管理中心 | `src/pages/AdminPage.vue` | `data/demo.js` |
| 导航与账号菜单 | `src/layouts/AppShell.vue` | `stores/auth.js`、`stores/ui.js` |

## 路由原则

- 普通平台页使用统一导航壳。
- 进入具体 Agent 后切换为聚焦工作区，只保留中煤标识和账号入口。
- 管理中心只允许管理员访问；驾驶舱按角色权限控制。
- `?cmRoute=` 只负责把旧书签转到新路由，不加载旧页面实现。

## 数据边界

- `src/data/demo.js` 是本地演示台账，不代表生产系统真实数据。
- 驾驶舱每项指标必须保留来源系统、统计主键和计算口径说明。
- 真实接口接入时，用 API 服务替换数据模块，不改变页面组件的职责划分。
- 用户可编辑字段与管理员分配字段必须分离；用户管理不得放入个人中心。

## 修改建议

- 只改某个 Agent 的内容：先改 `data/agents.js`，需要独特流程时再拆独立页面。
- 改全平台视觉：改 `styles/index.css` 的设计变量和共享类。
- 改身份权限：改 `stores/auth.js` 与 `router/index.js`。
- 改驾驶舱口径或演示记录：改 `data/demo.js`，同步核对页面中的来源说明。
