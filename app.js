const STORAGE_KEY = "subscope-demo-v3";
const API_BASE = location.port === "5000" ? "" : "http://127.0.0.1:5000";
let backendAvailable = false;

const genres = {
  it: { label: "IT", color: "#2563eb", keywords: ["tech", "technology", "programming", "programmer", "software", "code", "\u30ac\u30b8\u30a7\u30c3\u30c8", "\u958b\u767a", "python", "react", "\u30a8\u30f3\u30b8\u30cb\u30a2", "\u30b3\u30f3\u30d4\u30e5\u30fc\u30bf", "\u30d7\u30ed\u30b0\u30e9\u30df\u30f3\u30b0"] },
  eng_backend: { label: "\u30d0\u30c3\u30af\u30a8\u30f3\u30c9", color: "#1d4ed8", keywords: ["backend", "\u30d0\u30c3\u30af\u30a8\u30f3\u30c9", "python", "django", "flask", "api", "db", "database", "mysql", "postgres", "server"] },
  eng_frontend: { label: "\u30d5\u30ed\u30f3\u30c8\u30a8\u30f3\u30c9", color: "#0284c7", keywords: ["frontend", "\u30d5\u30ed\u30f3\u30c8\u30a8\u30f3\u30c9", "react", "vue", "typescript", "javascript", "css", "ui", "web\u5236\u4f5c"] },
  eng_infra: { label: "\u30a4\u30f3\u30d5\u30e9/DevOps", color: "#475569", keywords: ["infra", "devops", "aws", "gcp", "docker", "kubernetes", "linux", "\u30b5\u30fc\u30d0\u30fc", "\u30a4\u30f3\u30d5\u30e9"] },
  eng_ai: { label: "AI/\u958b\u767a", color: "#0d9488", keywords: ["ai", "chatgpt", "llm", "\u751f\u6210ai", "\u6a5f\u68b0\u5b66\u7fd2", "python ai", "\u4eba\u5de5\u77e5\u80fd"] },
  nba: { label: "NBA", color: "#d1840f", keywords: ["nba", "basket", "\u30d0\u30b9\u30b1", "lakers", "warriors", "be a baller", "\u30ec\u30a4\u30ab\u30fc\u30ba", "\u30a6\u30a9\u30ea\u30a2\u30fc\u30ba"] },
  sports: { label: "\u30b9\u30dd\u30fc\u30c4", color: "#16a34a", keywords: ["sports", "espn", "\u30b9\u30dd\u30fc\u30c4", "\u91ce\u7403", "\u30b5\u30c3\u30ab\u30fc", "\u30a2\u30b9\u30ea\u30fc\u30c8"] },
  game: { label: "\u30b2\u30fc\u30e0", color: "#ef4444", keywords: ["game", "gaming", "\u30b2\u30fc\u30e0", "dq", "dqx", "\u30c9\u30e9\u30b4\u30f3", "\u5b9f\u6cc1", "riddle", "mkr", "\u30dd\u30b1\u30e2\u30f3", "\u30de\u30ea\u30aa", "\u4efb\u5929\u5802", "nintendo", "apex", "apex legends", "\u30b9\u30fc\u30d1\u30fc\u30de\u30ea\u30aa", "\u30de\u30ea\u30aa\u30e1\u30fc\u30ab\u30fc", "\u30b9\u30fc\u30d1\u30fc\u30de\u30ea\u30aa\u30e1\u30fc\u30ab\u30fc"] },
  game_nintendo: { label: "\u4efb\u5929\u5802/\u30de\u30ea\u30aa", color: "#dc2626", keywords: ["nintendo", "\u4efb\u5929\u5802", "\u30de\u30ea\u30aa", "\u30de\u30ea\u30aa\u30e1\u30fc\u30ab\u30fc", "\u30b9\u30fc\u30d1\u30fc\u30de\u30ea\u30aa", "\u30dd\u30b1\u30e2\u30f3", "pokemon", "zelda"] },
  game_fps: { label: "FPS/\u30d0\u30c8\u30ed\u30ef", color: "#b91c1c", keywords: ["fps", "apex", "apex legends", "valorant", "fortnite", "\u30a8\u30fc\u30da\u30c3\u30af\u30b9", "\u30d0\u30c8\u30ed\u30ef"] },
  game_rpg: { label: "RPG", color: "#7c2d12", keywords: ["rpg", "dq", "dqx", "dq7", "\u30c9\u30e9\u30af\u30a8", "\u30c9\u30e9\u30b4\u30f3\u30af\u30a8\u30b9\u30c8", "ff", "\u30d5\u30a1\u30a4\u30ca\u30eb\u30d5\u30a1\u30f3\u30bf\u30b8\u30fc"] },
  game_stream: { label: "\u30b2\u30fc\u30e0\u5b9f\u6cc1/\u914d\u4fe1", color: "#f97316", keywords: ["\u5b9f\u6cc1", "\u914d\u4fe1", "\u30b2\u30fc\u30e0\u914d\u4fe1", "\u751f\u914d\u4fe1", "\u5207\u308a\u629c\u304d", "stream"] },
  horse: { label: "\u7af6\u99ac", color: "#a16207", keywords: ["\u7af6\u99ac", "\u99ac\u5238", "\u4e88\u60f3", "\u30de\u30a4\u30eb\u30ab\u30c3\u30d7", "nhk\u30de\u30a4\u30eb", "\u30a8\u30eb\u30b3\u30f3\u30c9\u30eb", "\u30c0\u30a4\u30e4\u30e2\u30f3\u30c9\u30ce\u30c3\u30c8", "\u5168\u982d\u8a3a\u65ad"] },
  diy: { label: "DIY/\u81ea\u4f5c", color: "#b45309", keywords: ["diy", "\u81ea\u4f5c", "\u5de5\u4f5c", "\u7d44\u307f\u7acb\u3066", "\u6539\u9020", "\u5efa\u9020", "\u81ea\u4f5cpc", "pc\u5efa\u9020", "\u30b0\u30e9\u30dc", "rtx", "blackwell"] },
  manga: { label: "\u6f2b\u753b/\u30a2\u30cb\u30e1", color: "#c026d3", keywords: ["\u6f2b\u753b", "\u30de\u30f3\u30ac", "\u30a2\u30cb\u30e1", "\u30ca\u30eb\u30c8", "naruto", "\u30b8\u30e3\u30f3\u30d7", "\u30ef\u30f3\u30d4\u30fc\u30b9", "\u9b3c\u6ec5", "\u30d2\u30ed\u30a2\u30ab"] },
  law: { label: "\u6cd5\u5f8b", color: "#475569", keywords: ["\u6cd5\u5f8b", "\u5f01\u8b77\u58eb", "\u52b4\u50cd\u6cd5", "\u88c1\u5224", "\u6cd5\u5ef7", "\u4e8b\u4ef6"] },
  medical: { label: "\u533b\u7642/\u7f8e\u5bb9", color: "#db2777", keywords: ["\u533b\u7642", "\u533b\u5b66", "\u533b\u5e2b", "\u30af\u30ea\u30cb\u30c3\u30af", "\u7f8e\u5bb9", "\u7f8e\u4eba", "\u6574\u5f62", "\u9f3b\u6574\u5f62", "\u9f3b", "\u8f2a\u90ed", "\u9ad8\u9808", "\u5065\u5eb7", "\u4e88\u9632"] },
  restaurant: { label: "\u98f2\u98df\u5e97", color: "#ea580c", keywords: ["\u98f2\u98df\u5e97", "\u30e9\u30fc\u30e1\u30f3", "\u30b0\u30eb\u30e1", "\u3046\u307e\u3044", "\u30a6\u30de\u3044", "\u8d85\u7d76\u30a6\u30de\u3044", "\u98df\u3079\u6b69\u304d", "\u5c45\u9152\u5c4b", "\u30ab\u30d5\u30a7"] },
  trivia: { label: "\u96d1\u5b66", color: "#0d9488", keywords: ["\u96d1\u5b66", "\u8c46\u77e5\u8b58", "\u8ab0\u304b\u306b\u8a71\u3057\u305f\u304f\u306a\u308b", "\u5f79\u7acb\u3064\u96d1\u5b66", "\u604b\u611b\u96d1\u5b66"] },
  board: { label: "2\u3061\u3083\u3093\u306d\u308b", color: "#64748b", keywords: ["2ch", "2\u3061\u3083\u3093", "2\u3061\u3083\u3093\u306d\u308b", "\u30b9\u30ec", "\u9762\u767d\u3044\u30b9\u30ec", "\u306a\u3093g", "\u306a\u3093j", "\u304a\u3093j"] },
  quote: { label: "\u540d\u8a00", color: "#7c3aed", keywords: ["\u540d\u8a00", "\u540d\u8a00\u96c6", "\u8a00\u8449\u306e\u30c1\u30ab\u30e9", "\u52c7\u6c17\u3092\u304f\u308c\u308b", "\u30de\u30c4\u30b3", "\u81ea\u4fe1", "\u5f53\u305f\u308a\u524d"] },
  entertainment: { label: "\u30a8\u30f3\u30bf\u30e1", color: "#f97316", keywords: ["\u30a8\u30f3\u30bf\u30e1", "\u304a\u7b11\u3044", "\u82b8\u4eba", "\u30c6\u30ec\u30d3", "nobrock", "\u6771\u6d77\u30aa\u30f3\u30a8\u30a2", "\u4f50\u4e45\u9593", "\u5207\u308a\u629c\u304d", "vtuber", "\u30a2\u30cb\u30e1"] },
  science: { label: "\u79d1\u5b66", color: "#0d9488", keywords: ["\u79d1\u5b66", "\u7269\u7406", "\u6570\u5b66", "\u7d71\u8a08\u5b66", "\u5de5\u5b66", "\u7406\u7cfb", "\u30c7\u30fc\u30bf\u30b5\u30a4\u30a8\u30f3\u30b9", "\u5927\u5b66\u306e\u6570\u5b66", "\u3086\u3063\u304f\u308a\u79d1\u5b66", "yobinori"] },
  business: { label: "\u30d3\u30b8\u30cd\u30b9", color: "#64748b", keywords: ["\u30d3\u30b8\u30cd\u30b9", "\u5e74\u53ce", "\u7d4c\u6e08", "\u6295\u8cc7", "\u30de\u30fc\u30b1\u30c3\u30c8", "\u30ad\u30e3\u30ea\u30a2", "\u4ed5\u4e8b"] },
  music: { label: "\u97f3\u697d", color: "#7c3aed", keywords: ["music", "bgm", "ost", "soundtrack", "playlist", "piano", "guitar", "cover", "lofi", "\u97f3\u697d", "\u6b4c", "dtm", "beats", "\u30b5\u30f3\u30c8\u30e9", "\u4f5c\u696d\u7528"] },
  study: { label: "\u5b66\u7fd2", color: "#2563eb", keywords: ["study", "english", "\u82f1\u8a9e", "\u82f1\u4f1a\u8a71", "\u5927\u5b66", "\u52c9\u5f37", "\u89e3\u8aac", "\u8b1b\u5ea7", "\u8cc7\u683c", "\u8a66\u9a13", "\u8a00\u8a9e\u5b66", "\u6388\u696d"] },
  student_exam: { label: "\u8a66\u9a13/\u53d7\u9a13", color: "#2563eb", keywords: ["\u8a66\u9a13", "\u53d7\u9a13", "\u8cc7\u683c", "\u57fa\u672c\u60c5\u5831", "\u5171\u901a\u30c6\u30b9\u30c8", "\u5927\u5b66\u53d7\u9a13", "\u52c9\u5f37\u6cd5"] },
  student_language: { label: "\u8a9e\u5b66/\u82f1\u8a9e", color: "#0d9488", keywords: ["english", "\u82f1\u8a9e", "\u82f1\u4f1a\u8a71", "\u8a9e\u5b66", "\u30ea\u30b9\u30cb\u30f3\u30b0", "\u5358\u8a9e", "toeic"] },
  worker_career: { label: "\u30ad\u30e3\u30ea\u30a2/\u4ed5\u4e8b", color: "#64748b", keywords: ["\u30ad\u30e3\u30ea\u30a2", "\u8ee2\u8077", "\u4ed5\u4e8b", "\u5e74\u53ce", "\u526f\u696d", "\u50cd\u304d\u65b9", "\u30d3\u30b8\u30cd\u30b9"] },
  worker_productivity: { label: "\u751f\u7523\u6027/\u7fd2\u6163", color: "#0891b2", keywords: ["\u751f\u7523\u6027", "\u7fd2\u6163", "\u30bf\u30b9\u30af", "\u30ce\u30fc\u30c8", "notion", "\u30bf\u30a4\u30e0\u30de\u30cd\u30b8\u30e1\u30f3\u30c8", "\u30e1\u30e2"] },
  cooking: { label: "\u6599\u7406", color: "#0f9f6e", keywords: ["cook", "recipe", "\u6599\u7406", "\u3054\u306f\u3093", "\u30ad\u30c3\u30c1\u30f3", "\u30ec\u30b7\u30d4"] },
  news: { label: "\u30cb\u30e5\u30fc\u30b9", color: "#0891b2", keywords: ["news", "\u30cb\u30e5\u30fc\u30b9", "\u653f\u6cbb", "\u901f\u5831"] },
  life: { label: "\u66ae\u3089\u3057", color: "#0f9f6e", keywords: ["vlog", "\u66ae\u3089\u3057", "\u65c5\u884c", "\u751f\u6d3b", "\u8cb7\u3063\u3066\u3088\u304b\u3063\u305f", "\u30ab\u30d5\u30a7"] },
  unknown: { label: "\u672a\u5206\u985e", color: "#667085", keywords: [] },
};

const overrideRules = [
  ["NBA", "nba"],
  ["Be a baller", "nba"],
  ["\u30cf\u30ec\u30eb\u30e4", "nba"],
  ["Dallas Mavericks", "nba"],
  ["Mavericks", "nba"],
  ["ESPN", "sports"],
  ["MKR", "game"],
  ["\u30de\u30ea\u30aa", "game"],
  ["\u4efb\u5929\u5802", "game"],
  ["Nintendo", "game"],
  ["APEX", "game"],
  ["Apex Legends", "game"],
  ["\u30b9\u30fc\u30d1\u30fc\u30de\u30ea\u30aa\u30e1\u30fc\u30ab\u30fc", "game"],
  ["\u30de\u30ea\u30aa\u30e1\u30fc\u30ab\u30fc", "game"],
  ["\u7af6\u99ac", "horse"],
  ["\u99ac\u5238", "horse"],
  ["NHK\u30de\u30a4\u30eb", "horse"],
  ["\u30de\u30a4\u30eb\u30ab\u30c3\u30d7", "horse"],
  ["\u81ea\u4f5cPC", "diy"],
  ["PC\u5efa\u9020", "diy"],
  ["\u30b0\u30e9\u30dc", "diy"],
  ["RTX", "diy"],
  ["Blackwell", "diy"],
  ["\u30ca\u30eb\u30c8", "manga"],
  ["NARUTO", "manga"],
  ["\u6f2b\u753b", "manga"],
  ["\u7f8e\u5bb9", "medical"],
  ["\u7f8e\u4eba", "medical"],
  ["\u6574\u5f62", "medical"],
  ["\u9f3b\u6574\u5f62", "medical"],
  ["\u30e9\u30fc\u30e1\u30f3", "restaurant"],
  ["\u30b0\u30eb\u30e1", "restaurant"],
  ["\u98f2\u98df\u5e97", "restaurant"],
  ["\u98df\u3079\u6b69\u304d", "restaurant"],
  ["\u96d1\u5b66", "trivia"],
  ["\u8ab0\u304b\u306b\u8a71\u3057\u305f\u304f\u306a\u308b", "trivia"],
  ["2ch", "board"],
  ["2\u3061\u3083\u3093", "board"],
  ["\u30b9\u30ec", "board"],
  ["\u306a\u3093G", "board"],
  ["\u540d\u8a00", "quote"],
  ["\u540d\u8a00\u96c6", "quote"],
  ["\u8a00\u8449\u306e\u30c1\u30ab\u30e9", "quote"],
  ["AppleWatch", "it"],
  ["Apple Watch", "it"],
  ["iPod", "it"],
  ["\u30ac\u30b8\u30a7\u30c3\u30c8", "it"],
  ["\u30ec\u30c8\u30eb\u30c8", "game"],
  ["\u30ad\u30e8", "game"],
  ["\u30b9\u30af\u30a6\u30a7\u30a2", "game"],
  ["\u30b9\u30af\u30a8\u30cb", "game"],
  ["Ado", "music"],
  ["MAISONdes", "music"],
  ["BGM", "music"],
  ["OST", "music"],
  ["soundtrack", "music"],
  ["\u30b5\u30f3\u30c8\u30e9", "music"],
  ["\u4f5c\u696d\u7528", "music"],
  ["\u30d4\u30a2\u30ce", "music"],
  ["\u82f1\u4f1a\u8a71", "study"],
  ["\u8a66\u9a13", "study"],
  ["\u57fa\u672c\u60c5\u5831", "study"],
  ["\u6599\u7406", "cooking"],
  ["\u6771\u6d77\u30aa\u30f3\u30a8\u30a2", "entertainment"],
  ["NOBROCK", "entertainment"],
  ["\u4f50\u4e45\u9593", "entertainment"],
  ["\u52a0\u85e4\u7d14\u4e00", "entertainment"],
  ["\u5207\u308a\u629c\u304d", "entertainment"],
  ["\u3072\u308d\u3086\u304d", "business"],
  ["\u5e74\u53ce", "business"],
  ["\u9ad8\u9808", "medical"],
  ["\u30af\u30ea\u30cb\u30c3\u30af", "medical"],
  ["\u5f01\u8b77\u58eb", "law"],
  ["\u52b4\u50cd\u6cd5", "law"],
  ["\u3086\u308b\u8a00\u8a9e\u5b66", "study"],
  ["\u3086\u308b\u30b3\u30f3\u30d4\u30e5\u30fc\u30bf", "science"],
  ["\u3086\u3063\u304f\u308a\u79d1\u5b66", "science"],
  ["yobinori", "science"],
  ["\u30c6\u30eb\u30bf", "science"],
];

const subTagRules = [
  { key: "shorts", label: "ショート", color: "#f43f5e", keywords: ["shorts", "#shorts", "ショート"] },
  { key: "commentary", label: "解説", color: "#2563eb", keywords: ["解説", "考察", "分析", "レビュー", "reaction", "リアクション"] },
  { key: "news", label: "ニュース", color: "#0891b2", keywords: ["news", "ニュース", "速報", "今日", "weekly", "まとめ"] },
  { key: "beginner", label: "初心者向け", color: "#0f9f6e", keywords: ["初心者", "入門", "基礎", "はじめて", "beginner"] },
  { key: "tutorial", label: "実践", color: "#7c3aed", keywords: ["tutorial", "作り方", "実装", "やってみた", "講座", "レシピ"] },
  { key: "highlight", label: "ハイライト", color: "#d1840f", keywords: ["highlight", "ハイライト", "名場面", "切り抜き", "clip"] },
  { key: "live", label: "ライブ", color: "#dc2626", keywords: ["live", "ライブ", "配信", "生放送"] },
  { key: "music", label: "BGM", color: "#9333ea", keywords: ["music", "bgm", "lofi", "playlist", "cover", "歌"] },
  { key: "chat", label: "\u96d1\u8ac7", color: "#f97316", keywords: ["\u96d1\u8ac7", "\u30c8\u30fc\u30af", "\u5bfe\u8ac7", "\u30e9\u30b8\u30aa", "\u8ac7\u7fa9"] },
  { key: "manga", label: "\u6f2b\u753b\u7cfb", color: "#c026d3", keywords: ["\u6f2b\u753b", "\u30de\u30f3\u30ac", "\u30ca\u30eb\u30c8", "naruto", "\u30a2\u30cb\u30e1", "\u30b8\u30e3\u30f3\u30d7"] },
  { key: "diy", label: "DIY/\u81ea\u4f5c", color: "#b45309", keywords: ["diy", "\u81ea\u4f5c", "\u5de5\u4f5c", "\u7d44\u307f\u7acb\u3066", "\u6539\u9020", "\u5efa\u9020", "\u30b0\u30e9\u30dc", "rtx"] },
  { key: "horse", label: "\u7af6\u99ac", color: "#a16207", keywords: ["\u7af6\u99ac", "\u99ac\u5238", "\u30de\u30a4\u30eb\u30ab\u30c3\u30d7", "nhk\u30de\u30a4\u30eb", "\u5168\u982d\u8a3a\u65ad"] },
  { key: "beauty", label: "\u7f8e\u5bb9", color: "#db2777", keywords: ["\u7f8e\u5bb9", "\u7f8e\u4eba", "\u6574\u5f62", "\u9f3b\u6574\u5f62", "\u8f2a\u90ed"] },
  { key: "restaurant", label: "\u98f2\u98df\u5e97", color: "#ea580c", keywords: ["\u30e9\u30fc\u30e1\u30f3", "\u30b0\u30eb\u30e1", "\u98f2\u98df\u5e97", "\u98df\u3079\u6b69\u304d", "\u3046\u307e\u3044"] },
  { key: "trivia", label: "\u96d1\u5b66", color: "#0d9488", keywords: ["\u96d1\u5b66", "\u8c46\u77e5\u8b58", "\u8ab0\u304b\u306b\u8a71\u3057\u305f\u304f\u306a\u308b", "\u5f79\u7acb\u3064"] },
  { key: "board", label: "2ch", color: "#64748b", keywords: ["2ch", "2\u3061\u3083\u3093", "\u30b9\u30ec", "\u306a\u3093g", "\u306a\u3093j"] },
  { key: "quote", label: "\u540d\u8a00", color: "#7c3aed", keywords: ["\u540d\u8a00", "\u540d\u8a00\u96c6", "\u8a00\u8449\u306e\u30c1\u30ab\u30e9", "\u52c7\u6c17"] },
  { key: "gadget", label: "\u30ac\u30b8\u30a7\u30c3\u30c8", color: "#2563eb", keywords: ["\u30ac\u30b8\u30a7\u30c3\u30c8", "applewatch", "apple watch", "ipod", "\u30ec\u30d3\u30e5\u30fc"] },
  { key: "nba", label: "NBA", color: "#d1840f", keywords: ["nba", "\u30d0\u30b9\u30b1", "lakers", "warriors"] },
  { key: "science", label: "\u79d1\u5b66", color: "#0d9488", keywords: ["\u79d1\u5b66", "\u7269\u7406", "\u6570\u5b66", "\u7406\u7cfb", "yobinori"] },
  { key: "law", label: "\u6cd5\u5f8b", color: "#475569", keywords: ["\u6cd5\u5f8b", "\u5f01\u8b77\u58eb", "\u52b4\u50cd\u6cd5", "\u88c1\u5224"] },
  { key: "cooking", label: "\u6599\u7406", color: "#0f9f6e", keywords: ["\u6599\u7406", "\u30ec\u30b7\u30d4", "recipe", "cook"] },
  { key: "ai", label: "AI", color: "#0d9488", keywords: ["ai", "chatgpt", "生成ai", "人工知能"] },
  { key: "money", label: "お金", color: "#64748b", keywords: ["投資", "年収", "副業", "お金", "節約", "経済"] },
  { key: "gameplay", label: "実況", color: "#ef4444", keywords: ["実況", "プレイ", "攻略", "gameplay"] },
  { key: "health", label: "健康", color: "#db2777", keywords: ["健康", "美容", "医療", "筋トレ", "ダイエット"] },
];

const classificationModes = {
  balanced: {
    label: "\u6a19\u6e96",
    icon: "\u6574",
    description: "\u5927\u5206\u985e\u306f10\u500b\u524d\u5f8c\u306b\u7d5e\u308a\u3001\u7d30\u304b\u3044\u8a71\u984c\u306f\u30b5\u30d6\u30bf\u30b0\u3067\u6574\u7406",
    keys: ["it", "game", "sports", "study", "business", "entertainment", "music", "medical", "life", "news", "unknown"],
  },
  engineer: {
    label: "\u30a8\u30f3\u30b8\u30cb\u30a2\u7528",
    icon: "\u30b3\u30fc\u30c9",
    description: "\u958b\u767a\u30fbAI\u30fb\u30a4\u30f3\u30d5\u30e9\u3092\u6df1\u6398\u308a",
    keys: ["eng_backend", "eng_frontend", "eng_infra", "eng_ai", "it", "science", "diy", "business", "study", "unknown"],
  },
  student: {
    label: "\u5b66\u751f\u7528",
    icon: "\u5b66",
    description: "\u8a66\u9a13\u30fb\u8a9e\u5b66\u30fb\u5b66\u7fd2\u7cfb\u3092\u6df1\u6398\u308a",
    keys: ["student_exam", "student_language", "study", "science", "trivia", "news", "manga", "music", "game", "unknown"],
  },
  worker: {
    label: "\u793e\u4f1a\u4eba\u7528",
    icon: "\u4ed5\u4e8b",
    description: "\u4ed5\u4e8b\u30fb\u30ad\u30e3\u30ea\u30a2\u30fb\u751f\u7523\u6027\u3092\u6df1\u6398\u308a",
    keys: ["worker_career", "worker_productivity", "business", "law", "trivia", "medical", "restaurant", "it", "news", "life", "unknown"],
  },
  gamer: {
    label: "\u30b2\u30fc\u30de\u30fc\u7528",
    icon: "\u30b2\u30fc\u30e0",
    description: "\u4efb\u5929\u5802\u30fbFPS\u30fbRPG\u30fb\u5b9f\u6cc1\u3092\u6df1\u6398\u308a",
    keys: ["game_nintendo", "game_fps", "game_rpg", "game_stream", "game", "manga", "music", "board", "trivia", "unknown"],
  },
};

const durationOptions = {
  all: [0, Infinity],
  under1: [0, 60],
  "1to10": [60, 600],
  "10to30": [600, 1800],
  "30to60": [1800, 3600],
  "60to180": [3600, 10800],
  over180: [10800, Infinity],
};

const initialState = {
  synced: false,
  settings: {
    theme: "light",
    accent: "red",
    density: "comfortable",
    classificationMode: "balanced",
  },
  channels: [
    {
      id: "c1",
      name: "Code Harbor Japan",
      description: "Python、AI、Web開発の実装解説",
      genre: "it",
      confidence: 92,
      tags: ["React", "AI"],
      memo: "週末にまとめて見る",
      favorite: true,
      lastViewed: "2026-04-30",
      clicks: 18,
      minutes: 132,
    },
    {
      id: "c2",
      name: "NBA Court Vision",
      description: "NBA試合分析、Lakers、Warriors、戦術解説",
      genre: "nba",
      confidence: 89,
      tags: ["戦術", "ハイライト"],
      memo: "",
      favorite: true,
      lastViewed: "2026-05-01",
      clicks: 24,
      minutes: 168,
    },
    {
      id: "c3",
      name: "Morning Study Lab",
      description: "英語、資格、勉強法、大学講座",
      genre: "study",
      confidence: 84,
      tags: ["英語"],
      memo: "通勤中",
      favorite: false,
      lastViewed: "2026-04-27",
      clicks: 10,
      minutes: 85,
    },
    {
      id: "c4",
      name: "Tokyo Kitchen Notes",
      description: "料理、作り置き、和食レシピ",
      genre: "cooking",
      confidence: 91,
      tags: ["作り置き"],
      memo: "",
      favorite: false,
      lastViewed: "2026-04-18",
      clicks: 7,
      minutes: 51,
    },
    {
      id: "c5",
      name: "Lo-Fi Room",
      description: "lofi music, piano, sleep playlist",
      genre: "music",
      confidence: 87,
      tags: ["作業用"],
      memo: "",
      favorite: true,
      lastViewed: "2026-04-29",
      clicks: 15,
      minutes: 210,
    },
    {
      id: "c6",
      name: "Daily Economy Brief",
      description: "経済ニュース、マーケット、政治解説",
      genre: "news",
      confidence: 79,
      tags: ["朝"],
      memo: "",
      favorite: false,
      lastViewed: "2026-04-25",
      clicks: 8,
      minutes: 44,
    },
    {
      id: "c7",
      name: "Weekend Vlog Tokyo",
      description: "旅行、暮らし、買ってよかったもの",
      genre: "life",
      confidence: 72,
      tags: ["旅行"],
      memo: "",
      favorite: false,
      lastViewed: "2026-04-02",
      clicks: 3,
      minutes: 28,
    },
    {
      id: "c8",
      name: "Mixed Uploads Archive",
      description: "いろいろな動画を不定期更新",
      genre: "unknown",
      confidence: 38,
      tags: [],
      memo: "要確認",
      favorite: false,
      lastViewed: "2026-03-30",
      clicks: 1,
      minutes: 6,
    },
  ],
  videos: [
    { id: "v1", channelId: "c2", title: "Warriorsのピック&ロールを5分で整理", daysAgo: 0, watched: false, score: 96 },
    { id: "v2", channelId: "c1", title: "ReactとFlaskでOAuth連携を作る", daysAgo: 0, watched: false, score: 91 },
    { id: "v3", channelId: "c5", title: "夜の作業用 Lo-Fi Mix", daysAgo: 1, watched: false, score: 84 },
    { id: "v4", channelId: "c4", title: "10分でできる鶏むね作り置き", daysAgo: 2, watched: true, score: 74 },
    { id: "v5", channelId: "c3", title: "英語学習を習慣化する朝のルール", daysAgo: 3, watched: false, score: 78 },
    { id: "v6", channelId: "c6", title: "今週の経済ニュースまとめ", daysAgo: 5, watched: false, score: 70 },
    { id: "v7", channelId: "c7", title: "週末の東京カフェ散歩", daysAgo: 6, watched: true, score: 55 },
  ],
  likedVideos: [],
};

let state = loadState();
let activeRange = 7;
let recommendationOffset = 0;

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(initialState);
  try {
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(initialState),
      ...parsed,
      settings: {
        ...structuredClone(initialState.settings),
        ...(parsed.settings || {}),
      },
      likedVideos: parsed.likedVideos || [],
    };
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderPreservingScroll() {
  const main = document.querySelector(".app-main");
  const scrollTop = main.scrollTop;
  render();
  main.scrollTop = scrollTop;
}

function renderAuthState() {
  const gate = document.querySelector("#authGate");
  const button = document.querySelector("#syncButton");
  gate.classList.toggle("active", !state.synced);
  document.body.classList.toggle("locked", !state.synced);
  button.textContent = state.synced ? (state.connectedAccount || "YouTube連携中") : "Google連携";
  button.title = state.synced ? "クリックしてログアウト / 別アカウント切替" : "GoogleでYouTube連携";
}

function completeGoogleConnect() {
  if (backendAvailable) {
    location.href = `${API_BASE}/auth/login`;
    return;
  }

  const button = document.querySelector("#googleLoginButton");
  button.disabled = true;
  button.textContent = "YouTube登録チャンネルを取得中...";

  window.setTimeout(() => {
    state.synced = true;
    state.connectedAccount = "youtube.user@example.com";
    state.connectedAt = new Date().toISOString();
    state.channels = state.channels.map((channel) => ({ ...channel, ...classifyChannel(channel) }));
    saveState();
    render();
    button.disabled = false;
    button.innerHTML = "<span>G</span>GoogleでYouTube連携";
  }, 800);
}

async function syncWithBackend() {
  try {
    const meResponse = await fetch(`${API_BASE}/api/me`, { credentials: "include" });
    if (!meResponse.ok) return;
    backendAvailable = true;
    const me = await meResponse.json();
    if (!me.connected && !me.channelCount) {
      state.synced = false;
      saveState();
      render();
      return;
    }

    const channelResponse = await fetch(`${API_BASE}/api/channels`, { credentials: "include" });
    if (channelResponse.ok) {
      const payload = await channelResponse.json();
      state.synced = Boolean(me.connected || me.channelCount);
      state.connectedAccount = me.userName || me.userEmail || "Google / YouTube";
      state.connectedEmail = me.userEmail || "";
      state.connectedPicture = me.userPicture || "";
      state.connectedAt = new Date().toISOString();
      if (Array.isArray(payload.channels) && payload.channels.length > 0) {
        state.channels = mergeChannelPreferences(payload.channels);
      }
      saveState();
      render();
      if (me.connected) syncVideosWithBackend();
      if (me.connected) syncLikedVideosWithBackend();
    }
  } catch {
    backendAvailable = false;
  }
}

async function syncVideosWithBackend(refresh = false) {
  if (!backendAvailable) return;
  const button = document.querySelector("#refreshVideosButton");
  if (button) {
    button.disabled = true;
    button.textContent = "更新中...";
  }

  try {
    const response = await fetch(`${API_BASE}/api/videos${refresh ? "?refresh=1" : ""}`, {
      credentials: "include",
    });
    if (response.status === 401 && refresh) {
      location.href = `${API_BASE}/auth/login`;
      return;
    }
    if (response.ok) {
      const payload = await response.json();
      if (Array.isArray(payload.videos)) {
        state.videos = payload.videos;
        saveState();
        render();
        if (payload.needsLoginForDuration) {
          document.querySelector("#syncState").textContent = "時間取得は再ログインが必要";
          if (refresh) location.href = `${API_BASE}/auth/login`;
        } else if (!refresh && state.videos.some((video) => !Number.isFinite(durationSeconds(video)))) {
          syncVideosWithBackend(true);
        }
      }
    }
  } catch {
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "新着を更新";
    }
  }
}

async function syncLikedVideosWithBackend(refresh = false) {
  if (!backendAvailable) return;
  const button = document.querySelector("#refreshLikedButton");
  if (button) {
    button.disabled = true;
    button.textContent = "更新中...";
  }

  try {
    const response = await fetch(`${API_BASE}/api/liked-videos${refresh ? "?refresh=1" : ""}`, {
      credentials: "include",
    });
    if (response.status === 401 && refresh) {
      location.href = `${API_BASE}/auth/login`;
      return;
    }
    if (response.ok) {
      const payload = await response.json();
      if (Array.isArray(payload.videos)) {
        state.likedVideos = payload.videos;
        saveState();
        render();
      }
    }
  } catch {
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "高評価を更新";
    }
  }
}

function channelById(id) {
  return state.channels.find((channel) => channel.id === id);
}

function mergeChannelPreferences(incomingChannels) {
  const existingById = new Map(state.channels.map((channel) => [channel.id, channel]));
  return incomingChannels.map((channel) => {
    const existing = existingById.get(channel.id);
    if (!existing) return channel;
    return {
      ...channel,
      favorite: existing.favorite ?? channel.favorite,
      memo: existing.memo ?? channel.memo,
      tags: existing.tags?.length ? existing.tags : channel.tags,
      genre: existing.tags?.includes("手動変更") || existing.tags?.includes("謇句虚螟画峩") ? existing.genre : channel.genre,
      confidence: existing.tags?.includes("手動変更") || existing.tags?.includes("謇句虚螟画峩") ? existing.confidence : channel.confidence,
      lastViewed: existing.lastViewed || channel.lastViewed,
      clicks: Math.max(existing.clicks || 0, channel.clicks || 0),
      minutes: Math.max(existing.minutes || 0, channel.minutes || 0),
    };
  });
}

function channelUrl(channel) {
  const id = channel.youtubeChannelId || channel.id;
  return id ? `https://www.youtube.com/channel/${encodeURIComponent(id)}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(channel.name)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function classifyChannel(channel) {
  const text = `${channel.name} ${channel.description} ${channel.tags.join(" ")}`.toLowerCase();
  const nameText = channel.name.toLowerCase();
  const override = overrideRules.find(([needle]) => nameText.includes(needle.toLowerCase()));
  if (override) {
    const genre = modeGenreFallback(override[1]);
    if (activeGenreKeys().includes(genre)) return { genre, confidence: 96 };
  }

  const scores = activeGenreEntries()
    .filter(([key]) => key !== "unknown")
    .map(([key, genre]) => {
      const score = genre.keywords.reduce((sum, keyword) => sum + keywordScore(text, keyword), 0);
      return { key, score };
    })
    .sort((a, b) => b.score - a.score);
  const best = scores[0];
  if (!best || best.score < 3) {
    if (override) return { genre: modeGenreFallback(override[1]), confidence: 96 };
    return { genre: "unknown", confidence: 38 };
  }
  return { genre: best.key, confidence: Math.min(96, 58 + best.score * 7) };
}

function genreCandidates(channel) {
  const text = `${channel.name} ${channel.description} ${channel.tags.join(" ")}`.toLowerCase();
  const nameText = channel.name.toLowerCase();
  const override = overrideRules.find(([needle]) => nameText.includes(needle.toLowerCase()));
  if (override) return [{ key: modeGenreFallback(override[1]), score: 6, confidence: 96 }];

  return activeGenreEntries()
    .filter(([key]) => key !== "unknown")
    .map(([key, genre]) => {
      const score = genre.keywords.reduce((sum, keyword) => sum + keywordScore(text, keyword), 0);
      return { key, score, confidence: Math.min(96, 58 + score * 7) };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function keywordScore(text, keyword) {
  const keywordLower = keyword.toLowerCase();
  if (/^[a-z0-9 ]+$/.test(keywordLower)) {
    const escaped = keywordLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`).test(text)
      ? keywordLower.length >= 4 ? 3 : 1
      : 0;
  }
  return text.includes(keywordLower) ? 3 : 0;
}

function currentModeKey() {
  const key = state.settings?.classificationMode || "balanced";
  return classificationModes[key] ? key : "balanced";
}

function currentMode() {
  return classificationModes[currentModeKey()];
}

function modeGenreFallback(genre) {
  if (activeGenreKeys().includes(genre)) return genre;
  const balancedFallbacks = {
    nba: "sports",
    horse: "sports",
    manga: "entertainment",
    restaurant: "life",
    trivia: "entertainment",
    board: "entertainment",
    quote: "entertainment",
    diy: "it",
    science: "study",
    cooking: "life",
    law: "business",
    eng_backend: "it",
    eng_frontend: "it",
    eng_infra: "it",
    eng_ai: "it",
    game_nintendo: "game",
    game_fps: "game",
    game_rpg: "game",
    game_stream: "game",
    student_exam: "study",
    student_language: "study",
    worker_career: "business",
    worker_productivity: "business",
  };
  const fallback = currentModeKey() === "balanced" ? balancedFallbacks[genre] : null;
  return fallback && activeGenreKeys().includes(fallback) ? fallback : genre;
}

function activeGenreKeys() {
  return currentMode().keys.filter((key) => genres[key]);
}

function activeGenreEntries() {
  return activeGenreKeys().map((key) => [key, genres[key]]);
}

function genreMeta(key) {
  return genres[key] || genres.unknown;
}

function displayChannelGenre(channel) {
  if (!channel) return "unknown";
  if (hasManualGenre(channel)) return modeGenreFallback(channel.genre || "unknown");
  const inferred = classifyChannel(channel).genre;
  if (inferred && inferred !== "unknown") return modeGenreFallback(inferred);
  return modeGenreFallback(channel.genre || "unknown");
}

function modeOptions(selected) {
  return Object.entries(classificationModes)
    .map(([key, mode]) => `<option value="${key}" ${selected === key ? "selected" : ""}>${mode.label}</option>`)
    .join("");
}

function hasManualGenre(channel) {
  return (channel.tags || []).some((tag) => {
    const value = String(tag).toLowerCase();
    return value.includes("\u624b\u52d5") || value.includes("manual") || value.includes("謇句虚");
  });
}

function setClassificationMode(modeKey) {
  if (!classificationModes[modeKey]) return;
  state.settings.classificationMode = modeKey;
  state.channels = state.channels.map((channel) => (
    hasManualGenre(channel) ? channel : { ...channel, ...classifyChannel(channel) }
  ));
  saveState();
  renderPreservingScroll();
}

function render() {
  applyUserSettings();
  renderAuthState();
  renderGenreOptions();
  renderExtraGenreOptions();
  renderHome();
  renderChannelScreen();
  renderVideos();
  renderLikedVideos();
  renderAnalytics();
  renderSettings();
}

function applyUserSettings() {
  document.body.dataset.theme = state.settings?.theme || "light";
  document.body.dataset.accent = state.settings?.accent || "red";
  document.body.dataset.density = state.settings?.density || "comfortable";
  document.body.dataset.mode = currentModeKey();
  const badge = document.querySelector("#modeBadge");
  if (badge) {
    badge.textContent = currentMode().icon;
    badge.setAttribute("title", currentMode().label);
  }
}

function renderChannelScreen() {
  renderChannels();
  renderBulkOrganizer();
}

function updateOrganizeSummary() {
  const unknownCount = state.channels.filter((channel) => displayChannelGenre(channel) === "unknown").length;
  const totalCount = state.channels.length;
  document.querySelector("#organizeSummary").textContent =
    `${totalCount}件中 ${unknownCount}件が未分類です。候補ボタンかプルダウンでまとめて整理できます。`;
}

function renderGenreOptions() {
  const select = document.querySelector("#genreFilter");
  const current = select.value || "all";
  select.innerHTML = `<option value="all">すべて</option>` + activeGenreEntries()
    .map(([key, genre]) => `<option value="${key}">${genre.label}</option>`)
    .join("");
  select.value = activeGenreKeys().includes(current) || current === "all" ? current : "all";
}

function genreOptions(selected) {
  return activeGenreEntries()
    .map(([key, genre]) => `<option value="${key}" ${selected === key ? "selected" : ""}>${genre.label}</option>`)
    .join("");
}

function renderExtraGenreOptions() {
  ["#newGenreFilter", "#likedGenreFilter"].forEach((selector) => {
    const select = document.querySelector(selector);
    if (!select) return;
    const current = select.value || "all";
    select.innerHTML = `<option value="all">すべて</option>` + genreOptions(current);
    select.value = activeGenreKeys().includes(current) || current === "all" ? current : "all";
  });
  renderSubTagFilters();
}

function renderSubTagFilters() {
  [
    "#channelSubTagFilter1",
    "#channelSubTagFilter2",
    "#channelSubTagFilter3",
    "#newSubTagFilter1",
    "#newSubTagFilter2",
    "#newSubTagFilter3",
    "#likedSubTagFilter1",
    "#likedSubTagFilter2",
    "#likedSubTagFilter3",
  ].forEach((selector) => {
    const select = document.querySelector(selector);
    if (!select) return;
    const current = select.value || "all";
    const label = select.id.endsWith("1") ? "サブタグA" : select.id.endsWith("2") ? "サブタグB" : "サブタグC";
    select.innerHTML = `<option value="all">${label}</option>` + subTagRules
      .map((tag) => `<option value="${tag.key}">${tag.label}</option>`)
      .join("");
    select.value = subTagRules.some((tag) => tag.key === current) ? current : "all";
  });
}

function videoMatchesFilters(video, channel, searchSelector, genreSelector, kindSelector, durationSelector, subTagSelectors = []) {
  const search = document.querySelector(searchSelector)?.value.trim().toLowerCase() || "";
  const genre = document.querySelector(genreSelector)?.value || "all";
  const target = [
    channel?.name || video.channelTitle || "",
    video.title || "",
  ].join(" ").toLowerCase();
  const videoGenre = resolveVideoGenre(video, channel);
  return (!search || target.includes(search))
    && (genre === "all" || videoGenre === genre)
    && matchesKindFilter(video, kindSelector)
    && matchesDurationFilter(video, durationSelector)
    && matchesSubTagFilters(subTagsForVideo(video, channel), subTagSelectors);
}

function matchesKindFilter(video, kindSelector) {
  const filter = document.querySelector(kindSelector)?.value || "all";
  if (filter === "all") return true;
  return likedVideoKind(video) === filter;
}

function matchesDurationFilter(video, durationSelector) {
  const filter = document.querySelector(durationSelector)?.value || "all";
  if (filter === "all") return true;
  const range = durationOptions[filter];
  if (!range) return true;
  const seconds = durationSeconds(video);
  if (!Number.isFinite(seconds)) return false;
  return seconds >= range[0] && seconds <= range[1];
}

function selectedSubTagFilters(selectors) {
  return selectors
    .map((selector) => document.querySelector(selector)?.value || "all")
    .filter((value) => value !== "all");
}

function matchesSubTagFilters(subTags, selectors) {
  const filters = selectedSubTagFilters(selectors);
  if (!filters.length) return true;
  const keys = new Set(subTags.map((tag) => tag.key));
  return filters.every((filter) => keys.has(filter));
}

function resolveVideoGenre(video, channel) {
  const text = `${video.title || ""} ${video.description || ""} ${video.channelTitle || ""} ${channel?.name || ""} ${(video.tags || []).join(" ")}`.toLowerCase();
  if (currentModeKey() !== "balanced") {
    const modeGenre = classifyTextGenre(text);
    if (modeGenre) return modeGenre;
  }
  const override = overrideRules.find(([needle]) => text.includes(needle.toLowerCase()));
  if (override) {
    const genre = modeGenreFallback(override[1]);
    if (activeGenreKeys().includes(genre)) return genre;
  }
  if (/\b(bgm|ost|soundtrack|playlist)\b/.test(text) || ["サントラ", "作業用", "音楽集", "楽曲", "歌"].some((word) => text.includes(word))) {
    return modeGenreFallback("music");
  }
  const scoredGenre = classifyTextGenre(text);
  if (scoredGenre) return scoredGenre;
  return channel?.genre || video.genre || "unknown";
}

function classifyTextGenre(text) {
  const scores = activeGenreEntries()
    .filter(([key]) => key !== "unknown")
    .map(([key, genre]) => {
      const score = genre.keywords.reduce((sum, keyword) => {
        const needle = String(keyword).toLowerCase();
        if (!needle) return sum;
        if (/^[a-z0-9 ]+$/.test(needle)) {
          const matched = new RegExp(`(^|[^a-z0-9])${escapeRegExp(needle)}([^a-z0-9]|$)`).test(text);
          return sum + (matched ? (needle.length >= 4 ? 3 : 1) : 0);
        }
        return sum + (text.includes(needle) ? 3 : 0);
      }, 0);
      return { key, score };
    })
    .sort((a, b) => b.score - a.score);
  return scores[0]?.score >= 3 ? scores[0].key : null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function inferSubTags(text, extra = []) {
  const normalized = String(text || "").toLowerCase();
  const found = subTagRules.filter((rule) =>
    rule.keywords.some((keyword) => normalized.includes(String(keyword).toLowerCase()))
  );
  extra.forEach((key) => {
    const rule = subTagRules.find((tag) => tag.key === key);
    if (rule && !found.some((tag) => tag.key === key)) found.push(rule);
  });
  return found.slice(0, 6);
}

function subTagsForChannel(channel) {
  return inferSubTags(`${channel.name || ""} ${channel.description || ""} ${(channel.tags || []).join(" ")}`);
}

function subTagsForVideo(video, channel) {
  const kind = likedVideoKind(video);
  const extra = kind === "short" ? ["shorts"] : kind === "live" ? ["live"] : [];
  return inferSubTags(`${video.title || ""} ${video.description || ""} ${video.channelTitle || ""} ${channel?.name || ""} ${(video.tags || []).join(" ")}`, extra);
}

function renderSubTags(subTags) {
  return subTags.map((tag) => `
    <span class="subtag" style="--subtag-color:${tag.color}">#${escapeHtml(tag.label)}</span>
  `).join("");
}

function videoKindLabel(video) {
  const kind = likedVideoKind(video);
  if (kind === "live") return "ライブ配信";
  return kind === "short" ? "ショート" : "通常動画";
}

function durationSeconds(video) {
  if (video.durationSeconds !== null && video.durationSeconds !== undefined && video.durationSeconds !== "" && Number.isFinite(Number(video.durationSeconds))) {
    return Number(video.durationSeconds);
  }
  return parseIsoDuration(video.duration);
}

function parseIsoDuration(duration) {
  const match = String(duration || "").match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return NaN;
  const [, days = 0, hours = 0, minutes = 0, seconds = 0] = match.map((value) => Number(value || 0));
  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

function formatDuration(video) {
  const seconds = durationSeconds(video);
  if (!Number.isFinite(seconds)) return "時間不明";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function renderHome() {
  const unwatchedVideos = state.videos.filter((video) => !video.watched && channelById(video.channelId));
  const recommendations = [...unwatchedVideos]
    .filter((video) => channelById(video.channelId))
    .sort((a, b) => b.score - a.score || videoTime(b) - videoTime(a));
  const recommended = recommendations.length
    ? recommendations[recommendationOffset % recommendations.length]
    : null;
  const channel = recommended ? channelById(recommended.channelId) : state.channels[0];
  renderModeSelect("#homeClassificationMode");

  document.querySelector("#syncState").textContent = state.synced ? "連携済み" : "デモデータ";
  document.querySelector("#totalChannels").textContent = state.channels.length;
  document.querySelector("#uncategorizedCount").textContent = state.channels.filter((channel) => displayChannelGenre(channel) === "unknown").length;
  document.querySelector("#unwatchedCount").textContent = unwatchedVideos.length;
  const heroThumbnail = recommended ? videoThumbnailUrl(recommended) : channel?.thumbnailUrl;

  document.querySelector("#heroVideo").innerHTML = `
    <div class="thumbnail hero-thumbnail">
      ${heroThumbnail ? `<img src="${escapeHtml(heroThumbnail)}" alt="" loading="lazy" />` : "▶"}
    </div>
    <div class="hero-copy">
	      <span>${escapeHtml(channel.name)} / ${genreMeta(displayChannelGenre(channel)).label}</span>
      <strong>${escapeHtml(recommended ? recommended.title : "登録チャンネルの整理を始める")}</strong>
	      <p>${recommended ? `おすすめ度 ${recommended.score}%・${recommended.daysAgo === 0 ? "今日" : `${recommended.daysAgo}日前`}更新` : `ジャンル: ${genreMeta(displayChannelGenre(channel)).label}・信頼度 ${channel.confidence}%`}</p>
      <a class="open-link" href="${recommended ? videoUrl(recommended) : channelUrl(channel)}" target="_blank" rel="noreferrer">YouTubeで開く</a>
    </div>
  `;

  const genreCounts = countByGenre();
  document.querySelector("#topGenres").innerHTML = genreCounts.slice(0, 4).map((item) => `
    <div class="genre-pill" style="color:${genreMeta(item.genre).color}">
      <span>${genreMeta(item.genre).label}</span>
      <strong>${item.count}</strong>
    </div>
  `).join("");

  const favoriteNewVideos = state.videos
    .filter((video) => !video.watched)
    .filter((video) => channelById(video.channelId)?.favorite)
    .sort((a, b) => videoTime(b) - videoTime(a))
    .slice(0, 3);
  document.querySelector("#favoriteUpdates").innerHTML = favoriteNewVideos.length
    ? favoriteNewVideos.map(renderFavoriteVideoUpdate).join("")
    : `<p class="meta">お気に入りチャンネルの新着はまだありません。</p>`;
}

function countByGenre() {
  return activeGenreKeys()
    .map((genre) => ({
      genre,
      count: state.channels.filter((channel) => displayChannelGenre(channel) === genre).length,
      views: state.videos
        .filter((video) => displayChannelGenre(channelById(video.channelId)) === genre)
        .reduce((sum, video) => sum + videoViewCount(video), 0),
    }))
    .filter((item) => item.count > 0 || item.views > 0)
    .sort((a, b) => b.views - a.views || b.count - a.count);
}

function renderCompactChannel(channel) {
  const viewCount = channelViewCount(channel);
  return `
    <article class="list-item">
      ${renderChannelAvatar(channel)}
      <div>
        <strong>${escapeHtml(channel.name)}</strong>
        <div class="meta">${genreMeta(displayChannelGenre(channel)).label}・YouTube公開視聴回数</div>
      </div>
      <span class="confidence">${formatNumber(viewCount)}回</span>
    </article>
  `;
}

function renderChannels() {
  updateOrganizeSummary();
  const search = document.querySelector("#channelSearch").value.trim().toLowerCase();
  const filter = document.querySelector("#genreFilter").value;
  const subTagSelectors = ["#channelSubTagFilter1", "#channelSubTagFilter2", "#channelSubTagFilter3"];
  const rows = state.channels.filter((channel) => {
    const genre = genres[channel.genre] || genres.unknown;
    const subTags = subTagsForChannel(channel);
    const target = [
      channel.name,
      channel.description,
      channel.tags.join(" "),
      subTags.map((tag) => tag.label).join(" "),
      channel.genre,
      genre.label,
    ].join(" ").toLowerCase();
    return (!search || target.includes(search))
      && (filter === "all" || displayChannelGenre(channel) === filter)
      && matchesSubTagFilters(subTags, subTagSelectors);
  });

  const genreOrder = activeGenreKeys().filter((genre) => genre !== "unknown").concat("unknown");
  const grouped = genreOrder
    .map((genre) => ({
      genre,
      channels: rows
        .filter((channel) => displayChannelGenre(channel) === genre)
        .sort((a, b) => channelRecommendationScore(b) - channelRecommendationScore(a) || a.name.localeCompare(b.name)),
    }))
    .filter((group) => group.channels.length > 0);

  const favoriteChannels = search || filter !== "all" || selectedSubTagFilters(subTagSelectors).length
    ? []
    : [...state.channels]
      .filter((channel) => channel.favorite)
      .filter((channel) => channel.genre !== "unknown")
      .sort((a, b) => channelRecommendationScore(b) - channelRecommendationScore(a) || a.name.localeCompare(b.name));
  const recommendedBlock = favoriteChannels.length ? `
    <section class="genre-group genre-section-recommended">
      <div class="genre-header">
        <span class="tag recommended">お気に入り</span>
        <strong>${favoriteChannels.length}件</strong>
      </div>
      <div class="genre-channel-list">
        ${favoriteChannels.map(renderChannelCard).join("")}
      </div>
    </section>
  ` : "";

  document.querySelector("#channelList").innerHTML = recommendedBlock + grouped.map((group) => `
    <section class="genre-group genre-section-${group.genre}">
      <div class="genre-header">
        <span class="tag ${group.genre}">${genreMeta(group.genre).label}</span>
        <strong>${group.channels.length}件</strong>
      </div>
      <div class="genre-channel-list">
        ${group.channels.map(renderChannelCard).join("")}
      </div>
    </section>
  `).join("") || `<p class="meta">「${escapeHtml(search)}」に合うチャンネルがありません。</p>`;
}

function renderFavoriteVideoUpdate(video) {
  const channel = channelById(video.channelId);
  return `
    <article class="list-item">
      ${renderChannelAvatar(channel)}
      <div>
        <strong>${escapeHtml(video.title)}</strong>
        <div class="meta">${escapeHtml(channel.name)}・${video.daysAgo === 0 ? "今日" : `${video.daysAgo}日前`}更新</div>
      </div>
      <button class="small-button" data-open-video="${video.id}" type="button">開く</button>
    </article>
  `;
}

function channelRecommendationScore(channel) {
  const viewedAt = Date.parse(channel.lastViewed || "") || 0;
  const recentBonus = viewedAt ? Math.max(0, 20 - Math.floor((Date.now() - viewedAt) / 86400000)) : 0;
  return (channel.favorite ? 100 : 0) + channel.clicks * 8 + recentBonus + channel.confidence / 10;
}

function renderBulkOrganizer() {
  const search = document.querySelector("#channelSearch").value.trim();
  const filter = document.querySelector("#genreFilter").value;
  if (search || filter !== "all") {
    document.querySelector("#bulkOrganizer").innerHTML = "";
    return;
  }

  const unknown = state.channels.filter((channel) => displayChannelGenre(channel) === "unknown").slice(0, 12);
  const organizer = document.querySelector("#bulkOrganizer");
  if (!unknown.length) {
    organizer.innerHTML = `
      <div class="empty-organizer">
        <strong>未分類はありません</strong>
        <span>すべてのチャンネルにジャンルが設定されています。</span>
      </div>
    `;
    return;
  }

  organizer.innerHTML = `
    <div class="bulk-heading">
      <strong>未分類 ${state.channels.filter((channel) => displayChannelGenre(channel) === "unknown").length}件</strong>
      <span>上位12件を表示中</span>
    </div>
    ${unknown.map((channel) => {
      const candidates = genreCandidates(channel);
      return `
        <article class="organize-row">
          ${renderChannelAvatar(channel)}
          <div class="organize-main">
            <strong>${escapeHtml(channel.name)}</strong>
            <p>${escapeHtml(channel.description || "説明文なし")}</p>
            <div class="suggestion-row">
              ${candidates.length ? candidates.map((item) => `
                <button class="suggestion-button" data-quick-genre="${channel.id}:${item.key}" type="button">
                  ${genreMeta(item.key).label} ${item.confidence}%
                </button>
              `).join("") : `<span class="meta">候補なし</span>`}
            </div>
          </div>
          <select class="compact-select" data-genre-change="${channel.id}">
            ${genreOptions(channel.genre)}
          </select>
        </article>
      `;
    }).join("")}
  `;
}

function renderChannelCard(channel) {
  const subTags = subTagsForChannel(channel);
  return `
    <article class="channel-card">
      ${renderChannelAvatar(channel)}
      <div class="channel-main">
        <strong>${escapeHtml(channel.name)}</strong>
        <div class="meta">${escapeHtml(channel.description)}</div>
        <div class="tag-row">
	          <span class="tag ${displayChannelGenre(channel)}">${genreMeta(displayChannelGenre(channel)).label}</span>
          <span class="confidence">${channel.confidence}%</span>
          ${renderSubTags(subTags)}
          ${channel.tags.map((tag) => `<span class="tag unknown">#${escapeHtml(tag)}</span>`).join("")}
        </div>
        <label class="inline-genre">
          ジャンル
          <select data-genre-change="${channel.id}">
            ${genreOptions(channel.genre)}
          </select>
        </label>
      </div>
      <div class="channel-actions">
        <button class="icon-button ${channel.favorite ? "active" : ""}" data-favorite="${channel.id}" type="button" aria-label="お気に入り">★</button>
        <button class="icon-button" data-open="${channel.id}" type="button" aria-label="YouTubeで開く">▶</button>
        <button class="icon-button" data-detail="${channel.id}" type="button" aria-label="詳細">›</button>
      </div>
    </article>
  `;
}

function renderVideosFlat() {
  const unwatchedOnly = document.querySelector("#unwatchedOnly").checked;
  const videos = state.videos
    .filter((video) => channelById(video.channelId))
    .filter((video) => videoMatchesFilters(video, channelById(video.channelId), "#newChannelSearch", "#newGenreFilter", "#newKindFilter", "#newDurationFilter", ["#newSubTagFilter1", "#newSubTagFilter2", "#newSubTagFilter3"]))
    .filter((video) => video.daysAgo < activeRange)
    .filter((video) => !unwatchedOnly || !video.watched)
    .sort((a, b) => videoTime(b) - videoTime(a) || b.score - a.score);

  document.querySelector("#videoList").innerHTML = videos.map((video) => {
    const channel = channelById(video.channelId);
    const thumbnail = videoThumbnailUrl(video);
    const genre = resolveVideoGenre(video, channel);
    return `
      <article class="video-card">
        <div class="video-thumb">
          ${thumbnail ? `<img src="${escapeHtml(thumbnail)}" alt="" loading="lazy" />` : "▶"}
        </div>
        <div class="video-copy">
          <strong>${escapeHtml(video.title)}</strong>
          <div class="meta">${escapeHtml(channel.name)}・${video.daysAgo === 0 ? "今日" : `${video.daysAgo}日前`}</div>
          <div class="tag-row">
            <span class="tag ${genre}">${genres[genre]?.label || genres.unknown.label}</span>
            <span class="confidence">${formatDuration(video)}</span>
            <span class="confidence">${video.watched ? "視聴済み" : "未視聴"}</span>
          </div>
          <div class="video-actions">
            <button class="small-button" data-watch="${video.id}" type="button">${video.watched ? "未視聴に戻す" : "視聴済みにする"}</button>
            <button class="small-button" data-open-video="${video.id}" type="button">開く</button>
          </div>
        </div>
      </article>
    `;
  }).join("") || `<p class="meta">この期間の未視聴動画はありません。</p>`;
}

function renderVideos() {
  const unwatchedOnly = document.querySelector("#unwatchedOnly").checked;
  const isFiltering =
    document.querySelector("#newChannelSearch").value.trim() ||
    document.querySelector("#newGenreFilter").value !== "all" ||
    document.querySelector("#newKindFilter").value !== "all" ||
    document.querySelector("#newDurationFilter").value !== "all" ||
    selectedSubTagFilters(["#newSubTagFilter1", "#newSubTagFilter2", "#newSubTagFilter3"]).length;
  const videos = state.videos
    .filter((video) => channelById(video.channelId))
    .filter((video) => videoMatchesFilters(video, channelById(video.channelId), "#newChannelSearch", "#newGenreFilter", "#newKindFilter", "#newDurationFilter", ["#newSubTagFilter1", "#newSubTagFilter2", "#newSubTagFilter3"]))
    .filter((video) => video.daysAgo < activeRange)
    .filter((video) => !unwatchedOnly || !video.watched)
    .sort((a, b) => videoTime(b) - videoTime(a) || b.score - a.score);

  if (!videos.length) {
    document.querySelector("#videoList").innerHTML = `<p class="meta">この期間の未視聴動画はありません。</p>`;
    return;
  }

  const favoriteVideos = isFiltering ? [] : videos.filter((video) => channelById(video.channelId)?.favorite);
  const topVideos = isFiltering ? [] : favoriteVideos.length
    ? favoriteVideos
    : [...videos]
      .sort((a, b) => {
        const channelA = channelById(a.channelId);
        const channelB = channelById(b.channelId);
        return channelRecommendationScore(channelB) - channelRecommendationScore(channelA) || videoTime(b) - videoTime(a);
      })
      .slice(0, 4);
  const topVideoIds = new Set(topVideos.map((video) => video.id));
  const normalVideos = videos.filter((video) => !topVideoIds.has(video.id));
  const sections = [];

  if (!isFiltering) sections.push(renderVideoSection(
    favoriteVideos.length ? "お気に入り更新" : "お気に入り・おすすめ",
    favoriteVideos.length
      ? "お気に入り登録したチャンネルの新着を先頭に表示しています。"
      : "お気に入りがまだないため、よく見る傾向と更新日の新しさからおすすめを先頭に表示しています。",
    topVideos,
    "recommended",
  ));

  if (false && favoriteVideos.length) {
    sections.push(renderVideoSection(
      "お気に入り更新",
      "お気に入り登録したチャンネルの新着を先頭に表示しています。",
      favoriteVideos,
      "recommended",
    ));
  }

  activeGenreKeys().forEach((genre) => {
    const genreVideos = normalVideos.filter((video) => displayChannelGenre(channelById(video.channelId)) === genre);
    if (!genreVideos.length) return;
    sections.push(renderVideoSection(
      genreMeta(genre).label,
      "ジャンルごとにまとめ、各ジャンル内は更新日付順です。",
      genreVideos,
      genre,
    ));
  });

  document.querySelector("#videoList").innerHTML = sections.join("");
}

function renderVideoSection(title, description, videos, tagClass) {
  return `
    <section class="video-section genre-section-${tagClass}">
      <div class="video-section-header">
        <div>
          <span class="tag ${tagClass}">${escapeHtml(title)}</span>
          <p>${escapeHtml(description)}</p>
        </div>
        <strong>${videos.length}件</strong>
      </div>
      <div class="video-section-list">
        ${videos
          .sort((a, b) => videoTime(b) - videoTime(a) || b.score - a.score)
          .map(renderVideoCard)
          .join("")}
      </div>
    </section>
  `;
}

function renderChannelAvatar(channel) {
  if (channel.thumbnailUrl) {
    return `
      <div class="avatar channel-avatar">
        <img src="${escapeHtml(channel.thumbnailUrl)}" alt="" loading="lazy" />
      </div>
    `;
  }
  return `<div class="avatar" style="background:${genres[channel.genre]?.color || genres.unknown.color}">${escapeHtml(channel.name.slice(0, 1))}</div>`;
}

function renderVideoCard(video) {
  const channel = channelById(video.channelId);
  const thumbnail = videoThumbnailUrl(video);
  const subTags = subTagsForVideo(video, channel);
  const genre = resolveVideoGenre(video, channel);
  return `
    <article class="video-card">
      <div class="video-thumb">
        ${thumbnail ? `<img src="${escapeHtml(thumbnail)}" alt="" loading="lazy" />` : "▶"}
      </div>
      <div class="video-copy">
        <strong>${escapeHtml(video.title)}</strong>
        <div class="meta">${escapeHtml(channel.name)}・${video.daysAgo === 0 ? "今日" : `${video.daysAgo}日前`}</div>
        <div class="tag-row">
          <span class="tag ${genre}">${genres[genre]?.label || genres.unknown.label}</span>
          <span class="kind-tag ${likedVideoKind(video)}">${videoKindLabel(video)}</span>
          <span class="confidence">${formatDuration(video)}</span>
          <span class="confidence">${formatNumber(videoViewCount(video))}回再生</span>
          ${channel.favorite ? `<span class="tag recommended">お気に入り</span>` : ""}
          <span class="confidence">${video.watched ? "視聴済み" : "未視聴"}</span>
          ${renderSubTags(subTags)}
        </div>
        <div class="video-actions">
          <button class="small-button" data-watch="${video.id}" type="button">${video.watched ? "未視聴に戻す" : "視聴済みにする"}</button>
          <button class="small-button" data-open-video="${video.id}" type="button">開く</button>
        </div>
      </div>
    </article>
  `;
}

function renderLikedVideos() {
  const videos = [...(state.likedVideos || [])]
    .filter((video) => videoMatchesFilters(video, null, "#likedChannelSearch", "#likedGenreFilter", "#likedKindFilter", "#likedDurationFilter", ["#likedSubTagFilter1", "#likedSubTagFilter2", "#likedSubTagFilter3"]))
    .sort((a, b) => videoViewCount(b) - videoViewCount(a) || videoTime(b) - videoTime(a));

  document.querySelector("#likedSummary").textContent =
    `${videos.length}件の高評価動画を、動画タイトル・説明・タグからジャンル分けしています。`;

  if (!videos.length) {
    document.querySelector("#likedVideoList").innerHTML = `
      <section class="video-section genre-section-recommended">
        <div class="video-section-header">
          <div>
            <span class="tag recommended">未取得</span>
            <p>「高評価を更新」を押すと、YouTubeで高く評価した動画を取得します。</p>
          </div>
        </div>
      </section>
    `;
    return;
  }

  const sections = activeGenreKeys()
    .map((genre) => ({
      genre,
      videos: videos.filter((video) => resolveVideoGenre(video, null) === genre && likedVideoKind(video) !== "short"),
    }))
    .filter((section) => section.videos.length > 0)
    .map((section) => renderLikedVideoSection(section.genre, section.videos, "動画"));

  const shortSections = activeGenreKeys()
    .map((genre) => ({
      genre,
      videos: videos.filter((video) => resolveVideoGenre(video, null) === genre && likedVideoKind(video) === "short"),
    }))
    .filter((section) => section.videos.length > 0)
    .map((section) => renderLikedVideoSection(section.genre, section.videos, "ショート"));

  document.querySelector("#likedVideoList").innerHTML = [...sections, ...shortSections].join("");
}

function renderLikedVideoSection(genre, videos, label) {
  return `
    <section class="video-section genre-section-${genre}">
      <div class="video-section-header">
        <div>
          <span class="tag ${genre}">${genreMeta(genre).label} / ${label}</span>
          <p>高評価した動画を、動画単位でこのジャンルに分類しています。</p>
        </div>
        <strong>${videos.length}件</strong>
      </div>
      <div class="video-section-list">
        ${videos.map(renderLikedVideoCard).join("")}
      </div>
    </section>
  `;
}

function renderLikedVideoCard(video) {
  const thumbnail = videoThumbnailUrl(video);
  const genre = resolveVideoGenre(video, null);
  const subTags = subTagsForVideo(video, null);
  return `
    <article class="video-card">
      <div class="video-thumb">
        ${thumbnail ? `<img src="${escapeHtml(thumbnail)}" alt="" loading="lazy" />` : "▶"}
      </div>
      <div class="video-copy">
        <strong>${escapeHtml(video.title)}</strong>
        <div class="meta">${escapeHtml(video.channelTitle || "チャンネル不明")}・${video.daysAgo === 0 ? "今日" : `${video.daysAgo}日前`}</div>
        <div class="tag-row">
          <span class="tag ${genre}">${genreMeta(genre).label}</span>
          <span class="kind-tag ${likedVideoKind(video)}">${videoKindLabel(video)}</span>
          <span class="confidence">${formatDuration(video)}</span>
          <span class="confidence">分類 ${video.confidence || 38}%</span>
          <span class="confidence">${formatNumber(videoViewCount(video))}回再生</span>
          ${renderSubTags(subTags)}
        </div>
        <label class="inline-genre">
          ジャンル
          <select data-liked-genre-change="${video.id}">
            ${genreOptions(genre)}
          </select>
        </label>
        <div class="video-actions">
          <button class="small-button" data-open-liked-video="${video.id}" type="button">開く</button>
        </div>
      </div>
    </article>
  `;
}

function likedVideoKind(video) {
  if (video.kind) return video.kind;
  const text = `${video.title || ""} ${video.description || ""}`.toLowerCase();
  if (text.includes("live") || text.includes("ライブ") || text.includes("生配信") || text.includes("生放送")) return "live";
  const seconds = durationSeconds(video);
  if (Number.isFinite(seconds)) return seconds <= 60 ? "short" : "video";
  if (text.includes("#shorts") || text.includes("shorts")) return "short";
  return "video";
}

function likedVideoKind(video) {
  const seconds = durationSeconds(video);
  const text = `${video.title || ""} ${video.description || ""} ${video.channelTitle || ""}`.toLowerCase();
  const strongLiveWords = ["live", "\u30e9\u30a4\u30d6", "\u751f\u914d\u4fe1", "\u751f\u653e\u9001", "\u914d\u4fe1\u4e2d", "\u914d\u4fe1\u6e08", "\u914d\u4fe1", "\u795d\u52dd\u4f1a"];
  const longTalkOrGameWords = ["apex", "dqx", "\u30b2\u30fc\u30e0", "\u5b9f\u6cc1", "gw", "\u96d1\u8ac7", "\u4f01\u753b"];
  if (video.kind === "live" || strongLiveWords.some((word) => text.includes(word))) return "live";
  if (Number.isFinite(seconds) && seconds >= 3600 && longTalkOrGameWords.some((word) => text.includes(word))) return "live";
  const liveWords = ["live", "ライブ", "生配信", "生放送", "配信中", "配信済", "配信", "祝勝会"];
  const streamWords = ["apex", "dqx", "ゲーム", "実況", "gw"];
  if (video.kind === "live" || liveWords.some((word) => text.includes(word))) return "live";
  if (Number.isFinite(seconds) && seconds === 0) return "live";
  if (Number.isFinite(seconds) && seconds >= 3600 && streamWords.some((word) => text.includes(word))) return "live";
  if (video.kind === "short" || video.kind === "video") return video.kind;
  if (Number.isFinite(seconds)) return seconds <= 60 ? "short" : "video";
  if (text.includes("#shorts") || text.includes("shorts")) return "short";
  return "video";
}

function videoKindLabel(video) {
  const kind = likedVideoKind(video);
  if (kind === "live") return "ライブ配信";
  return kind === "short" ? "ショート" : "通常動画";
}

function videoTime(video) {
  return Date.parse(video.updatedAt || video.publishedAt || "") || 0;
}

function videoUrl(video) {
  const videoId = video.youtubeVideoId || video.id;
  const params = new URLSearchParams({ v: videoId });
  if (video.title) params.set("title", video.title);
  const thumbnail = videoThumbnailUrl(video);
  if (thumbnail) params.set("thumb", thumbnail);
  return `${location.origin}/player.html?${params.toString()}`;
}

function videoThumbnailUrl(video) {
  const videoId = video.youtubeVideoId || video.id;
  return video.thumbnailUrl || (videoId ? `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg` : "");
}

function videoViewCount(video) {
  return Number(video.viewCount || 0);
}

function channelViewCount(channel) {
  return state.videos
    .filter((video) => video.channelId === channel.id)
    .reduce((sum, video) => sum + videoViewCount(video), 0);
}

function formatNumber(value) {
  return new Intl.NumberFormat("ja-JP").format(Number(value || 0));
}

function renderAnalytics() {
  const counts = analyticsGenreCounts();
  const totalViews = counts.reduce((sum, item) => sum + item.score, 0) || 1;
  let start = 0;
  const stops = counts.map((item) => {
    const size = item.score / totalViews * 100;
    const stop = `${genreMeta(item.genre).color} ${start}% ${start + size}%`;
    start += size;
    return stop;
  }).join(", ");
  document.querySelector("#genreDonut").style.background = `conic-gradient(${stops})`;

  document.querySelector("#frequencyBars").innerHTML = counts.slice(0, 5).map((item) => `
    <div class="bar-row">
      <span class="meta">${genreMeta(item.genre).label}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(8, item.score / totalViews * 100)}%; background:${genreMeta(item.genre).color}"></div></div>
      <strong>${formatNumber(item.views)}回</strong>
    </div>
  `).join("");

  document.querySelector("#popularChannels").innerHTML = [...state.channels]
    .sort((a, b) => channelViewCount(b) - channelViewCount(a))
    .slice(0, 4)
    .map(renderCompactChannel)
    .join("");
}

function analyticsGenreCounts() {
  return activeGenreKeys()
    .map((genre) => {
      const channelCount = state.channels.filter((channel) => displayChannelGenre(channel) === genre).length;
      const likedCount = (state.likedVideos || []).filter((video) => resolveVideoGenre(video, null) === genre).length;
      return { genre, channelCount, likedCount, score: channelCount + likedCount, views: channelCount + likedCount };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

function renderAnalytics() {
  const channelCounts = analyticsChannelGenreCounts();
  const likedCounts = analyticsLikedGenreCounts();
  setAnalyticsLabels();
  renderGenreDonut("#channelGenreDonut", channelCounts);
  renderGenreDonut("#likedGenreDonut", likedCounts);
  renderGenreBars("#channelGenreBars", channelCounts, "ch");
  renderGenreBars("#likedGenreBars", likedCounts, "本");

  document.querySelector("#popularChannels").innerHTML = [...state.channels]
    .sort((a, b) => channelViewCount(b) - channelViewCount(a))
    .slice(0, 4)
    .map(renderCompactChannel)
    .join("");
}

function setAnalyticsLabels() {
  const channelDonut = document.querySelector("#channelGenreDonut");
  const likedDonut = document.querySelector("#likedGenreDonut");
  const channelBars = document.querySelector("#channelGenreBars");
  const likedBars = document.querySelector("#likedGenreBars");
  channelDonut?.closest(".donut-card")?.querySelector("h3") && (channelDonut.closest(".donut-card").querySelector("h3").textContent = "登録チャンネルのジャンル割合");
  channelDonut?.closest(".donut-card")?.querySelector("p") && (channelDonut.closest(".donut-card").querySelector("p").textContent = "登録チャンネルだけをメインジャンル別に集計");
  channelBars?.closest(".bar-card")?.querySelector("h3") && (channelBars.closest(".bar-card").querySelector("h3").textContent = "登録チャンネルの内訳");
  likedDonut?.closest(".donut-card")?.querySelector("h3") && (likedDonut.closest(".donut-card").querySelector("h3").textContent = "高評価動画のジャンル割合");
  likedDonut?.closest(".donut-card")?.querySelector("p") && (likedDonut.closest(".donut-card").querySelector("p").textContent = "高評価した動画を動画ごとのジャンルで集計");
  likedBars?.closest(".bar-card")?.querySelector("h3") && (likedBars.closest(".bar-card").querySelector("h3").textContent = "高評価動画の内訳");
}

function analyticsChannelGenreCounts() {
  return activeGenreKeys()
    .map((genre) => ({
      genre,
      count: state.channels.filter((channel) => displayChannelGenre(channel) === genre).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
}

function analyticsLikedGenreCounts() {
  return activeGenreKeys()
    .map((genre) => ({
      genre,
      count: (state.likedVideos || []).filter((video) => resolveVideoGenre(video, null) === genre).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
}

function renderGenreDonut(selector, counts) {
  const donut = document.querySelector(selector);
  if (!donut) return;
  if (!counts.length) {
    donut.style.background = "#e5e7eb";
    return;
  }
  const total = counts.reduce((sum, item) => sum + item.count, 0) || 1;
  let start = 0;
  const stops = counts.map((item) => {
    const size = item.count / total * 100;
    const stop = `${genreMeta(item.genre).color} ${start}% ${start + size}%`;
    start += size;
    return stop;
  }).join(", ");
  donut.style.background = `conic-gradient(${stops})`;
}

function renderGenreBars(selector, counts, suffix) {
  const target = document.querySelector(selector);
  if (!target) return;
  const total = counts.reduce((sum, item) => sum + item.count, 0) || 1;
  target.innerHTML = counts.slice(0, 6).map((item) => `
    <div class="bar-row">
      <span class="meta">${genreMeta(item.genre).label}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(8, item.count / total * 100)}%; background:${genreMeta(item.genre).color}"></div></div>
      <strong>${item.count}${suffix}</strong>
    </div>
  `).join("") || `<p class="meta">データがありません</p>`;
}

function renderSettings() {
  const settings = state.settings || initialState.settings;
  document.querySelector("#accountStatus").innerHTML = state.synced
    ? `
      <div>
        <strong>YouTube連携済み</strong>
        <span>${escapeHtml(state.connectedAccount || "Googleアカウント")}</span>
      </div>
      <span class="confidence">OAuth</span>
    `
    : `
      <div>
        <strong>YouTube未連携</strong>
        <span>初回ログインで登録チャンネルを取得します</span>
      </div>
      <span class="confidence">未設定</span>
    `;
  document.querySelector("#themeMode").value = settings.theme;
  document.querySelector("#accentMode").value = settings.accent;
  document.querySelector("#densityMode").value = settings.density;
  renderModeSelect("#classificationMode");
  const help = document.querySelector("#classificationModeHelp");
  if (help) help.textContent = currentMode().description;
}

function renderModeSelect(selector) {
  const select = document.querySelector(selector);
  if (!select) return;
  const selected = currentModeKey();
  select.innerHTML = modeOptions(selected);
  select.value = selected;
}

function openChannelDetail(id) {
  const channel = channelById(id);
  if (!channel) return;
  document.querySelector("#channelDetail").innerHTML = `
    <div class="detail-grid">
      <h3>${escapeHtml(channel.name)}</h3>
      <p class="meta">${escapeHtml(channel.description)}</p>
      <label>
        ジャンル
        <select id="detailGenre">
          ${genreOptions(channel.genre)}
        </select>
      </label>
      <label>
        タグ
        <input id="detailTags" value="${escapeHtml(channel.tags.join(", "))}" />
      </label>
      <label>
        メモ
        <textarea id="detailMemo">${escapeHtml(channel.memo)}</textarea>
      </label>
      <button class="wide-button" data-save-detail="${channel.id}" type="button">保存</button>
    </div>
  `;
  document.querySelector("#channelDialog").showModal();
}

function saveChannelDetail(id) {
  const channel = channelById(id);
  if (!channel) return;
  channel.genre = document.querySelector("#detailGenre").value;
  channel.tags = document.querySelector("#detailTags").value.split(",").map((tag) => tag.trim()).filter(Boolean);
  channel.memo = document.querySelector("#detailMemo").value.trim();
  channel.confidence = channel.genre === "unknown" ? 38 : Math.max(channel.confidence, 76);
  saveState();
  render();
  document.querySelector("#channelDialog").close();
}

async function logoutAccount() {
  state.synced = false;
  state.connectedAccount = "";
  state.connectedEmail = "";
  state.connectedPicture = "";
  saveState();
  if (backendAvailable) {
    await fetch(`${API_BASE}/api/logout`, { method: "POST", credentials: "include" }).catch(() => {});
  }
  render();
}

async function deleteLocalData() {
  const ok = confirm("このブラウザに保存されているチャンネル設定、視聴済み、お気に入り、メモを削除します。続行しますか？");
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(initialState);
  if (backendAvailable) {
    await fetch(`${API_BASE}/api/delete-data`, { method: "POST", credentials: "include" }).catch(() => {});
  }
  saveState();
  render();
}

async function switchAccount() {
  state.synced = false;
  state.connectedAccount = "";
  saveState();
  if (backendAvailable) {
    location.href = `${API_BASE}/auth/switch`;
    return;
  }
  render();
}

function handleAccountMenu() {
  const account = state.connectedAccount || "YouTubeアカウント";
  const switchRequested = window.confirm(`${account}\n\nOK: 別のアカウントに切り替え\nキャンセル: ログアウト確認へ`);
  if (switchRequested) {
    switchAccount();
    return;
  }
  if (window.confirm(`${account} からログアウトしますか？`)) {
    logoutAccount();
  }
}

document.querySelectorAll(".bottom-nav button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".bottom-nav button, .screen").forEach((node) => node.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`#${button.dataset.tab}`).classList.add("active");
  });
});

document.querySelector("#syncButton").addEventListener("click", () => {
  if (state.synced) {
    handleAccountMenu();
    return;
  }
  renderAuthState();
});

document.querySelector("#googleLoginButton").addEventListener("click", completeGoogleConnect);
document.querySelector("#recommendReloadButton").addEventListener("click", () => {
  const count = state.videos.filter((video) => !video.watched && channelById(video.channelId)).length;
  recommendationOffset = count ? (recommendationOffset + 1) % count : 0;
  renderHome();
});

document.querySelector("#classifyButton").addEventListener("click", () => {
  state.channels = state.channels.map((channel) => ({ ...channel, ...classifyChannel(channel) }));
  saveState();
  render();
});

document.querySelector("#reclassifyButton").addEventListener("click", async () => {
  state.channels = state.channels.map((channel) => {
    if (channel.tags.includes("手動変更")) return channel;
    return { ...channel, ...classifyChannel(channel) };
  });
  saveState();
  render();

  if (backendAvailable) {
    try {
      const response = await fetch(`${API_BASE}/api/channels/reclassify`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const payload = await response.json();
        state.channels = payload.channels;
        saveState();
        render();
      }
    } catch {}
  }
});

document.querySelector("#showUnknownButton").addEventListener("click", () => {
  document.querySelector("#genreFilter").value = "unknown";
  renderChannelScreen();
});

document.querySelector("#channelSearch").addEventListener("input", renderChannelScreen);
document.querySelector("#genreFilter").addEventListener("change", renderChannelScreen);
document.querySelector("#channelSubTagFilter1").addEventListener("change", renderChannelScreen);
document.querySelector("#channelSubTagFilter2").addEventListener("change", renderChannelScreen);
document.querySelector("#channelSubTagFilter3").addEventListener("change", renderChannelScreen);
document.querySelector("#unwatchedOnly").addEventListener("change", renderVideos);
document.querySelector("#refreshVideosButton").addEventListener("click", () => syncVideosWithBackend(true));
document.querySelector("#refreshLikedButton").addEventListener("click", () => syncLikedVideosWithBackend(true));
document.querySelector("#newChannelSearch").addEventListener("input", renderVideos);
document.querySelector("#newGenreFilter").addEventListener("change", renderVideos);
document.querySelector("#newKindFilter").addEventListener("change", renderVideos);
document.querySelector("#newDurationFilter").addEventListener("change", renderVideos);
document.querySelector("#newSubTagFilter1").addEventListener("change", renderVideos);
document.querySelector("#newSubTagFilter2").addEventListener("change", renderVideos);
document.querySelector("#newSubTagFilter3").addEventListener("change", renderVideos);
document.querySelector("#likedChannelSearch").addEventListener("input", renderLikedVideos);
document.querySelector("#likedGenreFilter").addEventListener("change", renderLikedVideos);
document.querySelector("#likedKindFilter").addEventListener("change", renderLikedVideos);
document.querySelector("#likedDurationFilter").addEventListener("change", renderLikedVideos);
document.querySelector("#likedSubTagFilter1").addEventListener("change", renderLikedVideos);
document.querySelector("#likedSubTagFilter2").addEventListener("change", renderLikedVideos);
document.querySelector("#likedSubTagFilter3").addEventListener("change", renderLikedVideos);
document.querySelector("#themeMode").addEventListener("change", (event) => {
  state.settings.theme = event.target.value;
  saveState();
  renderPreservingScroll();
});
document.querySelector("#accentMode").addEventListener("change", (event) => {
  state.settings.accent = event.target.value;
  saveState();
  renderPreservingScroll();
});
document.querySelector("#densityMode").addEventListener("change", (event) => {
  state.settings.density = event.target.value;
  saveState();
  renderPreservingScroll();
});
document.querySelector("#classificationMode").addEventListener("change", (event) => {
  setClassificationMode(event.target.value);
});
document.querySelector("#homeClassificationMode").addEventListener("change", (event) => {
  setClassificationMode(event.target.value);
});
document.querySelector("#logoutButton").addEventListener("click", async () => {
  await logoutAccount();
});
document.querySelector("#deleteLocalDataButton").addEventListener("click", deleteLocalData);
document.querySelector("#pluginSettingsButton").addEventListener("click", () => {
  alert("YouTube補助機能は、リリース時にChrome拡張機能として別途作る想定です。このWebアプリから直接ブラウザ拡張を有効化することはできません。");
});

document.querySelector("#dateFilter").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  activeRange = Number(button.dataset.range);
  document.querySelectorAll("#dateFilter button").forEach((node) => node.classList.remove("active"));
  button.classList.add("active");
  renderVideos();
});

document.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    const channel = channelById(favoriteButton.dataset.favorite);
    channel.favorite = !channel.favorite;
    saveState();
    renderPreservingScroll();
    if (backendAvailable && state.synced) {
      fetch(`${API_BASE}/api/channels/${encodeURIComponent(channel.id)}/favorite`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: channel.favorite }),
      }).catch(() => {});
    }
    return;
  }

  const detailButton = event.target.closest("[data-detail]");
  if (detailButton) openChannelDetail(detailButton.dataset.detail);

  const saveButton = event.target.closest("[data-save-detail]");
  if (saveButton) saveChannelDetail(saveButton.dataset.saveDetail);

  const watchButton = event.target.closest("[data-watch]");
  if (watchButton) {
    const video = state.videos.find((item) => item.id === watchButton.dataset.watch);
    video.watched = !video.watched;
    const channel = channelById(video.channelId);
    channel.clicks += video.watched ? 1 : -1;
    channel.minutes = Math.max(0, channel.minutes + (video.watched ? 8 : -8));
    saveState();
    render();

    if (backendAvailable && video.id) {
      fetch(`${API_BASE}/api/videos/${encodeURIComponent(video.id)}/watched`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watched: video.watched }),
      }).catch(() => {});
    }
  }

  const openVideoButton = event.target.closest("[data-open-video]");
  if (openVideoButton) {
    const video = state.videos.find((item) => item.id === openVideoButton.dataset.openVideo);
    if (!video) return;
    const channel = channelById(video.channelId);
    if (channel) {
      channel.clicks += 1;
      channel.lastViewed = new Date().toISOString().slice(0, 10);
    }
    saveState();
    render();
    window.open(videoUrl(video), "_blank", "noreferrer");
    return;
  }

  const openLikedVideoButton = event.target.closest("[data-open-liked-video]");
  if (openLikedVideoButton) {
    const video = state.likedVideos.find((item) => item.id === openLikedVideoButton.dataset.openLikedVideo);
    if (!video) return;
    const videoId = video.youtubeVideoId || video.id;
    window.open(video.url || `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, "_blank", "noreferrer");
    return;
  }

  const openButton = event.target.closest("[data-open]");
  if (openButton) {
    const channel = channelById(openButton.dataset.open);
    channel.clicks += 1;
    channel.lastViewed = new Date().toISOString().slice(0, 10);
    saveState();
    renderPreservingScroll();
    window.open(channelUrl(channel), "_blank", "noreferrer");
    return;
  }

  const quickGenreButton = event.target.closest("[data-quick-genre]");
  if (quickGenreButton) {
    const [channelId, genre] = quickGenreButton.dataset.quickGenre.split(":");
    applyGenreChange(channelId, genre);
  }
});

document.addEventListener("change", (event) => {
  const select = event.target.closest("[data-genre-change]");
  if (select) {
    applyGenreChange(select.dataset.genreChange, select.value);
    return;
  }

  const likedSelect = event.target.closest("[data-liked-genre-change]");
  if (likedSelect) {
    applyLikedGenreChange(likedSelect.dataset.likedGenreChange, likedSelect.value);
  }
});

function applyGenreChange(channelId, genre) {
  const channel = channelById(channelId);
  if (!channel) return;
  channel.genre = genre;
  channel.confidence = genre === "unknown" ? 38 : 100;
  if (!channel.tags.includes("手動変更")) channel.tags.push("手動変更");
  saveState();
  render();

  if (backendAvailable && state.synced) {
    fetch(`${API_BASE}/api/channels/${encodeURIComponent(channel.id)}/genre`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ genre: channel.genre }),
    }).catch(() => {});
  }
}

function applyLikedGenreChange(videoId, genre) {
  const video = state.likedVideos.find((item) => item.id === videoId);
  if (!video) return;
  video.genre = genre;
  video.confidence = genre === "unknown" ? 38 : 100;
  saveState();
  renderLikedVideos();
}

document.querySelector("#exportButton").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "subscope-demo-data.json";
  link.click();
  URL.revokeObjectURL(link.href);
});

render();
syncWithBackend();



