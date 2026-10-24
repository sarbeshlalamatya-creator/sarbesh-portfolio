/* Previous / next between case studies, in the order of the portfolio's work grid, with a fade between pages. */
(function () {
  var C = [
    ['ticketing.html', 'TicketING'], ['tasq.html', 'TasQ Design System'], ['certify.html', 'Certify'], ['trisara.html', 'Trisara'],
    ['swimming-everyday.html', 'Swimming Everyday'], ['drukair.html', 'Drukair Holidays'], ['hippie-stay.html', 'Hippie Stay'],
    ['aura.html', 'Aura Fashion'], ['itdurbar.html', 'IT Durbar'], ['ing-tech.html', 'ING Tech Design System'], ['clms.html', 'CLMS'],
    ['locomo.html', 'Locomo'], ['attendease.html', 'AttendEase'], ['nmst.html', 'NMST'], ['kavya.html', 'Kavya School'],
    ['herald.html', 'Herald College'], ['iic.html', 'Itahari International College'], ['icp.html', 'Informatics College Pokhara'],
    ['quickr.html', 'Quikr'], ['womens-day.html', "Women's Day"], ['bigmart.html', 'Big Mart'],
    ['yuemi.html', 'YueMi Ecosystem'], ['dayworks.html', 'Dayworks'], ['gyalpo-losar.html', 'Gyalpo Losar'], ['maghe-sankranti.html', 'Maghe Sankranti'], ['medfirst.html', 'MedFirst']
  ];
  var file = location.pathname.split('/').pop();
  var i = -1;
  C.forEach(function (c, k) { if (c[0] === file) i = k; });
  if (i < 0) return;
  var prev = C[(i - 1 + C.length) % C.length], next = C[(i + 1) % C.length];
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = document.createElement('style');
  css.textContent =
    'html.cn-out body{opacity:0;transition:opacity .3s ease}' +
    '.cn-mini{display:inline-grid;place-items:center;width:34px;height:34px;padding:0!important;border-radius:50%;font-size:18px;line-height:1}' +
    '.cn-pn{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(12px,2vw,24px);margin-top:clamp(40px,6vw,72px);padding-top:clamp(24px,3vw,36px);border-top:1px solid color-mix(in srgb,var(--ind-ink) 30%,transparent)}' +
    '.cn-mini,.cn-pn a{text-decoration:none}.cn-pn a{display:flex;flex-direction:column;gap:6px;padding:18px 20px;border-radius:18px;color:var(--ind-ink);border:1.5px solid color-mix(in srgb,var(--ind-ink) 35%,transparent);transition:background .2s,color .2s}' +
    '.cn-pn a:hover,.cn-pn a:focus-visible{background:var(--ind-ink);color:var(--ind)}' +
    '.cn-pn a.nx{text-align:right;align-items:flex-end}' +
    '.cn-pn small{font:700 12px var(--body);letter-spacing:.14em;text-transform:uppercase;opacity:.75}' +
    '.cn-pn b{font:800 clamp(20px,2.6vw,34px)/1.05 var(--display);letter-spacing:-.03em}' +
    '@media (max-width:560px){.cn-pn{grid-template-columns:minmax(0,1fr)}.cn-pn a.nx{text-align:left;align-items:flex-start}}' +
    '@media (prefers-reduced-motion:reduce){html.cn-out body{transition:none}}';
  document.head.appendChild(css);

  function link(c, cls, label, text) {
    var a = document.createElement('a');
    a.href = c[0]; a.className = cls; a.setAttribute('aria-label', label + ' case study: ' + c[1]);
    a.innerHTML = text;
    return a;
  }
  // small arrows in the floating bar, before the last button
  var bar = document.querySelector('.bar');
  if (bar) {
    var last = bar.lastElementChild;
    bar.insertBefore(link(prev, 'cn-mini', 'Previous', '‹'), last);
    bar.insertBefore(link(next, 'cn-mini', 'Next', '›'), last);
  }
  // large previous / next at the end of the page
  var end = document.querySelector('.end .wrap');
  if (end) {
    var pn = document.createElement('nav');
    pn.className = 'cn-pn'; pn.setAttribute('aria-label', 'More case studies');
    pn.appendChild(link(prev, 'pv', 'Previous', '<small>← Previous</small><b>' + prev[1] + '</b>'));
    pn.appendChild(link(next, 'nx', 'Next', '<small>Next →</small><b>' + next[1] + '</b>'));
    end.appendChild(pn);
  }

  // fade out before leaving for another case study or the home page
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var h = a.getAttribute('href');
    if (!/^(\.\.\/index\.html|[\w-]+\.html)/.test(h)) return;
    e.preventDefault();
    if (reduce) { location.assign(h); return; }
    document.documentElement.classList.add('cn-out');
    setTimeout(function () { location.assign(h); }, 320);
  });
  addEventListener('pageshow', function (e) { if (e.persisted) document.documentElement.classList.remove('cn-out'); });
})();
