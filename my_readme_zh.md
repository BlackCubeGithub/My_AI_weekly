<div align="center">

# AI Weekly

**AI 聚合 · 技术雷达 · 日报周报**

---

**声明**: 本项目基于 [Horizon](https://github.com/Thysrael/Horizon) 二次开发而来。由于原项目功能与我们的目标存在较大差距，我们将在其基础上进行大量扩展和重构，最终目标是一个通用的 AI 聚合新闻 + 技术雷达独立网站。

当前阶段（Phase 1）聚焦于：**AI 技术雷达 / 大模型方向的 AI 聚合日报周报独立网站**。

---

</div>

## 项目愿景

我们希望构建一个**真正有用的 AI 技术情报系统**——不是又一个平平无奇的新闻摘要合集，而是一个兼具**信息广度**、**AI 智能分析**和**技术雷达视角**的产品。

**最终目标**：

> 一个通用的 AI 聚合新闻 + 技术雷达独立网站。
>
> 能够追踪 AI / 大模型领域的技术趋势、社区热点、产品动态和开源生态，并生成有深度、可操作的日报和周报。

**为什么说 Horizon 的功能太少？** Horizon 作为基础框架已经很不错——多源抓取、AI 评分、去重、富化、总结。但它缺少我们真正关心的东西：

- **技术雷达视角**：不是简单按热度排序，而是识别技术成熟度、趋势方向和值得关注的新事物
- **周报聚合**：日报信息碎片化，需要周报来呈现一周的全局图景
- **深度分析层**：不仅摘要，还要有趋势判断、主题聚类、关键词图谱
- **更丰富的数据源**：Horizon 支持的源有限，我们还需要引入更多 AI 领域专业来源
- **前端独立站点**：Horizon 的前端较为简单，我们计划构建一个现代化的独立前端

所以，虽然名字里还带着 Horizon 的影子，但**最终大概率会把原有结构全部颠覆**。这不是修修补补，是重新设计。

## 阶段路线图

### Phase 1（当前阶段）—— AI 聚合日报周报独立网站

**目标**: 完成 AI 技术雷达（AI / 大模型方向）的 AI 聚合日报周报独立网站开发。

**核心任务**:

- [ ] 多源 AI 技术新闻抓取（Hacker News、RSS、Reddit、AI 垂直媒体等）
- [ ] AI 评分与智能过滤（基于技术价值而非单纯热度）
- [ ] 新闻去重与内容富化（背景知识、相关链接、社区讨论）
- [ ] 日报生成（中文结构化 Markdown 输出）
- [ ] **周报聚合生成**（日报之上再做主题聚类和趋势分析）
- [ ] 前端独立站点开发（现代化的浏览、搜索、筛选界面）
- [ ] 部署与持续运行（GitHub Actions 定时任务或其他 CI/CD 方案）

**预估工作量**: 2~4 周

---

### Phase 2 —— 技术雷达深度功能

**目标**: 从日报周报升级为真正的技术雷达。

**计划任务**:

- 技术成熟度标注（Meme / Emerging / Validated / Old Hat / Outdated）
- 趋势识别与关键词图谱
- 主题聚类与话题分组
- 按技术领域（LLM / Agent / 推理优化 / 基础设施等）分类筛选
- 更多国内数据源扩展（知乎、B站、微博热搜、百度热搜等）

---

### Phase 3（未来）—— 平台化与生态

**计划任务**:

- 用户可配置的个性化订阅
- 本地 LLM 支持（VLLM / Ollama）
- 更多分发渠道（飞书、钉钉、邮件、Webhook）
- 全文搜索与历史简报浏览
- PDF / Word 导出

---

## 与 Horizon 的关系

本项目**起点**是 Horizon，并从中借鉴了：

- 多源抓取架构（RSS、Hacker News、Reddit 等）
- AI 评分与过滤机制
- 内容富化逻辑
- 日报生成框架

但我们在以下方面**进行了或计划进行重大扩展**：

| 维度 | Horizon（参考） | 本项目 |
|------|---------------|--------|
| 核心定位 | 通用新闻聚合 | AI / 大模型技术雷达 |
| 报告类型 | 日报 | 日报 + **周报** |
| 分析深度 | 摘要 + 评论 | 摘要 + **趋势分析 + 技术成熟度** |
| 前端 | 简单静态展示 | **现代化独立站点** |
| 数据源 | 通用来源 | **AI 垂直来源 + 更多平台** |
| 架构 | Horizon 原架构 | **大概率全部重构** |

## 快速开始（Phase 1 期间）

> 项目仍处于快速迭代阶段，以下指南将随项目进展持续更新。

### 前置依赖

- Python 3.11+
- uv（推荐）或 pip

### 安装

```bash
# 克隆本项目
git clone https://github.com/your-repo/ai-weekly.git
cd ai-weekly

# 安装依赖（推荐）
uv sync

# 或使用 pip
pip install -e .
```

### 配置

```bash
# 复制环境变量模板
cp .env.example .env

# 复制配置文件模板
cp data/config.example.json data/config.json

# 编辑 .env 填入 API 密钥
# 编辑 data/config.json 配置信息源和偏好
```

### 运行

```bash
# 生成日报（默认 24 小时窗口）
uv run horizon

# 指定时间窗口
uv run horizon --hours 48

# 启动前端开发服务器
cd frontend3
npm install
npm run dev
```

## 项目结构

```
ai-weekly/
├── src/                    # 后端核心代码
│   ├── ai/                 # AI 相关模块（评分、富化、摘要）
│   ├── scrapers/           # 各数据源抓取器
│   ├── models.py           # 数据模型定义
│   ├── orchestrator.py     # 流程编排
│   ├── search.py           # 搜索服务
│   ├── mcp/                # MCP Server 集成
│   ├── setup/              # 配置向导
│   └── services/           # 各类服务（webhook 等）
├── frontend3/              # 现代化前端（Vue 3）
├── frontend2/              # 备用前端版本
├── frontend/               # 原 Horizon 前端
├── docs/                   # 生成的日报/周报输出目录
├── data/                   # 配置和数据目录
├── tests/                  # 测试代码
└── pyproject.toml          # 项目依赖配置
```

## 技术栈

| 层级 | 技术 |
|------|------|
| **后端语言** | Python 3.11+ |
| **AI 接入** | OpenAI API / Claude / Gemini / DeepSeek 等（OpenAI 兼容） |
| **前端框架** | Vue 3 + Vite |
| **Markdown** | markdown-it + markdown |
| **搜索** | Whoosh / SQLite FTS5 |
| **定时任务** | GitHub Actions |
| **部署** | Docker / Docker Compose |

## 致谢

- 感谢 [Horizon](https://github.com/Thysrael/Horizon) 项目提供了良好的起点和架构参考
- 感谢所有开源项目的贡献者

## 许可证

[MIT](LICENSE)

---

> **注意**: 本项目处于早期开发阶段。文档、代码和架构将随开发进展持续更新和调整。如果你对本项目感兴趣，欢迎参与贡献！
