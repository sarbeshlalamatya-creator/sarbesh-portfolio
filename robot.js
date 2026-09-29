import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

function roundedBox(w, h, d, r, seg = 18) {
  const g = new THREE.BoxGeometry(w, h, d, seg, seg, seg);
  const p = g.attributes.position, n = g.attributes.normal;
  const hw = w / 2 - r, hh = h / 2 - r, hd = d / 2 - r, v = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    c.set(Math.max(-hw, Math.min(hw, v.x)), Math.max(-hh, Math.min(hh, v.y)), Math.max(-hd, Math.min(hd, v.z)));
    v.sub(c).normalize();
    n.setXYZ(i, v.x, v.y, v.z);
    p.setXYZ(i, c.x + v.x * r, c.y + v.y * r, c.z + v.z * r);
  }
  return g;
}
function roundedPlate(w, h, r, depth) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 5, curveSegments: 16 });
}

export function startRobot({ reduce = false, follow: follow0 = true } = {}) {
  let follow = follow0 !== false;
  const W = 85, H = 96;
  const wrap = document.createElement('div');
  wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = `position:fixed;left:0;top:0;width:${W}px;height:${H}px;pointer-events:none;z-index:900;will-change:transform;opacity:0;transition:opacity .6s`;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  wrap.appendChild(renderer.domElement);
  document.body.appendChild(wrap);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, W / H, 0.1, 100);
  cam.position.set(0, 1.2, 8.6); cam.lookAt(0, -0.05, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa3ad, 2.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(-4, 5, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0xdfe8ff, 0.9); fill.position.set(5, 1, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 1.4); rim.position.set(2, 3, -5); scene.add(rim);

  const white = new THREE.MeshPhysicalMaterial({ color: 0xF1F1EF, roughness: 0.62, sheen: 0.4, sheenColor: 0xffffff });
  const seamM = new THREE.MeshStandardMaterial({ color: 0x9C9FA3, roughness: 0.7 });
  const darkM = new THREE.MeshStandardMaterial({ color: 0x3A3B3E, roughness: 0.55, metalness: 0.15 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x9EA2A7, roughness: 0.28, metalness: 0.85 });
  const screenM = new THREE.MeshPhysicalMaterial({ color: 0x050506, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 });
  const eyeM = new THREE.MeshBasicMaterial({ color: 0xA8F2E6 });
  const wheelM = new THREE.MeshPhysicalMaterial({ color: 0x111113, roughness: 0.35, clearcoat: 0.6 });

  const robot = new THREE.Group(); scene.add(robot);
  const float = new THREE.Group(); robot.add(float);
  const body = new THREE.Group(); float.add(body);

  const core = new THREE.Mesh(roundedBox(1.9, 1.9, 1.7, 0.36), seamM); body.add(core);
  const top = new THREE.Mesh(roundedBox(2.0, 1.0, 1.8, 0.4), white); top.position.y = 0.5; body.add(top);
  const bot = new THREE.Mesh(roundedBox(2.0, 0.96, 1.8, 0.4), white); bot.position.y = -0.52; body.add(bot);

  const screen = new THREE.Mesh(roundedPlate(1.1, 1.0, 0.24, 0.06), screenM);
  screen.position.set(-0.05, -0.08, 0.84); body.add(screen);
  const glare = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.06), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
  glare.position.set(0.1, 0.3, 0.97); glare.rotation.z = 0.12; body.add(glare);
  const face = new THREE.Group(); face.position.set(-0.05, -0.08, 0.955); body.add(face);
  const eyeGeo = new THREE.CapsuleGeometry(0.075, 0.17, 6, 16);
  const eyes = [-1, 1].map(s => { const e = new THREE.Mesh(eyeGeo, eyeM); e.scale.z = 0.25; e.position.x = 0.2 * s; face.add(e); return e; });

  const band = new THREE.Mesh(new THREE.TorusGeometry(1.13, 0.1, 18, 64, Math.PI), darkM);
  band.scale.z = 1.9; band.position.set(0, 0.08, -0.12); body.add(band);
  [-1, 1].forEach(s => {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.22, 48), darkM);
    cup.rotation.z = Math.PI / 2; cup.position.set(1.1 * s, 0.05, -0.12); body.add(cup);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.28, 40), metal);
    cap.rotation.z = Math.PI / 2; cap.position.set(1.12 * s, 0.05, -0.12); body.add(cap);
  });

  const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.55, 40, 24), wheelM);
  wheel.scale.set(0.8, 0.85, 0.95); wheel.position.y = -1.08; float.add(wheel);

  const armGeo = new THREE.CapsuleGeometry(0.07, 0.56, 6, 12);
  const handGeo = new THREE.SphereGeometry(0.19, 24, 16);
  const arms = [-1, 1].map(s => {
    const p = new THREE.Group(); p.position.set(0.98 * s, -0.5, 0.55); float.add(p);
    const a = new THREE.Mesh(armGeo, darkM); a.position.y = -0.36; p.add(a);
    const hnd = new THREE.Group(); hnd.position.y = -0.74; p.add(hnd);
    const palm = new THREE.Mesh(handGeo, white); palm.scale.set(1, 1.05, 0.8); hnd.add(palm);
    const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), white); thumb.position.set(-0.13 * s, 0.07, 0.04); hnd.add(thumb);
    return { p, hnd };
  });

  const sc = document.createElement('canvas'); sc.width = sc.height = 128;
  const g = sc.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(27,26,23,0.4)'); gr.addColorStop(1, 'rgba(27,26,23,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.9; scene.add(shadow);

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  let px = innerWidth - W * 0.7, py = innerHeight - H * 0.6, vx = 0, vy = 0;
  let mx = null, my = null, lastMove = -1e9, excited = 0, scrollKick = 0, lastScroll = scrollY;
  let wanderT = 0, wx = px, wy = py, nextBlink = 2, blink = 0, waveAmt = 0, waveSide = 1;
  const start = performance.now();

  const onMove = e => {
    mx = e.clientX; my = e.clientY; lastMove = performance.now();
    const t = e.target && e.target.closest ? e.target.closest('a[href],button,[role="button"],[onclick],input,select,textarea,label') : null;
    excited = t ? 1 : 0;
  };
  const onTouch = e => { const t = e.touches && e.touches[0]; if (t) { mx = t.clientX; my = t.clientY; lastMove = performance.now(); } };
  const onScroll = () => { scrollKick = clamp(scrollKick + (scrollY - lastScroll) * 0.004, -1, 1); lastScroll = scrollY; };
  addEventListener('mousemove', onMove); addEventListener('touchstart', onTouch, { passive: true }); addEventListener('scroll', onScroll, { passive: true });

  let raf, prev = performance.now();
  const frame = now => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    const t = (now - start) / 1000;
    const idle = now - lastMove > 4000 || mx === null;
    let tx, ty;
    if (!follow) { tx = innerWidth - 24 - W / 2 - 2; ty = innerHeight - 24 - 52 - 12 - H / 2 + Math.sin(t * 1.6) * 3; }
    else if (reduce) { tx = innerWidth - W * 0.6; ty = innerHeight - H * 0.55; }
    else if (!idle) { const side = mx > innerWidth - 160 ? -1 : 1; tx = mx + 60 * side; ty = my + 34; }
    else {
      wanderT -= dt;
      if (wanderT <= 0) { wanderT = 3 + Math.random() * 3; wx = W / 2 + Math.random() * (innerWidth - W); wy = H / 2 + 70 + Math.random() * (innerHeight - H - 70); }
      tx = wx + Math.sin(t * 0.9) * 20; ty = wy + Math.cos(t * 0.7) * 14;
    }
    tx = clamp(tx, W / 2, innerWidth - W / 2); ty = clamp(ty, H / 2, innerHeight - H / 2);
    const k = idle ? 9 : 26, d = idle ? 5 : 8;
    vx += (k * (tx - px) - d * vx) * dt; vy += (k * (ty - py) - d * vy) * dt;
    px += vx * dt; py += vy * dt;
    wrap.style.transform = `translate3d(${px - W / 2}px,${py - H / 2}px,0)`;

    scrollKick = lerp(scrollKick, 0, 1 - Math.pow(0.02, dt));
    const bobF = reduce ? 0 : (excited ? 5 : 2.4), bobA = reduce ? 0 : (excited ? 0.14 : 0.09);
    const bob = Math.sin(t * bobF) * bobA;
    float.position.y = bob - scrollKick * 0.15;
    const sq = 1 + Math.abs(scrollKick) * 0.08;
    body.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
    shadow.scale.setScalar(1 - bob * 0.9); shadow.material.opacity = 0.9 - bob * 1.5;

    const lx = mx === null ? 0 : clamp((mx - px) / 320, -0.7, 0.7);
    const ly = mx === null ? 0 : clamp((my - py) / 420, -0.3, 0.3);
    const look = idle ? Math.sin(t * 0.7) * 0.45 : lx;
    let yaw = -0.3 + look + clamp(vx * 0.0008, -0.4, 0.4);
    if (waveAmt > 0.3) yaw = clamp(yaw, -0.45, 0.45);
    robot.rotation.y = lerp(robot.rotation.y, yaw, 0.08);
    robot.rotation.x = lerp(robot.rotation.x, (idle ? Math.sin(t * 0.6) * 0.06 : ly) + clamp(vy * 0.0004, -0.2, 0.2) + scrollKick * 0.2, 0.08);
    robot.rotation.z = lerp(robot.rotation.z, clamp(-vx * 0.001, -0.35, 0.35) + (idle ? Math.sin(t * 0.5) * 0.06 : 0), 0.12);
    face.position.x = lerp(face.position.x, -0.05 + lx * 0.12, 0.15);
    face.position.y = lerp(face.position.y, -0.08 + ly * 0.15, 0.15);

    const greet = t > 0.6 && t < 3.4;
    waveAmt = lerp(waveAmt, excited || greet ? 1 : 0, 0.14);
    const swing = Math.sin(t * bobF + 0.6) * 0.1;
    const wave = Math.sin(t * 11) * 0.45;
    if (excited || greet) waveSide = mx !== null && mx < px ? 0 : 1;
    arms.forEach((a, i) => {
      const sgn = i ? 1 : -1, rest = sgn * (0.18 + swing);
      const w = i === waveSide ? waveAmt : 0;
      a.p.rotation.z = lerp(rest - (i === waveSide ? 0 : sgn * waveAmt * 0.25), sgn * (2.25 + wave * sgn), w);
      a.hnd.rotation.z = wave * 0.6 * w;
    });
    arms.forEach((a, i) => { a.p.rotation.x = lerp(a.p.rotation.x, clamp(vx * 0.0008, -0.6, 0.6) * (i ? -1 : 1), 0.1); });

    nextBlink -= dt;
    if (nextBlink <= 0) { blink = 0.16; nextBlink = 2.2 + Math.random() * 3; }
    let ey = 1;
    if (blink > 0) { blink -= dt; ey = Math.max(0.1, Math.abs(blink - 0.08) / 0.08); }
    const happy = waveAmt;
    eyes.forEach(e => { e.scale.y = lerp(1, 0.55, happy) * ey; e.scale.x = lerp(1, 1.15, happy); });

    renderer.render(scene, cam);
  };
  raf = requestAnimationFrame(frame);
  setTimeout(() => { wrap.style.opacity = '1'; }, 300);

  const stop = () => {
    cancelAnimationFrame(raf);
    removeEventListener('mousemove', onMove); removeEventListener('touchstart', onTouch); removeEventListener('scroll', onScroll);
    renderer.dispose(); wrap.remove();
  };
  stop.setFollow = v => { follow = !!v; };
  return stop;
}
