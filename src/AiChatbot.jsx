import { useState, useEffect, useRef, useCallback } from "react";
 
const THEMES = {
  Aurora: { bg: "linear-gradient(135deg, #0d0d2b 0%, #1a0a3d 40%, #0a2040 100%)", sidebar: "rgba(15,10,40,0.92)", bubble: "rgba(80,40,160,0.35)", bubbleAI: "rgba(20,15,50,0.7)", accent: "#a78bfa", text: "#e2d9f3", muted: "#9d8ec4", input: "rgba(30,20,70,0.8)", border: "rgba(167,139,250,0.2)", glow: "0 0 30px rgba(167,139,250,0.3)", headerBg: "rgba(10,5,30,0.85)", tag: "Aurora 🌌" },
  Sunset: { bg: "linear-gradient(135deg, #1a0010 0%, #3d0a1a 40%, #2d1500 100%)", sidebar: "rgba(30,5,15,0.95)", bubble: "rgba(200,60,30,0.3)", bubbleAI: "rgba(40,10,20,0.75)", accent: "#fb923c", text: "#fde8d8", muted: "#d4956a", input: "rgba(50,15,10,0.8)", border: "rgba(251,146,60,0.2)", glow: "0 0 30px rgba(251,146,60,0.3)", headerBg: "rgba(20,5,10,0.9)", tag: "Sunset 🌅" },
  Forest: { bg: "linear-gradient(135deg, #020f06 0%, #071a0e 40%, #0a1505 100%)", sidebar: "rgba(3,14,8,0.95)", bubble: "rgba(30,100,50,0.35)", bubbleAI: "rgba(5,20,10,0.75)", accent: "#4ade80", text: "#d1fae5", muted: "#6eae85", input: "rgba(5,20,10,0.8)", border: "rgba(74,222,128,0.2)", glow: "0 0 30px rgba(74,222,128,0.25)", headerBg: "rgba(2,10,5,0.9)", tag: "Forest 🌿" },
  Candy: { bg: "linear-gradient(135deg, #1a0520 0%, #200a30 40%, #10051a 100%)", sidebar: "rgba(20,5,28,0.95)", bubble: "rgba(230,80,180,0.3)", bubbleAI: "rgba(30,10,40,0.75)", accent: "#f0abfc", text: "#fdf4ff", muted: "#c084fc", input: "rgba(35,10,45,0.8)", border: "rgba(240,171,252,0.2)", glow: "0 0 30px rgba(240,171,252,0.3)", headerBg: "rgba(15,5,22,0.9)", tag: "Candy 🍬" },
  Ocean: { bg: "linear-gradient(135deg, #000d1a 0%, #001a33 50%, #001020 100%)", sidebar: "rgba(0,10,22,0.95)", bubble: "rgba(10,80,160,0.35)", bubbleAI: "rgba(0,15,35,0.75)", accent: "#38bdf8", text: "#e0f2fe", muted: "#5ba4c7", input: "rgba(0,20,40,0.8)", border: "rgba(56,189,248,0.2)", glow: "0 0 30px rgba(56,189,248,0.3)", headerBg: "rgba(0,8,18,0.9)", tag: "Ocean 🌊" },
  Ember: { bg: "linear-gradient(135deg, #0f0500 0%, #1f0800 50%, #150300 100%)", sidebar: "rgba(12,4,0,0.97)", bubble: "rgba(180,50,0,0.35)", bubbleAI: "rgba(25,8,0,0.78)", accent: "#f97316", text: "#fff1e6", muted: "#c4704a", input: "rgba(25,8,0,0.8)", border: "rgba(249,115,22,0.2)", glow: "0 0 30px rgba(249,115,22,0.3)", headerBg: "rgba(10,3,0,0.92)", tag: "Ember 🔥" },
  Galaxy: { bg: "linear-gradient(135deg, #05050f 0%, #0a0520 50%, #050a15 100%)", sidebar: "rgba(5,3,12,0.97)", bubble: "rgba(60,20,120,0.4)", bubbleAI: "rgba(8,5,20,0.8)", accent: "#818cf8", text: "#eef2ff", muted: "#8b8eb8", input: "rgba(10,5,25,0.8)", border: "rgba(129,140,248,0.2)", glow: "0 0 30px rgba(129,140,248,0.3)", headerBg: "rgba(4,3,10,0.92)", tag: "Galaxy 🪐" },
  Mint: { bg: "linear-gradient(135deg, #f0fff8 0%, #e0faf0 50%, #ccf5e8 100%)", sidebar: "rgba(230,255,245,0.97)", bubble: "rgba(100,220,180,0.25)", bubbleAI: "rgba(255,255,255,0.8)", accent: "#059669", text: "#064e3b", muted: "#34856a", input: "rgba(255,255,255,0.9)", border: "rgba(5,150,105,0.2)", glow: "0 0 20px rgba(5,150,105,0.15)", headerBg: "rgba(240,255,250,0.95)", tag: "Mint 🌱" },
  White: { bg: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)", sidebar: "rgba(245,245,245,0.98)", bubble: "rgba(100,100,200,0.12)", bubbleAI: "rgba(255,255,255,0.95)", accent: "#6366f1", text: "#1e1e2e", muted: "#6b7280", input: "rgba(255,255,255,0.97)", border: "rgba(99,102,241,0.2)", glow: "0 0 20px rgba(99,102,241,0.12)", headerBg: "rgba(255,255,255,0.98)", tag: "White ☁️" },
  Black: { bg: "#000000", sidebar: "rgba(8,8,8,0.98)", bubble: "rgba(255,255,255,0.07)", bubbleAI: "rgba(18,18,18,0.97)", accent: "#e5e5e5", text: "#f5f5f5", muted: "#737373", input: "rgba(20,20,20,0.97)", border: "rgba(255,255,255,0.1)", glow: "0 0 20px rgba(255,255,255,0.05)", headerBg: "rgba(5,5,5,0.98)", tag: "Black 🖤" },
};
 
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
 
const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;
 
const SYSTEM_PROMPT = `You are a helpful, brilliant, multilingual AI assistant. Answer any question on any topic clearly and thoroughly. You maintain full conversation context — always remember what was said earlier in the chat. ONLY if the user directly asks "who built you" or "who made you" or "who created you", respond: "I was built by Anu Sri Vaddi 💫". Never mention Anu Sri Vaddi otherwise. Always respond in the same language the user writes in. Never add unnecessary filler phrases. Give direct, accurate, detailed answers.`;
 
export default function App() {
  const [themeName, setThemeName] = useState("Aurora");
  const t = THEMES[themeName];
  const [conversations, setConversations] = useState(() => { try { return JSON.parse(localStorage.getItem("anu_chats") || "[]"); } catch { return []; } });
  const [activeId, setActiveId] = useState(() => localStorage.getItem("anu_active") || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [recording, setRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMediaType, setImageMediaType] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
 
  const activeConvo = conversations.find(c => c.id === activeId) || null;
  const messages = activeConvo?.messages || [];
 
  useEffect(() => { localStorage.setItem("anu_chats", JSON.stringify(conversations)); }, [conversations]);
  useEffect(() => { if (activeId) localStorage.setItem("anu_active", activeId); }, [activeId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
 
  const newChat = () => {
    const id = uid();
    setConversations(p => [{ id, title: "New Chat", messages: [], createdAt: Date.now() }, ...p]);
    setActiveId(id);
    setInput("");
    setImagePreview(null);
    setImageBase64(null);
    setImageMediaType(null);
  };
 
  const deleteConvo = (id, e) => {
    e.stopPropagation();
    setConversations(p => p.filter(c => c.id !== id));
    if (activeId === id) setActiveId(null);
  };
 
  const updateConvo = (id, updater) => setConversations(p => p.map(c => c.id === id ? updater(c) : c));
 
  const sendMessage = useCallback(async (overrideText, overrideImage, overrideMediaType) => {
    const text = (overrideText ?? input).trim();
    const imgB64 = overrideImage ?? imageBase64;
    const imgMime = overrideMediaType ?? imageMediaType;
    if (!text && !imgB64) return;
    if (loading) return;
 
    let cid = activeId;
    if (!cid) {
      cid = uid();
      setConversations(p => [{ id: cid, title: text.slice(0, 32) || "Image Chat", messages: [], createdAt: Date.now() }, ...p]);
      setActiveId(cid);
    }
 
    const userMsg = { id: uid(), role: "user", content: text, time: now(), image: imagePreview || null, imageBase64: imgB64, imageMediaType: imgMime };
 
    updateConvo(cid, c => ({
      ...c,
      title: c.messages.length === 0 ? (text.slice(0, 32) || "Image Chat") : c.title,
      messages: [...c.messages, userMsg],
    }));
 
    setInput("");
    setImagePreview(null);
    setImageBase64(null);
    setImageMediaType(null);
    setLoading(true);
 
    try {
      let reply = "";
 
      if (imgB64) {
        // Gemini for image analysis
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: [{
                role: "user",
                parts: [
                  { inline_data: { mime_type: imgMime, data: imgB64 } },
                  { text: text || "What is in this image? Describe it in detail." }
                ]
              }]
            }),
          }
        );
        const data = await resp.json();
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text || data.error?.message || "Sorry, couldn't analyze the image.";
      } else {
        // Groq for text
        const allMsgs = [...(conversations.find(c => c.id === cid)?.messages || []), userMsg];
        const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...allMsgs.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content || "" })),
            ],
            max_tokens: 2048,
            temperature: 0.7,
          }),
        });
        const data = await resp.json();
        reply = data.choices?.[0]?.message?.content || data.error?.message || "Sorry, couldn't get a response.";
      }
 
      const aiMsg = { id: uid(), role: "assistant", content: reply, time: now() };
      updateConvo(cid, c => ({ ...c, messages: [...c.messages, aiMsg] }));
    } catch (err) {
      const errMsg = { id: uid(), role: "assistant", content: "⚠️ Error: " + err.message, time: now() };
      updateConvo(cid, c => ({ ...c, messages: [...c.messages, errMsg] }));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, imageBase64, imagePreview, imageMediaType, activeId, loading, conversations]);
 
  const regenerate = async () => {
    if (!activeConvo || loading) return;
    const msgs = activeConvo.messages;
    const lastUser = [...msgs].reverse().find(m => m.role === "user");
    if (!lastUser) return;
    updateConvo(activeId, c => ({ ...c, messages: c.messages.filter((_, i) => !(i === c.messages.length - 1 && c.messages[i].role === "assistant")) }));
    await sendMessage(lastUser.content, lastUser.imageBase64, lastUser.imageMediaType);
  };
 
  const copyMsg = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };
 
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setImagePreview(result);
      setImageBase64(result.split(",")[1]);
      setImageMediaType(file.type);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
 
  const toggleRecord = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice not supported! Use Chrome browser.");
      return;
    }
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(p => p ? p + " " + transcript : transcript);
    };
    recognition.onerror = () => setRecording(false);
    recognition.start();
  };
 
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-thumb{background:${t.accent}44;border-radius:4px}
    body{font-family:'Outfit',sans-serif}
    .app{display:flex;height:100vh;width:100vw;background:${t.bg};position:relative;overflow:hidden}
    .sidebar{width:260px;height:100vh;display:flex;flex-direction:column;background:${t.sidebar};border-right:1px solid ${t.border};transition:transform .3s ease;z-index:20;backdrop-filter:blur(20px);position:absolute;top:0;left:0}
    .sidebar.closed{transform:translateX(-260px)}
    .overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:15}
    .overlay.show{display:block}
    .sidebar-header{padding:20px 16px 12px;border-bottom:1px solid ${t.border}}
    .logo{font-size:20px;font-weight:700;color:${t.accent};display:flex;align-items:center;gap:8px}
    .logo span{font-size:12px;color:${t.muted};font-weight:400}
    .new-btn{margin:12px;padding:10px 16px;border-radius:12px;border:1px solid ${t.border};background:${t.bubble};color:${t.accent};font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;width:calc(100% - 24px);transition:all .2s;display:flex;align-items:center;gap:8px}
    .new-btn:hover{background:${t.accent}22}
    .convo-list{flex:1;overflow-y:auto;padding:4px 8px}
    .convo-item{padding:10px 12px;border-radius:10px;cursor:pointer;margin-bottom:2px;color:${t.muted};font-size:13px;display:flex;align-items:center;justify-content:space-between;transition:all .15s;white-space:nowrap;overflow:hidden}
    .convo-item:hover{background:${t.bubble};color:${t.text}}
    .convo-item.active{background:${t.accent}22;color:${t.accent};font-weight:600}
    .convo-title{flex:1;overflow:hidden;text-overflow:ellipsis}
    .del-btn{opacity:0;background:none;border:none;color:${t.muted};cursor:pointer;font-size:14px;padding:2px 6px;border-radius:4px}
    .convo-item:hover .del-btn{opacity:1}
    .sidebar-footer{padding:12px 16px;border-top:1px solid ${t.border};font-size:11px;color:${t.muted};text-align:center}
    .sidebar-footer strong{color:${t.accent}}
    .main{flex:1;display:flex;flex-direction:column;height:100vh;z-index:1;width:100%;min-width:0}
    .header{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid ${t.border};background:${t.headerBg};backdrop-filter:blur(20px);z-index:5;position:relative}
    .toggle-btn{background:none;border:1px solid ${t.border};color:${t.muted};cursor:pointer;padding:6px 10px;border-radius:8px;font-size:16px;transition:all .2s}
    .toggle-btn:hover{color:${t.accent};border-color:${t.accent}}
    .header-title{flex:1;font-size:16px;font-weight:600;color:${t.text};overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .theme-btn{background:none;border:1px solid ${t.border};color:${t.muted};cursor:pointer;padding:6px 12px;border-radius:8px;font-size:12px;transition:all .2s;white-space:nowrap}
    .theme-btn:hover{color:${t.accent};border-color:${t.accent}}
    .theme-dropdown{position:absolute;top:56px;right:16px;background:${t.sidebar};border:1px solid ${t.border};border-radius:12px;padding:6px;z-index:100;backdrop-filter:blur(20px);display:grid;grid-template-columns:1fr 1fr;gap:4px;min-width:200px;box-shadow:0 8px 32px rgba(0,0,0,0.4)}
    .theme-opt{padding:8px 12px;border-radius:8px;cursor:pointer;color:${t.muted};font-size:12px;transition:all .15s;background:none;border:none;font-family:'Outfit',sans-serif;text-align:left}
    .theme-opt:hover,.theme-opt.active{background:${t.bubble};color:${t.accent};font-weight:600}
    .messages{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px}
    .empty-state{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}
    .empty-icon{font-size:48px;opacity:.6}
    .empty-title{font-size:22px;font-weight:700;color:${t.text}}
    .empty-sub{font-size:14px;color:${t.muted};text-align:center;max-width:320px;line-height:1.6}
    .msg-row{display:flex;gap:10px;align-items:flex-start;animation:fadeUp .3s ease}
    .msg-row.user{flex-direction:row-reverse}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .avatar{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;font-weight:600}
    .av-ai{background:${t.accent}33;color:${t.accent};border:1px solid ${t.accent}44}
    .av-user{background:${t.bubble};color:${t.text};border:1px solid ${t.border}}
    .bubble{max-width:72%;padding:12px 16px;border-radius:16px;font-size:14px;line-height:1.7;position:relative}
    .bubble.user{background:${t.bubble};color:${t.text};border:1px solid ${t.border};border-top-right-radius:4px}
    .bubble.ai{background:${t.bubbleAI};color:${t.text};border:1px solid ${t.border};border-top-left-radius:4px;box-shadow:${t.glow}}
    .bubble-img{max-width:200px;border-radius:8px;margin-bottom:8px;display:block}
    .bubble-footer{display:flex;align-items:center;gap:8px;margin-top:8px}
    .msg-time{font-size:10px;color:${t.muted}}
    .copy-btn{background:${t.bubble};border:1px solid ${t.border};color:${t.muted};cursor:pointer;font-size:11px;padding:3px 10px;border-radius:6px;transition:all .15s;font-family:'Outfit',sans-serif}
    .copy-btn:hover{color:${t.accent};border-color:${t.accent}}
    .copy-btn.copied{color:${t.accent};border-color:${t.accent}}
    .typing{display:flex;gap:4px;align-items:center;padding:14px 16px}
    .dot{width:7px;height:7px;border-radius:50%;background:${t.accent};animation:bounce 1.2s infinite}
    .dot:nth-child(2){animation-delay:.2s}
    .dot:nth-child(3){animation-delay:.4s}
    @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
    .regen-btn{background:none;border:1px solid ${t.border};color:${t.muted};cursor:pointer;padding:6px 14px;border-radius:8px;font-size:12px;transition:all .2s;display:flex;align-items:center;gap:6px;margin:6px auto;font-family:'Outfit',sans-serif}
    .regen-btn:hover{color:${t.accent};border-color:${t.accent}}
    .input-area{padding:16px 20px;border-top:1px solid ${t.border};background:${t.headerBg};backdrop-filter:blur(20px)}
    .img-preview-wrap{position:relative;display:inline-block;margin-bottom:10px}
    .img-preview{height:72px;border-radius:8px;border:1px solid ${t.border}}
    .rm-img{position:absolute;top:-6px;right:-6px;background:${t.accent};border:none;color:#000;width:18px;height:18px;border-radius:50%;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center}
    .input-row{display:flex;align-items:flex-end;gap:8px}
    .input-box{flex:1;background:${t.input};border:1px solid ${t.border};border-radius:14px;padding:12px 16px;color:${t.text};font-family:'Outfit',sans-serif;font-size:14px;resize:none;outline:none;min-height:48px;max-height:140px;transition:border-color .2s;line-height:1.5}
    .input-box::placeholder{color:${t.muted}}
    .input-box:focus{border-color:${t.accent}88}
    .icon-btn{background:${t.bubble};border:1px solid ${t.border};color:${t.muted};cursor:pointer;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;transition:all .2s;flex-shrink:0}
    .icon-btn:hover{color:${t.accent};border-color:${t.accent}}
    .icon-btn.recording{color:#ef4444;border-color:#ef4444;animation:pulse 1s infinite}
    .send-btn{background:${t.accent};border:none;color:#000;cursor:pointer;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;transition:all .2s;flex-shrink:0;font-weight:700}
    .send-btn:hover{opacity:.85;transform:scale(1.05)}
    .send-btn:disabled{opacity:.4;cursor:not-allowed;transform:none}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @media(max-width:640px){.bubble{max-width:88%}}
  `;
 
  return (
    <>
      <style>{css}</style>
      <div className="app" onClick={() => themeOpen && setThemeOpen(false)}>
        <div className={`overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />
        <div className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
          <div className="sidebar-header">
            <div className="logo">✦ ANU AI<span>v2.0</span></div>
          </div>
          <button className="new-btn" onClick={newChat}>＋ New Conversation</button>
          <div className="convo-list">
            {conversations.map(c => (
              <div key={c.id} className={`convo-item ${c.id === activeId ? "active" : ""}`} onClick={() => { setActiveId(c.id); setSidebarOpen(false); }}>
                <span className="convo-title">💬 {c.title}</span>
                <button className="del-btn" onClick={e => deleteConvo(c.id, e)}>✕</button>
              </div>
            ))}
          </div>
          <div className="sidebar-footer">Built by <strong>Anu Sri Vaddi 💫</strong><br />Powered by Groq + Gemini</div>
        </div>
 
        <div className="main">
          <div className="header">
            <button className="toggle-btn" onClick={() => setSidebarOpen(o => !o)}>☰</button>
            <div className="header-title">{activeConvo?.title || "Anu AI"}</div>
            <button className="theme-btn" onClick={e => { e.stopPropagation(); setThemeOpen(o => !o); }}>🎨 {t.tag}</button>
            {themeOpen && (
              <div className="theme-dropdown" onClick={e => e.stopPropagation()}>
                {Object.keys(THEMES).map(name => (
                  <button key={name} className={`theme-opt ${themeName === name ? "active" : ""}`} onClick={() => { setThemeName(name); setThemeOpen(false); }}>{THEMES[name].tag}</button>
                ))}
              </div>
            )}
          </div>
 
          <div className="messages">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✦</div>
                <div className="empty-title">Anu AI</div>
                <div className="empty-sub">Ask me anything in any language 🌍</div>
              </div>
            ) : messages.map(m => (
              <div key={m.id} className={`msg-row ${m.role}`}>
                <div className={`avatar ${m.role === "assistant" ? "av-ai" : "av-user"}`}>{m.role === "assistant" ? "✦" : "U"}</div>
                <div className={`bubble ${m.role === "assistant" ? "ai" : "user"}`}>
                  {m.image && <img src={m.image} className="bubble-img" alt="uploaded" />}
                  <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                  <div className="bubble-footer">
                    <span className="msg-time">{m.time}</span>
                    <button className={`copy-btn ${copiedId === m.id ? "copied" : ""}`} onClick={() => copyMsg(m.id, m.content)}>
                      {copiedId === m.id ? "✓ Copied!" : "⎘ Copy"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="msg-row">
                <div className="avatar av-ai">✦</div>
                <div className="bubble ai">
                  <div className="typing"><div className="dot" /><div className="dot" /><div className="dot" /></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
 
          {messages.length > 0 && !loading && (
            <button className="regen-btn" onClick={regenerate}>↻ Regenerate response</button>
          )}
 
          <div className="input-area">
            {imagePreview && (
              <div className="img-preview-wrap">
                <img src={imagePreview} className="img-preview" alt="preview" />
                <button className="rm-img" onClick={() => { setImagePreview(null); setImageBase64(null); setImageMediaType(null); }}>✕</button>
              </div>
            )}
            <div className="input-row">
              <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} onChange={handleImage} />
              <button className="icon-btn" onClick={() => fileInputRef.current?.click()} title="Upload image">🖼</button>
              <button className={`icon-btn ${recording ? "recording" : ""}`} onClick={toggleRecord} title="Voice input">🎙</button>
              <textarea
                ref={inputRef}
                className="input-box"
                placeholder="Ask me anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                rows={1}
              />
              <button className="send-btn" onClick={() => sendMessage()} disabled={loading || (!input.trim() && !imageBase64)}>➤</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
