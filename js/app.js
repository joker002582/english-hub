/* ============================================================
   app.js —— 入口脚本
   负责：主题切换、页面导航、首页渲染
   （最后加载，boot 时调用其他模块的初始化函数）
   ============================================================ */
(function () {
  const TIPS = [
    "每天 20 个单词 + 10 分钟口语，坚持 3 个月就能看到质变。",
    "听写是练听力的最好方法之一，每天 5 句刚刚好。",
    "背单词要「眼到、口到、手到」：看、读、写缺一不可。",
    "敢开口比说得对更重要，跟 AI 老师练口语不要怕出错。",
    "把手机系统语言调成英语，是免费的沉浸式环境。",
    "一个句子读 10 遍不如读给 AI 听 1 遍——跟读评分用起来。",
    "考试前 3 个月开始做真题，比刷单词软件更提分。",
  ];

  /* ---------- 主题（深色/浅色） ---------- */
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    UI.$("#themeBtn").textContent = t === "dark" ? "☀️" : "🌙";
  }
  function initTheme() {
    applyTheme(Store.get("theme", "light"));
    UI.$("#themeBtn").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      Store.set("theme", next);
    });
  }

  /* ---------- 导航 ---------- */
  function initNav() {
    UI.$$("#navBtns .nav-btn").forEach((b) =>
      b.addEventListener("click", () => App.showTab(b.dataset.tab))
    );
    // 所有带 data-goto 的元素（首页按钮、统计卡片、快捷入口）都变成跳转按钮
    UI.$$("[data-goto]").forEach((b) =>
      b.addEventListener("click", () => App.showTab(b.dataset.goto))
    );
    App.showTab(Store.get("lastTab", "home"));
  }

  /* ---------- 首页渲染 ---------- */
  function renderHome() {
    const p = Profile.get();
    const day = Math.floor(Date.now() / 86400000);

    // 问候语（按时间段）
    const h = new Date().getHours();
    const part = h < 6 ? "夜深了" : h < 12 ? "早上好" : h < 14 ? "中午好" : h < 18 ? "下午好" : "晚上好";
    UI.$("#homeGreet").textContent = part + "，" + p.name + " 👋";

    // 每日一句（按天轮换）
    const q = window.QUOTES[day % window.QUOTES.length];
    UI.$("#quoteEn").textContent = q.en;
    UI.$("#quoteZh").textContent = q.zh;
    UI.$("#quoteSpeak").onclick = () => UI.tts(q.en);

    // 学习统计卡片
    const stats = [
      { num: Checkins.streak(), lbl: "连续打卡(天)", goto: "plan" },
      { num: Checkins.total(), lbl: "累计打卡(天)", goto: "plan" },
      { num: VocabStore.knownCount(), lbl: "已掌握单词", goto: "vocab" },
      { num: VocabStore.notebook().length, lbl: "生词本", goto: "vocab" },
      { num: Stats.quizAvg() == null ? "-" : Stats.quizAvg() + "%", lbl: "测验平均分", goto: "exam" },
      { num: Stats.get().aiMsgs, lbl: "AI 对话(句)", goto: "ai" },
    ];
    UI.$("#homeStats").innerHTML = stats.map((s) =>
      `<div class="card stat" data-goto="${s.goto}"><div class="num">${s.num}</div><div class="lbl">${s.lbl}</div></div>`
    ).join("");
    UI.$$("#homeStats .stat").forEach((el) =>
      el.addEventListener("click", () => App.showTab(el.dataset.goto))
    );

    renderRoadmap();
    renderTodayTasks();
    renderQuick();
    UI.$("#footerTip").textContent = "💡 " + TIPS[day % TIPS.length];
  }

  /* 学习路线：结合个人资料里的考试日期显示倒计时 */
  function renderRoadmap() {
    const p = Profile.get();
    const daysOf = (d) => (d ? UI.daysBetween(new Date(), new Date(d)) : null);
    const dl = (d) => (d == null ? "（在「计划」页设置考试日期可显示倒计时）" : d < 0 ? "已到考试时间" : "还剩 " + d + " 天");
    const stages = [
      {
        no: 1, period: "大一上学期", title: "打地基 + 过 AB 级", goal: "目标：通过 AB 级考试",
        days: daysOf(p.dates.ab), badge: "短期",
        points: ["48 音标 + 基础语法速成（10 天）", "AB 级核心词汇（网站词汇模块）", "每天 1 个口语场景 + AI 对话 10 分钟"],
      },
      {
        no: 2, period: "大一下 ~ 大二", title: "冲刺四级 CET-4", goal: "目标：四级 ≥ 425 分",
        days: daysOf(p.dates.cet4), badge: "中期",
        points: ["四级核心词汇 + 真题高频词", "听力精听（每天 5 句听写）", "写作模板 + 阅读提速训练"],
      },
      {
        no: 3, period: "大二 ~ 大三", title: "冲刺六级 CET-6", goal: "目标：六级过线",
        days: daysOf(p.dates.cet6), badge: "中期",
        points: ["六级词汇 + 长难句", "真题训练 + 汉译英练习", "口语进阶：能聊观点和时事"],
      },
      {
        no: 4, period: "大三起", title: "BEC 商务英语 + 长期口语", goal: "目标：BEC Vantage（中级）以上",
        days: daysOf(p.dates.bec), badge: "长期",
        points: ["商务词汇与邮件写作", "会议、谈判、面试场景口语", "持续与外国人真实交流"],
      },
    ];
    UI.$("#roadmap").innerHTML = stages.map((s) => `
      <div class="stage">
        <div class="dot">${s.no}</div>
        <div class="body" style="flex:1">
          <div class="row" style="gap:8px;flex-wrap:wrap">
            <h3 style="margin:0">${s.title}</h3><span class="badge">${s.badge}</span>
          </div>
          <div class="meta">${s.period} · ${s.goal} · ${dl(s.days)}</div>
          <ul>${s.points.map((x) => `<li>${x}</li>`).join("")}</ul>
        </div>
      </div>`).join("");
  }

  /* 今日任务（只读，点击去计划页打卡） */
  function renderTodayTasks() {
    const tasks = Tasks.today();
    const done = tasks.filter((t) => t.done).length;
    UI.$("#todayTasks").innerHTML = tasks.map((t) => `
      <div class="task-item ${t.done ? "done" : ""}" data-goto="plan">
        <span class="task-check">${t.done ? "✅" : "⬜"}</span> ${UI.esc(t.label)}
      </div>`).join("") +
      `<div class="bar mt8"><i style="width:${(done / tasks.length) * 100}%"></i></div>
       <div class="small muted mt8">今日进度：${done}/${tasks.length}</div>`;
    UI.$$("#todayTasks .task-item").forEach((el) =>
      el.addEventListener("click", () => App.showTab("plan"))
    );
  }

  /* 快捷入口 */
  function renderQuick() {
    const items = [
      { ic: "📚", t: "背单词", d: "分类词卡 + 三种测验", tab: "vocab" },
      { ic: "🗣️", t: "练口语", d: "场景对话 + 跟读评分", tab: "speaking" },
      { ic: "🤖", t: "AI 陪练", d: "24 小时口语老师", tab: "ai" },
      { ic: "🎯", t: "考试攻略", d: "AB / 四六级 / BEC", tab: "exam" },
    ];
    UI.$("#homeQuick").innerHTML = items.map((x) =>
      `<div class="card quick-card" data-goto="${x.tab}">
         <div class="ic">${x.ic}</div>
         <div><b>${x.t}</b><div class="small muted">${x.d}</div></div>
       </div>`).join("");
    UI.$$("#homeQuick .quick-card").forEach((el) =>
      el.addEventListener("click", () => App.showTab(el.dataset.goto))
    );
  }

  function updateStreak() {
    UI.$("#streakBadge").textContent = "🔥 " + Checkins.streak() + " 天";
  }

  /* ---------- 对外接口 ---------- */
  window.App = {
    showTab(id) {
      UI.$$("section.tab").forEach((s) => s.classList.toggle("active", s.id === "tab-" + id));
      UI.$$("#navBtns .nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === id));
      Store.set("lastTab", id);
      window.scrollTo({ top: 0 });
      if (id === "home") renderHome();
      if (id === "vocab") Vocab.render();
      if (id === "plan") Plan.refresh();
      updateStreak();
    },
    boot() {
      // 每个模块单独 try/catch：一个模块出错不会影响其他模块
      const steps = [
        ["主题", initTheme],
        ["导航", initNav],
        ["首页", renderHome],
        ["计划", PlanInit],
        ["词汇", VocabInit],
        ["口语", SpeakInit],
        ["考试", ExamInit],
        ["AI陪练", AiInit],
      ];
      steps.forEach((item) => {
        try {
          item[1]();
        } catch (e) {
          console.error("[英途] 模块初始化失败：", item[0], e);
          UI.toast("⚠️ 模块「" + item[0] + "」加载出错：" + e.message);
        }
      });
      updateStreak();
    },
    updateStreak,
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", App.boot);
  else App.boot();
})();
