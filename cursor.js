(function () {
  if (window.__slaCursor || !window.matchMedia || !matchMedia('(pointer:fine)').matches) return;
  window.__slaCursor = true;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var st = document.createElement('style');
  st.textContent = 'html.sla-cursor,html.sla-cursor *{cursor:none!important}';
  document.head.appendChild(st);
  function start() {
    var mk = function (css) { var d = document.createElement('div'); d.setAttribute('aria-hidden', 'true'); d.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:2147483000;border-radius:50%;opacity:0;will-change:transform;transition:opacity .2s,width .25s cubic-bezier(.2,.8,.2,1),height .25s cubic-bezier(.2,.8,.2,1),margin .25s cubic-bezier(.2,.8,.2,1),background .25s;' + css; document.body.appendChild(d); return d; };
    var dot = mk('width:8px;height:8px;margin:-4px 0 0 -4px;background:#F2552C;');
    var ring = mk('width:34px;height:34px;margin:-17px 0 0 -17px;border:1.5px solid #F2552C;background:transparent;');
    document.documentElement.classList.add('sla-cursor');
    var x = -100, y = -100, rx = -100, ry = -100, hot = false, down = false, shown = false;
    var hotSel = 'a,button,[role="button"],label,select,summary,input,textarea,[onclick],[draggable="true"],[tabindex]:not([tabindex="-1"])';
    function size() { var s = down ? 24 : hot ? 52 : 34; ring.style.width = ring.style.height = s + 'px'; ring.style.margin = (-s / 2) + 'px 0 0 ' + (-s / 2) + 'px'; ring.style.background = hot ? 'rgba(242,85,44,0.12)' : 'transparent'; dot.style.opacity = hot ? '0' : '1'; }
    addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; rx = x; ry = y; ring.style.opacity = '1'; dot.style.opacity = hot ? '0' : '1'; }
      var t = e.target, h = !!(t && t.closest && t.closest(hotSel));
      if (h !== hot) { hot = h; size(); }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { shown = false; dot.style.opacity = '0'; ring.style.opacity = '0'; });
    addEventListener('mousedown', function () { down = true; size(); });
    addEventListener('mouseup', function () { down = false; size(); });
    var k = reduce ? 1 : 0.2;
    (function loop() { requestAnimationFrame(loop); rx += (x - rx) * k; ry += (y - ry) * k; dot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)'; ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)'; })();
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
