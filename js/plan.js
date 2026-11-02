/* ============================================================
   plan.js —— 计划模块
   目标资料 / 里程碑倒计时 / 每日任务打卡 / 打卡日历 / 番茄钟 / 备份
   ============================================================ */
(function () {
  const GOALS = [
    { key: "ab",   label: "AB 级考试", target: "AB 级词汇约 1500 个", words: 1500 },
    { key: "cet4", label: "四级考试", target: "四级词汇约 4500 个", words: 4500 },
    { key: "cet6", label: "六级考试", target: "六级词汇约 6000 个", words: 6000 },
    { key: "bec",  label: "BEC 商务英语", target: "商务词汇 + 口语流利", words: 0 },
  ];

  /* ---------- 表单 ---------- */
  function loadForm() {
    const p = Profile.get();
    UI.$("#pfName").value = p.name;
    UI.$("#pfSchool").value = p.school;
    UI.$("#pfMajor").value = p.major;
    UI.$("#pfGrade").value = p.grade;
    UI.$("#pfDailyMin").value = p.dailyMin;
    UI.$("#pfAb").value = p.dates.ab;
    UI.$("#pfCet4").value = p.dates.cet4;
    UI.$("#pfCet6").value = p.dates.cet6;
    UI.$("#pfBec").value = p.dates.bec;
  }

  function saveForm() {
    const p = {
      name: UI.$("#pfName").value.trim() || "同学",
      school: UI.$("#pfSchool").value.trim() || "陕西职业技术学院",
      major: UI.$("#pfMajor").value.trim() || "计算机网络技术",
      grade: UI.$("#pfGrade").value.trim() || "大一",
      dailyMin: parseInt(UI.$("#pfDailyMin").value, 10) || 60,
      dates: {
        ab: UI.$("#pfAb").value,
        cet4: UI.$("#pfCet4").value,
        cet6: UI.$("#pfCet6").value,
        bec: UI.$("#pfBec").value,
      },
    };
    Profile.save(p);
    renderMilestones();
    UI.toast("✅ 已保存，计划已更新");
  }

  /* ---------- 里程碑 ---------- */
  function renderMilestones() {
    const p = Profile.get();
    const today = new Date();
    UI.$("#milestones").innerHTML = GOALS.map((g) => {
      const d = p.dates[g.key];
      if (!d) {
        return `<div class="milestone">
          <div class="m-days">❔</div>
          <div class="body"><b>${g.label}</b>
          <div class="small muted">未设置日期 · ${g.target}</div></div>
        </div>`;
      }
      const days = UI.daysBetween(today, new Date(d));
      const status = days < 0 ? "已到考试时间，全力冲刺真题！" : "还剩 " + days + " 天";
      // 按每周学 5 天估算每天新学单词数
      let perDay = "";
      if (days > 0 && g.words) {
        const studyDays = Math.max(1, Math.floor((days * 5) / 7));
        const n = Math.max(10, Math.ceil(g.words / Math.min(studyDays, days)));
        perDay = `<div class="small">建议每天新学约 <b>${n}</b> 个单词（每周学 5 天）</div>`;
      }
      return `<div class="milestone">
        <div class="m-days">${days < 0 ? "⏰" : days}</div>
        <div class="body"><b>${g.label}</b>
        <div class="small muted">${d} · ${status} · ${g.target}</div>${perDay}</div>
      </div>`;
    }).join("");
  }

  /* ---------- 每日任务 ---------- */
  function renderTasks() {
    const tasks = Tasks.today();
    UI.$("#dailyTasks").innerHTML = tasks.map((t) => `
      <label class="task-item ${t.done ? "done" : ""}">
        <input type="checkbox" ${t.done ? "checked" : ""} data-task="${t.id}">
        <span>${UI.esc(t.label)}</span>
      </label>`).join("");
    const done = tasks.filter((t) => t.done).length;
    UI.$("#dailyTasks").insertAdjacentHTML("beforeend",
      `<div class="bar mt12"><i style="width:${(done / tasks.length) * 100}%"></i></div>
       <div class="small muted mt8">今日进度：${done}/${tasks.length} · 全部完成自动打卡</div>`);
    UI.$$("#dailyTasks input[data-task]").forEach((cb) =>
      cb.addEventListener("change", () => {
        Tasks.toggle(cb.dataset.task);
        renderTasks();
        maybeAutoCheckin();
      })
    );
  }

  function maybeAutoCheckin() {
    if (Tasks.todayAll() && !Checkins.has()) {
      Checkins.mark();
      UI.toast("🎉 今日任务全部完成，自动打卡成功！");
      afterCheckin();
    }
  }

  function manualCheckin() {
    Checkins.mark();
    UI.toast("🔥 打卡成功！");
    afterCheckin();
  }

  function afterCheckin() {
    renderCalendar();
    renderStats();
    App.updateStreak();
  }

  /* ---------- 日历 ---------- */
  function renderCalendar() {
    const today = new Date();
    const start = UI.addDays(today, -34);
    const c = Checkins.all();
    const dow = ["日", "一", "二", "三", "四", "五", "六"];
    let html = dow.map((d) => `<div class="dow">${d}</div>`).join("");
    for (let i = 0; i < 35; i++) {
      const d = UI.addDays(start, i);
      const key = UI.dateStr(d);
      const cls = "cell" + (c[key] ? " on" : "") + (key === UI.todayStr() ? " today" : "");
      html += `<div class="${cls}" title="${key}">${d.getDate()}</div>`;
    }
    UI.$("#calGrid").innerHTML = html;
    UI.$("#calLegend").innerHTML = `连续打卡 <b>${Checkins.streak()}</b> 天 · 累计打卡 <b>${Checkins.total()}</b> 天`;
  }

  /* ---------- 数据统计 ---------- */
  function renderStats() {
    const s = Stats.get();
    const avg = Stats.quizAvg();
    UI.$("#planStats").innerHTML = `
      <div class="row" style="gap:8px;flex-wrap:wrap">
        <span class="tag">📚 已掌握单词 ${VocabStore.knownCount()}</span>
        <span class="tag">📕 生词本 ${VocabStore.notebook().length}</span>
        <span class="tag">📝 测验次数 ${s.quizzes.length}</span>
        <span class="tag">🎯 平均正确率 ${avg == null ? "-" : avg + "%"}</span>
        <span class="tag">🤖 AI 对话 ${s.aiMsgs} 句</span>
        <span class="tag">🎧 听写轮次 ${s.dictRounds}</span>
      </div>`;
  }

  /* ---------- 番茄钟 ---------- */
  const pomo = { secs: 25 * 60, run: false, timer: null, work: true };
  function renderPomo() {
    const m = String(Math.floor(pomo.secs / 60)).padStart(2, "0");
    const s = String(pomo.secs % 60).padStart(2, "0");
    UI.$("#pomoTime").textContent = m + ":" + s;
    UI.$("#pomoMode").textContent = pomo.work ? "📖 学习时间" : "☕ 休息时间";
    UI.$("#pomoStart").textContent = pomo.run ? "⏸ 暂停" : "▶ 开始";
  }
  function pomoTick() {
    pomo.secs--;
    if (pomo.secs <= 0) {
      beep();
      pomo.work = !pomo.work;
      pomo.secs = (pomo.work ? 25 : 5) * 60;
      UI.toast(pomo.work ? "☕ 休息结束，开始下一个 25 分钟学习吧！" : "🎉 学习结束，休息 5 分钟！");
    }
    renderPomo();
  }
  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.4].forEach((t) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = 880;
        o.start(ctx.currentTime + t);
        o.stop(ctx.currentTime + t + 0.25);
      });
    } catch (e) { /* 无声卡/无权限时静默失败 */ }
  }

  /* ---------- 初始化 ---------- */
  window.PlanInit = function () {
    loadForm();
    UI.$("#pfSave").addEventListener("click", saveForm);
    UI.$("#checkinBtn").addEventListener("click", manualCheckin);
    UI.$("#exportData").addEventListener("click", Backup.exportAll);
    UI.$("#resetData").addEventListener("click", Backup.resetAll);
    UI.$("#pomoStart").addEventListener("click", () => {
      if (pomo.run) { clearInterval(pomo.timer); pomo.run = false; }
      else { pomo.timer = setInterval(pomoTick, 1000); pomo.run = true; }
      renderPomo();
    });
    UI.$("#pomoReset").addEventListener("click", () => {
      clearInterval(pomo.timer);
      pomo.run = false; pomo.work = true; pomo.secs = 25 * 60;
      renderPomo();
    });
    Plan.refresh(); // 注意：必须通过 window.Plan 调用，直接写 refresh() 会报 ReferenceError
  };

  /* 每次进入计划页时刷新（数据可能被其他模块改了） */
  window.Plan = {
    refresh() {
      renderMilestones();
      renderTasks();
      renderCalendar();
      renderStats();
      renderPomo();
    },
  };
})();
