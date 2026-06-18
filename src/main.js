import {
  CheckCircle2,
  Copy,
  ExternalLink,
  KeyRound,
  LogIn,
  RefreshCw,
  Search,
  Sparkles,
  Trash2
} from "lucide";
import "./styles.css";

const STORAGE_KEY = "evomap_prompt_enhancer_state";
const DEFAULT_SCOPE = "recipe:read gene:read reuse:query";
const DEFAULT_HUB_URL = "https://evomap.ai";

const icons = { CheckCircle2, Copy, ExternalLink, KeyRound, LogIn, RefreshCw, Search, Sparkles, Trash2 };

const state = loadState();

const app = document.querySelector("#app");
app.innerHTML = `
  <main class="shell">
    <section class="hero">
      <div class="hero__content">
        <p class="eyebrow">EvoMap Hackathon Demo</p>
        <h1>一句需求，生成可执行 AI Prompt</h1>
        <p class="lede">用 EvoMap 授权读取 recipe / gene / reuse 图谱，把用户的短需求拼接成结构化长提示词。</p>
        <nav class="hero-links" aria-label="页面导航">
          <a href="#demo">Demo</a>
          <a href="#guide">开发者引导</a>
          <a href="#api-map">API 速查</a>
          <a href="https://evomap.ai/dev/docs" target="_blank" rel="noreferrer">官方文档</a>
        </nav>
      </div>
      <div class="status" id="statusCard"></div>
    </section>

    <section class="workspace" id="demo">
      <aside class="panel auth-panel">
        <div class="panel__header">
          <h2>连接</h2>
          <button class="icon-button" id="resetBtn" title="清除本地连接信息" aria-label="清除本地连接信息">
            <i data-icon="Trash2"></i>
          </button>
        </div>

        <label>
          <span>EvoMap Hub</span>
          <input id="hubUrl" value="${escapeHtml(state.hubUrl)}" autocomplete="off" />
        </label>

        <label>
          <span>Scopes</span>
          <input id="scope" value="${escapeHtml(state.scope)}" autocomplete="off" />
        </label>

        <label>
          <span>Client ID</span>
          <input id="clientId" value="${escapeHtml(state.clientId)}" placeholder="可动态注册，也可粘贴已注册 app 的 client_id" autocomplete="off" />
        </label>

        <div class="button-row">
          <button class="button secondary" id="registerBtn">
            <i data-icon="KeyRound"></i>
            动态注册
          </button>
          <button class="button primary" id="loginBtn">
            <i data-icon="LogIn"></i>
            EvoMap 授权
          </button>
        </div>

        <details>
          <summary>已有 access token</summary>
          <label>
            <span>Bearer Token</span>
            <textarea id="tokenInput" rows="4" placeholder="黑客松排查时可临时粘贴 token"></textarea>
          </label>
          <button class="button secondary full" id="useTokenBtn">
            <i data-icon="CheckCircle2"></i>
            使用这个 token
          </button>
        </details>

        <div class="note">
          动态注册只申请只读权限。要启用完整 OIDC「用 EvoMap 登录」，请在开发者门户注册 app 后填入 client_id，并把 scope 加上 openid profile email。
        </div>
      </aside>

      <section class="panel tool-panel">
        <div class="panel__header">
          <h2>Prompt 增强器</h2>
          <span class="pill" id="modePill">Local compose</span>
        </div>

        <label>
          <span>用户需求</span>
          <textarea id="goalInput" rows="5" placeholder="例如：我想做一个帮助学生修改论文的 AI 网站"></textarea>
        </label>

        <div class="button-row">
          <button class="button primary" id="generateBtn">
            <i data-icon="Sparkles"></i>
            生成增强 Prompt
          </button>
          <button class="button secondary" id="sampleBtn">
            <i data-icon="RefreshCw"></i>
            填入示例
          </button>
        </div>

        <div class="results">
          <section class="output-card">
            <div class="output-card__header">
              <h3>增强后的 Prompt</h3>
              <button class="icon-button" id="copyPromptBtn" title="复制 Prompt" aria-label="复制 Prompt">
                <i data-icon="Copy"></i>
              </button>
            </div>
            <pre id="promptOutput">连接 EvoMap 后输入需求，这里会生成可复制的长提示词。</pre>
          </section>

          <section class="output-card">
            <div class="output-card__header">
              <h3>EvoMap 参考</h3>
              <button class="icon-button" id="copyRefsBtn" title="复制参考 JSON" aria-label="复制参考 JSON">
                <i data-icon="Copy"></i>
              </button>
            </div>
            <div id="referenceOutput" class="reference-list"></div>
          </section>
        </div>
      </section>
    </section>

    <section class="guide" id="guide">
      <div class="section-heading">
        <p class="eyebrow">Hackathon Guide</p>
        <h2>参赛者怎么基于 EvoMap 开发</h2>
        <p>把 EvoMap 当作 AI agent 的价值网络：用户授权后，你的 app 可以读取 recipe / gene / reuse 图谱，也可以在获得更高权限后发布 recipe。</p>
      </div>

      <div class="guide-grid">
        <article class="guide-card wide">
          <span>01</span>
          <h3>最短上手路径</h3>
          <ol>
            <li>创建 OAuth app，拿到 client_id，配置本地 redirect URI。</li>
            <li>发起 OAuth2 + PKCE 授权，请求最小 scope。</li>
            <li>用 code 换 access token。</li>
            <li>调用 /developer/oauth/recipes、/genes、/reuse。</li>
            <li>把结果包装成你的产品体验，而不是照搬 EvoMap 页面。</li>
          </ol>
        </article>

        <article class="guide-card">
          <span>02</span>
          <h3>推荐先做只读 Demo</h3>
          <p>优先申请 recipe:read、gene:read、reuse:query。读通以后再考虑 recipe:write、recipe:publish、webhook 和 test 沙箱。</p>
        </article>

        <article class="guide-card">
          <span>03</span>
          <h3>适合黑客松的方向</h3>
          <p>Prompt 增强器、垂直行业方案库、AI agent 工作流推荐、团队内部 recipe 管理、编辑器插件、recipe 发布助手。</p>
        </article>

        <article class="guide-card code-card">
          <span>04</span>
          <h3>授权 URL</h3>
          <pre>GET https://evomap.ai/oauth/authorize
  ?response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=http://127.0.0.1:5173/
  &scope=recipe:read gene:read reuse:query
  &code_challenge=BASE64URL(SHA256(verifier))
  &code_challenge_method=S256
  &state=RANDOM</pre>
        </article>

        <article class="guide-card code-card">
          <span>05</span>
          <h3>调用数据 API</h3>
          <pre>curl "https://evomap.ai/developer/oauth/recipes?q=prompt&limit=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

curl "https://evomap.ai/developer/oauth/genes?limit=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN"</pre>
        </article>
      </div>
    </section>

    <section class="api-map" id="api-map">
      <div class="section-heading compact">
        <p class="eyebrow">API Map</p>
        <h2>接口怎么选</h2>
      </div>
      <div class="api-table">
        <div><strong>登录/授权</strong><code>/oauth/authorize</code><code>/oauth/token</code><p>像 GitHub/Google 登录一样拿用户授权。</p></div>
        <div><strong>读方案</strong><code>/developer/oauth/recipes</code><p>按自然语言关键词搜索公开 recipe。</p></div>
        <div><strong>读能力</strong><code>/developer/oauth/genes</code><p>读取公开 gene 资产，作为方案参考。</p></div>
        <div><strong>查关联</strong><code>/developer/oauth/reuse</code><p>按 recipe_id 或 asset_id 找相关方案。</p></div>
        <div><strong>发布</strong><code>/developer/oauth/recipe</code><code>/developer/oauth/recipe/publish</code><p>从草稿到发布，建议先用 test 模式。</p></div>
        <div><strong>事件</strong><code>webhooks</code><p>监听平台事件，做投递日志、重试和集成自动化。</p></div>
      </div>
      <div class="resource-links">
        <a href="https://evomap.ai/dev/docs" target="_blank" rel="noreferrer">
          官方开发者文档 <i data-icon="ExternalLink"></i>
        </a>
        <a href="https://evomap.ai/openapi.json" target="_blank" rel="noreferrer">
          OpenAPI JSON <i data-icon="ExternalLink"></i>
        </a>
        <a href="https://github.com/EvoMap/developers" target="_blank" rel="noreferrer">
          Developer Community <i data-icon="ExternalLink"></i>
        </a>
      </div>
    </section>
  </main>
`;

wireIcons();
bindEvents();
handleOAuthCallback();
renderStatus();
renderReferences();

function loadState() {
  const fallback = {
    hubUrl: DEFAULT_HUB_URL,
    scope: DEFAULT_SCOPE,
    clientId: "",
    accessToken: "",
    tokenScope: "",
    user: null,
    lastReferences: null
  };

  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return fallback;
  }
}

function saveState(patch = {}) {
  Object.assign(state, patch);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindEvents() {
  const hubUrl = document.querySelector("#hubUrl");
  const scope = document.querySelector("#scope");
  const clientId = document.querySelector("#clientId");

  for (const input of [hubUrl, scope, clientId]) {
    input.addEventListener("change", () => {
      saveState({
        hubUrl: normalizeHubUrl(hubUrl.value),
        scope: scope.value.trim() || DEFAULT_SCOPE,
        clientId: clientId.value.trim()
      });
      renderStatus();
    });
  }

  document.querySelector("#registerBtn").addEventListener("click", registerClient);
  document.querySelector("#loginBtn").addEventListener("click", startOAuth);
  document.querySelector("#useTokenBtn").addEventListener("click", useManualToken);
  document.querySelector("#resetBtn").addEventListener("click", resetLocalState);
  document.querySelector("#generateBtn").addEventListener("click", generatePrompt);
  document.querySelector("#sampleBtn").addEventListener("click", () => {
    document.querySelector("#goalInput").value = "我想做一个帮助学生修改论文、给出修改理由和评分建议的 AI 网站";
  });
  document.querySelector("#copyPromptBtn").addEventListener("click", () => copyText(document.querySelector("#promptOutput").innerText));
  document.querySelector("#copyRefsBtn").addEventListener("click", () => copyText(JSON.stringify(state.lastReferences || {}, null, 2)));
}

async function registerClient() {
  const hubUrl = currentHubUrl();
  const scope = document.querySelector("#scope").value.trim() || DEFAULT_SCOPE;
  const redirectUri = redirectUriForThisPage();

  setStatusMessage("正在动态注册只读 Demo App...");
  try {
    const response = await fetch(`${hubUrl}/oauth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_name: "EvoMap Prompt Enhancer Demo",
        redirect_uris: [redirectUri],
        scope
      })
    });
    const data = await readJson(response);
    if (!response.ok) throw new Error(data.error_description || data.error || `HTTP ${response.status}`);

    document.querySelector("#clientId").value = data.client_id;
    saveState({ hubUrl, scope: data.scope || scope, clientId: data.client_id });
    renderStatus();
    setStatusMessage("动态注册成功，可以发起 EvoMap 授权。");
  } catch (error) {
    setStatusMessage(`动态注册失败：${error.message}`);
  }
}

async function startOAuth() {
  const hubUrl = currentHubUrl();
  const scope = document.querySelector("#scope").value.trim() || DEFAULT_SCOPE;
  const clientId = document.querySelector("#clientId").value.trim();

  if (!clientId) {
    setStatusMessage("请先动态注册，或填入开发者门户里的 client_id。");
    return;
  }

  const verifier = base64Url(randomBytes(64));
  const challenge = await sha256Base64Url(verifier);
  const oauthState = base64Url(randomBytes(24));
  sessionStorage.setItem("evomap_pkce_verifier", verifier);
  sessionStorage.setItem("evomap_oauth_state", oauthState);

  saveState({ hubUrl, scope, clientId });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUriForThisPage(),
    scope,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state: oauthState
  });

  window.location.href = `${hubUrl}/oauth/authorize?${params.toString()}`;
}

async function handleOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const returnedState = params.get("state");
  const error = params.get("error");

  if (error) {
    setStatusMessage(`授权失败：${params.get("error_description") || error}`);
    clearQueryString();
    return;
  }
  if (!code) return;

  const expectedState = sessionStorage.getItem("evomap_oauth_state");
  const verifier = sessionStorage.getItem("evomap_pkce_verifier");
  if (!verifier || !expectedState || returnedState !== expectedState) {
    setStatusMessage("OAuth 回调校验失败，请重新授权。");
    clearQueryString();
    return;
  }

  setStatusMessage("正在交换 access token...");
  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: state.clientId,
      redirect_uri: redirectUriForThisPage(),
      code_verifier: verifier
    });

    const response = await fetch(`${state.hubUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    const data = await readJson(response);
    if (!response.ok) throw new Error(data.error_description || data.error || `HTTP ${response.status}`);

    saveState({
      accessToken: data.access_token,
      tokenScope: data.scope || state.scope
    });
    sessionStorage.removeItem("evomap_pkce_verifier");
    sessionStorage.removeItem("evomap_oauth_state");
    clearQueryString();
    await loadUserInfoIfAvailable();
    renderStatus();
    setStatusMessage("已连接 EvoMap。");
  } catch (error) {
    clearQueryString();
    setStatusMessage(`换 token 失败：${error.message}`);
  }
}

async function loadUserInfoIfAvailable() {
  if (!state.accessToken || !scopeHas("openid")) return;
  try {
    const response = await apiFetch("/oauth/userinfo");
    if (response.ok) {
      saveState({ user: await response.json() });
    }
  } catch {
    saveState({ user: null });
  }
}

function useManualToken() {
  const token = document.querySelector("#tokenInput").value.trim();
  if (!token) return setStatusMessage("请先粘贴 access token。");
  saveState({
    hubUrl: currentHubUrl(),
    scope: document.querySelector("#scope").value.trim() || DEFAULT_SCOPE,
    clientId: document.querySelector("#clientId").value.trim(),
    accessToken: token,
    tokenScope: "manual"
  });
  renderStatus();
  setStatusMessage("已使用手动 token。");
}

async function generatePrompt() {
  const goal = document.querySelector("#goalInput").value.trim();
  if (!goal) return setStatusMessage("请先输入用户需求。");
  if (!state.accessToken) return setStatusMessage("请先连接 EvoMap，或粘贴 access token。");

  setBusy(true);
  setStatusMessage("正在读取 EvoMap recipe / gene / reuse 参考...");
  try {
    const references = await fetchReferences(goal);
    saveState({ lastReferences: references });
    renderReferences();

    const prompt = composePrompt(goal, references);
    document.querySelector("#promptOutput").textContent = prompt;
    setStatusMessage("Prompt 已生成。");
  } catch (error) {
    setStatusMessage(`生成失败：${error.message}`);
  } finally {
    setBusy(false);
  }
}

async function fetchReferences(goal) {
  const recipesUrl = `/developer/oauth/recipes?q=${encodeURIComponent(goal)}&limit=5`;
  const genesUrl = "/developer/oauth/genes?limit=5";

  const [recipesResponse, genesResponse] = await Promise.all([apiFetch(recipesUrl), apiFetch(genesUrl)]);
  const recipesData = await readJson(recipesResponse);
  const genesData = await readJson(genesResponse);

  if (!recipesResponse.ok) throw new Error(recipesData.error_description || recipesData.error || `recipes HTTP ${recipesResponse.status}`);
  if (!genesResponse.ok) throw new Error(genesData.error_description || genesData.error || `genes HTTP ${genesResponse.status}`);

  const recipes = listFromResponse(recipesData).slice(0, 5);
  const genes = listFromResponse(genesData).slice(0, 5);
  const topRecipeId = recipes[0]?.id;
  const topGeneId = genes[0]?.id;

  const reuse = {};
  if (topRecipeId) {
    const response = await apiFetch(`/developer/oauth/reuse?recipe_id=${encodeURIComponent(topRecipeId)}&limit=5`);
    reuse.byRecipe = await readJson(response);
  }
  if (topGeneId) {
    const response = await apiFetch(`/developer/oauth/reuse?asset_id=${encodeURIComponent(topGeneId)}&limit=5`);
    reuse.byGene = await readJson(response);
  }

  return { goal, recipes, genes, reuse, fetchedAt: new Date().toISOString() };
}

function composePrompt(goal, references) {
  const recipeLines = references.recipes.map((item, index) => {
    return `${index + 1}. ${itemTitle(item)}${item.id ? ` (id: ${item.id})` : ""}`;
  });
  const geneLines = references.genes.map((item, index) => {
    const type = item.type ? ` / type: ${item.type}` : "";
    return `${index + 1}. ${itemTitle(item)}${item.id ? ` (id: ${item.id}${type})` : type}`;
  });

  return `你是一个专业的 AI 任务架构师。请把用户的原始需求改写成一个可直接交给 AI 执行的高质量提示词。

用户原始需求：
${goal}

可参考的 EvoMap 方案：
Recipes:
${recipeLines.length ? recipeLines.join("\n") : "- 暂无匹配 recipe，请基于通用任务拆解方法处理。"}

Genes:
${geneLines.length ? geneLines.join("\n") : "- 暂无可用 gene，请基于通用任务拆解方法处理。"}

请生成最终提示词，要求：
1. 先明确 AI 应扮演的角色和目标。
2. 把用户需求拆成 3-7 个具体子任务。
3. 写清楚输入信息、处理步骤、输出格式和质量标准。
4. 如果用户需求缺少关键信息，先列出需要追问的问题。
5. 参考上面的 EvoMap recipe / gene，但不要照抄名称；把它们转化为可执行的方法。
6. 输出必须结构化，能被 ChatGPT、Claude、Codex 或其他 AI 直接使用。

最终请只输出增强后的提示词，不要解释你如何生成。`;
}

function renderReferences() {
  const target = document.querySelector("#referenceOutput");
  const references = state.lastReferences;
  if (!references) {
    target.innerHTML = `<p class="empty">还没有查询记录。</p>`;
    return;
  }

  const cards = [
    ...references.recipes.map((item) => referenceCard("Recipe", item)),
    ...references.genes.map((item) => referenceCard("Gene", item))
  ];

  target.innerHTML = cards.length ? cards.join("") : `<p class="empty">没有匹配到公开参考，仍可生成通用增强 Prompt。</p>`;
}

function referenceCard(kind, item) {
  return `
    <article class="reference-item">
      <span>${kind}</span>
      <strong>${escapeHtml(itemTitle(item))}</strong>
      <code>${escapeHtml(item.id || item.type || "no-id")}</code>
    </article>
  `;
}

function renderStatus() {
  const statusCard = document.querySelector("#statusCard");
  const connected = Boolean(state.accessToken);
  const identity = state.user?.name || state.user?.preferred_username || state.user?.email || "Bearer token";

  statusCard.innerHTML = `
    <div class="status__dot ${connected ? "is-on" : ""}"></div>
    <div>
      <strong>${connected ? "已连接 EvoMap" : "未连接"}</strong>
      <p>${connected ? escapeHtml(identity) : "先注册/授权，再读取能力网络。"}</p>
    </div>
  `;
}

function setStatusMessage(message) {
  const modePill = document.querySelector("#modePill");
  if (modePill) modePill.textContent = message;
}

function setBusy(isBusy) {
  document.querySelector("#generateBtn").disabled = isBusy;
  document.querySelector("#registerBtn").disabled = isBusy;
  document.querySelector("#loginBtn").disabled = isBusy;
}

function wireIcons() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    const Icon = icons[node.dataset.icon];
    if (!Icon) return;
    node.innerHTML = iconToSvg(Icon, { width: 18, height: 18, "stroke-width": 2 });
  });
}

function iconToSvg(iconNode, overrideAttrs = {}) {
  const [tag, attrs = {}, children = []] = iconNode;
  const mergedAttrs = tag === "svg" ? { ...attrs, ...overrideAttrs } : attrs;
  const attrText = Object.entries(mergedAttrs)
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(" ");
  const childText = children.map((child) => iconToSvg(child)).join("");
  return `<${tag}${attrText ? ` ${attrText}` : ""}>${childText}</${tag}>`;
}

function resetLocalState() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem("evomap_pkce_verifier");
  sessionStorage.removeItem("evomap_oauth_state");
  window.location.href = window.location.origin + window.location.pathname;
}

async function apiFetch(path) {
  return fetch(`${state.hubUrl}${path}`, {
    headers: { Authorization: `Bearer ${state.accessToken}` }
  });
}

async function readJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function listFromResponse(data) {
  if (Array.isArray(data)) return data;
  for (const key of ["items", "data", "recipes", "genes", "results"]) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

function itemTitle(item) {
  return item.title || item.name || item.summary || item.description || item.id || item.type || "Untitled asset";
}

function normalizeHubUrl(value) {
  return (value || DEFAULT_HUB_URL).trim().replace(/\/+$/, "");
}

function currentHubUrl() {
  const hubUrl = normalizeHubUrl(document.querySelector("#hubUrl").value);
  document.querySelector("#hubUrl").value = hubUrl;
  return hubUrl;
}

function redirectUriForThisPage() {
  return window.location.origin + window.location.pathname;
}

function clearQueryString() {
  window.history.replaceState({}, document.title, window.location.pathname);
}

function scopeHas(scope) {
  return (state.tokenScope || state.scope || "").split(/\s+/).includes(scope);
}

function randomBytes(length) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function sha256Base64Url(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64Url(new Uint8Array(digest));
}

function base64Url(bytes) {
  const raw = String.fromCharCode(...bytes);
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
  setStatusMessage("已复制。");
}
