# -*- coding: utf-8 -*-
"""生成《英途 EnglishHub 使用说明书.docx》"""
from docx import Document
from docx.shared import Pt, RGBColor
from docx.oxml.ns import qn
from docx.enum.text import WD_ALIGN_PARAGRAPH

OUT = "英途EnglishHub使用说明书.docx"

doc = Document()

# ---------- 全局字体：微软雅黑 ----------
def set_cn_font(style_or_run, name="微软雅黑"):
    style_or_run.font.name = name
    rpr = style_or_run.element.get_or_add_rPr() if hasattr(style_or_run, "element") else None
    if rpr is not None:
        rpr.rFonts.set(qn("w:eastAsia"), name)

normal = doc.styles["Normal"]
normal.font.size = Pt(10.5)
set_cn_font(normal)

for hname, sz in [("Heading 1", 16), ("Heading 2", 13), ("Heading 3", 11.5)]:
    st = doc.styles[hname]
    st.font.size = Pt(sz)
    st.font.color.rgb = RGBColor(0x4F, 0x46, 0xE5)
    set_cn_font(st)

# ---------- 工具函数 ----------
def h1(t): doc.add_heading(t, level=1)
def h2(t): doc.add_heading(t, level=2)
def h3(t): doc.add_heading(t, level=3)
def p(t, bold=False):
    para = doc.add_paragraph()
    run = para.add_run(t)
    run.bold = bold
    return para
def bullet(t):
    para = doc.add_paragraph(t, style="List Bullet")
    return para
def step(t):
    para = doc.add_paragraph(t, style="List Number")
    return para
def table(headers, rows):
    tb = doc.add_table(rows=1, cols=len(headers))
    tb.style = "Light Grid Accent 1"
    for i, h in enumerate(headers):
        cell = tb.rows[0].cells[i]
        cell.text = h
        for para in cell.paragraphs:
            for run in para.runs:
                run.bold = True
                set_cn_font(run)
    for r in rows:
        cells = tb.add_row().cells
        for i, v in enumerate(r):
            cells[i].text = str(v)
            for para in cells[i].paragraphs:
                for run in para.runs:
                    set_cn_font(run)
    doc.add_paragraph()

# ---------- 封面 ----------
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = title.add_run("🚀 英途 EnglishHub\n使用说明书")
run.bold = True
run.font.size = Pt(26)
run.font.color.rgb = RGBColor(0x4F, 0x46, 0xE5)
set_cn_font(run)

sub = doc.add_paragraph()
sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = sub.add_run("AB级 → 四六级 → BEC 商务英语 · 你的专属英语学习网站\n适用：大专一年级 · 计算机网络技术专业 · 英语基础薄弱但想开口交流的你")
run.font.size = Pt(12)
set_cn_font(run)
doc.add_paragraph()

# ---------- 1 简介 ----------
h1("一、这个网站是什么")
p("「英途 EnglishHub」是一个完全本地运行的英语学习网站，专为你定制：从 AB 级起步，到四六级，再到 BEC 商务英语；重点是练好和外国人「接地气」的日常交流。")
bullet("不用联网也能用：单词、口语、语法、考试、打卡全部离线可用。")
bullet("可选 AI 陪练：配置一次 DeepSeek API Key 后，就有一个 24 小时在线的英语口语老师。")
bullet("数据只存在你自己的浏览器里，不上传任何服务器。")

# ---------- 2 打开方式 ----------
h1("二、第一次打开网站")
h2("方式一：用 Python 启动（推荐）")
step("打开文件夹 D:\\DSH工作区\\english-hub")
step("在地址栏输入 cmd 回车，打开命令行窗口")
step("输入命令：python server.py 然后回车")
step("浏览器会自动打开 http://localhost:8000，开始学习")
p("提示：server.py 用的是 Python 标准库 http.server，不需要安装任何第三方包；你正好在学 Python，可以打开这个文件看看注释。")
h2("方式二：直接双击 index.html")
p("双击 D:\\DSH工作区\\english-hub\\index.html 即可。单词、口语、语法、考试、打卡都能用；只有 AI 陪练个别浏览器会拦截，遇到时改用方式一。")
h2("浏览器要求")
bullet("推荐 Chrome 或 Edge 浏览器。")
bullet("语音朗读、跟读评分、语音输入需要联网，并允许浏览器使用麦克风。")

# ---------- 3 页面布局 ----------
h1("三、认识页面布局")
p("顶部有 7 个标签页，点击切换：")
table(
    ["标签", "干什么用"],
    [
        ["🏠 首页", "学习路线图、考试倒计时、每日一句、学习统计、今日任务"],
        ["📚 词汇", "7 类词卡学习 + 三种测验 + 生词本"],
        ["🗣️ 口语", "10 个场景对话、发音朗读、跟读评分、听写、音标表、地道表达"],
        ["🤖 AI陪练", "AI 口语老师：自由对话、场景陪练、写作批改、翻译、造句"],
        ["📖 语法", "10 个零基础语法主题 + 随堂小测验"],
        ["🎯 考试", "AB级/四六级/BEC 攻略、写作模板、真题风格样题"],
        ["📅 计划", "考试倒计时、每日任务打卡、打卡日历、番茄钟、数据备份"],
    ],
)
p("右上角：🔥 显示连续打卡天数；🌙 按钮切换深色/浅色主题。", bold=True)

# ---------- 4 各模块用法 ----------
h1("四、各模块详细用法")

h2("4.1 首页")
bullet("学习路线：4 个阶段（AB级→四级→六级→BEC），设置考试日期后会显示「还剩 XX 天」。")
bullet("每日一句：名人名言，点 🔊 朗读。")
bullet("统计卡片和快捷入口：点一下直接跳到对应模块。")

h2("4.2 词汇")
h3("学习模式")
step("选择词库：AB级核心 / 四级核心 / 六级核心 / 计算机网络 / 前端 / Python / 商务英语")
step("看单词卡：单词、音标、词性、中文意思、例句")
step("点 🔊 听发音；点 ✅ 认识 标记掌握；点 📕 生词 收进生词本")
step("点 ➡ 下一个 或 🔀 随机 继续；顶部进度条会记录你学了几个")
bullet("点 🤖 AI造句 会跳转到 AI 陪练，让 AI 用这个单词造 3 个由浅入深的例句。")
h3("测验模式（三种题型）")
bullet("英 → 中：看单词选中文意思")
bullet("中 → 英：看中文选英文单词")
bullet("拼写：听发音、看中文，把单词打出来")
bullet("每轮 10 题，答完显示成绩并自动记录到统计里。")
h3("生词本")
step("点工具栏「📕 生词本」打开面板")
step("点 🔊 复习发音；学会后点「已学会」移出")
step("点「📤 导出」把生词复制到剪贴板，可粘贴到笔记本里")

h2("4.3 口语")
h3("场景对话")
step("选一个场景（如「餐厅点餐」「游戏开黑」「求职面试」）")
step("每句话旁边点 🔊 听发音；「语速」可选慢速/正常/快速")
step("勾选/取消「显示中文翻译」")
h3("跟读评分（重点功能）")
step("点某句话下面的「🎙️ 跟读评测」")
step("浏览器询问麦克风权限时点「允许」")
step("大声朗读这句话，系统识别后按相似度给 1-5 星")
bullet("评分低没关系，先点 🔊 多听两遍再读；敢开口比说得对更重要。")
h3("听写练习（练听力）")
step("在口语页点「🎧 听写练习」")
step("点「播放」听一句英语，在输入框打出你听到的句子")
step("点「✅ 提交」看答案和得分；每轮 5 句")
bullet("大小写和标点不影响评分。")
h3("其他")
bullet("🔤 48 音标表：点击任意音标听例词发音，零基础先过一遍音标。")
bullet("🗣️ 地道表达：20 条老外天天说的口语（Long time no see、It's on me 等），附使用场合说明。")

h2("4.4 AI 陪练（需要先配置，见下）")
h3("第一步：配置 API Key（只需一次）")
step("打开 platform.deepseek.com 注册账号（手机号即可）")
step("进入「充值」页，充 10 元（价格便宜，够练很久；以官网显示为准）")
step("进入「API keys」页面，点「创建 API key」，复制 sk- 开头的密钥")
step("回到网站的 AI 陪练页，粘贴密钥，点「💾 保存配置」→「🔌 测试连接」")
step("看到「✅ 连接成功」就可以开始聊天了")
p("⚠️ 安全提示：API Key 相当于你的钱包钥匙，只保存在你自己浏览器里；不要截图发到群里，也不要贴进公开代码。", bold=True)
h3("第二步：选择模式")
table(
    ["模式", "怎么用"],
    [
        ["💬 自由对话", "随便聊，AI 老师会温和纠正你的语法错误（先英文，必要时附中文提示）"],
        ["🍜 餐厅点餐", "AI 扮演服务员，练点餐、加单、买单全流程"],
        ["📋 面试陪练", "AI 扮演面试官，练自我介绍和常见问题"],
        ["💼 商务会议", "AI 主持商务会议，练 BEC 口语方向"],
        ["🏫 校园闲聊", "模拟和外国同学聊宿舍、食堂、游戏"],
        ["✍️ 写作批改", "把作文粘贴到框里点「开始」，AI 改语法、按四级标准打分并讲解"],
        ["🈶 中英互译", "输入中文或英文自动互译，附关键词和用法（适合练汉译英）"],
        ["💡 单词造句", "输入一个单词，AI 造 3 个由浅入深的例句"],
    ],
)
h3("聊天小技巧")
bullet("在底部输入框用英语打字，Enter 发送（Shift+Enter 换行）。")
bullet("点 🎤 可以直接语音输入，说完自动变成文字。")
bullet("AI 回复下方点 🔊 朗读，跟着读一遍，练发音。")
bullet("点 🗑️ 清空对话重新开始。")

h2("4.5 语法")
bullet("10 个主题按顺序学，每天 1 个，10 天过完基础语法。")
bullet("点主题标题展开：讲解 + 例句 + 3 道随堂小测验，做完再学下一个。")

h2("4.6 考试")
bullet("顶部切换 AB级 / 四六级 / BEC，查看题型、分值、备考技巧。")
bullet("写作模板点「📋 复制模板」，粘贴到 Word 里填空练习。")
bullet("下方有 24 道真题风格样题，做完立刻看解析，成绩记入统计。")
bullet("页面底部有 8 个免费学习资源（VOA、BBC、TED、每日英语听力等）。")

h2("4.7 计划")
step("填写昵称、学校、专业，重点填 4 个考试日期（AB级/四级/六级/BEC）")
step("点「💾 保存并生成计划」，上方会显示每个考试的倒计时和「每天建议背多少单词」")
step("每天完成「每日任务」5 项打勾，全部完成自动打卡")
step("「手动打卡」随时可点；日历会显示最近 35 天打卡情况")
bullet("⏱️ 番茄钟：学习 25 分钟、休息 5 分钟，到点自动提醒。")
bullet("📤 导出全部数据：备份到文件；换电脑或清缓存前一定要先导出。")

# ---------- 5 每日流程 ----------
h1("五、推荐每日学习流程（约 60 分钟）")
table(
    ["时间", "做什么", "在哪里"],
    [
        ["5 分钟", "复习昨天生词本，点 🔊 听发音", "词汇 → 生词本"],
        ["15 分钟", "新学 20 个单词，例句跟读一遍", "词汇 → 学习模式"],
        ["10 分钟", "完成 1 个语法主题或做一轮词汇测验", "语法 / 词汇测验"],
        ["10 分钟", "练 1 个口语场景，每句跟读评测", "口语"],
        ["10 分钟", "和 AI 老师自由对话（点餐/面试等场景）", "AI 陪练"],
        ["5 分钟", "听写 5 句练听力", "口语 → 听写练习"],
        ["5 分钟", "检查今日任务是否全部完成、打卡", "计划"],
    ],
)
p("核心原则：每天 20 个单词 + 10 分钟开口，坚持 3 个月就能看到质变。", bold=True)

# ---------- 6 学习路线 ----------
h1("六、学习路线与考试安排")
table(
    ["阶段", "时间", "目标", "每天做什么"],
    [
        ["1 打地基", "大一上学期", "通过 AB 级", "音标 + 语法速成；AB 级词汇；口语场景 + AI 对话"],
        ["2 冲四级", "大一下~大二", "CET-4 ≥ 425", "四级词汇；每天 5 句听写；写作模板；真题"],
        ["3 冲六级", "大二~大三", "CET-6 过线", "六级词汇；长难句；汉译英；口语观点表达"],
        ["4 商务进阶", "大三起", "BEC Vantage+", "商务词汇；邮件写作；会议/谈判/面试口语"],
    ],
)

# ---------- 7 FAQ ----------
h1("七、常见问题（FAQ）")
table(
    ["问题", "答案"],
    [
        ["双击打开网页，AI 提示「网络请求被拦截」？", "个别浏览器禁止网页直接调 AI 接口。改用方式一：命令行运行 python server.py 后访问 http://localhost:8000。"],
        ["跟读评测 / 语音输入没反应？", "需要用 Chrome 或 Edge；允许麦克风权限；保持联网。"],
        ["点 🔊 没有声音？", "检查电脑音量；换 Chrome/Edge；浏览器语音合成在个别系统上音色较少属正常。"],
        ["AI 提示「余额不足」？", "到 platform.deepseek.com 充值，充 10 元可用很久。"],
        ["AI 提示「API Key 不正确」？", "确认完整复制了 sk- 开头的密钥，保存后点「测试连接」验证。"],
        ["数据会丢吗？", "数据存在浏览器本地。清浏览器缓存、换电脑、重装系统会丢；先在「计划」页点「📤 导出全部数据」备份。"],
        ["怎么把备份导回新电脑？", "目前提供导出，导入功能还没有；需要的话可以让我帮你加上。"],
        ["手机能用吗？", "能，见第十章：同一 WiFi 下扫二维码即可访问；想随时随地访问就部署到免费的 GitHub Pages。"],
        ["想换词库配色、加单词？", "打开 js/data-vocab.js 按格式加一条即可；改颜色改 css/style.css 顶部的 CSS 变量。"],
    ],
)

# ---------- 8 数据与隐私 ----------
h1("八、数据安全与隐私")
bullet("学习记录（单词状态、打卡、测验成绩）保存在浏览器 localStorage，不上传服务器。")
bullet("AI 对话内容会发给 DeepSeek 接口处理；API Key 只存本地。")
bullet("建议每周点一次「📤 导出全部数据」备份。")

# ---------- 9 进阶 ----------
h1("九、想进阶？自己动手改代码")
p("网站代码全部是中文注释，改坏了重新下载即可。建议按顺序尝试：")
table(
    ["练习", "怎么做"],
    [
        ["加一个单词", "打开 js/data-vocab.js，在对应词库的 words 数组里照格式加一行"],
        ["加一个场景", "打开 js/data-content.js，在 SCENARIOS 里加一个场景"],
        ["改配色", "改 css/style.css 顶部的 CSS 变量（--primary 等）"],
        ["改每日任务", "打开 js/progress.js，修改 Tasks.defs 里的任务清单"],
        ["Python 进阶", "把 server.py 改写成 Flask 版，或写个接口把单词存进 SQLite"],
    ],
)

# ---------- 10 手机与他人访问 ----------
h1("十、手机和其他人怎么访问")

h2("方式一：同一 WiFi 下用手机访问（最快）")
step("电脑上运行 python server.py（新版自动监听局域网，控制台会打印「手机访问」地址）")
step("手机连和电脑同一个 WiFi，用相机扫浏览器自动弹出的二维码，或手动输入 http://192.168.x.x:8000")
step("打不开时排查：是否同一个 WiFi（校园网常隔离设备互访）；防火墙弹窗点「允许访问」；或手机开热点让电脑连接")
p("注意事项：", bold=True)
bullet("局域网 http 地址下，手机用不了麦克风功能（跟读评分/语音输入），朗读、词卡、测验、AI 聊天正常。")
bullet("AI 需要在每台设备上各自填一次自己的 API Key。")
bullet("每台设备的学习数据是独立的，互不同步。")

h2("方式二：部署到公网（其他人在任何地方都能访问）")
p("推荐 GitHub Pages：免费、支持 HTTPS（手机上麦克风功能也能用），还能顺便学会 git：")
step("注册 github.com 账号")
step("新建仓库（New repository），名字如 english-hub，选 Public")
step("点 Add file → Upload files，把 index.html、css、js 整个拖进去提交（无需安装 git）")
step("仓库 Settings → Pages → Source 选 main 分支 → Save")
step("1~2 分钟后，网址为 https://你的用户名.github.io/english-hub/，任何人任何设备都能访问")
p("国内访问慢的替代：Gitee Pages（需实名）、Vercel / Netlify（免费，绑定 GitHub 一键导入）。")
p("🔒 安全提醒：不要把 API Key 写进代码上传！Key 只存在每台设备自己的浏览器里，访问者各自配置、互不共享费用。", bold=True)

end = doc.add_paragraph()
end.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = end.add_run("祝你大一过 AB 级，毕业前拿下 BEC，和外国人聊天不再紧张！💪")
run.bold = True
set_cn_font(run)

try:
    doc.save(OUT)
except PermissionError:
    # 原文件可能正被 Word 打开占用，保存为“新版”
    OUT = "英途EnglishHub使用说明书(新版).docx"
    doc.save(OUT)
print("SAVED:", OUT)
