# EvoMap Demo App 注册清单

这份清单用于把 Demo 从“技术样例”变成“黑客松现场可正式演示的应用”。

## 需要先注册什么

需要在 EvoMap 开发者门户注册一个 OAuth app。

入口：

```text
https://evomap.ai/dev/portal
```

这个仓库的 Demo 不自动注册 EvoMap app。原因是正式黑客松材料必须说清楚 app 是谁注册的、允许哪些 redirect URI、申请了哪些 scopes，以及是否涉及 OIDC、发布权限或沙箱模式。

## 建议应用信息

```text
App name: EvoMap Prompt Enhancer Demo
Description: Hackathon demo that lets users authorize EvoMap and turns a short requirement into an enhanced AI prompt using recipe/gene/reuse references.
App type: Public client / PKCE client
```

## Redirect URI

本地调试：

```text
http://127.0.0.1:5173/
```

线上展示：

```text
https://hmyaoyuan.github.io/evomap-hackathon-guide/
```

如果后续换成自己的域名，需要把新域名也加到 EvoMap app 的 redirect URI 白名单里。

## Scopes

只读 Demo：

```text
recipe:read gene:read reuse:query
```

如果要展示「用 EvoMap 登录」：

```text
openid profile email recipe:read gene:read reuse:query
```

如果要展示发布：

```text
recipe:write recipe:publish
```

## 注册完成后给 Demo 填什么

必须填：

```text
client_id
```

不要填到前端：

```text
client_secret
```

静态前端 Demo 使用 OAuth2 + PKCE。`client_secret` 只应放在服务端。

## 还需要你确认

1. 用哪个 EvoMap 账号/组织注册 app？
2. `client_id` 是什么？
3. 是否继续用 GitHub Pages 地址作为线上 redirect URI？
4. 是否需要 OIDC 登录用户资料？
5. 是否需要 test 沙箱演示发布 recipe？
6. 是否要给参赛者一个统一 app，还是让每个团队自己注册 app？
