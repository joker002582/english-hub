/* ============================================================
   ui.js —— 公共工具
   DOM 助手 / 轻提示 / 语音合成(TTS) / 语音识别 / 日期 / 文本评分
   全局对象：window.UI
   ============================================================ */
window.UI = (function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  /* HTML 转义：防止用户输入或数据里的特殊字符破坏页面 */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  /* 洗牌：返回新数组，不修改原数组 */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ---------- 轻提示 ---------- */
  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---------- 语音合成（英语发音） ---------- */
  let voice = null;
  function pickVoice() {
    const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    voice =
      vs.find((v) => /en[-_]US/i.test(v.lang) && /Google|Natural|Samantha|Aria/i.test(v.name)) ||
      vs.find((v) => /en[-_]US/i.test(v.lang)) ||
      vs.find((v) => /^en/i.test(v.lang)) ||
      null;
  }
  if ("speechSynthesis" in window) {
    speechSynthesis.onvoiceschanged = pickVoice;
    pickVoice(); // 部分浏览器音色是异步加载的，onvoiceschanged 会再选一次
  }

  let rate = 1; // 全局语速：口语页可选慢速/正常/快速
  function setRate(r) { rate = r; }
  function getRate() { return rate; }

  function tts(text, r) {
    if (!("speechSynthesis" in window)) {
      toast("当前浏览器不支持语音合成，请用 Chrome 或 Edge");
      return;
    }
    const s = new SpeechSynthesisUtterance(String(text));
    s.lang = "en-US";
    s.rate = r != null ? r : rate;
    s.pitch = 1;
    if (voice) s.voice = voice;
    speechSynthesis.cancel(); // 打断上一句，避免排队
    speechSynthesis.speak(s);
  }

  /* ---------- 语音识别（跟读评测 / 语音输入） ----------
     注意：依赖浏览器联网调用语音服务，需要 Chrome/Edge 并允许麦克风 */
  function recognize(lang) {
    return new Promise((resolve, reject) => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        reject("当前浏览器不支持语音识别，请使用 Chrome 或 Edge（需联网）");
        return;
      }
      const rec = new SR();
      rec.lang = lang || "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      let done = false;
      rec.onresult = (e) => { done = true; resolve(e.results[0][0].transcript); };
      rec.onerror = (e) => {
        if (!done) {
          done = true;
          const map = {
            "not-allowed": "麦克风权限被拒绝，请在浏览器地址栏允许使用麦克风",
            "no-speech": "没有听到声音，请靠近麦克风再试一次",
            "network": "语音识别需要联网，请检查网络",
            "audio-capture": "没有找到可用的麦克风",
          };
          reject(map[e.error] || ("语音识别出错：" + e.error));
        }
      };
      rec.onend = () => { if (!done) { done = true; reject("未识别到语音"); } };
      try { rec.start(); } catch (err) { reject("无法启动麦克风：" + err); }
    });
  }

  /* ---------- 日期工具 ---------- */
  function pad(n) { return String(n).padStart(2, "0"); }
  function dateStr(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function todayStr() { return dateStr(new Date()); }
  function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function daysBetween(a, b) {
    const da = new Date(a), db = new Date(b);
    return Math.round((db - da) / 86400000);
  }
  function fmtCN(d) { return (d.getMonth() + 1) + "月" + d.getDate() + "日"; }

  /* ---------- 文本评分（跟读 / 听写共用） ---------- */
  function norm(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
  }
  /* 简单相似度：目标句里的词被你命中几个（说多了会扣分） */
  function simScore(target, said) {
    const t = norm(target), s = norm(said);
    if (!t.length) return 0;
    const set = new Set(t);
    const hit = s.filter((w) => set.has(w)).length;
    const extra = Math.max(0, s.length - t.length) * 0.5;
    return Math.max(0, Math.min(1, (hit - extra) / t.length));
  }
  function stars(score) {
    const n = Math.round(score * 5);
    return "⭐".repeat(n) + "☆".repeat(5 - n);
  }

  return {
    $, $$, esc, shuffle, toast, tts, setRate, getRate, recognize,
    dateStr, todayStr, addDays, daysBetween, fmtCN, norm, simScore, stars,
  };
})();
