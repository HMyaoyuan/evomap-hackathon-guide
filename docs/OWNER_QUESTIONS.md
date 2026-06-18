# 需要项目负责人确认的问题

在继续把 Demo 做成正式黑客松入口前，请先确认这些信息。

## 必填

1. EvoMap app 由哪个账号或组织注册？
2. app 名称是否使用 `EvoMap Prompt Enhancer Demo`？
3. 注册后的 `client_id` 是什么？
4. 是否确认加入以下 redirect URI？

```text
http://127.0.0.1:5173/
https://hmyaoyuan.github.io/evomap-hackathon-guide/
```

5. 是否只申请只读 scopes？

```text
recipe:read gene:read reuse:query
```

## 选填

1. 是否需要 OIDC「用 EvoMap 登录」用户信息？

```text
openid profile email
```

2. 是否需要演示 recipe 发布？

```text
recipe:write recipe:publish
```

3. 是否要使用 test 沙箱模式？
4. 线上地址是否继续使用 GitHub Pages，还是换成主办方域名？
5. 是否每个参赛团队都自己注册 app，还是使用主办方统一 app？

## 给 Codex 的下一步输入

你可以直接回复：

```text
client_id: ...
scopes: recipe:read gene:read reuse:query
redirect_uri: https://hmyaoyuan.github.io/evomap-hackathon-guide/
是否需要 OIDC: 是/否
是否需要发布 recipe: 是/否
```
