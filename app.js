(() => {
  const $ = id => document.getElementById(id);
  const CFG = window.KMB_CONFIG || {};
  const LABEL = { hype: "Hype", roast: "Roast", vibes: "Vibes" };
  const ICON = { hype: "🎉", roast: "🔥", vibes: "🎵" };
  const COLORS = ["#ff7a1a","#bf94ff","#00f593","#1e90ff","#ff4f9a","#ffd23f","#3cdfff","#ff6b6b","#9ef01a","#f4a261"];
  const COOLDOWN_MS = 30000;
  let vibe = "hype", pb = null, msgs = [];

  // ---------- static bits ----------
  $("today").textContent = new Date().toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  const dBtn = $("discordBtn");
  if (CFG.DISCORD_INVITE) dBtn.href = CFG.DISCORD_INVITE; else dBtn.style.display = "none";
  try { const s = localStorage.getItem("ginge_from"); if (s) $("from").value = s; } catch (e) {}

  // confetti
  const cf = $("confetti"), cc = ["#ff7a1a","#9146ff","#00f593","#ffd23f","#ff4f9a"];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement("i");
    p.style.left = Math.random() * 100 + "%";
    p.style.background = cc[i % cc.length];
    p.style.animationDuration = (4 + Math.random() * 5) + "s";
    p.style.animationDelay = (-Math.random() * 8) + "s";
    cf.appendChild(p);
  }

  // !wheel
  const WHEEL = [
    "Drink a cuppa on stream, no milk. Absolute scandal.",
    "Play one round with the in-game music at max volume and sing along.",
    "Next Marvel Rivals match: chat picks your hero.",
    "Do the whole next race in cockpit cam with no ABS.",
    "Say 'water' in an American accent every time you die.",
    "Thank every single person who wished you happy birthday by name.",
    "Return one (1) historical artefact. Any will do.",
    "Let chat pick the next !addsong, no skips.",
    "Wear a party hat for the rest of the stream.",
    "Eat a piece of cake between every match."
  ];
  let rot = 0;
  $("spin").addEventListener("click", () => {
    rot += 720 + Math.floor(Math.random() * 360);
    $("wheelIcon").style.transform = `rotate(${rot}deg)`;
    $("spin").disabled = true;
    setTimeout(() => {
      $("wheelRes").innerHTML = "<b>Wheel says:</b> ";
      $("wheelRes").appendChild(document.createTextNode(WHEEL[Math.floor(Math.random() * WHEEL.length)]));
      $("spin").disabled = false;
    }, 1200);
  });

  $("chips").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    vibe = b.dataset.v;
    document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b));
  });

  // ---------- helpers ----------
  function setStatus(t, cls) { const s = $("status"); s.textContent = t; s.className = "note" + (cls ? " " + cls : ""); }
  function colorFor(n) { let h = 0; for (const ch of String(n)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return COLORS[h % COLORS.length]; }
  function discordFormat(m) {
    return `${ICON[m.vibe] || "🎉"} **${m.name}** → @KMB\n> ${String(m.message).replace(/\n/g, "\n> ")}\n🎂 Happy birthday Ginge!`;
  }
  async function copyText(t, btn) {
    try {
      await navigator.clipboard.writeText(t);
      if (btn) { const o = btn.textContent; btn.textContent = "Copied ✓"; setTimeout(() => btn.textContent = o, 1500); }
      return true;
    } catch (e) { setStatus("Couldn't copy. Select the text and copy it manually.", "err"); return false; }
  }

  // ---------- render ----------
  function render() {
    const log = $("log");
    $("count").textContent = msgs.length + (msgs.length === 1 ? " message" : " messages");
    $("viewers").textContent = msgs.length ? `${msgs.length} mate${msgs.length === 1 ? "" : "s"} in chat` : "1 birthday boy";
    if (!msgs.length) { log.innerHTML = '<div class="empty">Chat\'s quiet… be the first to wish KMB a happy birthday.</div>'; return; }
    const atBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 60;
    log.innerHTML = "";
    msgs.forEach(m => {
      const v = LABEL[m.vibe] ? m.vibe : "hype";
      const el = document.createElement("div"); el.className = "line"; el.dataset.v = v;
      const badge = document.createElement("span"); badge.className = "badge"; badge.textContent = ICON[v]; badge.title = LABEL[v];
      const name = document.createElement("span"); name.className = "name"; name.textContent = String(m.name || "Anonymous").slice(0, 30); name.style.color = colorFor(m.name);
      const txt = document.createTextNode(": " + String(m.message || "").slice(0, 5000));
      const t = document.createElement("span"); t.className = "t";
      t.textContent = m.created_at ? new Date(m.created_at).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
      const cp = document.createElement("button"); cp.type = "button"; cp.className = "cp"; cp.textContent = "Copy";
      cp.addEventListener("click", () => copyText(discordFormat(m), cp));
      el.append(badge, name, txt, t, cp);
      log.appendChild(el);
    });
    if (atBottom || msgs.length < 8) log.scrollTop = log.scrollHeight;
  }

  // ---------- copy / send ----------
  $("copyBtn").addEventListener("click", ev => {
    const name = $("from").value.trim(), message = $("text").value.trim();
    if (!message) { setStatus("Type your message first.", "err"); return; }
    copyText(discordFormat({ name: name || "Anonymous", message, vibe }), ev.currentTarget)
      .then(ok => ok && setStatus("Copied. Paste it in Discord 🎉", "ok"));
  });
  $("text").addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("form").requestSubmit(); }
  });

  $("form").addEventListener("submit", async e => {
    e.preventDefault();
    if (!pb) return;
    const name = $("from").value.trim(), message = $("text").value.trim();
    if (!name || !message) { setStatus("Need a name and a message.", "err"); return; }
    let last = 0; try { last = +localStorage.getItem("ginge_last") || 0; } catch (e) {}
    const wait = COOLDOWN_MS - (Date.now() - last);
    if (wait > 0) { setStatus(`Slow mode: wait ${Math.ceil(wait / 1000)}s.`, "err"); return; }
    try { localStorage.setItem("ginge_from", name); } catch (e) {}
    $("sendBtn").disabled = true; setStatus("Sending…");
    let data = null;
    try { data = toMsg(await pb.collection("messages").create({ name, message, vibe })); }
    catch (err) {
      $("sendBtn").disabled = false;
      const slow = err && err.status === 429;
      setStatus(slow ? "Slow mode: too many messages, wait a minute." : "Couldn't send. Try again, or use Copy for Discord.", "err");
      console.error(err); return;
    }
    $("sendBtn").disabled = false;
    try { localStorage.setItem("ginge_last", String(Date.now())); } catch (e) {}
    $("text").value = "";
    add(data);
    $("log").scrollTop = $("log").scrollHeight;
    setStatus("Sent! 🎉", "ok");
  });

  // ---------- pocketbase ----------
  // PocketBase records use "created"; the renderer expects "created_at".
  function toMsg(r) { return { id: r.id, name: r.name, message: r.message, vibe: r.vibe, created_at: r.created }; }
  function add(m) { if (m && !msgs.some(x => x.id === m.id)) { msgs.push(m); render(); } }

  async function connect() {
    if (!CFG.POCKETBASE_URL || !window.PocketBase) {
      setStatus("Chat not connected yet. Use Copy for Discord for now.");
      return;
    }
    pb = new window.PocketBase(CFG.POCKETBASE_URL.replace(/\/+$/, ""));
    pb.autoCancellation(false);
    try {
      const res = await pb.collection("messages").getList(1, 500, { sort: "-created" });
      msgs = res.items.map(toMsg).reverse();
    } catch (err) {
      pb = null;
      setStatus("Couldn't load chat. Copy for Discord still works.", "err"); console.error(err); return;
    }
    render();
    $("sendBtn").disabled = false;
    setStatus("Connected. Say happy birthday 🎂", "ok");

    pb.collection("messages").subscribe("*", e => { if (e.action === "create") add(toMsg(e.record)); })
      .catch(err => console.error("Live updates unavailable:", err));
  }
  connect();
})();
