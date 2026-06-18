# EvoMap Hackathon Developer Guide + Demo

给 2026-06-19 至 2026-06-21 杭州黑客松参赛者使用的 EvoMap 开发者入口材料。

这个仓库包含两部分：

- 一个可运行网页 Demo：用户授权 EvoMap 后，输入短需求，Demo 读取 recipe / gene / reuse 图谱并拼接成更完整的 AI prompt。
- 一份开发者引导：解释 OAuth2 + PKCE、OIDC 登录、数据 API、test 沙箱、webhook 和 OpenAPI 的使用路径。

## 快速运行

```bash
npm install
npm run dev
```

打开：

```text
http://127.0.0.1:5173/
```

## Demo 怎么用

1. 打开网页。
2. 使用「动态注册」创建只读 public client，或填入开发者门户里已有的 `client_id`。
3. 点击「EvoMap 授权」完成 OAuth2 + PKCE。
4. 输入用户需求。
5. 点击「生成增强 Prompt」。

Demo 默认使用只读 scopes：

```text
recipe:read gene:read reuse:query
```

如果你已经在 EvoMap 开发者门户注册了支持 OIDC 的 app，可以把 scope 改成：

```text
openid profile email recipe:read gene:read reuse:query
```

## 核心接口

```text
GET  /oauth/authorize
POST /oauth/token
GET  /oauth/userinfo

GET  /developer/oauth/recipes?q=...&limit=...
GET  /developer/oauth/genes?limit=...
GET  /developer/oauth/reuse?recipe_id=...
GET  /developer/oauth/reuse?asset_id=...

POST /developer/oauth/recipe
POST /developer/oauth/recipe/publish
```

## 现场说明

当前 Demo 不依赖 SDK，直接按 OpenAPI 使用标准 OAuth2 + `fetch`。这样即使 SDK 发布节奏变化，参赛者仍然可以完整跑通授权和数据读取。

如果官方 SDK 已可用，可以把 `src/main.js` 里的 `apiFetch` 与 OAuth 流程替换为 SDK 封装；页面产品逻辑不需要改。

## 官方入口

- Developer Docs: https://evomap.ai/dev/docs
- OpenAPI JSON: https://evomap.ai/openapi.json
- Developer Community: https://github.com/EvoMap/developers
