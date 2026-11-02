/*
 * 英语学习网站内容数据文件 data-content.js
 * 加载方式: 由普通 script 标签引入(非 ES 模块), 加载完成后依次向 window 挂载 6 个数据对象.
 * 数据结构说明:
 * 1. SCENARIOS: 10 个口语场景, 每项 {id, title, icon, desc, lines:[{en, zh}]}
 * 2. GRAMMAR: 10 个语法主题, 每项 {id, title, points:[{h, t}], examples:[{en, zh}], quiz:[{q, opts, a, why}]}
 * 3. EXAM: 三大考试资料, {ab, cet, bec}, 每项含 sections/skills/writing/extra
 * 4. EXAM_QUIZ: 24 道样题, 每项 {q, opts, a, why, level}, level 取 ab 或 cet
 * 5. QUOTES: 15 条英语名言, 每项 {en, zh}
 * 6. RESOURCES: 8 个免费学习资源, 每项 {name, url, zh}
 * 注意: 本文件只做数据赋值, 不含任何其他可执行代码; 所有标点均为英文半角.
 */

window.SCENARIOS = [
  {
    id: "self-intro",
    title: "自我介绍与破冰",
    icon: "👋",
    desc: "大一新生初次见面时的自我介绍与破冰对话, 覆盖姓名/家乡/专业/爱好四大要点. 关键句型: I'm from... / I major in...",
    lines: [
      { en: "Hi, I'm Leo. Nice to meet you!", zh: "你好, 我叫 Leo, 很高兴认识你!" },
      { en: "Where are you from?", zh: "你是哪里人?" },
      { en: "I'm from Sichuan, and I love hot pot.", zh: "我来自四川, 而且我超爱火锅." },
      { en: "I'm a freshman, and I major in Computer Network Technology.", zh: "我是大一新生, 专业是计算机网络技术." },
      { en: "That sounds cool. Do you play video games?", zh: "听起来很酷. 你玩游戏吗?" },
      { en: "Yeah, I play games on weekends with my roommates.", zh: "玩啊, 我周末经常和室友一起打游戏." },
      { en: "What do you do in your free time?", zh: "你空闲时间都做什么?" },
      { en: "I like basketball and listening to music.", zh: "我喜欢打篮球和听音乐." },
      { en: "Can I add you on WeChat?", zh: "我可以加你微信吗?" },
      { en: "Sure! Here's my QR code.", zh: "当然! 这是我的二维码." },
      { en: "Let's hang out sometime.", zh: "我们改天一起出去玩吧." },
      { en: "Sounds good. See you around!", zh: "好啊. 回头见!" }
    ]
  },
  {
    id: "campus",
    title: "校园与课堂生活",
    icon: "🏫",
    desc: "校园日常: 上课, 借笔记, 找图书馆, 聊社团. 关键句型: What class do we have next? / Where is the...?",
    lines: [
      { en: "Hey, what class do we have next?", zh: "嘿, 我们下节是什么课?" },
      { en: "We have English at 10 a.m. in Building 3.", zh: "十点在三号教学楼有英语课." },
      { en: "Ugh, I didn't finish my homework.", zh: "唉, 我作业还没写完." },
      { en: "Don't worry. The teacher is pretty easygoing.", zh: "别担心, 老师挺随和的." },
      { en: "Can I borrow your notes from last class?", zh: "我能借一下你上节课的笔记吗?" },
      { en: "Sure, but my handwriting is kinda messy.", zh: "可以, 不过我字写得有点乱." },
      { en: "Where is the school library?", zh: "学校图书馆在哪里?" },
      { en: "It's next to the playground. Let's go together.", zh: "就在操场旁边. 我们一起去吧." },
      { en: "Are you joining any clubs this semester?", zh: "这学期你参加社团了吗?" },
      { en: "Yeah, I joined the computer club. It's fun.", zh: "参加了, 我加了计算机社团, 挺有意思的." },
      { en: "Good for you. I wanna join the basketball club.", zh: "不错啊. 我想加入篮球社." },
      { en: "Let's study together for the finals.", zh: "期末我们一起复习吧." }
    ]
  },
  {
    id: "restaurant",
    title: "餐厅点餐",
    icon: "🍜",
    desc: "餐厅点餐全流程: 进门, 看菜单, 点菜, 结账. 关键句型: I'd like... / Can I have...?",
    lines: [
      { en: "Welcome to our restaurant! How many people?", zh: "欢迎光临! 请问几位?" },
      { en: "A table for two, please.", zh: "两个人, 谢谢." },
      { en: "Can I see the menu, please?", zh: "请给我看一下菜单好吗?" },
      { en: "What do you recommend?", zh: "你有什么推荐吗?" },
      { en: "The spicy chicken is our special.", zh: "辣子鸡是我们的招牌菜." },
      { en: "OK, I'll have that and a bowl of rice.", zh: "好的, 我要那个, 再来一碗米饭." },
      { en: "Anything to drink?", zh: "要喝点什么吗?" },
      { en: "Two cups of cola, no ice, please.", zh: "两杯可乐, 不加冰, 谢谢." },
      { en: "How's the food?", zh: "菜味道怎么样?" },
      { en: "It's delicious, but a little spicy.", zh: "很好吃, 就是有点辣." },
      { en: "Can we have the bill, please?", zh: "请帮我们结账." },
      { en: "Sure. That's 68 yuan in total.", zh: "好的. 一共68元." }
    ]
  },
  {
    id: "direction",
    title: "问路与出行",
    icon: "🧭",
    desc: "问路与出行: 指路, 问距离, 坐公交, 买票. 关键句型: How can I get to...? / Go straight and turn left.",
    lines: [
      { en: "Excuse me, how can I get to the subway station?", zh: "打扰一下, 请问地铁站怎么走?" },
      { en: "Go straight and turn left at the second crossing.", zh: "直走, 在第二个路口左转." },
      { en: "How far is it from here?", zh: "离这里有多远?" },
      { en: "It's about ten minutes on foot.", zh: "步行大约十分钟." },
      { en: "Can I take a bus there?", zh: "我能坐公交车去吗?" },
      { en: "Yes, bus No. 5 can take you there.", zh: "可以, 5路公交车能到." },
      { en: "Is there a bus stop near here?", zh: "这附近有公交站吗?" },
      { en: "There's one right across the street.", zh: "街对面就有一个." },
      { en: "How much is the bus fare?", zh: "公交车票多少钱?" },
      { en: "It's two yuan. You can scan the code.", zh: "两块钱, 扫码就行." },
      { en: "Could you speak a little slower, please?", zh: "您能说慢一点吗?" },
      { en: "No problem. Follow me, I'm going that way too.", zh: "没问题. 跟我走吧, 我也往那边去." }
    ]
  },
  {
    id: "dorm",
    title: "宿舍日常",
    icon: "🛏️",
    desc: "宿舍日常: 起床, 值日, 借东西, 开空调, 点外卖. 关键句型: Can I use your...? / It's my turn.",
    lines: [
      { en: "Are you up? Class starts in thirty minutes.", zh: "你醒了吗? 还有半小时就上课了." },
      { en: "Five more minutes, please.", zh: "再给我五分钟吧." },
      { en: "You stayed up late gaming again, right?", zh: "你昨晚又熬夜打游戏了吧?" },
      { en: "Yeah, I couldn't sleep, so I played a bit.", zh: "是啊, 睡不着, 就玩了一会儿." },
      { en: "Who's on duty today? The room is a mess.", zh: "今天谁值日? 宿舍太乱了." },
      { en: "It's my turn. I'll clean it after class.", zh: "轮到我了. 下课后我来打扫." },
      { en: "Can I use your charger? Mine is broken.", zh: "我可以用一下你的充电器吗? 我的坏了." },
      { en: "Sure, it's on my desk.", zh: "可以, 在我桌上." },
      { en: "It's so hot. Why don't we turn on the AC?", zh: "好热啊. 我们把空调打开吧." },
      { en: "The remote is on the bed.", zh: "遥控器在床上." },
      { en: "Let's order some takeout for lunch.", zh: "中午我们点外卖吧." },
      { en: "Good idea. I'm starving.", zh: "好主意. 我快饿死了." }
    ]
  },
  {
    id: "gaming",
    title: "游戏开黑",
    icon: "🎮",
    desc: "游戏开黑常用语, 覆盖 GG/AFKO/noob/carry/lag 等词. 关键句型: I'll carry you. / GG!",
    lines: [
      { en: "Yo, are you online? Wanna play a game?", zh: "哟, 上线了吗? 打一局?" },
      { en: "I'm in. Invite me to your team.", zh: "我在线. 拉我进队." },
      { en: "Guys, my ping is so high. I'm lagging hard.", zh: "兄弟们, 我延迟好高, 卡死了." },
      { en: "Noob! You missed the easy kill again.", zh: "菜鸟! 这么简单的击杀又放跑了." },
      { en: "Sorry, my bad. The connection is terrible today.", zh: "抱歉, 我的锅. 今天网络太差了." },
      { en: "Don't worry. I'll carry you this round.", zh: "别担心. 这局我带你飞." },
      { en: "Nice! That was a sick play!", zh: "漂亮! 这波操作太秀了!" },
      { en: "AFK for a minute, I need some water.", zh: "我挂机一分钟, 去倒杯水." },
      { en: "Hurry back. We're pushing the base now.", zh: "快回来. 我们现在推基地了." },
      { en: "The enemy is defending hard. We need a good combo.", zh: "对面守得很死. 我们需要好配合." },
      { en: "Yes! We got the win. GG everyone!", zh: "赢了! 大家打得好, GG!" },
      { en: "One more round? I'm on a hot streak.", zh: "再来一局? 我手感正热." }
    ]
  },
  {
    id: "shopping",
    title: "购物砍价",
    icon: "🛍️",
    desc: "购物砍价: 问价, 讨价还价, 试穿, 移动支付. 关键句型: Can you make it cheaper?",
    lines: [
      { en: "Excuse me, how much is this T-shirt?", zh: "请问这件T恤多少钱?" },
      { en: "It's 120 yuan. It's the latest style.", zh: "120元. 这是最新款." },
      { en: "Wow, that's a bit expensive.", zh: "哇, 有点贵啊." },
      { en: "I can give you a discount. 100 yuan, OK?", zh: "我可以给你打个折. 100元怎么样?" },
      { en: "Can you make it cheaper? Say 80.", zh: "还能再便宜点吗? 80吧." },
      { en: "No way, 80 is below my cost.", zh: "不行, 80连成本都不够." },
      { en: "How about 90? That's my final offer.", zh: "90怎么样? 这是我的最高价了." },
      { en: "OK, 90 it is. You drive a hard bargain.", zh: "行, 90就90. 你真会砍价." },
      { en: "Great. Can I try it on first?", zh: "太好了. 我能先试穿一下吗?" },
      { en: "Of course. The fitting room is over there.", zh: "当然. 试衣间在那边." },
      { en: "It fits perfectly. I'll take it.", zh: "很合身. 我就要这件了." },
      { en: "Do you take Alipay or WeChat Pay?", zh: "可以用支付宝或微信支付吗?" }
    ]
  },
  {
    id: "travel",
    title: "旅行与住酒店",
    icon: "✈️",
    desc: "旅行与住酒店: 办理入住, 早餐时间, 叫醒服务, Wi-Fi. 关键句型: I'd like to check in.",
    lines: [
      { en: "I'd like to check in, please.", zh: "我想办理入住." },
      { en: "Do you have a reservation?", zh: "您有预订吗?" },
      { en: "Yes, I booked a single room for two nights.", zh: "有, 我订了两晚的单人间." },
      { en: "May I see your ID card, please?", zh: "请出示一下您的身份证." },
      { en: "Here you are.", zh: "给您." },
      { en: "Your room is 1206 on the twelfth floor.", zh: "您的房间是12楼1206." },
      { en: "What time is breakfast served?", zh: "早餐几点供应?" },
      { en: "From 7 to 10 in the morning.", zh: "早上7点到10点." },
      { en: "Can I get a wake-up call at six thirty?", zh: "能帮我设一个6点半的叫醒服务吗?" },
      { en: "Sure. Anything else I can help you with?", zh: "好的. 还有什么需要帮忙的吗?" },
      { en: "Is there free Wi-Fi in the room?", zh: "房间里有免费Wi-Fi吗?" },
      { en: "Yes, the password is on the desk.", zh: "有, 密码在桌子上." }
    ]
  },
  {
    id: "meeting",
    title: "商务会议",
    icon: "💼",
    desc: "商务会议场景(BEC 方向), 覆盖 agenda, project update 等词. 关键句型: Let's go over the agenda.",
    lines: [
      { en: "Good morning, everyone. Let's start the meeting.", zh: "大家早上好. 我们开会吧." },
      { en: "First, let's go over today's agenda.", zh: "首先, 我们过一下今天的议程." },
      { en: "First on the list is the project update.", zh: "第一项是项目进展汇报." },
      { en: "I'll begin with the sales numbers for this quarter.", zh: "我先说说本季度的销售数据." },
      { en: "Sales went up by ten percent last month.", zh: "上个月销售额增长了10%." },
      { en: "That's great news. What about the new website?", zh: "好消息. 新网站进展如何?" },
      { en: "The website is almost ready. We're testing it now.", zh: "网站基本完成了, 我们正在测试." },
      { en: "When can we launch it?", zh: "我们什么时候能上线?" },
      { en: "I think we can launch it next Monday.", zh: "我觉得下周一可以上线." },
      { en: "Good. Any questions about the plan?", zh: "好. 对这个计划有疑问吗?" },
      { en: "Could you send me the report by email?", zh: "能把报告发我邮箱吗?" },
      { en: "Sure. I'll send it to everyone this afternoon.", zh: "好的, 今天下午发给大家." }
    ]
  },
  {
    id: "interview",
    title: "求职面试",
    icon: "📋",
    desc: "求职面试场景(BEC 方向): 自我介绍, 求职动机, 优势, 提问环节. 关键句型: Could you tell me about yourself?",
    lines: [
      { en: "Good morning. Please have a seat.", zh: "早上好, 请坐." },
      { en: "Thank you. I'm glad to be here.", zh: "谢谢. 很高兴能来面试." },
      { en: "Could you tell me a little about yourself?", zh: "能简单介绍一下你自己吗?" },
      { en: "I'm a computer major. I love solving problems.", zh: "我是计算机专业的, 喜欢解决问题." },
      { en: "Why do you want this job?", zh: "你为什么想应聘这个岗位?" },
      { en: "I want to learn and grow in a real team.", zh: "我想在真正的团队里学习和成长." },
      { en: "What are your strengths?", zh: "你的优点是什么?" },
      { en: "I'm patient and I learn new things fast.", zh: "我有耐心, 学新东西也快." },
      { en: "Can you work under pressure?", zh: "你能在压力下工作吗?" },
      { en: "Yes, I keep calm and plan my time well.", zh: "能, 我能保持冷静并合理安排时间." },
      { en: "Do you have any questions for me?", zh: "你有什么想问我的吗?" },
      { en: "When can I know the result?", zh: "我什么时候能知道结果?" }
    ]
  }
];

window.GRAMMAR = [
  {
    id: "sentence",
    title: "句子结构与五大基本句型",
    points: [
      { h: "英语句子必须有主语和谓语, 中文可以没有", t: "中文可以说'下雨了', 没有主语, 但英语必须说 It is raining. 英语句子的骨架永远是'谁 + 做什么/是什么'." },
      { h: "五大基本句型(一): 主谓/主谓宾/主系表", t: "主谓: I run(我跑). 主谓宾: I love English(我爱英语). 主系表: be 动词 + 形容词或名词, 如 I am happy(我开心), He is a student(他是学生)." },
      { h: "五大基本句型(二): 主谓双宾/主谓宾补", t: "主谓双宾: give/send/show 等动词后接'人 + 物', 如 She gave me a book(她给了我一本书). 主谓宾补: 宾语后面再补一个说明, 如 We call him Tom(我们叫他汤姆)." },
      { h: "中英语序对比: 修饰语的位置", t: "中文的修饰语习惯放前面, 如'我昨天在学校打篮球', 英语习惯把时间地点放句尾: I played basketball at school yesterday." }
    ],
    examples: [
      { en: "I like English very much.", zh: "我非常喜欢英语." },
      { en: "She is my English teacher.", zh: "她是我的英语老师." },
      { en: "He gave me a book yesterday.", zh: "他昨天给了我一本书." }
    ],
    quiz: [
      { q: "下面哪个句子正确表达'我非常喜欢英语'?", opts: ["I very like English", "I like English very much", "I very much like English", "English I like very much"], a: 1, why: "英语不说 I very like English, very much 要放在句尾, 结构是主谓宾加状语." },
      { q: "'He gave me a book.' 属于五大基本句型中的哪一种?", opts: ["主谓", "主谓宾", "主谓双宾", "主谓宾补"], a: 2, why: "gave 后面跟了 me 和 a book 两个宾语, 分别是间接宾语和直接宾语." },
      { q: "下面哪个句子是'主系表'结构?", opts: ["I run every day", "I love music", "She is happy", "He plays basketball"], a: 2, why: "is 加形容词 happy 构成主系表, 表示'她是开心的'." }
    ]
  },
  {
    id: "present",
    title: "be 动词与一般现在时",
    points: [
      { h: "be 动词的三种形式: am/is/are", t: "我(I)用 am, 他她它(he/she/it)用 is, 你我们他们(you/we/they)用 are. 口诀: I am, You are, He is." },
      { h: "一般现在时: 表示习惯和事实", t: "经常做的事, 日常习惯, 客观事实都用一般现在时, 如 I get up at seven(我七点起床), The sun rises in the east(太阳从东方升起)." },
      { h: "第三人称单数要加 -s", t: "主语是 he/she/it 或单个名字时, 动词要加 -s. 规则: 一般加 -s(likes); 以 s/x/ch/sh/o 结尾加 -es(goes, watches); 辅音字母加 y 结尾变 y 为 ies(studies)." },
      { h: "否定和疑问要请助动词帮忙", t: "否定用 don't/doesn't 加动词原形(He doesn't like tea). 疑问把 Do/Does 放句首, 动词用原形(Does she like tea?)." }
    ],
    examples: [
      { en: "I am a college student.", zh: "我是一名大学生." },
      { en: "She gets up at seven every day.", zh: "她每天七点起床." },
      { en: "He goes to school by bus.", zh: "他坐公交车上学." }
    ],
    quiz: [
      { q: "My brother ____ TV every evening.", opts: ["watch", "watches", "watching", "to watch"], a: 1, why: "主语 My brother 是第三人称单数, 一般现在时动词要加 -es." },
      { q: "____ you like coffee?", opts: ["Do", "Does", "Is", "Are"], a: 0, why: "主语是 you, 疑问句用 Do 开头, 后面动词用原形 like." },
      { q: "Tom ____ a student. He is a worker.", opts: ["is", "isn't", "aren't", "doesn't"], a: 1, why: "根据后一句'他是工人'可知 Tom 不是学生, 主语 Tom 用 isn't." }
    ]
  },
  {
    id: "past",
    title: "一般过去时",
    points: [
      { h: "规则动词加 -ed", t: "一般过去时表示过去发生的事. 规则动词直接加 -ed: play 变 played, work 变 worked; 以 e 结尾加 -d: live 变 lived; 辅音加 y 结尾变 ied: study 变 studied." },
      { h: "不规则动词要靠背", t: "常用不规则动词: go 变 went, come 变 came, have 变 had, do 变 did, eat 变 ate, see 变 saw, buy 变 bought. 它们没有规律, 只能多读多背." },
      { h: "否定和疑问用 did", t: "否定: didn't 加动词原形(I didn't go). 疑问: Did 放句首, 动词用原形(Did you go?). 注意: 用了 did 动词就打回原形, 不能再加 -ed." },
      { h: "be 动词的过去式 was/were", t: "I/he/she/it 用 was, you/we/they 用 were, 如 I was tired yesterday(我昨天很累), They were at home(他们在家)." }
    ],
    examples: [
      { en: "I watched a movie last night.", zh: "我昨晚看了一场电影." },
      { en: "She went to Shanghai last week.", zh: "她上周去了上海." },
      { en: "Did you see the game yesterday?", zh: "你昨天看比赛了吗?" }
    ],
    quiz: [
      { q: "He ____ football yesterday afternoon.", opts: ["play", "plays", "played", "playing"], a: 2, why: "yesterday afternoon 是过去时间, 动词要用过去式 played." },
      { q: "She ____ to Beijing last month.", opts: ["go", "goes", "went", "gone"], a: 2, why: "last month 表示过去, go 的过去式是 went." },
      { q: "____ they have a meeting last Friday?", opts: ["Do", "Does", "Did", "Are"], a: 2, why: "last Friday 是过去时间, 疑问句用 Did 开头, 后面动词用原形 have." }
    ]
  },
  {
    id: "future-prog",
    title: "一般将来时与现在进行时",
    points: [
      { h: "will 加动词原形", t: "will 表示'将要', 后面永远跟动词原形, 如 I will call you tomorrow(我明天给你打电话). 否定用 won't, 疑问把 Will 提前." },
      { h: "be going to 加动词原形", t: "be going to 表示'打算/准备做', 或根据迹象'将要发生', 如 I'm going to visit my parents(我打算去看父母). be 要随主语变化: am/is/are going to." },
      { h: "will 与 be going to 的区别", t: "临时决定的用 will(门铃响了: I'll get it 我去开门); 早有计划的用 be going to. 口语里两者经常混用, 不用太纠结." },
      { h: "现在进行时: be 加 doing", t: "现在进行时表示'此刻正在做', 如 I'm reading a book now(我现在正在看书). 动词加 -ing: play 变 playing; 以 e 结尾去 e 加 ing: make 变 making; 双写末尾辅音: run 变 running." }
    ],
    examples: [
      { en: "I will go to the library tomorrow.", zh: "我明天要去图书馆." },
      { en: "We are going to have a test next week.", zh: "我们下周有一场考试." },
      { en: "Look! The bus is coming.", zh: "看! 公交车来了." }
    ],
    quiz: [
      { q: "I ____ visit my grandparents this weekend.", opts: ["will", "am", "was", "did"], a: 0, why: "this weekend 是将来的时间, 用 will 加动词原形 visit." },
      { q: "Listen! Someone ____ in the next room.", opts: ["sing", "sings", "is singing", "sang"], a: 2, why: "Listen! 提示动作正在发生, 用现在进行时 is singing." },
      { q: "Look at the dark clouds. It ____ rain.", opts: ["will to", "is going to", "going to", "is go to"], a: 1, why: "乌云是下雨的迹象, 用 be going to, 主语 it 搭配 is." }
    ]
  },
  {
    id: "perfect",
    title: "现在完成时入门",
    points: [
      { h: "结构: have/has 加过去分词", t: "主语是 he/she/it 用 has, 其余用 have, 后面跟动词的过去分词(也叫 done 形式), 如 I have finished my homework(我已经写完作业了)." },
      { h: "表示'结果'和'经验'", t: "现在完成时强调事情对现在的影响: 一种表示结果(钥匙丢了开不了门), 一种表示经验(曾经做过): I have been to Beijing(我去过北京). 它不关心事情是什么时候发生的." },
      { h: "与一般过去时的区别", t: "过去时必须配过去时间(yesterday, last week): I went there yesterday. 现在完成时不配过去时间: I have been there(我去过那儿). 口诀: 过去时问'什么时候', 完成时问'有没有'." },
      { h: "常搭配的副词: already/yet/ever/never", t: "already(已经)用于肯定句; yet(还)用于否定和疑问句; ever(曾经)用于疑问句; never(从未)用于否定: I have never seen the sea(我从没见过大海)." }
    ],
    examples: [
      { en: "I have finished my homework.", zh: "我已经做完作业了." },
      { en: "Have you ever been to Beijing?", zh: "你去过北京吗?" },
      { en: "She has lived here for five years.", zh: "她在这里住了五年了." }
    ],
    quiz: [
      { q: "I have ____ this movie before.", opts: ["see", "saw", "seen", "seeing"], a: 2, why: "have 后面要跟过去分词, see 的过去分词是 seen." },
      { q: "He ____ to Japan twice.", opts: ["has been", "have been", "went", "goes"], a: 0, why: "主语 he 用 has, '去过两次'强调经验, 用现在完成时 has been." },
      { q: "I ____ my key. I can't open the door.", opts: ["lose", "lost", "have lost", "loses"], a: 2, why: "钥匙丢了影响到现在(开不了门), 用现在完成时表示结果." }
    ]
  },
  {
    id: "modal",
    title: "情态动词",
    points: [
      { h: "can/can't: 能力与许可", t: "can 表示'能/会', 也可以表示允许: Can I use your phone?(我能用一下你的手机吗?) 否定 can't 表示'不会/不能'." },
      { h: "must/should: 必须与应该", t: "must 语气强, 表示'必须': You must finish it today(你今天必须完成). should 表示建议'应该': You should eat more fruit(你应该多吃水果). mustn't 是'禁止', 不是'不必'." },
      { h: "may/might: 可能", t: "may 可以表示'也许'或礼貌请求: May I come in?(我可以进来吗?) might 语气更弱, 把握更小: It might rain(可能会下雨)." },
      { h: "礼貌请求句型: Could you...?", t: "Could you help me?(您能帮我一下吗?) 比 Can you... 更礼貌. 回答别人请求时要说 Sure/Of course, 不用 could 回答." }
    ],
    examples: [
      { en: "Can you speak English?", zh: "你会说英语吗?" },
      { en: "You should go to bed early.", zh: "你应该早点睡觉." },
      { en: "Could you open the window, please?", zh: "请您开一下窗户好吗?" }
    ],
    quiz: [
      { q: "You ____ smoke here. It's a hospital.", opts: ["can", "mustn't", "should", "may"], a: 1, why: "医院里禁止吸烟, 用 mustn't 表示'禁止'." },
      { q: "____ I ask you a question?", opts: ["Must", "Should", "May", "Need"], a: 2, why: "May I... 是礼貌请求的固定句型, 表示'我可以...吗'." },
      { q: "You look tired. You ____ take a rest.", opts: ["should", "mustn't", "can't", "need"], a: 0, why: "提建议用 should, 表示'你应该休息一下'." }
    ]
  },
  {
    id: "noun-article",
    title: "名词单复数与冠词",
    points: [
      { h: "可数名词的复数规则", t: "一般加 -s(book 变 books); 以 s/x/ch/sh 结尾加 -es(box 变 boxes, watch 变 watches); 辅音加 y 结尾变 ies(city 变 cities); 以 f/fe 结尾变 ves(knife 变 knives); 不规则的: man 变 men, child 变 children." },
      { h: "不可数名词没有复数", t: "water(水), rice(米饭), money(钱), information(信息), advice(建议)都不可数, 不能说 two waters. 要说'两杯水'就是 two glasses of water." },
      { h: "a/an 的用法", t: "第一次提到的单数可数名词前用 a/an: a book(一本书). 元音音素开头用 an: an apple(一个苹果), an hour(h 不发音). 注意看发音, 不看字母." },
      { h: "the 的用法", t: "特指前面提过或双方都知道的东西: the book on the desk(桌上的那本书); 世界上独一无二的: the sun, the moon; 固定搭配: play the piano(弹钢琴)." }
    ],
    examples: [
      { en: "I have a book and two pens.", zh: "我有一本书和两支钢笔." },
      { en: "She has an apple every day.", zh: "她每天吃一个苹果." },
      { en: "The book on the desk is mine.", zh: "桌上的那本书是我的." }
    ],
    quiz: [
      { q: "There are many ____ in the tree.", opts: ["bird", "birds", "a bird", "birdes"], a: 1, why: "many 后面要用可数名词复数, bird 直接加 -s." },
      { q: "He wants to buy ____ umbrella.", opts: ["a", "an", "the", "some"], a: 1, why: "umbrella 以元音音素开头, 用 an, 不用 a." },
      { q: "I can see ____ sun in the sky.", opts: ["a", "an", "the", "one"], a: 2, why: "太阳是独一无二的, 必须用定冠词 the." }
    ]
  },
  {
    id: "compare",
    title: "形容词副词的比较级与最高级",
    points: [
      { h: "比较级基本规则", t: "单音节和部分双音节词加 -er: tall 变 taller, big 变 bigger(双写 g). 多音节词前面加 more: more beautiful. 最高级相应加 -est 或 most." },
      { h: "than 和 as...as", t: "两者比较用 than: He is taller than me(他比我高). 表示'一样'用 as...as: He is as tall as me(他和我一样高); '不如'用 not as...as." },
      { h: "不规则变化要死记", t: "good/well 变 better 变 best; bad 变 worse 变 worst; many/much 变 more 变 most; little 变 less 变 least. 这几个出现频率最高, 必须背熟." },
      { h: "最高级前面加 the", t: "三者或以上比较用最高级, 前面要加 the, 后面常跟 in/of 表示范围: He is the tallest in our class(他是我们班最高的)." }
    ],
    examples: [
      { en: "This book is more interesting than that one.", zh: "这本书比那本更有趣." },
      { en: "My English is better than before.", zh: "我的英语比以前好了." },
      { en: "She is the tallest girl in our class.", zh: "她是我们班最高的女生." }
    ],
    quiz: [
      { q: "Your bag is ____ than mine.", opts: ["big", "bigger", "biggest", "more big"], a: 1, why: "than 提示用比较级, big 要双写 g 再加 -er." },
      { q: "This movie is as ____ as that one.", opts: ["good", "better", "best", "well"], a: 0, why: "as...as 中间要用原级形容词 good." },
      { q: "Winter is the ____ season of the year.", opts: ["cold", "colder", "coldest", "most cold"], a: 2, why: "一年四季相比要用最高级 the coldest." }
    ]
  },
  {
    id: "prep",
    title: "常用介词",
    points: [
      { h: "in/on/at 表时间", t: "in 用于大时间: in 2024, in June, in the morning; on 用于具体某天: on Monday, on May 1st; at 用于具体时刻: at 8 o'clock, at night." },
      { h: "in/on/at 表地点", t: "in 表示在内部: in the room(在房间里); on 表示在表面: on the desk(在桌上); at 表示在某一点或小地点: at the bus stop(在公交站), at school(在学校)." },
      { h: "for/since 与完成时搭配", t: "for 加时间段: for two years(两年了); since 加时间点: since 2022(自2022年以来). 两者都常与现在完成时连用." },
      { h: "to/for 的常用搭配", t: "to 表示方向或对象: go to school(去上学), give sth to sb(把某物给某人); for 表示目的或对象: This gift is for you(这礼物是给你的), buy sth for sb(给某人买某物)." }
    ],
    examples: [
      { en: "I get up at seven in the morning.", zh: "我早上七点起床." },
      { en: "We have an English class on Monday.", zh: "我们周一有英语课." },
      { en: "I have lived here since 2022.", zh: "我从2022年起就住在这里." }
    ],
    quiz: [
      { q: "My birthday is ____ May 10th.", opts: ["in", "on", "at", "for"], a: 1, why: "具体某一天(5月10日)用 on." },
      { q: "He has worked here ____ five years.", opts: ["for", "since", "in", "on"], a: 0, why: "for 后面跟时间段, five years 是时间段." },
      { q: "The cat is sleeping ____ the sofa.", opts: ["in", "on", "at", "to"], a: 1, why: "猫在沙发上面, 用 on." }
    ]
  },
  {
    id: "clause",
    title: "从句入门",
    points: [
      { h: "宾语从句: I think (that)...", t: "把一句话放进另一句话里当宾语: I think (that) he is right(我觉得他是对的). that 只是连接词, 没有实际意思, 口语中常省略." },
      { h: "宾语从句的语序", t: "从句内部用陈述语序(主语加谓语), 不能倒装: I don't know where he lives(我不知道他住哪). 不能说 where does he live." },
      { h: "定语从句: who/which/that", t: "修饰人的用 who 或 that: The man who is talking is my teacher(正在说话的那个人是我老师). 修饰物的用 which 或 that: I like the book that you gave me(我喜欢你给我的那本书)." },
      { h: "什么时候可以省略关系词", t: "当 who/which/that 在从句里作宾语时可以省略: I like the book (that) you gave me. 作主语时不能省略: The man who is talking is my teacher." }
    ],
    examples: [
      { en: "I think that English is useful.", zh: "我觉得英语很有用." },
      { en: "The girl who is singing is my sister.", zh: "正在唱歌的女孩是我妹妹." },
      { en: "This is the book that I bought yesterday.", zh: "这就是我昨天买的书." }
    ],
    quiz: [
      { q: "I think ____ he will come tomorrow.", opts: ["what", "that", "where", "who"], a: 1, why: "宾语从句用 that 连接, 表示'认为他会来'." },
      { q: "Do you know where ____?", opts: ["does he live", "he lives", "he live", "lives he"], a: 1, why: "宾语从句要用陈述语序, 主语 he 放在动词 lives 前面." },
      { q: "The man ____ is wearing a red hat is my uncle.", opts: ["which", "who", "where", "whose"], a: 1, why: "修饰人 the man 用 who." }
    ]
  }
];

window.EXAM = {
  ab: {
    name: "AB级(PRETCO-高等学校英语应用能力考试)",
    intro: "面向高职高专学生的英语水平考试, 分 A 级和 B 级两个难度. B 级更基础, 适合英语薄弱的同学先考; A 级稍难, 通过后颁发证书. 大专一年级建议先考 B 级, 二年级再冲 A 级.",
    time: "每年 6 月 / 12 月",
    score: "满分 100 分, 60 分及格(A 级通过发证书)",
    sections: [
      { name: "听力理解", percent: "15%", tip: "多听真题录音, 边听边记关键词, 数字和日期常考." },
      { name: "语法与词汇", percent: "15%", tip: "复习基础语法点, 每天背高频词组和固定搭配." },
      { name: "阅读理解", percent: "35%", tip: "分值最高, 先看题目再读文章, 答案大多按顺序出现." },
      { name: "翻译(英译汉)", percent: "20%", tip: "先抓句子主干再翻译, 写出大意就能拿到大部分分." },
      { name: "写作", percent: "15%", tip: "背熟书信和通知的格式模板, 套用常用句型拿基础分." }
    ],
    skills: [
      "先做一套历年真题摸底, 找出听力/语法/阅读中的弱项, 再重点突破.",
      "每天背 20 个高频词汇, 坚持一个月就能覆盖大部分考点.",
      "听力每天精听 15 分钟, 听不懂就反复听, 直到能跟读出来.",
      "阅读先读题干圈关键词, 再回原文定位, 不要逐词翻译全文.",
      "翻译不要逐字硬翻, 先找主谓宾, 再组织成通顺的中文.",
      "写作考前背 3 个万能句型和 2 篇范文, 考试时套用并替换关键词."
    ],
    writing: [
      {
        title: "书信/邮件格式模板",
        template: "Dear ____,\nI am writing to tell you that ____.\nFirst, ____. Second, ____.\nIf you have any questions, please let me know.\nI am looking forward to your reply.\nYours sincerely,\n____",
        zh: "书信/邮件标准格式: 称呼, 开头说明写信目的, 正文写两点, 结尾表达期待回复, 最后落款署名. 下划线处按题目要求填写."
      },
      {
        title: "通知/启事模板",
        template: "Notice\nAttention please. ____ will be held ____.\nThe activity will last ____.\nEveryone is welcome to join.\nFor more information, please contact ____.\nThe Students' Union\n____(date)",
        zh: "通知格式: 标题 Notice, 正文写清活动内容/时间/地点, 注明联系方式, 最后落款单位与日期. 下划线处按题目要求填写."
      }
    ],
    extra: "AB 级是高职学生的入门级英语证书, 难度远低于四六级. 建议先拿下 AB 级建立信心, 再挑战四六级和 BEC."
  },
  cet: {
    name: "大学英语四六级(CET-4/CET-6)",
    intro: "全国大学英语考试, 分四级(CET-4)和六级(CET-6). 425 分过线, 过线后发放成绩单. 许多本科院校把四级与毕业挂钩, 考研, 专升本和求职时四级也是常见门槛, 六级高分更能加分.",
    time: "每年 6 月 / 12 月",
    score: "总分 710, 425 分过线",
    sections: [
      { name: "写作", percent: "15%", tip: "30 分钟限时完成, 开头套模板, 主体写清观点和例子." },
      { name: "听力", percent: "35%", tip: "占比最高, 平时多听新闻和真题, 转折词 but/however 后面的内容常是答案." },
      { name: "阅读理解", percent: "35%", tip: "先做仔细阅读(每题分值高), 再做段落匹配和选词填空." },
      { name: "翻译(汉译英)", percent: "15%", tip: "用简单句把意思说清楚, 不会的词换一种说法, 写了就有分." }
    ],
    skills: [
      "四级词汇约 4500 个, 优先背高频 1500 词, 不要从 A 背到 Z.",
      "听力是命门, 坚持每天 30 分钟精听加泛听, 重点练真题听力.",
      "阅读先看题干圈关键词, 再回原文定位, 答案基本按段落顺序出现.",
      "翻译不求华丽, 用简单词汇把意思说清楚就能拿一半以上的分.",
      "写作考前背 5 个万能句型和 3 篇范文, 考试时直接套用.",
      "考前一个月每周完整模考两次, 严格计时, 训练做题节奏."
    ],
    writing: [
      {
        title: "议论文开头段模板",
        template: "With the development of society, ____ has become a hot topic.\nDifferent people have different opinions about it.\nIn my view, ____.\nThe reasons are as follows.",
        zh: "议论文三段式开头: 第一句引入话题, 第二句点明存在不同观点, 第三句亮出自己的观点. 下划线处按题目主题填写."
      },
      {
        title: "图表作文开头模板",
        template: "The chart shows that the number of ____ has changed a lot from ____ to ____.\nAs we can see, it increased/decreased from ____ to ____.\nThere are several reasons behind this change.",
        zh: "图表作文开头: 第一句描述图表总体内容, 第二句用数据说明上升或下降趋势, 第三句引出原因分析. 下划线处按图表信息填写."
      }
    ],
    extra: "大专生同样可以报考四六级. 建议先过 AB 级打好基础, 再考四级, 通过后挑战六级. 四六级证书在求职和专升本中认可度很高."
  },
  bec: {
    name: "BEC 剑桥商务英语",
    intro: "剑桥大学考试委员会主办的商务英语考试, 分 Preliminary(初级)/Vantage(中级)/Higher(高级)三个级别. 适合想进外企, 做外贸或需要商务沟通的人. 初级适合基础薄弱者入门, 中级含金量最高, 报考人数最多.",
    time: "每年 5 月 / 11 月(以官网为准)",
    score: "初级/中级/高级三档, 分阅读/写作/听力/口语四部分",
    sections: [
      { name: "阅读", percent: "25%", tip: "材料全部来自真实商务场景, 如邮件, 报告, 图表, 平时多读商务文章." },
      { name: "写作", percent: "25%", tip: "常考商务邮件, 备忘录, 报告, 背熟固定开头结尾和常用句型." },
      { name: "听力", percent: "25%", tip: "语速较快且带口音, 多听商务场景对话, 电话录音和会议发言." },
      { name: "口语", percent: "25%", tip: "两人一组与考官对话, 练好自我介绍, 看图表达和话题讨论." }
    ],
    skills: [
      "先过四六级或 AB 级再考 BEC, 商务词汇是全新领域, 需要专门积累.",
      "每天积累 10 个商务高频词, 如 quotation(报价), deadline(截止日期), invoice(发票).",
      "口语考试两人一组, 提前找搭档按真题流程练习, 录音回听改进.",
      "写作必须熟悉邮件格式: 称呼, 正文, 结尾敬语一样都不能少.",
      "听力场景固定: 接电话, 开会, 出差, 反复精听真题总结常用表达.",
      "阅读时间紧, 先做短篇再做长篇, 图表题先看图再定位文字."
    ],
    writing: [
      {
        title: "商务邮件(询价/报价)",
        template: "Dear ____,\nWe are interested in your ____ and would like to ask for a quotation.\nPlease let us know the price, delivery time and payment terms.\nWe look forward to hearing from you soon.\nBest regards,\n____",
        zh: "询价邮件格式: 表明对产品感兴趣, 请对方报价, 并询问价格/交货时间/付款条件, 最后礼貌结尾. 下划线处按题目要求填写."
      },
      {
        title: "会议纪要开头模板",
        template: "Meeting Minutes\nDate: ____  Time: ____  Place: ____\nAttendees: ____\nAgenda items: ____\nDecisions made: ____\nAction items: ____",
        zh: "会议纪要要点: 时间, 地点, 参会人, 议题, 决议和待办事项, 分条列出. 下划线处按会议信息填写."
      }
    ],
    extra: "与四六级不同, BEC 全部围绕商务场景, 听说读写各占四分之一, 口语单独计分, 证书由剑桥大学颁发, 外企认可度高. 建议备考顺序: AB 级(打基础) > 四级 > BEC 初级 > BEC 中级."
  }
};

window.EXAM_QUIZ = [
  { q: "Tom ____ to school every day.", opts: ["go", "goes", "going", "gone"], a: 1, why: "主语 Tom 是第三人称单数, 一般现在时动词加 -es.", level: "ab" },
  { q: "There ____ a book and two pens on the desk.", opts: ["is", "are", "be", "am"], a: 0, why: "There be 句型遵循就近原则, 离 be 最近的是 a book, 所以用 is.", level: "ab" },
  { q: "She ____ TV last night.", opts: ["watches", "watch", "watched", "watching"], a: 2, why: "last night 是过去时间, 动词要用过去式 watched.", level: "ab" },
  { q: "____ beautiful the flowers are!", opts: ["What", "How", "What a", "So"], a: 1, why: "感叹句修饰形容词 beautiful 用 How, 结构是 How + 形容词 + 主语 + 谓语.", level: "ab" },
  { q: "Can you ____ me the way to the station?", opts: ["say", "speak", "tell", "talk"], a: 2, why: "tell sb the way 是固定搭配, 表示'告诉某人路怎么走'.", level: "ab" },
  { q: "He is interested ____ computer games.", opts: ["in", "on", "at", "for"], a: 0, why: "be interested in 是固定搭配, 表示'对...感兴趣'.", level: "ab" },
  { q: "There are ____ students in our class.", opts: ["fifty", "fifties", "fifty of", "the fifty"], a: 0, why: "数词直接修饰名词, 不加 s 也不加 of.", level: "ab" },
  { q: "I have two ____.", opts: ["knife", "knives", "knifes", "knifees"], a: 1, why: "knife 的复数要把 fe 变成 ves, 即 knives.", level: "ab" },
  { q: "She is ____ girl in our class.", opts: ["tall", "taller", "tallest", "the tallest"], a: 3, why: "in our class 表示三者以上范围, 用最高级, 且最高级前面要加 the.", level: "ab" },
  { q: "Would you like ____ cup of tea?", opts: ["other", "another", "the other", "others"], a: 1, why: "another 加单数名词表示'再来一杯', other 后面一般接复数名词.", level: "ab" },
  { q: "He didn't ____ to the party last night.", opts: ["went", "goes", "go", "gone"], a: 2, why: "didn't 后面必须跟动词原形, 所以用 go.", level: "ab" },
  { q: "The meeting will ____ at 9 o'clock.", opts: ["begin", "begins", "beginning", "began"], a: 0, why: "will 后面跟动词原形, 所以用 begin.", level: "ab" },
  { q: "The new policy will ____ all the students in our school.", opts: ["affect", "effect", "effort", "offer"], a: 0, why: "affect 是动词, 表示'影响'; effect 是名词, 此处需要动词.", level: "cet" },
  { q: "He has a good ____ of humor, so everyone likes him.", opts: ["feeling", "sense", "mood", "temper"], a: 1, why: "a sense of humor 是固定搭配, 表示'幽默感'.", level: "cet" },
  { q: "By the time he arrives, we ____ the meeting.", opts: ["finish", "will have finished", "finished", "have finished"], a: 1, why: "by the time 引导将来时间, 用将来完成时 will have done, 表示将来某时刻前已经完成.", level: "cet" },
  { q: "It was not until midnight ____ he finished his report.", opts: ["that", "when", "which", "where"], a: 0, why: "强调句型 It was not until...that..., 是固定结构, 表示'直到...才...'.", level: "cet" },
  { q: "The book, ____ cover is red, is mine.", opts: ["which", "whose", "that", "who"], a: 1, why: "whose 在定语从句中作定语修饰 cover, 表示'书的封面'.", level: "cet" },
  { q: "____ the heavy rain, the sports meeting was put off.", opts: ["Because", "Thanks to", "Due to", "As"], a: 2, why: "Due to 后面接名词短语表示原因; Because 和 As 要引导从句.", level: "cet" },
  { q: "He suggested that we ____ early tomorrow.", opts: ["start", "started", "will start", "would start"], a: 0, why: "suggest 表示'建议'时, 从句用虚拟语气 should 加动词原形, should 可以省略.", level: "cet" },
  { q: "I regret ____ you that your application has been turned down.", opts: ["tell", "told", "to tell", "telling"], a: 2, why: "regret to do 表示'遗憾地去做(还没做)', regret doing 表示'后悔做过'.", level: "cet" },
  { q: "Only in this way ____ solve the problem.", opts: ["we can", "can we", "we could", "could we"], a: 1, why: "Only 加状语放在句首时, 主句要部分倒装, 把情态动词 can 提到主语前面.", level: "cet" },
  { q: "He devoted himself to ____ the poor children.", opts: ["help", "helping", "helped", "helps"], a: 1, why: "devote oneself to 中的 to 是介词, 后面要跟动名词 helping.", level: "cet" },
  { q: "The company ____ in 2005 has become a world leader.", opts: ["founded", "founding", "to found", "being founded"], a: 0, why: "过去分词 founded 作后置定语表示被动, 意为'成立于2005年的公司'.", level: "cet" },
  { q: "No sooner had he arrived ____ it began to rain.", opts: ["when", "than", "then", "that"], a: 1, why: "no sooner...than 是固定搭配, 表示'一...就...'.", level: "cet" }
];

window.QUOTES = [
  { en: "The journey of a thousand miles begins with a single step.", zh: "千里之行, 始于足下." },
  { en: "Where there is a will, there is a way.", zh: "有志者, 事竟成." },
  { en: "Practice makes perfect.", zh: "熟能生巧." },
  { en: "Rome was not built in a day.", zh: "罗马不是一天建成的." },
  { en: "Learning is a treasure that will follow its owner everywhere.", zh: "学习是一笔财富, 走到哪里都跟着你." },
  { en: "The best way to predict the future is to create it.", zh: "预测未来最好的方式, 就是创造未来." },
  { en: "Success is the sum of small efforts, repeated day in and day out.", zh: "成功是日复一日的小努力累积起来的." },
  { en: "Don't watch the clock; do what it does. Keep going.", zh: "别盯着时钟看, 要像时钟一样, 不停往前走." },
  { en: "A different language is a different vision of life.", zh: "一种不同的语言, 就是一种不同的人生视角." },
  { en: "The limits of my language mean the limits of my world.", zh: "语言的边界, 就是世界的边界." },
  { en: "To learn a language is to have one more window from which to look at the world.", zh: "学一门语言, 就是多一扇看世界的窗户." },
  { en: "It does not matter how slowly you go as long as you do not stop.", zh: "走得慢没关系, 只要不停下来." },
  { en: "Hard work beats talent when talent doesn't work hard.", zh: "当天才不努力时, 努力可以打败天才." },
  { en: "You don't have to be great to start, but you have to start to be great.", zh: "你不必很厉害才开始, 但你必须开始才会变厉害." },
  { en: "Language is the road map of a culture.", zh: "语言是一张文化的路线图." }
];

window.RESOURCES = [
  { name: "每日英语听力", url: "https://dict.eudic.net/ting", zh: "海量英语听力材料, 支持跟读/变速/字幕, 适合每天打卡练听力." },
  { name: "VOA Learning English", url: "https://learningenglish.voanews.com", zh: "美国之音慢速英语, 语速慢, 用词简单, 适合初学者练习听力和新闻词汇." },
  { name: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish", zh: "BBC 官方英语学习频道, 有地道英式发音和大量语法/词汇短课程." },
  { name: "TED", url: "https://www.ted.com", zh: "看世界各地精彩演讲, 可开英文字幕, 顺便积累口语表达和视野." },
  { name: "YouGlish", url: "https://youglish.com", zh: "输入单词就能看到它在大量真实视频中的发音例句, 纠正发音的神器." },
  { name: "ESL Pod", url: "https://www.eslpod.com", zh: "专为英语学习者做的慢速播客, 每集讲解日常对话, 适合磨耳朵." },
  { name: "中国日报英语点津", url: "https://language.chinadaily.com.cn", zh: "中国日报旗下双语栏目, 双语新闻加热词翻译, 了解时事顺便学英语." },
  { name: "Anki", url: "https://apps.ankiweb.net", zh: "免费记忆卡片软件, 用间隔重复法背单词, 记得牢, 手机电脑可同步." }
];
