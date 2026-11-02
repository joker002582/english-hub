/* ============================================================
   progress.js —— 本地数据层
   所有学习数据都存在浏览器 localStorage（键名以 eh_ 开头）：
   - eh_profile   个人资料与考试日期
   - eh_vocab     词汇学习状态（认识/生词）
   - eh_checkins  打卡记录
   - eh_tasks     每日任务完成情况
   - eh_stats     统计（测验成绩、AI 对话次数等）
   ============================================================ */
window.Store = {
  get(k, d) {
    try {
      const v = localStorage.getItem("eh_" + k);
      return v == null ? d : JSON.parse(v);
    } catch (e) { return d; }
  },
  set(k, v) {
    try { localStorage.setItem("eh_" + k, JSON.stringify(v)); }
    catch (e) { UI.toast("保存失败：浏览器存储空间不足"); }
  },
  del(k) { localStorage.removeItem("eh_" + k); },
};

/* ---------- 个人资料 ---------- */
window.Profile = {
  defaults: {
    name: "同学",
    school: "陕西职业技术学院",
    major: "计算机网络技术",
    grade: "大一",
    dailyMin: 60,
    dates: { ab: "", cet4: "", cet6: "", bec: "" },
  },
  get() {
    const saved = Store.get("profile", {}) || {};
    return {
      ...this.defaults,
      ...saved,
      dates: { ...this.defaults.dates, ...(saved.dates || {}) },
    };
  },
  save(p) { Store.set("profile", p); },
};

/* ---------- 词汇学习状态 ----------
   结构：{ "ab::ability": 1 | 2 }  1=认识  2=生词 */
window.VocabStore = {
  getState() { return Store.get("vocab", {}); },
  mark(setId, w, status) {
    const st = this.getState();
    st[setId + "::" + w] = status;
    Store.set("vocab", st);
  },
  statusOf(setId, w) { return this.getState()[setId + "::" + w] || 0; },
  notebook() {
    const st = this.getState();
    return Object.keys(st)
      .filter((k) => st[k] === 2)
      .map((k) => {
        const i = k.indexOf("::");
        return { setId: k.slice(0, i), w: k.slice(i + 2) };
      });
  },
  removeNotebook(setId, w) {
    const st = this.getState();
    delete st[setId + "::" + w];
    Store.set("vocab", st);
  },
  clearNotebook() {
    const st = this.getState();
    Object.keys(st).forEach((k) => { if (st[k] === 2) delete st[k]; });
    Store.set("vocab", st);
  },
  knownCount() { return Object.values(this.getState()).filter((v) => v === 1).length; },
};

/* ---------- 打卡 ---------- */
window.Checkins = {
  all() { return Store.get("checkins", {}); },
  mark(date) {
    const c = this.all();
    c[date || UI.todayStr()] = true;
    Store.set("checkins", c);
  },
  has(date) { return !!this.all()[date || UI.todayStr()]; },
  streak() {
    // 连续打卡天数：从今天往回数，今天没打就从昨天开始数
    const c = this.all();
    let n = 0;
    let d = new Date();
    if (!c[UI.dateStr(d)]) d = UI.addDays(d, -1);
    while (c[UI.dateStr(d)]) { n++; d = UI.addDays(d, -1); }
    return n;
  },
  total() { return Object.keys(this.all()).length; },
};

/* ---------- 统计 ---------- */
window.Stats = {
  get() { return Store.get("stats", { quizzes: [], aiMsgs: 0, dictRounds: 0 }); },
  addQuiz(cat, score, total) {
    const s = this.get();
    s.quizzes.push({ cat, score, total, t: Date.now() });
    if (s.quizzes.length > 100) s.quizzes = s.quizzes.slice(-100);
    Store.set("stats", s);
  },
  addAi() { const s = this.get(); s.aiMsgs++; Store.set("stats", s); },
  addDict() { const s = this.get(); s.dictRounds++; Store.set("stats", s); },
  quizAvg() {
    const qs = this.get().quizzes;
    if (!qs.length) return null;
    const sum = qs.reduce((a, q) => a + q.score / q.total, 0);
    return Math.round((sum / qs.length) * 100);
  },
};

/* ---------- 每日任务 ---------- */
window.Tasks = {
  defs: [
    { id: "words",  label: "词汇：学习 20 个新单词", cat: "vocab" },
    { id: "speak",  label: "口语：完成 1 个场景跟读", cat: "speaking" },
    { id: "ai",     label: "AI 陪练：对话 10 分钟以上", cat: "ai" },
    { id: "listen", label: "听力：完成 5 句听写", cat: "speaking" },
    { id: "review", label: "复习：过一遍生词本", cat: "vocab" },
  ],
  all() { return Store.get("tasks", {}); }, // { "2026-11-02": { words: true, ... } }
  today() {
    const t = this.all()[UI.todayStr()] || {};
    return this.defs.map((d) => ({ ...d, done: !!t[d.id] }));
  },
  toggle(id) {
    const a = this.all();
    const t = a[UI.todayStr()] || {};
    t[id] = !t[id];
    a[UI.todayStr()] = t;
    Store.set("tasks", a);
  },
  todayDone() { return this.today().filter((t) => t.done).length; },
  todayAll() { return this.today().every((t) => t.done); },
};

/* ---------- 导出 / 重置 ---------- */
window.Backup = {
  exportAll() {
    const out = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("eh_")) out[k] = localStorage.getItem(k);
    }
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "englishhub-备份-" + UI.todayStr() + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
    UI.toast("📤 已导出备份文件");
  },
  resetAll() {
    if (!confirm("确定清空所有学习数据吗？此操作不可恢复！（建议先导出备份）")) return;
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("eh_")) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    location.reload();
  },
};
