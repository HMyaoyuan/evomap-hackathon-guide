# EvoMap Hackathon Developer Guide + Demo

给 2026-06-19 至 2026-06-21 杭州黑客松参赛者使用的 EvoMap 开发者入口材料。

这个仓库包含两部分：

- 一个可运行网页 Demo：用户授权 EvoMap 后，输入短需求，Demo 读取 recipe / gene / reuse 图谱并拼接成更完整的 AI prompt。
- 一份开发者引导：解释 OAuth2 + PKCE、OIDC 登录、数据 API、test 沙箱、webhook 和 OpenAPI 的使用路径。

## 先说清楚：Demo 需要你自己的 EvoMap app

这个 Demo 不是我已经替你在 EvoMap 注册好了应用。真实演示前，主办方或项目负责人需要先在 EvoMap 开发者门户注册一个 OAuth app，然后把拿到的 `client_id` 填到 Demo 页面里，或写进 `src/main.js` 的 `DEFAULT_CLIENT_ID`。

注册入口：

```text
https://evomap.ai/dev/portal
```

注册时至少要配置两个 redirect URI：

```text
http://127.0.0.1:5173/
https://hmyaoyuan.github.io/evomap-hackathon-guide/
```

推荐先申请只读 scopes：

```text
recipe:read gene:read reuse:query
```

如果要做完整「用 EvoMap 登录」，再加：

```text
openid profile email
```

前端 PKCE public client 不应该保存 `client_secret`。如果 EvoMap 给了 secret，请放在服务端，不要写进这个静态 Demo。

## 我还需要你提供的信息

要把这个 Demo 变成你们黑客松现场的“正式入口”，还需要你确认：

1. 你希望这个 Demo 用哪个 EvoMap 账号/组织注册 app？
2. 注册后的 `client_id` 是什么？
3. 线上展示地址是否继续用 `https://hmyaoyuan.github.io/evomap-hackathon-guide/`，还是换成你们自己的域名？
4. 是否需要 OIDC 登录用户信息，也就是 `openid profile email`？
5. 是否只做只读搜索，还是要开放发布 recipe 的 `recipe:write recipe:publish`？
6. 是否要启用 test 沙箱演示发布流程？

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
2. 填入你在 EvoMap 开发者门户注册得到的 `client_id`。
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

页面里保留了「临时只读动态注册」折叠项，只用于现场排障或快速试读接口。正式讲解时应使用你自己注册的 app，并说明 app 是在哪里注册、redirect URI 是什么、scope 是什么。

如果官方 SDK 已可用，可以把 `src/main.js` 里的 `apiFetch` 与 OAuth 流程替换为 SDK 封装；页面产品逻辑不需要改。

## 官方入口

- Developer Docs: https://evomap.ai/dev/docs
- OpenAPI JSON: https://evomap.ai/openapi.json
- Developer Community: https://github.com/EvoMap/developers
