(function () {
  if (window.__preloaderBooted) return; window.__preloaderBooted = true;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var SITE_BG = '#F3EEE4';
  var fonts = document.createElement('link');
  fonts.rel = 'stylesheet';
  fonts.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=DM+Mono:wght@500&display=swap';
  document.head.appendChild(fonts);
  var css = document.createElement('style');
  css.textContent =
    "html.pl-lock, html.pl-lock body { overflow: hidden; }" +
    "#preloader { position: fixed; inset: 0; z-index: 9999; overflow: hidden; background: #EFE3D0; }" +
    "#preloader .pl-level { position: absolute; inset: 0; will-change: transform; }" +
    "#preloader .pl-l0 { background: #EFE3D0; }" +
    "#preloader .pl-l1 { background: #A64B2E; box-shadow: 0 0 0 400vmax #A64B2E; }" +
    "#preloader .pl-l2 { background: #3A2A20; box-shadow: 0 0 0 400vmax #3A2A20; }" +
    "#preloader .pl-l3 { background: " + SITE_BG + "; box-shadow: 0 0 0 400vmax " + SITE_BG + "; }" +
    "#preloader .pl-row { position: absolute; left: 0; right: 20.8vw; top: 35vh; display: flex; justify-content: flex-end; align-items: baseline; font: 700 min(17.7vw, 28vh)/1 'Fredoka', sans-serif; letter-spacing: -0.02em; }" +
    "#preloader .pl-word { display: flex; align-items: baseline; }" +
    "#preloader .pl-word span { display: inline-block; opacity: 0; }" +
    "#preloader .pl-dot { display: inline-block; width: 0.19em; height: 0.19em; margin-left: 0.03em; }" +
    "#preloader .pl-l0 .pl-row { color: #A64B2E; }" +
    "#preloader .pl-l1 .pl-row { color: #F3E8D8; }" +
    "#preloader .pl-l2 .pl-row { color: #DDBF97; }" +
    "#preloader .pl-hud { position: absolute; inset: 0; padding: clamp(20px, 3.4vw, 40px); box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; pointer-events: none; color: #3A2A20; }" +
    "#preloader .pl-meta { display: flex; justify-content: space-between; font: 500 12px/1 'DM Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; }" +
    "#preloader .pl-foot { display: flex; justify-content: space-between; align-items: flex-end; }" +
    "#preloader .pl-count { display: flex; align-items: baseline; gap: 4px; font: 600 clamp(48px, 7.5vw, 72px)/0.8 'Fredoka', sans-serif; font-variant-numeric: tabular-nums; }" +
    "#preloader .pl-count small { font-size: 0.4em; }";
  document.head.appendChild(css);

  var root = document.createElement('div');
  root.id = 'preloader';
  root.setAttribute('aria-hidden', 'true');
  var word = function (s) { return s.split('').map(function (c) { return '<span>' + c + '</span>'; }).join(''); };
  root.innerHTML =
    '<div class="pl-level pl-l0"><div class="pl-row"><div class="pl-word">' + word('Sarbesh') + '</div><span class="pl-dot"></span></div></div>' +
    '<div class="pl-level pl-l1"><div class="pl-row"><div class="pl-word">' + word('Lal') + '</div><span class="pl-dot"></span></div></div>' +
    '<div class="pl-level pl-l2"><div class="pl-row"><div class="pl-word">' + word('Amatya') + '</div><span class="pl-dot"></span></div></div>' +
    '<div class="pl-level pl-l3"></div>' +
    '<div class="pl-hud"><div class="pl-meta"><span>UI/UX Designer</span><span>Portfolio · 2026</span></div>' +
    '<div class="pl-foot"><div class="pl-count"><span class="pl-num">000</span><small>%</small></div><div class="pl-meta"><span class="pl-lvl">01 / 03</span></div></div></div>';
  (document.body || document.documentElement).appendChild(root);
  document.documentElement.classList.add('pl-lock');
  window.__preloaderActive = true;

  var D = 3.5, ROT = 22;
  var levels = root.querySelectorAll('.pl-level');
  var words = root.querySelectorAll('.pl-word');
  var dot = root.querySelector('.pl-l0 .pl-dot');
  var hud = root.querySelector('.pl-hud'), num = root.querySelector('.pl-num'), lvl = root.querySelector('.pl-lvl');
  var G = null, loaded = document.readyState === 'complete', clock = 0, last = null;
  window.addEventListener('load', function () { loaded = true; });
  setTimeout(function () { loaded = true; }, 8000);

  var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
  var seg = function (t, a, b) { return clamp((t - a) / (b - a)); };
  var outBack = function (x) { var c1 = 1.9, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  var inOut = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

  function measure() {
    var R = root.getBoundingClientRect(), b = dot.getBoundingClientRect();
    var w = R.width, h = R.height, r = Math.max(1, b.width / 2), cx = b.left - R.left + r, cy = b.top - R.top + r;
    var dist = Math.max(Math.hypot(cx, cy), Math.hypot(w - cx, cy), Math.hypot(cx, h - cy), Math.hypot(w - cx, h - cy));
    G = { cx: cx, cy: cy, r: r, Z: (dist / r) * 1.04 };
    levels.forEach(function (L) { L.style.transformOrigin = cx + 'px ' + cy + 'px'; });
  }

  function frame(t) {
    var p;
    if (t >= D) p = 3;
    else if (t < 0.95) p = 0;
    else if (t < 1.45) p = inOut(seg(t, 0.95, 1.45));
    else if (t < 1.95) p = 1;
    else if (t < 2.45) p = 1 + inOut(seg(t, 1.95, 2.45));
    else if (t < 2.85) p = 2;
    else p = 2 + inOut(seg(t, 2.85, D));
    var pops = [1, outBack(seg(t, 0.45, 0.75)), outBack(seg(t, 1.5, 1.8)), outBack(seg(t, 2.5, 2.75))];
    var starts = [0.05, 1.15, 2.15];
    levels.forEach(function (L, i) {
      var rel = p - i, vis = rel < 1.05 && rel > -1.5;
      L.style.visibility = vis ? 'visible' : 'hidden';
      if (!vis) return;
      L.style.transform = 'scale(' + Math.pow(G.Z, rel) + ') rotate(' + (ROT * rel) + 'deg)';
      if (i > 0) L.style.clipPath = 'circle(' + Math.max(0, G.r * G.Z * pops[i]) + 'px at ' + G.cx + 'px ' + G.cy + 'px)';
      if (i < 3) {
        var a = starts[i], amp = seg(t, a + 0.55, a + 0.8);
        Array.prototype.forEach.call(words[i].children, function (c, j) {
          var s = seg(t, a + j * 0.05, a + 0.5 + j * 0.05), e = outBack(s);
          c.style.transform = 'translateY(' + (1 - e) * 80 + '%) translateY(' + Math.sin(t * 7 - j * 0.8) * 6 * amp + 'px) rotate(' + (1 - e) * -10 + 'deg)';
          c.style.opacity = Math.min(1, s * 4);
        });
      }
    });
    hud.style.color = p < 0.5 ? '#3A2A20' : p < 1.5 ? '#F3E8D8' : '#EFE3D0';
    hud.style.opacity = 1 - seg(t, 2.8, 3.0);
    num.textContent = String(Math.round(100 * seg(t, 0.1, 2.8))).padStart(3, '0');
    lvl.textContent = '0' + (Math.min(2, Math.round(p)) + 1) + ' / 03';
  }

  function finish() {
    root.remove();
    document.documentElement.classList.remove('pl-lock');
    window.__preloaderActive = false;
    window.dispatchEvent(new Event('preloader:done'));
  }
  function tick(now) {
    if (last !== null) {
      var dt = Math.min(0.1, (now - last) / 1000);
      if (!(clock >= 2.6 && !loaded)) clock += dt;
    }
    last = now;
    frame(Math.min(clock, D));
    if (clock < D) return requestAnimationFrame(tick);
    finish();
  }
  function start() {
    measure(); frame(0);
    if (document.visibilityState === 'hidden') { finish(); return; }
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', function () { if (root.isConnected) measure(); });
  var fontsReady = document.fonts && document.fonts.load ? Promise.all([document.fonts.load("700 100px 'Fredoka'"), document.fonts.load("500 12px 'DM Mono'")]) : Promise.resolve();
  Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 1500); })]).then(start, start);
})();
