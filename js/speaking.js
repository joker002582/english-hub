/* ============================================================
   speaking.js —— 口语模块
   场景对话（发音/跟读评分）/ 听写练习 / 48 音标表 / 地道表达
   ============================================================ */
(function () {
  let curScn = null;   // 当前场景（data-content.js 的 SCENARIOS 元素）
  let showZh = true;   // 是否显示中文翻译
  let dict = null;     // 听写状态 { lines, i, right, total, reveal }

  /* ---------- 场景导航 ---------- */
  function renderChips() {
    UI.$("#scnChips").innerHTML = window.SCENARIOS.map((s) =>
      `<button class="chip" data-scn="${s.id}">${s.icon} ${UI.esc(s.title)}</button>`).join("");
    UI.$$("#scnChips .chip").forEach((b) =>
      b.addEventListener("click", () => {
        curScn = window.SCENARIOS.find((s) => s.id === b.dataset.scn);
        renderScene();
      })
    );
    curScn = window.SCENARIOS[0];
    renderScene();
  }

  function renderScene() {
    if (!curScn) return;
    UI.$$("#scnChips .chip").forEach((b) => b.classList.toggle("active", b.dataset.scn === curScn.id));
    UI.$("#scnTitle").textContent = curScn.icon + " " + curScn.title;
    UI.$("#scnDesc").textContent = curScn.desc;
    UI.$("#scnLines").innerHTML = curScn.lines.map((l, i) => `
      <div class="scn-line">
        <div class="row" style="gap:8px;align-items:flex-start">
          <button class="say-btn" data-say="${i}" title="听发音">🔊</button>
          <div style="flex:1">
            <div class="en">${UI.esc(l.en)}</div>
            ${showZh ? `<div class="zh">${UI.esc(l.zh)}</div>` : ""}
          </div>
        </div>
        <div class="row" style="gap:8px;align-items:center;margin-top:4px">
          <button class="btn sm ghost" data-prac="${i}">🎙️ 跟读评测</button>
          <span class="scn-result" id="scn-result-${i}"></span>
        </div>
      </div>`).join("");
    UI.$$("#scnLines [data-say]").forEach((b) =>
      b.addEventListener("click", () => UI.tts(curScn.lines[+b.dataset.say].en))
    );
    UI.$$("#scnLines [data-prac]").forEach((b) =>
      b.addEventListener("click", () => practice(+b.dataset.prac, curScn.lines[+b.dataset.prac].en))
    );
  }

  /* 跟读评测：录音 → 识别 → 和原句对比打分 */
  async function practice(i, target) {
    const resultEl = UI.$("#scn-result-" + i);
    if (resultEl) resultEl.textContent = "🎙️ 正在听…请朗读这句话";
    try {
      const said = await UI.recognize("en-US");
      const score = UI.simScore(target, said);
      if (resultEl) {
        resultEl.textContent = `你说的是："${said}"　${UI.stars(score)}`;
      }
      UI.toast(score >= 0.8 ? "🌟 发音很棒！" : score >= 0.5 ? "👌 不错，再读一遍更流利" : "💪 差距有点大，先点 🔊 多听两遍再读");
    } catch (e) {
      if (resultEl) resultEl.textContent = "⚠️ " + e;
      UI.toast(String(e));
    }
  }

  /* ---------- 听写练习 ---------- */
  function startDict() {
    if (!curScn || !curScn.lines.length) {
      UI.toast("请先选择一个场景");
      return;
    }
    const lines = UI.shuffle(curScn.lines).slice(0, 5);
    dict = { lines, i: 0, right: 0, total: lines.length };
    UI.$("#dictPanel").classList.remove("hidden");
    UI.$("#dictInput").value = "";
    renderDict();
    UI.toast("🎧 听写开始！先点「播放」");
  }

  function renderDict() {
    if (!dict) return;
    const box = UI.$("#dictPanel");
    box.scrollIntoView({ behavior: "smooth", block: "center" });
    UI.$("#dictInput").value = "";
    if (dict.i >= dict.total) {
      const pct = Math.round((dict.right / dict.total) * 100);
      Stats.addDict();
      UI.$("#dictWord").textContent = "";
      UI.$("#dictScore").innerHTML = `<b>本轮结束：${dict.right}/${dict.total}（${pct}%）</b>`;
      UI.$("#dictInput").placeholder = "本轮结束，点「再来一轮」继续练";
      UI.$("#dictCheck").disabled = true;
      UI.$("#dictSkip").disabled = true;
      UI.$("#dictEnd").textContent = "🔁 再来一轮";
      UI.$("#dictEnd").onclick = () => { startDict(); UI.$("#dictCheck").disabled = false; UI.$("#dictSkip").disabled = false; UI.$("#dictEnd").textContent = "🏁 结束本轮"; };
      UI.toast(pct >= 80 ? "🎉 听力不错！" : "💪 听力需要多磨耳朵，再来一轮！");
      return;
    }
    UI.$("#dictWord").textContent = "第 " + (dict.i + 1) + " / " + dict.total + " 句";
    UI.$("#dictScore").innerHTML = `已对 <b>${dict.right}</b> 题`;
    UI.$("#dictCheck").disabled = false;
    UI.$("#dictSkip").disabled = false;
    UI.$("#dictEnd").textContent = "🏁 结束本轮";
    UI.$("#dictEnd").onclick = endDict;
    UI.$("#dictInput").placeholder = "先点「播放」听句子…";
    UI.$("#dictInput").focus();
  }

  function endDict() {
    if (!dict) return;
    Stats.addDict();
    UI.$("#dictWord").textContent = "";
    UI.$("#dictScore").innerHTML = `已结束，共对 <b>${dict.right}</b> 题（本轮 ${dict.i}/${dict.total}）`;
    UI.$("#dictCheck").disabled = true;
    UI.$("#dictSkip").disabled = true;
    dict = null;
    UI.$("#dictEnd").textContent = "🔁 再来一轮";
    UI.$("#dictEnd").onclick = () => { startDict(); UI.$("#dictCheck").disabled = false; UI.$("#dictSkip").disabled = false; UI.$("#dictEnd").textContent = "🏁 结束本轮"; };
  }

  function dictCurrent() {
    return dict && dict.i < dict.total ? dict.lines[dict.i].en : null;
  }

  function checkDict() {
    if (!dict || dict.i >= dict.total) return;
    const target = dictCurrent();
    const said = UI.$("#dictInput").value.trim();
    if (!said) { UI.toast("先写点什么再提交"); return; }
    const score = UI.simScore(target, said);
    const right = score >= 0.9;
    if (right) dict.right++;
    UI.$("#dictScore").innerHTML =
      (right ? "✅ 正确！" : `❌ 原句是：<b>${UI.esc(target)}</b>`) +
      `<br><span class="muted">你写的是：${UI.esc(said)}（${Math.round(score * 100)}%）</span>`;
    UI.tts(target, 1);
    dict.i++;
    setTimeout(renderDict, 2200);
  }

  /* ---------- 48 音标表 ---------- */
  function renderPhonemes() {
    const ph = window.PHONEMES;
    const table = (title, rows) => `
      <h3 style="margin:10px 0 6px">${title}</h3>
      <table class="ph-table"><tr>
        ${rows.map((r) => `<td data-say="${UI.esc(r[1])}">${UI.esc(r[0])}<small>${UI.esc(r[1])}</small></td>`).join("")}
      </tr></table>`;
    UI.$("#phonemeBox").innerHTML =
      `<div class="small muted">点击任意音标可听例词发音</div>` +
      table("元音 Vowels", ph.vowels) +
      table("辅音 Consonants", ph.consonants);
    UI.$$("#phonemeBox [data-say]").forEach((td) =>
      td.addEventListener("click", () => UI.tts(td.dataset.say))
    );
  }

  /* ---------- 地道表达 ---------- */
  function renderExpressions() {
    UI.$("#exprList").innerHTML = window.EXPRESSIONS.map((x) => `
      <div class="expr-item">
        <button class="say-btn" data-say="${UI.esc(x.en)}">🔊</button>
        <div>
          <div class="expr-en">${UI.esc(x.en)}</div>
          <div>${UI.esc(x.zh)}</div>
          <div class="expr-tip">💡 ${UI.esc(x.tip)}</div>
        </div>
      </div>`).join("");
    UI.$$("#exprList [data-say]").forEach((b) => b.addEventListener("click", () => UI.tts(b.dataset.say)));
  }

  /* ---------- 初始化 ---------- */
  window.SpeakInit = function () {
    renderChips();
    renderExpressions();

    UI.$("#showZh").addEventListener("change", (e) => { showZh = e.target.checked; renderScene(); });
    UI.$("#rateSel").addEventListener("change", (e) => UI.setRate(parseFloat(e.target.value)));

    UI.$("#dictBtn").addEventListener("click", startDict);
    UI.$("#dictSpeak").addEventListener("click", () => { const t = dictCurrent(); if (t) UI.tts(t, 1); });
    UI.$("#dictSlow").addEventListener("click", () => { const t = dictCurrent(); if (t) UI.tts(t, 0.7); });
    UI.$("#dictCheck").addEventListener("click", checkDict);
    UI.$("#dictSkip").addEventListener("click", () => {
      if (!dict || dict.i >= dict.total) return;
      const t = dictCurrent();
      UI.$("#dictScore").innerHTML = `⏭ 原句是：<b>${UI.esc(t)}</b>`;
      UI.tts(t, 1);
      dict.i++;
      setTimeout(renderDict, 2000);
    });
    UI.$("#dictInput").addEventListener("keydown", (e) => { if (e.key === "Enter") checkDict(); });

    UI.$("#phonemeToggle").addEventListener("click", () => {
      const box = UI.$("#phonemeBox");
      box.classList.toggle("hidden");
      if (!box.classList.contains("hidden") && !box.innerHTML) renderPhonemes();
    });
    renderPhonemes();
  };
})();
