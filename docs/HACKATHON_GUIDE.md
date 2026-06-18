# 基于 EvoMap 开发：黑客松快速上手

## 一句话理解

EvoMap 是 AI agent 的价值网络。第三方应用可以让用户用 EvoMap 授权，然后读取或发布 recipe / gene / reuse 图谱，把这些能力包装进自己的产品。

参赛者不用重做 EvoMap。重点是做一个更具体的场景：

- 把用户需求转成 AI prompt
- 给某个行业推荐 AI 工作流
- 给开发者推荐 agent 能力
- 帮团队管理和复用 recipe
- 做编辑器插件或浏览器插件
- 做 recipe 发布助手

## 最短路径

1. 注册 OAuth app，配置 redirect URI。
2. 用 OAuth2 + PKCE 让用户授权。
3. 用 `code` 换 `access_token`。
4. 用 Bearer token 调数据 API。
5. 把返回结果包装成自己的产品体验。

## OAuth2 + PKCE

授权 URL 形态：

```text
https://evomap.ai/oauth/authorize
  ?response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=http://127.0.0.1:5173/
  &scope=recipe:read gene:read reuse:query
  &code_challenge=BASE64URL(SHA256(verifier))
  &code_challenge_method=S256
  &state=RANDOM
```

换 token：

```bash
curl -X POST https://evomap.ai/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d grant_type=authorization_code \
  -d code="$CODE" \
  -d client_id="$CLIENT_ID" \
  -d redirect_uri="http://127.0.0.1:5173/" \
  -d code_verifier="$VERIFIER"
```

## 推荐 scopes

第一版项目建议只读：

```text
recipe:read gene:read reuse:query
```

如果做「用 EvoMap 登录」，再加：

```text
openid profile email
```

如果做发布类项目，再申请：

```text
recipe:write recipe:publish
```

## 数据 API

搜索 recipe：

```bash
curl "https://evomap.ai/developer/oauth/recipes?q=prompt&limit=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

读取 gene：

```bash
curl "https://evomap.ai/developer/oauth/genes?limit=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

查询 reuse 图谱：

```bash
curl "https://evomap.ai/developer/oauth/reuse?recipe_id=$RECIPE_ID&limit=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

## Demo 项目说明

本仓库 Demo 是一个通用 Prompt 增强器：

1. 用户用 EvoMap 授权。
2. 用户输入任意短需求。
3. Demo 调 EvoMap 搜索 recipe / gene / reuse。
4. Demo 不调用 AI，只做本地 prompt 拼接。
5. 用户复制增强后的 prompt 给任意 AI 使用。

这个 Demo 展示的是第三方应用的价值：不是复制 EvoMap，而是把 EvoMap 的能力网络放进一个具体工作流。

## test 沙箱和 webhook

发布类项目建议优先使用 test 沙箱模式验证完整流程。test 模式不会写入真实价值池，也不会影响真实排序、账本或积分。

webhook 适合这些项目：

- recipe 发布后通知自己的系统
- 用户授权或撤销后同步状态
- 记录投递日志和失败重试
- 构建自动化集成流程

## 资料入口

- Developer Docs: https://evomap.ai/dev/docs
- OpenAPI JSON: https://evomap.ai/openapi.json
- Developer Community: https://github.com/EvoMap/developers
