/* ============================================================
   ai.js —— AI 陪练模块（DeepSeek API，OpenAI 兼容接口）
   自由对话 / 场景陪练 / 写作批改 / 中英互译 / 单词造句
   密钥只存在本地浏览器（eh_ai 键），通过 fetch 直接调用官方接口
   ============================================================ */
(function () {
  let cfg = null;      // { key, base, model }
  let mode = "free";   // 当前模式
  let history = [];    // 对话记录 [{role, content}]
  let busy = false;    // 是否正在等待回复

  /* ---------- 模式定义 ---------- */
  const MODES = {
    free: {
      note: "和 AI 英语老师 Emma 随便聊。她会温和纠正你的错误：先英文、必要时附简短中文提示。",
      sys: "You are Emma, a warm and patient English speaking tutor. Your student is a Chinese college freshman with a weak English foundation, preparing for PRETCO then CET-4/6 then BEC, and mainly wants fluent, natural everyday conversation with foreigners. Rules: keep replies short and conversational (under 120 words); use simple, natural spoken English; after the English reply, add a very short Chinese note ONLY when the student seems to need clarification or you corrected an error, formatted as 「提示：...」; when the student makes a grammar or word choice mistake, gently correct it in that note; encourage them and keep the chat going with a follow-up question.",
    },
    restaurant: {
      note: "场景陪练：你在国外餐厅，AI 扮演服务员。点餐、加单、买单都练一遍。",
      sys: "Role-play: you are a friendly waiter/waitress in a casual restaurant abroad. The user is a customer who wants to order food. Stay in character, keep replies short and natural (under 80 words). You may occasionally add a very short Chinese tip in 「提示：...」 to teach a useful phrase. Guide the conversation through: greeting, ordering, asking about the dish, ordering a drink, asking for the bill.",
    },
    interview: {
      note: "场景陪练：AI 扮演面试官，练习英文自我介绍和常见面试问题（对以后求职和 BEC 口语都有用）。",
      sys: "Role-play: you are a hiring manager interviewing the user for an entry-level IT job (the user studies computer networking). Ask common interview questions one at a time in simple English, give feedback on answers, and add a short Chinese tip in 「提示：...」 when helpful. Keep replies under 100 words.",
    },
    meeting: {
      note: "场景陪练：AI 扮演会议主持人，练习商务会议口语（BEC 口语方向）。",
      sys: "Role-play: you are chairing a small English business meeting about a project update. The user is a team member. Use simple business English (agenda, update, deadline, action items), keep replies under 100 words, and occasionally add a short Chinese tip in 「提示：...」 teaching a useful business phrase.",
    },
    campus: {
      note: "场景陪练：模拟校园里和外国同学闲聊（宿舍、食堂、社团、游戏都可以聊）。",
      sys: "Role-play: you are a friendly international student on campus chatting with the user, a Chinese college freshman. Chat naturally about dorm life, food, classes, hobbies, video games. Keep replies short and fun (under 90 words). Occasionally add a short Chinese tip in 「提示：...」 with a cool everyday expression.",
    },
    writing: {
      needInput: "✍️ 把你要批改的英语作文粘贴到下面（建议 80 词以上）",
      note: "粘贴作文后点「开始」，AI 会改语法、换更地道的表达、按四级标准打分并给出中文讲解。",
      sys: "You are a CET-4 writing coach. When the user submits an English essay, do the following in Chinese: 1) give a score out of 15 with a one-line reason; 2) list every grammar and word-choice mistake with corrections (original → corrected → why); 3) rewrite the essay into a better version in English; 4) give 2-3 specific improvement tips. Keep it organized and encouraging.",
    },
    translate: {
      needInput: "🈶 输入中文或英文，AI 自动识别方向",
      note: "中英互译：会给出翻译、关键词汇和用法说明，适合练汉译英（四六级题型）。",
      sys: "You are a helpful translator between Chinese and English. Detect the input language and translate it into the other. Reply in this format: 1) the translation; 2) key words with pinyin-free brief notes; 3) one usage tip for the most useful phrase. Keep explanations in Chinese and concise.",
    },
    sentence: {
      needInput: "💡 输入一个英文单词，AI 造 3 个由浅入深的例句",
      note: "用 AI 给单词造句，例句由易到难，附中文翻译和用法说明。",
      sys: "The user gives you one English word or phrase. Reply with: 1) its Chinese meaning(s) and part of speech; 2) three example sentences from easy to hard (each under 15 words, natural spoken English) with Chinese translations; 3) one short usage note in Chinese. Keep the whole reply concise.",
    },
  };

  /* ---------- 配置 ---------- */
  function loadCfg() {
    cfg = Store.get("ai", { key: "", base: "https://api.deepseek.com", model: "deepseek-chat" });
    UI.$("#aiKey").value = cfg.key;
    UI.$("#aiBase").value = cfg.base;
    UI.$("#aiModel").value = cfg.model;
    updateStatus();
  }

  function saveCfg() {
    cfg = {
      key: UI.$("#aiKey").value.trim(),
      base: UI.$("#aiBase").value.trim().replace(/\/+$/, "") || "https://api.deepseek.com",
      model: UI.$("#aiModel").value.trim() || "deepseek-chat",
    };
    Store.set("ai", cfg);
    UI.toast("💾 配置已保存（只存在本机浏览器）");
    updateStatus();
  }

  function updateStatus() {
    UI.$("#aiStatus").innerHTML = cfg && cfg.key
      ? '<span style="color:var(--ok)">● 已配置</span>'
      : '<span style="color:var(--warn)">● 未配置 Key</span>';
  }

  async function testConnection() {
    if (!cfg || !cfg.key) { UI.toast("请先填写并保存 API Key"); return; }
    const st = UI.$("#aiStatus");
    st.innerHTML = '<span style="color:var(--muted)">⏳ 测试中…</span>';
    try {
      const res = await chat("Reply with the single word: OK", true);
      st.innerHTML = '<span style="color:var(--ok)">✅ 连接成功！回复：' + UI.esc(res) + "</span>";
    } catch (e) {
      st.innerHTML = '<span style="color:var(--bad)">❌ ' + UI.esc(e.message) + "</span>";
    }
  }

  /* ---------- 核心：调用 DeepSeek ---------- */
  function chat(userText, isTest) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 60000);
    const msgs = [];
    if (!isTest) {
      const m = MODES[mode];
      msgs.push({ role: "system", content: m.sys });
      msgs.push(...history.slice(-30));
    }
    msgs.push({ role: "user", content: userText });

    return fetch(cfg.base + "/chat/completions", {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + cfg.key,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: msgs,
        max_tokens: isTest ? 16 : 800,
        temperature: isTest ? 0 : 1.0,
      }),
    }).then(async (res) => {
      clearTimeout(timer);
      if (!res.ok) {
        let detail = "";
        try { detail = (await res.json()).error && (await res.json()).error.message; } catch (e) { /* 忽略 */ }
        const map = {
          401: "API Key 不正确，请检查是否复制完整（sk- 开头）",
          402: "余额不足，请到 platform.deepseek.com 充值",
          429: "请求太频繁或额度用尽，稍后再试",
          400: "请求格式错误：" + (detail || ""),
          500: "服务端出错，稍后再试",
        };
        throw new Error(map[res.status] || ("请求失败（HTTP " + res.status + "）" + (detail ? "：" + detail : "")));
      }
      const data = await res.json();
      return data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : "";
    }).catch((e) => {
      clearTimeout(timer);
      if (e.name === "AbortError") throw new Error("请求超时，请重试");
      if (e instanceof TypeError) throw new Error("网络请求被拦截：如果网页是双击打开的，请改用 python server.py 启动后再试");
      throw e;
    });
  }

  /* ---------- 界面 ---------- */
  function renderModes() {
    UI.$$("#aiModeChips .chip").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
    const m = MODES[mode];
    UI.$("#aiModeNote").textContent = m.note || "";
    if (m.needInput) {
      UI.$("#aiExtraArea").classList.remove("hidden");
      UI.$("#aiExtraLabel").textContent = m.needInput;
      UI.$("#aiExtraInput").placeholder = m.needInput;
    } else {
      UI.$("#aiExtraArea").classList.add("hidden");
    }
  }

  function renderLog() {
    const log = UI.$("#chatLog");
    if (!history.length) {
      log.innerHTML = `<div class="msg ai">Hi! I'm Emma, your English speaking tutor. 👋<br><span class="muted" style="font-size:13px">随便发一句英语试试，比如：Hello, my name is ...</span></div>`;
    } else {
      log.innerHTML = history.map((h) => {
        if (h.role === "user") {
          return `<div class="msg user">${UI.esc(h.content)}</div>`;
        }
        return `<div class="msg ai">${UI.esc(h.content)}
          <div class="m-row"><button class="m-speak" data-say="${UI.esc(h.content)}">🔊 朗读</button></div>
        </div>`;
      }).join("");
      UI.$$("#chatLog [data-say]").forEach((b) =>
        b.addEventListener("click", () => UI.tts(b.dataset.say))
      );
    }
    log.scrollTop = log.scrollHeight;
    UI.$("#aiCount").textContent = "对话 " + history.length + " 条 · 模型 " + (cfg ? cfg.model : "deepseek-chat");
  }

  function addMsg(role, content) {
    history.push({ role, content });
    if (history.length > 60) history = history.slice(-60);
    Store.set("aiChat", history);
    renderLog();
  }

  async function send(text) {
    text = (text || UI.$("#aiInput").value).trim();
    if (!text) return;
    if (!cfg || !cfg.key) {
      UI.toast("请先在上方配置 API Key");
      return;
    }
    if (busy) { UI.toast("AI 正在思考，请稍等…"); return; }
    busy = true;
    UI.$("#aiInput").value = "";
    addMsg("user", text);
    Stats.addAi();
    const log = UI.$("#chatLog");
    const typing = document.createElement("div");
    typing.className = "msg ai typing";
    typing.textContent = "思考中";
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;
    try {
      const reply = await chat(text, false);
      typing.remove();
      addMsg("assistant", reply);
    } catch (e) {
      typing.remove();
      addMsg("assistant", "⚠️ " + e.message);
      UI.toast(String(e.message));
    }
    busy = false;
  }

  function openWith(m, text) {
    mode = m;
    renderModes();
    if (MODES[m].needInput && text != null) {
      UI.$("#aiExtraInput").value = text;
      if (m === "sentence" || m === "translate" || m === "writing") goExtra();
    }
  }

  function goExtra() {
    const m = MODES[mode];
    if (!m.needInput) return;
    const text = UI.$("#aiExtraInput").value.trim();
    if (!text) { UI.toast("请先输入内容"); return; }
    const prefix = mode === "writing" ? "请批改下面这篇作文：\n\n" : mode === "sentence" ? "请用这个词造句：" : "请翻译：";
    send(prefix + text);
  }

  /* ---------- 初始化 ---------- */
  window.AiInit = function () {
    loadCfg();
    history = Store.get("aiChat", []);
    renderLog();
    renderModes();

    UI.$$("#aiModeChips .chip").forEach((b) =>
      b.addEventListener("click", () => {
        mode = b.dataset.mode;
        renderModes();
        if (MODES[mode].needInput) UI.$("#aiExtraInput").focus();
        else UI.$("#aiInput").focus();
      })
    );
    UI.$("#aiSave").addEventListener("click", saveCfg);
    UI.$("#aiTest").addEventListener("click", testConnection);
    UI.$("#aiExtraGo").addEventListener("click", goExtra);
    UI.$("#aiSend").addEventListener("click", () => send());
    UI.$("#aiInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    });
    UI.$("#aiMic").addEventListener("click", async () => {
      UI.toast("🎤 正在听…请说英语");
      try {
        const said = await UI.recognize("en-US");
        UI.$("#aiInput").value = said;
      } catch (e) { UI.toast(String(e)); }
    });
    UI.$("#aiClear").addEventListener("click", () => {
      if (!history.length) return;
      history = [];
      Store.set("aiChat", []);
      renderLog();
      UI.toast("对话已清空");
    });
  };

  /* 供其他模块调用（如词汇页的 AI 造句按钮） */
  window.AI = { openWith };
})();
