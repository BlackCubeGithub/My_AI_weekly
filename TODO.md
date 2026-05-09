# Horizon 功能规划

> 创建时间: 2026-05-09

---

## 高优先级

---

### 1. ~~PyPI 发布~~ （暂不考虑，保留）

~~让用户可以通过 `pip install horizon` 一键安装。~~

**备注**: 暂缓，当前安装方式（git clone + pip install -e .）已够用。未来可考虑。

---

### 2. 历史简报搜索 + 前端展示

**目标**: 盘活已有的 `frontend/`，让用户能浏览和搜索历史简报。

#### 2.1 后端：简报索引服务

- 新建 `src/services/search.py`，提供以下能力：
  - 加载 `docs/_posts/` 下的所有 `.md` 文件（而非 `data/summaries/`）
  - 按日期、标签、语言进行过滤
  - 支持标题和内容的全文搜索（可用 `Whoosh` / `sqlite fts5` / 简单 `grep` 实现）
  - 提供 HTTP API（FastAPI），或直接让前端 `fs.readdir` + 客户端搜索
- 在 `src/main.py` 中集成搜索命令 `horizon search <keyword>`

**涉及文件**: `src/services/search.py`（新增）, `src/main.py`

#### 2.2 前端：`frontend/` 增强

- 历史简报列表页 — 按日期倒序展示所有已生成简报
- 简报详情页 — 展示单篇简报完整内容（已实现 Markdown 渲染）
- 搜索栏 — 支持按关键词搜索历史简报
- 标签筛选 — 按 AI 标签（LLM、Security、Web 等）快速筛选
- 语言切换 — 中文 / English / All

**涉及文件**: `frontend/` 目录

**预估工作量**: 2~3 天

---

### 3. ~~按来源自定义评分 Prompt~~ （保留，但实现较麻烦）

**备注**: 当前共用一套评分逻辑是合理的，按来源自定义 Prompt 会增加配置复杂度和维护成本，暂缓。

---

## 中优先级

---

### 4. ~~新闻聚类 / 话题分组~~ （保留）

**备注**: 同 3，实现成本较高，暂缓。

---

### 5. 国内数据源扩展

**目标**: 增加国内可用的数据源，丰富新闻覆盖面。

**需要做的事**:

- 新建 `src/scrapers/zhihu.py`，支持抓取知乎热榜
- 新建 `src/scrapers/bilibili.py`，支持抓取 B 站热搜
- 新建 `src/scrapers/wallstreet.py`，支持抓取华尔街见闻
- 新建 `src/scrapers/tieba.py`，支持抓取百度贴吧热帖
- 新建 `src/scrapers/baidu.py`，支持抓取百度热搜
- 新建 `src/scrapers cls.py`，支持抓取财联社热门
- 新建 `src/scrapers/pengpai.py`，支持抓取澎湃新闻
- 新建 `src/scrapers/ifeng.py`，支持抓取凤凰网
- 新建 `src/scrapers/toutiao.py`，支持抓取今日头条
- 新建 `src/scrapers/weibo.py`，支持抓取微博热搜
- 为每个数据源实现 `Scraper` 基类接口：`fetch(hours) -> List[ContentItem]`
- 在 `docs/scrapers.md` 补充各数据源配置说明
- 在 `data/config.example.json` 添加各数据源配置示例
- 在 `src/setup/wizard.py` 中添加国内数据源选项

**技术注意事项**:

- 各平台可能需要反爬处理（UA、延时、代理等）
- 部分平台有 API 可用（如微博热搜 API）
- 部分平台可能需要 Cookie 或登录态

**涉及文件**: `src/scrapers/zhihu.py`（新增）、`src/scrapers/bilibili.py`（新增）、`src/scrapers/wallstreet.py`（新增）、`src/scrapers/tieba.py`（新增）、`src/scrapers/baidu.py`（新增）、`src/scrapers/cls.py`（新增）、`src/scrapers/pengpai.py`（新增）、`src/scrapers/ifeng.py`（新增）、`src/scrapers/toutiao.py`（新增）、`src/scrapers/weibo.py`（新增）、`docs/scrapers.md`、`data/config.example.json`、`src/setup/wizard.py`、`pyproject.toml`（加依赖）

**预估工作量**: 5~8 天（逐个实现）

---

### 6. ~~自动化趋势分析~~ （保留，实现方式待设计）

**备注**: 当前简单的滑动窗口方案过于呆板，不够智能。如要真正做好，需要结合话题聚类和时序分析，设计成本较高，暂缓。

---

### 7. 本地 LLM 支持（VLLM）

**目标**: 支持本地模型，降低 API 成本，保护隐私。

**需要做的事**:

- 修改 `src/ai/client.py`，新增 `VLLMProvider`：
  - VLLM 支持 OpenAI-compatible API server 模式
  - 直接复用现有的 `OpenAIProvider`，只需配置 `base_url` 和本地模型名
  - 支持流式输出（`stream=True`）
- 修改 `data/config.example.json` 添加本地模型配置示例：

```jsonc
{
  "ai": {
    "provider": "openai",   // 或新增 "vllm" provider
    "model": "Qwen2.5-7B-Instruct",
    "base_url": "http://localhost:8000/v1",
    "api_key": "not-needed"  // VLLM 默认不校验 key
  }
}
```

- 在 `docs/configuration.md` 添加 VLLM 配置说明

**涉及文件**: `src/ai/client.py`, `data/config.example.json`, `docs/configuration.md`

**预估工作量**: 0.5~1 天（VLLM 兼容 OpenAI API，实现很简单）

---

## 低优先级

---

### 8. ~~全文内容缓存与 RAG 问答~~ （保留）

**备注**: 向量化和问答功能设计成本较高，暂缓。

---

### 9. 简报导出为 PDF / Word

**目标**: 生成排版精美的 PDF/Word，方便离线阅读和分享。

**需要做的事**:

- 新建 `src/services/exporter.py`，实现以下导出器：
  - `PDFExporter`: 用 `weasyprint` 或 `reportlab` 将 Markdown 转为 PDF
  - `WordExporter`: 用 `python-docx` 生成 `.docx`
- 修改 `src/orchestrator.py`，在生成后调用导出器
- 配置项：

```jsonc
{
  "output": {
    "pdf": { "enabled": false, "path": "docs/exports/" },
    "word": { "enabled": false, "path": "docs/exports/" }
  }
}
```

**涉及文件**: `src/services/exporter.py`（新增）, `src/orchestrator.py`, `data/config.example.json`, `pyproject.toml`（加依赖）

**预估工作量**: 1~2 天

---

### 10. ~~读者反馈~~ （不要）

---

## 整体路线图建议


| 阶段          | 任务                          | 预计时间    |
| ----------- | --------------------------- | ------- |
| **Phase 1** | 本地 LLM 支持（VLLM）             | 0.5~1 天 |
| **Phase 1** | 历史简报搜索 + 前端展示               | 2~3 天   |
| **Phase 2** | 简报导出为 PDF / Word            | 1~2 天   |
| **Phase 3** | 国内数据源扩展（知乎、B站、微博、百度热搜等 10个） | 5~8 天   |
| **Phase 3** | 新闻聚类 / 话题分组                 | 3~4 天   |
| **Phase 3** | 自动化趋势分析（需重新设计）              | 暂缓      |
| **Phase 4** | 按来源自定义评分 Prompt             | 暂缓      |
| **Phase 4** | RAG 问答                      | 暂缓      |
| **未来**      | PyPI 发布                     | 暂缓      |


