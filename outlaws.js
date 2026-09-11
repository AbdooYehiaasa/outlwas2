/* THE OUTLAWS — shared runtime: chrome styles, motion system, navigation.
   Loaded from <helmet> on every page (synchronous, so the stylesheet is in
   place before any body markup paints). One source of truth for the header,
   footer, background field, scroll reveal, cursor FX and page transitions. */
(function () {
  if (window.OutlawsFX) return;

  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── stylesheet ─────────────────────────────────────────────────── */
  var CSS = [
    'html,body{margin:0;padding:0;background:#08060a}',
    "body{font-family:'Space Grotesk',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}",
    '*{box-sizing:border-box}',
    'a{color:#FF6A00;text-decoration:none}a:hover{color:#FF9040}',
    '::selection{background:#FF6A00;color:#0a0709}',
    '::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-track{background:#0b0810}',
    '::-webkit-scrollbar-thumb{background:#2a1f2b;border-radius:99px}::-webkit-scrollbar-thumb:hover{background:#FF6A00}',
    'input,textarea,select,button{font-family:inherit}',

    /* keyframes */
    '@keyframes vx-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.82)}}',
    '@keyframes vx-rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}',
    '@keyframes vx-sweep{from{transform:translateX(-120%)}to{transform:translateX(320%)}}',
    '@keyframes vx-orbit{from{transform:rotate(0)}to{transform:rotate(360deg)}}',
    '@keyframes vx-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}',
    '@keyframes vx-word{0%{opacity:0;transform:translateY(34px) scale(.9);filter:blur(12px)}55%{opacity:.85;transform:translateY(8px) scale(.98);filter:blur(2px)}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}',
    '@keyframes vx-draw{0%{stroke-dashoffset:1200;opacity:0}45%{opacity:.5}100%{stroke-dashoffset:0;opacity:.22}}',
    '@keyframes vx-dotglow{0%,100%{opacity:.12;transform:scale(1)}50%{opacity:.55;transform:scale(1.45)}}',
    '@keyframes vx-float{0%,100%{transform:translate3d(0,0,0);opacity:.18}25%{transform:translate3d(6px,-14px,0);opacity:.7}50%{transform:translate3d(-4px,-7px,0);opacity:.35}75%{transform:translate3d(9px,-19px,0);opacity:.85}}',
    '@keyframes vx-ripple{0%{transform:translate(-50%,-50%) scale(.2);opacity:.85}100%{transform:translate(-50%,-50%) scale(11);opacity:0}}',
    '@keyframes vx-scan{0%{transform:translateY(-110%);opacity:0}12%{opacity:1}88%{opacity:1}100%{transform:translateY(560%);opacity:0}}',
    '@keyframes vx-tickin{from{opacity:0;transform:translateY(-58%) scale(.92);filter:blur(5px)}to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}',
    '@keyframes vx-node{0%,100%{box-shadow:0 0 0 0 rgba(255,106,0,.55)}50%{box-shadow:0 0 0 9px rgba(255,106,0,0)}}',
    '@keyframes vx-seal{0%{transform:scale(.4) rotate(-12deg);opacity:0}60%{transform:scale(1.08) rotate(2deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}',
    '@keyframes vx-urgent{0%,100%{color:#FF6A00;text-shadow:0 0 0 rgba(255,60,0,0)}50%{color:#FF8A33;text-shadow:0 0 22px rgba(255,60,0,.75)}}',
    '@keyframes vx-shimmer{from{transform:translateX(-100%)}to{transform:translateX(100%)}}',
    '@keyframes ol-enter{from{opacity:0;transform:translateY(14px);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}',

    /* motion utilities */
    '.vx-rise{animation:vx-rise .7s cubic-bezier(.2,.8,.2,1) both}',
    '.vx-word{display:inline-block;animation:vx-word .95s cubic-bezier(.16,1,.3,1) both;transition:color .3s,transform .3s,text-shadow .3s}',
    '.vx-word:hover{transform:translateY(-4px);text-shadow:0 0 28px rgba(255,106,0,.6)}',
    '.vx-line{stroke:#FF6A00;stroke-width:.6;opacity:0;stroke-dasharray:6 7;stroke-dashoffset:1200;animation:vx-draw 2.6s cubic-bezier(.16,1,.3,1) forwards}',
    '.vx-dot{fill:#FF8A33;opacity:0;transform-box:fill-box;transform-origin:center;animation:vx-dotglow 3.4s ease-in-out infinite}',
    '.vx-mote{position:absolute;width:2px;height:2px;border-radius:99px;background:#FF8A33;box-shadow:0 0 8px rgba(255,106,0,.9);animation:vx-float 9s ease-in-out infinite}',
    '.vx-ripple{position:fixed;width:46px;height:46px;border-radius:99px;border:1px solid rgba(255,106,0,.75);pointer-events:none;z-index:9999;animation:vx-ripple .95s cubic-bezier(.16,1,.3,1) forwards}',
    '.vx-tick{animation:vx-tickin .45s cubic-bezier(.16,1,.3,1)}',
    '.vx-urgent{animation:vx-urgent 1.6s ease-in-out infinite}',
    '.vx-seal{animation:vx-seal .7s cubic-bezier(.16,1,.3,1) both}',
    '.vx-node{animation:vx-node 1.8s ease-in-out infinite}',
    '.vx-scanner{position:absolute;left:0;right:0;height:38%;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(255,106,0,.16),transparent);animation:vx-scan 1.5s linear infinite}',
    '.vx-skel{position:relative;overflow:hidden;background:rgba(255,255,255,.03)}',
    ".vx-skel::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);animation:vx-shimmer 1.3s linear infinite}",

    /* scroll reveal — default VISIBLE; JS arms then reveals */
    '.vx-reveal{transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1),filter 1s cubic-bezier(.16,1,.3,1)}',
    '.vx-stagger>*{transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1),filter .85s cubic-bezier(.16,1,.3,1)}',
    '.vx-armed.vx-reveal{opacity:0;transform:translateY(38px);filter:blur(7px)}',
    '.vx-armed.vx-reveal.vx-in{opacity:1;transform:translateY(0);filter:blur(0)}',
    '.vx-armed.vx-stagger>*{opacity:0;transform:translateY(30px) scale(.985);filter:blur(6px)}',
    '.vx-armed.vx-stagger.vx-in>*{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}',
    '.vx-stagger>*:nth-child(1){transition-delay:0s}.vx-stagger>*:nth-child(2){transition-delay:.07s}',
    '.vx-stagger>*:nth-child(3){transition-delay:.14s}.vx-stagger>*:nth-child(4){transition-delay:.21s}',
    '.vx-stagger>*:nth-child(5){transition-delay:.28s}.vx-stagger>*:nth-child(6){transition-delay:.35s}',
    '.vx-stagger>*:nth-child(7){transition-delay:.42s}.vx-stagger>*:nth-child(8){transition-delay:.49s}',

    '.vx-spot{position:relative}',
    ".vx-spot::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .35s;background:radial-gradient(340px circle at var(--mx,50%) var(--my,50%),rgba(255,106,0,.14),transparent 62%)}",
    '.vx-spot:hover::after{opacity:1}',

    /* page transition */
    '[data-page]>*:not(header):not(svg):not([aria-hidden="true"]){animation:ol-enter .42s cubic-bezier(.16,1,.3,1) both}',
    'html[data-leaving] [data-page]>*:not(header):not(svg):not([aria-hidden="true"]){opacity:0;transform:translateY(-8px);filter:blur(3px);transition:opacity .16s,transform .16s,filter .16s}',
    'html[data-leaving] .ol-hd{opacity:.72;transition:opacity .16s}',

    /* ── chrome: header ── */
    '.ol-hd{position:sticky;top:0;z-index:40;backdrop-filter:blur(18px);background:rgba(8,6,10,.78);border-bottom:1px solid rgba(255,255,255,.07)}',
    '.ol-hd-in{max-width:1400px;margin:0 auto;padding:0 28px;height:72px;display:flex;align-items:center;gap:22px}',
    '.ol-hairline{height:1px;background:linear-gradient(90deg,transparent,rgba(255,106,0,.55) 18%,rgba(255,106,0,.85) 50%,rgba(255,106,0,.55) 82%,transparent);opacity:.5}',
    '.ol-brand{display:flex;align-items:center;gap:11px;flex:none}',
    '.ol-diamond{width:30px;height:30px;display:grid;place-items:center;border:1.5px solid #FF6A00;transform:rotate(45deg);box-shadow:0 0 22px rgba(255,106,0,.45)}',
    '.ol-diamond i{width:8px;height:8px;background:#FF6A00;box-shadow:0 0 10px #FF6A00;display:block}',
    '.ol-mark{display:flex;flex-direction:column;line-height:1}',
    ".ol-mark b{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:11px;letter-spacing:.42em;color:#6E646C}",
    ".ol-mark s{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:19px;letter-spacing:.13em;color:#F4EDE6;margin-top:3px;text-decoration:none}",
    '.ol-nav{display:flex;align-items:center;gap:4px;flex:1}',
    '.ol-nav a{padding:9px 15px;font-size:14.5px;font-weight:500;color:#8C8189;border-radius:8px;white-space:nowrap;transition:color .22s,background .22s}',
    '.ol-nav a:hover{color:#F4EDE6;background:rgba(255,255,255,.05)}',
    '.ol-nav a.on{color:#F4EDE6;background:rgba(255,106,0,.1)}',
    '.ol-burger{display:none;width:40px;height:40px;place-items:center;background:transparent;border:1px solid rgba(255,255,255,.09);border-radius:9px;color:#C6BBC1;font-size:15px;cursor:pointer;margin-right:auto;transition:border-color .22s,color .22s}',
    '.ol-burger:hover{border-color:rgba(255,106,0,.45);color:#FF6A00}',
    '.ol-srch{display:flex;align-items:center;gap:10px;padding:9px 14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.09);border-radius:9px;color:#6E646C;font-size:13.5px;cursor:pointer;min-width:220px;flex:none;transition:border-color .22s,color .22s}',
    '.ol-srch:hover{border-color:rgba(255,106,0,.45);color:#A79BA3}',
    '.ol-srch em{flex:1;text-align:left;font-style:normal;white-space:nowrap}',
    ".ol-srch kbd{font-family:'JetBrains Mono',monospace;font-size:10.5px;padding:2px 6px;border:1px solid rgba(255,255,255,.13);border-radius:5px;letter-spacing:.06em}",
    '.ol-bell{position:relative;width:38px;height:38px;display:grid;place-items:center;background:transparent;border:1px solid rgba(255,255,255,.09);border-radius:9px;color:#A79BA3;cursor:pointer;font-size:15px;transition:border-color .22s,color .22s}',
    '.ol-bell:hover{border-color:rgba(255,106,0,.45);color:#F4EDE6}',
    '.ol-bell i{position:absolute;top:-3px;right:-3px;width:8px;height:8px;border-radius:99px;background:#FF6A00;box-shadow:0 0 9px #FF6A00}',
    '.ol-sub{padding:10px 17px;font-size:13.5px;font-weight:600;color:#08060a;background:linear-gradient(180deg,#FFA047,#FF6A00);border-radius:9px;white-space:nowrap;box-shadow:0 6px 24px rgba(255,106,0,.32);transition:transform .2s,box-shadow .2s}',
    '.ol-sub:hover{transform:translateY(-1px);box-shadow:0 10px 30px rgba(255,106,0,.5);color:#08060a}',
    '.ol-user{display:flex;align-items:center;gap:9px;padding:5px 11px 5px 5px;border:1px solid rgba(255,255,255,.09);border-radius:99px;transition:border-color .22s}',
    '.ol-user:hover{border-color:rgba(255,106,0,.4)}',
    ".ol-user i{width:28px;height:28px;border-radius:99px;background:linear-gradient(135deg,#FF6A00,#7a2a00);display:grid;place-items:center;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:#08060a;font-style:normal}",
    ".ol-user s{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:#C6BBC1;text-decoration:none}",

    /* ── chrome: footer ── */
    '.ol-ft{position:relative;z-index:1;margin-top:84px;border-top:1px solid rgba(255,255,255,.07)}',
    '.ol-ft-grid{max-width:1400px;margin:0 auto;padding:48px 28px 24px;display:grid;grid-template-columns:minmax(0,1.5fr) repeat(3,minmax(0,1fr));gap:36px}',
    ".ol-ft-t{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.16em;color:#4E454C;margin-bottom:16px}",
    '.ol-ft-col{display:flex;flex-direction:column;gap:11px}',
    '.ol-ft-col a{font-size:13.5px;color:#8C8189;transition:color .2s}.ol-ft-col a:hover{color:#FF6A00}',
    '.ol-ft-bot{max-width:1400px;margin:0 auto;padding:20px 28px 32px;border-top:1px solid rgba(255,255,255,.05);display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between}',
    ".ol-ft-bot span{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#4E454C;letter-spacing:.05em}",

    /* ── responsive ── */
    '@media(max-width:1120px){.ol-nav,.vx-nav{display:none!important}.ol-burger{display:grid}.ol-hd-in{gap:14px}.ol-brand,header .vx-shell>a:first-child{margin-right:auto}.ol-srch,.vx-search{min-width:0!important;width:40px;justify-content:center;padding:9px 0!important}.ol-srch em,.ol-srch kbd,.vx-search-label,.vx-search-kbd{display:none!important}}',
    '@media(max-width:820px){.ol-user,.vx-chip{display:none!important}.ol-hd-in,.ol-ft-grid,.ol-ft-bot{padding-left:16px;padding-right:16px}.ol-shell,.vx-shell{padding-left:16px!important;padding-right:16px!important}}',
    '@media(max-width:620px){.ol-hd-in{gap:10px}}',
    '@media(max-width:620px){.ol-sub{display:none}.ol-mark b{display:none}.ol-ft-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    /* ── decorative field + mobile drawer ── */
    '.ol-field{position:fixed;inset:0;pointer-events:none;z-index:0}',
    '.ol-grid{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.32;background-image:linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);background-size:76px 76px;-webkit-mask-image:radial-gradient(1000px 700px at 50% 0%,#000 20%,transparent 78%);mask-image:radial-gradient(1000px 700px at 50% 0%,#000 20%,transparent 78%)}',
    '#vx-aura{position:fixed;inset:0;pointer-events:none;z-index:0;will-change:transform;background:radial-gradient(1100px 620px at 74% -8%,rgba(255,106,0,.15),transparent 65%),radial-gradient(740px 520px at 2% 16%,rgba(255,60,0,.06),transparent 70%)}',
    '#vx-halo{position:fixed;top:0;left:0;width:520px;height:520px;border-radius:99px;pointer-events:none;z-index:1;opacity:0;filter:blur(58px);will-change:transform,opacity;transition:opacity .5s;background:radial-gradient(circle,rgba(255,106,0,.13),rgba(255,60,0,.05) 45%,transparent 70%)}',
    '.ol-prog{position:fixed;top:0;left:0;right:0;height:2px;z-index:60;pointer-events:none}',
    '#vx-progress{display:block;height:100%;width:100%;transform:scaleX(0);transform-origin:left;background:linear-gradient(90deg,#FF3C00,#FFA047,#00D6B4);box-shadow:0 0 14px rgba(255,106,0,.7)}',
    '.ol-drawer{position:fixed;inset:0;z-index:70;display:none;background:rgba(4,3,5,.74);backdrop-filter:blur(7px)}',
    '.ol-drawer[data-open]{display:block}',
    '.ol-drawer-p{position:absolute;top:0;left:0;bottom:0;width:min(88vw,330px);background:#0b080d;border-right:1px solid rgba(255,255,255,.09);display:flex;flex-direction:column;overflow-y:auto;animation:ol-slide .34s cubic-bezier(.16,1,.3,1) both;box-shadow:34px 0 90px rgba(0,0,0,.6)}',
    '@keyframes ol-slide{from{transform:translateX(-100%)}to{transform:translateX(0)}}',
    '.ol-drawer-top{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:18px 18px 16px;border-bottom:1px solid rgba(255,255,255,.07)}',
    '.ol-drawer-body{padding:6px 14px 22px;display:flex;flex-direction:column}',
    ".ol-drawer-p a{display:flex;align-items:center;gap:12px;padding:13px 13px;font-size:15.5px;font-weight:600;color:#C6BBC1;border-radius:10px;transition:color .2s,background .2s}",
    '.ol-drawer-p a:hover{color:#FF6A00;background:rgba(255,106,0,.07)}',
    '.ol-drawer-p a[data-on]{color:#F4EDE6;background:rgba(255,106,0,.1)}',
    ".ol-drawer-p a i{width:5px;height:5px;border-radius:99px;background:#3E353C;flex:none}",
    '.ol-drawer-p a[data-on] i,.ol-drawer-p a:hover i{background:#FF6A00;box-shadow:0 0 8px #FF6A00}',
    ".ol-drawer-p .t{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.18em;color:#4E454C;margin:16px 15px 8px}",
    '.ol-drawer-p .t:first-child{margin-top:10px}',
    '.ol-drawer-cta{margin:14px 14px 0;padding:14px;text-align:center;font-size:14.5px;font-weight:700;color:#08060a;background:linear-gradient(180deg,#FFA047,#FF6A00);border-radius:11px}',
    '.ol-drawer-cta:hover{color:#08060a}',
    '.ol-drawer-x{width:38px;height:38px;flex:none;display:grid;place-items:center;background:transparent;border:1px solid rgba(255,255,255,.12);border-radius:9px;color:#C6BBC1;font-size:15px;cursor:pointer}',
    '.ol-drawer-x:hover{border-color:#FF6A00;color:#FF6A00}',

    /* burger sits hard left, before the wordmark */
    '.ol-burger{order:-1;margin-right:0!important}',

    '@media(prefers-reduced-motion:reduce){.vx-word,.vx-line,.vx-mote,.vx-rise,.vx-scanner,.vx-urgent,.vx-node,.vx-skel::after,[data-page]>*{animation:none!important;opacity:1!important}.vx-reveal,.vx-stagger>*{opacity:1!important;transform:none!important;filter:none!important}}'
  ].join('');

  var st = document.createElement('style');
  st.id = 'outlaws-runtime';
  st.textContent = CSS;
  (document.head || document.documentElement).appendChild(st);

  /* ── behaviour ──────────────────────────────────────────────────── */
  var started = false;
  var pt = { x: 0, y: 0, tx: 0, ty: 0, on: false };
  var raf = null, idleTimer = null, sweepQueued = false, mo = null;

  function node(id) { var n = document.getElementById(id); return n && n.isConnected ? n : null; }

  function sweep() {
    var vh = window.innerHeight || 800;
    var list = document.querySelectorAll('.vx-reveal, .vx-stagger');
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (el.classList.contains('vx-in')) continue;
      if (!el.classList.contains('vx-armed')) {
        if (RM) { el.classList.add('vx-in'); continue; }
        el.classList.add('vx-armed');
        continue;
      }
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('vx-in');
    }
  }
  function queueSweep() {
    if (sweepQueued) return;
    sweepQueued = true;
    requestAnimationFrame(function () { sweepQueued = false; sweep(); });
  }

  function loop() {
    pt.x += (pt.tx - pt.x) * 0.13;
    pt.y += (pt.ty - pt.y) * 0.13;
    var h = node('vx-halo');
    if (h) {
      h.style.transform = 'translate3d(' + (pt.x - 260) + 'px,' + (pt.y - 260) + 'px,0)';
      if (pt.on) h.style.opacity = '1';
    }
    if (Math.abs(pt.tx - pt.x) < 0.4 && Math.abs(pt.ty - pt.y) < 0.4) { raf = null; return; }
    raf = requestAnimationFrame(loop);
  }
  function kick() { if (raf === null && !document.hidden) raf = requestAnimationFrame(loop); }

  function onMove(e) {
    pt.tx = e.clientX; pt.ty = e.clientY; pt.on = true;
    kick();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }, 900);
    var card = e.target.closest && e.target.closest('.vx-spot');
    if (card) {
      var b = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - b.left) + 'px');
      card.style.setProperty('--my', (e.clientY - b.top) + 'px');
    }
  }
  function onLeave() { pt.on = false; var h = node('vx-halo'); if (h) h.style.opacity = '0'; }

  function onClick(e) {
    var r = document.createElement('span');
    r.className = 'vx-ripple';
    r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(function () { r.remove(); }, 1000);
  }

  function onScroll() {
    var doc = document.documentElement;
    var top = doc.scrollTop || document.body.scrollTop || 0;
    var max = doc.scrollHeight - doc.clientHeight;
    var bar = node('vx-progress');
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, top / max) : 0) + ')';
    var aura = node('vx-aura');
    if (aura && !RM) aura.style.transform = 'translate3d(0,' + (top * -0.07) + 'px,0)';
    queueSweep();
  }

  function internal(a) {
    if (!a || !a.getAttribute) return false;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || a.target === '_blank') return false;
    return /\.dc\.html($|[?#])/.test(href) || /(^|\/)index\.html($|[?#])/.test(href);
  }
  function onNavClick(e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var a = e.target.closest && e.target.closest('a');
    if (!internal(a)) return;
    e.preventDefault();
    var href = a.getAttribute('href');
    if (RM) { location.href = href; return; }
    document.documentElement.setAttribute('data-leaving', '');
    setTimeout(function () { location.href = href; }, 170);
  }
  var prefetched = {};
  function onHover(e) {
    var a = e.target.closest && e.target.closest('a');
    if (!internal(a)) return;
    var href = a.getAttribute('href');
    if (prefetched[href]) return;
    prefetched[href] = 1;
    var l = document.createElement('link');
    l.rel = 'prefetch'; l.href = href;
    document.head.appendChild(l);
  }

  /* decorative background field — injected once, never authored per page */
  var NAV = [
    ['BROWSE', [['Home', 'index.html'], ['Discover', 'discover.dc.html'], ['Projects', 'projects.dc.html'], ['Communities', 'communities.dc.html'], ['Calendar', 'calendar.dc.html']]],
    ['YOUR ACTIVITY', [['My Raffles', 'myraffles.dc.html'], ['My Wins', 'wins.dc.html'], ['Profile', 'profile.dc.html']]],
    ['MORE', [['Search', 'search.dc.html'], ['Support', 'support.dc.html'], ['Sign in', 'auth.dc.html']]]
  ];

  function field() {
    if (document.getElementById('vx-aura') || !document.body) return;
    var page = document.querySelector('[data-page]');
    if (!page) return;
    var frag = document.createElement('div');
    var motes = '';
    var pos = [[20, 11, .3], [36, 89, 1.3], [56, 6, 2.2], [70, 93, .8], [84, 28, 3], [13, 61, 3.7]];
    for (var i = 0; i < pos.length; i++) motes += '<span class="vx-mote" style="top:' + pos[i][0] + '%;left:' + pos[i][1] + '%;animation-delay:' + pos[i][2] + 's"></span>';
    frag.innerHTML =
      '<div id="vx-aura" aria-hidden="true"></div>' +
      '<div class="ol-grid" aria-hidden="true"></div>' +
      '<svg class="ol-field" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
        '<line x1="0" y1="24%" x2="100%" y2="24%" class="vx-line" style="animation-delay:.4s"/>' +
        '<line x1="0" y1="78%" x2="100%" y2="78%" class="vx-line" style="animation-delay:.9s"/>' +
        '<line x1="17%" y1="0" x2="17%" y2="100%" class="vx-line" style="animation-delay:1.3s"/>' +
        '<line x1="83%" y1="0" x2="83%" y2="100%" class="vx-line" style="animation-delay:1.7s"/>' +
        '<circle cx="17%" cy="24%" r="2.4" class="vx-dot" style="animation-delay:2.5s"/>' +
        '<circle cx="83%" cy="24%" r="2.4" class="vx-dot" style="animation-delay:2.8s"/>' +
        '<circle cx="17%" cy="78%" r="2.4" class="vx-dot" style="animation-delay:3.1s"/>' +
        '<circle cx="83%" cy="78%" r="2.4" class="vx-dot" style="animation-delay:3.4s"/>' +
      '</svg>' +
      '<div class="ol-field" aria-hidden="true">' + motes + '</div>' +
      '<div id="vx-halo" aria-hidden="true"></div>' +
      '<div class="ol-prog" aria-hidden="true"><span id="vx-progress"></span></div>';
    while (frag.firstChild) document.body.appendChild(frag.firstChild);
  }

  function drawer() {
    var d = document.querySelector('.ol-drawer');
    if (d) return d;
    d = document.createElement('div');
    d.className = 'ol-drawer';
    var here = (location.pathname.split('/').pop() || 'index.html');
    var body = '';
    for (var g = 0; g < NAV.length; g++) {
      body += '<div class="t">' + NAV[g][0] + '</div>';
      var items = NAV[g][1];
      for (var i = 0; i < items.length; i++) {
        var on = items[i][1] === here ? ' data-on=""' : '';
        body += '<a href="' + items[i][1] + '"' + on + '><i></i>' + items[i][0] + '</a>';
      }
    }
    d.innerHTML =
      '<div class="ol-drawer-p">' +
        '<div class="ol-drawer-top">' +
          '<span class="ol-brand"><span class="ol-diamond"><i></i></span><span class="ol-mark"><b>THE</b><s>OUTLAWS</s></span></span>' +
          '<button class="ol-drawer-x" aria-label="Close menu">✕</button>' +
        '</div>' +
        '<div class="ol-drawer-body">' + body + '</div>' +
        '<a class="ol-drawer-cta" href="premium.dc.html">Go Premium</a>' +
        '<div style="padding:16px 20px 22px;font-family:\'JetBrains Mono\',monospace;font-size:9px;line-height:1.7;letter-spacing:.06em;color:#4E454C">NON-CUSTODIAL · NO PRIVATE KEYS STORED</div>' +
      '</div>';
    d.addEventListener('click', function (e) {
      if (e.target === d || (e.target.closest && e.target.closest('.ol-drawer-x'))) d.removeAttribute('data-open');
    });
    document.body.appendChild(d);
    return d;
  }

  window.OutlawsFX = {
    reduced: RM,
    sweep: queueSweep,
    start: function () {
      if (started) { field(); queueSweep(); return; }
      started = true;
      field();

      document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('.ol-burger, .vx-burger');
        if (!b) return;
        e.preventDefault();
        drawer().setAttribute('data-open', '');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        var d = document.querySelector('.ol-drawer[data-open]');
        if (d) d.removeAttribute('data-open');
      });
      if (!RM) {
        document.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('click', onClick);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      document.addEventListener('click', onNavClick);
      document.addEventListener('pointerenter', onHover, true);
      document.addEventListener('visibilitychange', function () {
        if (document.hidden && raf !== null) { cancelAnimationFrame(raf); raf = null; }
      });
      window.addEventListener('pageshow', function () {
        document.documentElement.removeAttribute('data-leaving');
      });
      if (window.MutationObserver) {
        mo = new MutationObserver(queueSweep);
        mo.observe(document.body, { childList: true, subtree: true });
      }
      onScroll();
      queueSweep();
    }
  };
})();
