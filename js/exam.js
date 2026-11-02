/* ============================================================
   exam.js —— 语法 + 考试模块
   语法主题手风琴（含随堂小测验）/ AB·四六级·BEC 攻略 / 真题风格样题 / 资源
   ============================================================ */
(function () {
  /* ==================== 语法 ==================== */
  function renderGrammar() {
    UI.$("#grammarList").innerHTML = window.GRAMMAR.map((g, gi) => `
      <div class="acc" id="acc-${gi}">
        <div class="acc-head">
          <span>${gi + 1}. ${UI.esc(g.title)}</span>
          <span class="acc-arrow">▾</span>
        </div>
        <div class="acc-body">
          ${g.points.map((p) => `<div class="g-point"><h4>${UI.esc(p.h)}</h4><div>${UI.esc(p.t)}</div></div>`).join("")}
          <div class="g-ex">
            ${g.examples.map((e) => `<div>· ${UI.esc(e.en)}<div class="z">${UI.esc(e.zh)}</div></div>`).join("")}
          </div>
          <h3>📝 随堂小测验</h3>
          <div id="gq-${gi}">${g.quiz.map((q, qi) => renderGQuiz(gi, qi, q)).join("")}</div>
        </div>
      </div>`).join("");
    UI.$$("#grammarList .acc-head").forEach((h) =>
      h.addEventListener("click", () => h.parentElement.classList.toggle("open"))
    );
    // 随堂测验绑定
    window.GRAMMAR.forEach((g, gi) => {
      g.quiz.forEach((q, qi) => {
        const wrap = UI.$("#gq-" + gi + " [data-qi='" + qi + "']");
        if (!wrap) return;
        wrap.querySelectorAll(".quiz-opt").forEach((el) =>
          el.addEventListener("click", () => {
            if (wrap.dataset.done === "1") return;
            wrap.dataset.done = "1";
            const oi = +el.dataset.oi;
            wrap.querySelectorAll(".quiz-opt").forEach((x, xi) => {
              if (xi === q.a) x.classList.add("right");
              else if (xi === oi) x.classList.add("wrong");
            });
            wrap.querySelector(".gq-why").classList.remove("hidden");
            wrap.querySelector(".gq-why").innerHTML =
              (oi === q.a ? "✅ 正确！" : "❌ 再想想，答案是 " + String.fromCharCode(65 + q.a) + "。") +
              "<br>" + UI.esc(q.why);
          })
        );
      });
    });
  }

  function renderGQuiz(gi, qi, q) {
    return `
      <div class="mb12" data-qi="${qi}">
        <div style="font-weight:600">${UI.esc(q.q)}</div>
        <div class="mt8">${q.opts.map((o, oi) =>
          `<div class="quiz-opt" data-oi="${oi}">${String.fromCharCode(65 + oi)}. ${UI.esc(o)}</div>`).join("")}</div>
        <div class="why-box gq-why hidden"></div>
      </div>`;
  }

  /* ==================== 考试攻略 ==================== */
  let curExam = "ab";

  function renderExamInfo() {
    const e = window.EXAM[curExam];
    if (!e) return;
    UI.$("#examInfo").innerHTML = `
      <div class="card">
        <h2>${UI.esc(e.name)}</h2>
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:8px">
          <span class="tag">⏰ ${UI.esc(e.time)}</span>
          <span class="tag">💯 ${UI.esc(e.score)}</span>
        </div>
        <p class="small">${UI.esc(e.intro)}</p>
        <div class="tbl-wrap"><table class="tbl">
          <tr><th>题型</th><th>分值</th><th>备考提示</th></tr>
          ${e.sections.map((s) => `<tr><td>${UI.esc(s.name)}</td><td>${UI.esc(s.percent)}</td><td>${UI.esc(s.tip)}</td></tr>`).join("")}
        </table></div>
        <h3 class="mt12">🎯 备考技巧</h3>
        <ul class="skill-list">${e.skills.map((s) => `<li>${UI.esc(s)}</li>`).join("")}</ul>
        <h3 class="mt12">✍️ 写作模板</h3>
        ${e.writing.map((w, wi) => `
          <div class="template-box">
            <div class="row between" style="flex-wrap:wrap;gap:8px">
              <b>${UI.esc(w.title)}</b>
              <button class="btn sm ghost" data-copy="${curExam}-${wi}">📋 复制模板</button>
            </div>
            <pre>${UI.esc(w.template)}</pre>
            <div class="small muted">${UI.esc(w.zh)}</div>
          </div>`).join("")}
        ${e.extra ? `<div class="small muted mt8">${UI.esc(e.extra)}</div>` : ""}
      </div>`;
    UI.$$("#examInfo [data-copy]").forEach((b) => {
      b.addEventListener("click", () => {
        const [ek, wi] = b.dataset.copy.split("-");
        const t = window.EXAM[ek].writing[+wi].template;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(t).then(
            () => UI.toast("📋 模板已复制，可以粘贴到 Word 里填空练习"),
            () => UI.toast("复制失败，请手动选中文本复制")
          );
        } else UI.toast("浏览器不支持复制，请手动选中");
      });
    });
  }

  /* ==================== 真题风格样题 ==================== */
  let examQ = null; // { list, i, right, total }

  function examBank() {
    if (curExam === "ab") return window.EXAM_QUIZ.filter((q) => q.level === "ab");
    if (curExam === "cet") return window.EXAM_QUIZ.filter((q) => q.level === "cet");
    return window.EXAM_QUIZ; // BEC 页展示全部（含 AB 与四级）
  }

  function startExamQuiz() {
    const list = UI.shuffle(examBank());
    examQ = { list, i: 0, right: 0, total: list.length, answered: false };
    renderExamQuiz();
  }

  function renderExamQuiz() {
    const box = UI.$("#examQuizBox");
    if (!examQ || !examQ.list.length) {
      box.innerHTML = `<div class="muted">暂无样题</div>`;
      return;
    }
    if (examQ.i >= examQ.total) {
      const pct = Math.round((examQ.right / examQ.total) * 100);
      const comment = pct >= 80 ? "太棒了！继续保持 🔥" : pct >= 60 ? "不错！错题记得看解析 📖" : "别灰心，把错题解析看懂再来一轮 💪";
      box.innerHTML = `
        <div class="score-big">${examQ.right} / ${examQ.total}（${pct}%）</div>
        <div class="small muted center">${comment}</div>
        <div class="center mt12"><button class="btn primary" id="examAgain">🔄 再来一轮</button></div>`;
      UI.$("#examAgain").addEventListener("click", startExamQuiz);
      return;
    }
    const item = examQ.list[examQ.i];
    const levelTag = item.level === "ab" ? "AB级" : "四级";
    box.innerHTML = `
      <div class="row between" style="flex-wrap:wrap;gap:8px">
        <span class="tag">${levelTag}</span>
        <span class="small muted">${examQ.i + 1} / ${examQ.total}</span>
      </div>
      <div class="mt8" style="font-size:16px;font-weight:600">${UI.esc(item.q)}</div>
      <div class="mt8">${item.opts.map((o, oi) =>
        `<div class="quiz-opt" data-oi="${oi}">${String.fromCharCode(65 + oi)}. ${UI.esc(o)}</div>`).join("")}</div>
      <div class="why-box hidden" id="examWhy"></div>
      <div class="mt8 hidden" id="examNextRow"><button class="btn primary sm" id="examNext">下一题 ➡</button></div>`;
    UI.$$("#examQuizBox .quiz-opt").forEach((el) =>
      el.addEventListener("click", () => {
        if (examQ.answered) return;
        examQ.answered = true;
        const oi = +el.dataset.oi;
        const right = oi === item.a;
        UI.$$("#examQuizBox .quiz-opt").forEach((x, xi) => {
          if (xi === item.a) x.classList.add("right");
          else if (xi === oi) x.classList.add("wrong");
        });
        if (right) examQ.right++;
        UI.$("#examWhy").classList.remove("hidden");
        UI.$("#examWhy").innerHTML =
          (right ? "✅ 回答正确！" : "❌ 回答错误，正确答案是 " + String.fromCharCode(65 + item.a) + "。") +
          "<br>" + UI.esc(item.why);
        UI.$("#examNextRow").classList.remove("hidden");
        UI.$("#examNext").addEventListener("click", () => {
          examQ.i++;
          examQ.answered = false;
          if (examQ.i >= examQ.total) Stats.addQuiz("exam:" + curExam, examQ.right, examQ.total);
          renderExamQuiz();
        });
      })
    );
  }

  /* ==================== 资源 ==================== */
  function renderResources() {
    UI.$("#resourcesList").innerHTML = window.RESOURCES.map((r) => `
      <div class="res-item">
        <b><a href="${UI.esc(r.url)}" target="_blank" rel="noopener">${UI.esc(r.name)}</a></b>
        <span class="small muted">${UI.esc(r.zh)}</span>
      </div>`).join("");
  }

  /* ==================== 初始化 ==================== */
  window.ExamInit = function () {
    renderGrammar();
    UI.$$("#examInfoTabs .chip").forEach((b) =>
      b.addEventListener("click", () => {
        curExam = b.dataset.exam;
        UI.$$("#examInfoTabs .chip").forEach((x) => x.classList.toggle("active", x === b));
        renderExamInfo();
        startExamQuiz();
      })
    );
    UI.$("#examRestart").addEventListener("click", startExamQuiz);
    UI.$("#examTotal").textContent = window.EXAM_QUIZ.length;
    renderExamInfo();
    startExamQuiz();
    renderResources();
  };
})();
