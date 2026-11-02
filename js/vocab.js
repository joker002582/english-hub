/* ============================================================
   vocab.js —— 词汇模块
   分类词卡学习 / 三种测验（英译中、中译英、拼写）/ 生词本
   ============================================================ */
(function () {
  let curSet = "ab";      // 当前词库 id（见 data-vocab.js 的 VOCAB）
  let idx = 0;            // 当前卡片下标
  let pool = [];          // 当前展示顺序（洗牌后或搜索结果）
  let mode = "learn";     // learn | quiz
  let quizType = "en2zh"; // en2zh | zh2en | spell
  let quiz = null;        // 测验状态 { bank, i, right, total }

  const wordsOf = (set) => (window.VOCAB[set] && window.VOCAB[set].words) || [];

  /* 单词 → 释义 的全局索引（生词本查释义用） */
  let WORD_INDEX = null;
  function buildIndex() {
    if (WORD_INDEX) return WORD_INDEX;
    WORD_INDEX = {};
    Object.keys(window.VOCAB).forEach((set) => {
      wordsOf(set).forEach((w) => {
        if (!WORD_INDEX[w.w]) WORD_INDEX[w.w] = { setId: set, entry: w };
      });
    });
    return WORD_INDEX;
  }

  /* ---------- 分类导航 ---------- */
  function renderChips() {
    UI.$("#vocabCatChips").innerHTML = Object.keys(window.VOCAB).map((c) =>
      `<button class="chip" data-set="${c}">${UI.esc(window.VOCAB[c].title)}</button>`).join("");
    UI.$$("#vocabCatChips .chip").forEach((b) =>
      b.addEventListener("click", () => {
        curSet = b.dataset.set;
        setMode("learn");
        resetPool();
        refresh();
      })
    );
  }

  function resetPool() {
    pool = UI.shuffle(wordsOf(curSet));
    idx = 0;
  }

  /* ---------- 刷新整个模块（进度 + 当前视图） ---------- */
  function refresh() {
    UI.$$("#vocabCatChips .chip").forEach((b) => b.classList.toggle("active", b.dataset.set === curSet));
    UI.$("#vocabCatDesc").textContent = window.VOCAB[curSet] ? window.VOCAB[curSet].desc : "";

    const words = wordsOf(curSet);
    const known = words.filter((w) => VocabStore.statusOf(curSet, w.w) === 1).length;
    const seen = words.filter((w) => VocabStore.statusOf(curSet, w.w)).length;
    UI.$("#vocabProgressText").textContent = `已认识 ${known}/${words.length} · 已学习 ${seen}/${words.length}`;
    UI.$("#vocabProgressBar").style.width = ((seen / Math.max(1, words.length)) * 100) + "%";
    UI.$("#notebookCount").textContent = VocabStore.notebook().length;

    UI.$("#vocabModeLearn").classList.toggle("primary", mode === "learn");
    UI.$("#vocabModeQuiz").classList.toggle("primary", mode === "quiz");
    UI.$("#vocabLearn").classList.toggle("hidden", mode !== "learn");
    UI.$("#vocabQuiz").classList.toggle("hidden", mode !== "quiz");

    if (mode === "learn") renderCard();
    else renderQuiz();
  }

  /* ---------- 学习模式 ---------- */
  function renderCard() {
    if (!pool.length) {
      UI.$("#vocabCard").innerHTML = `<div class="muted">该词库暂无单词</div>`;
      return;
    }
    const w = pool[idx % pool.length];
    const st = VocabStore.statusOf(curSet, w.w);
    UI.$("#vocabCard").innerHTML = `
      <div class="row between" style="flex-wrap:wrap;gap:10px">
        <div>
          <div class="word">${UI.esc(w.w)}</div>
          <div class="row" style="gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap">
            <span class="phon">${UI.esc(w.p || "")}</span>
            <span class="pos-tag">${UI.esc(w.pos || "")}</span>
            ${st ? `<span class="tag">${st === 1 ? "✅ 已认识" : "📕 生词"}</span>` : ""}
          </div>
        </div>
        <div class="small muted">${idx + 1} / ${pool.length}</div>
      </div>
      <div class="word-zh">${UI.esc(w.zh || "")}</div>
      <div class="ex-box">
        <div class="ex-en">${UI.esc(w.ex || "")}</div>
        <div class="ex-zh">${UI.esc(w.exZh || "")}</div>
      </div>`;
  }

  function next(delta) {
    if (!pool.length) return;
    idx = (idx + delta + pool.length) % pool.length;
    renderCard();
  }

  function mark(status) {
    if (!pool.length) return;
    const w = pool[idx % pool.length];
    VocabStore.mark(curSet, w.w, status);
    UI.toast(status === 1 ? `✅ 已标记认识：${w.w}` : `📕 已加入生词本：${w.w}`);
    next(1);
    refresh();
  }

  function setMode(m) {
    mode = m;
    if (m === "quiz") startQuiz();
  }

  /* ---------- 测验模式 ---------- */
  function startQuiz() {
    const bank = pool.length
      ? pool.slice(0, Math.min(10, pool.length))
      : UI.shuffle(wordsOf(curSet)).slice(0, 10);
    if (!bank.length) {
      UI.$("#vocabQuizBox").innerHTML = `<div class="muted">该词库暂无单词</div>`;
      return;
    }
    quiz = { bank: UI.shuffle(bank), i: 0, right: 0, total: bank.length, answered: false };
    renderQuiz();
  }

  const QUIZ_TYPES = [
    { id: "en2zh", label: "英 → 中" },
    { id: "zh2en", label: "中 → 英" },
    { id: "spell", label: "拼写" },
  ];

  function renderQuiz() {
    if (!quiz) { startQuiz(); return; }
    const box = UI.$("#vocabQuizBox");

    // 轮次结束 → 显示成绩
    if (quiz.i >= quiz.total) {
      const pct = Math.round((quiz.right / quiz.total) * 100);
      const comment = pct >= 80 ? "太棒了！这些词你已经拿下 🔥" : pct >= 60 ? "不错！错词已自动看一遍，下次全对 💪" : "别灰心，多看几遍卡片再来一轮 📖";
      box.innerHTML = `
        <div class="score-big">${quiz.right} / ${quiz.total}（${pct}%）</div>
        <div class="small muted center">${comment}</div>
        <div class="center mt12"><button class="btn primary" id="vocabQuizAgain">🔄 再来一轮</button></div>`;
      UI.$("#vocabQuizAgain").addEventListener("click", () => { startQuiz(); });
      return;
    }

    const w = quiz.bank[quiz.i];
    const typeRow = QUIZ_TYPES.map((t) =>
      `<button class="btn sm ${t.id === quizType ? "primary" : ""}" data-qtype="${t.id}">${t.label}</button>`).join("");

    if (quizType === "en2zh" || quizType === "zh2en") {
      const others = wordsOf(curSet).filter((x) => x.w !== w.w);
      const distract = UI.shuffle(others).slice(0, 3).map((x) => quizType === "en2zh" ? x.zh : x.w);
      const opts = UI.shuffle([...distract, quizType === "en2zh" ? w.zh : w.w]);
      const qText = quizType === "en2zh"
        ? `<div class="row" style="gap:10px;flex-wrap:wrap;align-items:center">
             <span class="word" style="font-size:30px">${UI.esc(w.w)}</span>
             <span class="phon">${UI.esc(w.p || "")}</span>
             <button class="say-btn" id="vqSpeak">🔊</button>
           </div><div class="muted small mt8">选出正确的中文意思：</div>`
        : `<div class="word-zh">${UI.esc(w.zh || "")}</div><div class="muted small mt8">选出对应的英文单词：</div>`;
      box.innerHTML = `
        <div class="row between" style="flex-wrap:wrap;gap:8px">
          <div class="row" style="gap:6px">${typeRow}</div>
          <span class="small muted">${quiz.i + 1} / ${quiz.total} · 已对 ${quiz.right}</span>
        </div>
        <div class="mt12">${qText}</div>
        <div class="mt8">${opts.map((o) => `<div class="quiz-opt">${UI.esc(o)}</div>`).join("")}</div>
        <div class="why-box hidden" id="vqWhy"></div>
        <div class="mt8 hidden" id="vqNextRow"><button class="btn primary sm" id="vqNext">下一题 ➡</button></div>`;
      const speakBtn = UI.$("#vqSpeak");
      if (speakBtn) speakBtn.addEventListener("click", () => UI.tts(w.w));
      UI.$$("#vocabQuizBox .quiz-opt").forEach((el) =>
        el.addEventListener("click", () => {
          if (quiz.answered) return;
          quiz.answered = true;
          const right = el.textContent === (quizType === "en2zh" ? w.zh : w.w);
          const correctText = quizType === "en2zh" ? w.zh : w.w;
          UI.$$("#vocabQuizBox .quiz-opt").forEach((x) => {
            if (x.textContent === correctText) x.classList.add("right");
            else if (x === el) x.classList.add("wrong");
          });
          if (right) quiz.right++;
          UI.$("#vqWhy").classList.remove("hidden");
          UI.$("#vqWhy").innerHTML = (right ? "✅ 正确！" : `❌ 正确答案是：<b>${UI.esc(correctText)}</b>`) +
            `<br>${UI.esc(w.w)} ${UI.esc(w.p || "")} · ${UI.esc(w.zh || "")}<br>例句：${UI.esc(w.ex || "")}<br><span class="muted">${UI.esc(w.exZh || "")}</span>`;
          UI.$("#vqNextRow").classList.remove("hidden");
          UI.$("#vqNext").addEventListener("click", advanceQuiz);
        })
      );
      UI.$$("#vocabQuizBox [data-qtype]").forEach((b) =>
        b.addEventListener("click", () => { quizType = b.dataset.qtype; renderQuiz(); })
      );
      return;
    }

    // 拼写模式：听音 + 看中文，把单词打出来
    box.innerHTML = `
      <div class="row between" style="flex-wrap:wrap;gap:8px">
        <div class="row" style="gap:6px">${typeRow}</div>
        <span class="small muted">${quiz.i + 1} / ${quiz.total} · 已对 ${quiz.right}</span>
      </div>
      <div class="mt12 row" style="gap:10px;flex-wrap:wrap;align-items:center">
        <button class="btn" id="vqSpeak">🔊 听发音</button>
        <span class="word-zh" style="margin:0">${UI.esc(w.zh || "")}</span>
      </div>
      <input type="text" id="vqSpellInput" class="mt12" placeholder="拼写出这个单词..." autocomplete="off">
      <div class="row mt12" style="gap:8px;flex-wrap:wrap">
        <button class="btn primary" id="vqSpellCheck">✅ 提交</button>
        <button class="btn ghost" id="vqSpellSkip">⏭ 不会，看答案</button>
      </div>
      <div class="why-box hidden mt8" id="vqWhy"></div>`;
    UI.$("#vqSpeak").addEventListener("click", () => UI.tts(w.w));
    const input = UI.$("#vqSpellInput");
    input.focus();
    const finish = (right) => {
      if (right) quiz.right++;
      UI.$("#vqWhy").classList.remove("hidden");
      UI.$("#vqWhy").innerHTML = (right ? "✅ 拼写正确！" : `❌ 正确答案是：<b>${UI.esc(w.w)}</b>`) +
        `<br>${UI.esc(w.w)} ${UI.esc(w.p || "")} · ${UI.esc(w.zh || "")}<br>例句：${UI.esc(w.ex || "")}<br><span class="muted">${UI.esc(w.exZh || "")}</span>` +
        `<div class="mt8"><button class="btn primary sm" id="vqNext">下一题 ➡</button></div>`;
      UI.$("#vqNext").addEventListener("click", () => { quiz.i++; quiz.answered = false; renderQuiz(); });
    };
    const doCheck = () => {
      if (quiz.answered) return;
      quiz.answered = true;
      const said = input.value.trim();
      const right = UI.norm(said).join(" ") === UI.norm(w.w).join(" ");
      finish(right);
    };
    UI.$("#vqSpellCheck").addEventListener("click", doCheck);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") doCheck(); });
    UI.$("#vqSpellSkip").addEventListener("click", () => { if (quiz.answered) return; quiz.answered = true; finish(false); });
    UI.$$("#vocabQuizBox [data-qtype]").forEach((b) =>
      b.addEventListener("click", () => { quizType = b.dataset.qtype; renderQuiz(); })
    );
  }

  /* 进入下一题；整轮结束时记录成绩到统计 */
  function advanceQuiz() {
    quiz.i++;
    quiz.answered = false;
    if (quiz.i >= quiz.total) Stats.addQuiz(curSet, quiz.right, quiz.total);
    renderQuiz();
  }

  /* ---------- 生词本 ---------- */
  function renderNotebook() {
    const idx2 = buildIndex();
    const list = VocabStore.notebook();
    if (!list.length) {
      UI.$("#notebookList").innerHTML = `<div class="muted">生词本是空的。在词汇卡上点「📕 生词」就会把单词收进来。</div>`;
      return;
    }
    UI.$("#notebookList").innerHTML = list.map((item) => {
      const info = idx2[item.w];
      const zh = info ? info.entry.zh : "";
      return `<div class="notebook-item">
        <button class="say-btn" data-say="${UI.esc(item.w)}">🔊</button>
        <span class="w">${UI.esc(item.w)}</span>
        <span class="z">${UI.esc(zh)}</span>
        <span class="grow"></span>
        <button class="btn sm ok" data-remove="${UI.esc(item.w)}">已学会</button>
      </div>`;
    }).join("");
    UI.$$("#notebookList [data-say]").forEach((b) => b.addEventListener("click", () => UI.tts(b.dataset.say)));
    UI.$$("#notebookList [data-remove]").forEach((b) =>
      b.addEventListener("click", () => {
        const item = list.find((x) => x.w === b.dataset.remove);
        if (item) VocabStore.removeNotebook(item.setId, item.w);
        UI.toast("👏 已从生词本移除，继续加油！");
        refresh();
        renderNotebook();
      })
    );
  }

  function exportNotebook() {
    const idx2 = buildIndex();
    const list = VocabStore.notebook();
    if (!list.length) { UI.toast("生词本是空的"); return; }
    const text = list.map((item) => {
      const info = idx2[item.w];
      return item.w + " — " + (info ? info.entry.zh : "") + (info ? "（" + window.VOCAB[info.setId].title + "）" : "");
    }).join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => UI.toast("📤 已复制到剪贴板，可粘贴到笔记软件"),
        () => UI.toast("复制失败，请手动选中文本复制")
      );
    } else {
      UI.toast("浏览器不支持复制，请升级到 Chrome/Edge");
    }
  }

  /* ---------- 初始化 ---------- */
  window.VocabInit = function () {
    renderChips();
    UI.$("#vocabModeLearn").addEventListener("click", () => { setMode("learn"); refresh(); });
    UI.$("#vocabModeQuiz").addEventListener("click", () => { setMode("quiz"); refresh(); });
    UI.$("#notebookBtn").addEventListener("click", () => {
      const panel = UI.$("#notebookPanel");
      panel.classList.toggle("hidden");
      if (!panel.classList.contains("hidden")) renderNotebook();
    });
    UI.$("#notebookExport").addEventListener("click", exportNotebook);
    UI.$("#notebookClear").addEventListener("click", () => {
      if (!confirm("确定清空生词本吗？")) return;
      VocabStore.clearNotebook();
      refresh();
      renderNotebook();
      UI.toast("生词本已清空");
    });
    UI.$("#vocabPrev").addEventListener("click", () => next(-1));
    UI.$("#vocabNext").addEventListener("click", () => next(1));
    UI.$("#vocabShuffle").addEventListener("click", () => { resetPool(); refresh(); });
    UI.$("#vocabKnown").addEventListener("click", () => mark(1));
    UI.$("#vocabWrong").addEventListener("click", () => mark(2));
    UI.$("#vocabSpeak").addEventListener("click", () => {
      if (pool.length) UI.tts(pool[idx % pool.length].w);
    });
    UI.$("#vocabAi").addEventListener("click", () => {
      if (!pool.length) return;
      const w = pool[idx % pool.length].w;
      App.showTab("ai");
      AI.openWith("sentence", w);
    });
    UI.$("#vocabSearch").addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) resetPool();
      else {
        pool = UI.shuffle(wordsOf(curSet).filter((w) => (w.w + " " + (w.zh || "")).toLowerCase().includes(q)));
        idx = 0;
      }
      if (mode === "learn") renderCard();
      else startQuiz();
    });
    resetPool();
    refresh();
  };

  /* 供 App.showTab 调用 */
  window.Vocab = { render: refresh };
})();
