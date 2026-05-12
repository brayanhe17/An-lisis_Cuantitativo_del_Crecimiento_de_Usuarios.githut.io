/* ══════════════════════════════════════════════════════
   graficos.js — Instagram Growth Dashboard
   f(t) = 50 + 10t  |  F(t) = 50t + 5t²
══════════════════════════════════════════════════════ */

/* ══════════ PALETA ══════════ */
const C = {
  blue:      '#3b7ff5',
  blueL:     '#6ea3ff',
  blueAlpha: 'rgba(59,127,245,',
  teal:      '#22c9a5',
  tealAlpha: 'rgba(34,201,165,',
  amber:     '#f5a623',
  amberAlpha:'rgba(245,166,35,',
  rose:      '#f55b6e',
  roseAlpha: 'rgba(245,91,110,',
  grid:      'rgba(255,255,255,.05)',
  text2:     '#8b91a8',
};

/* ══════════ DATOS ══════════ */
const T      = Array.from({ length: 101 }, (_, i) => i / 10);
const DAYS   = [1,2,3,4,5,6,7,8,9,10];
const LABELS = T.map(t => t.toFixed(1));

function f(t, b = 50, p = 10) { return b + p * t; }
function F(t, b = 50, p = 10) { return b * t + (p / 2) * t * t; }
function fExpo(t)  { return 50 * Math.exp(0.18 * t); }
function fLogis(t) { return 300 / (1 + Math.exp(-0.8 * (t - 5))); }

/* ══════════ CHART DEFAULTS ══════════ */
Chart.defaults.font.family = "'DM Sans', sans-serif";
Chart.defaults.color = C.text2;

function baseOpts(yMax, yLabel) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600, easing: 'easeInOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e2335',
        borderColor: 'rgba(255,255,255,.1)',
        borderWidth: 1,
        titleColor: '#eef0f6',
        bodyColor: '#8b91a8',
        padding: 12,
        cornerRadius: 10,
        callbacks: { label: ctx => '  ' + Math.round(ctx.parsed.y).toLocaleString() + ' usuarios' }
      }
    },
    scales: {
      x: {
        grid: { color: C.grid },
        ticks: { color: C.text2, font: { size: 11 }, maxTicksLimit: 11 },
        border: { color: 'transparent' }
      },
      y: {
        grid: { color: C.grid },
        ticks: { color: C.text2, font: { size: 11 }, callback: v => Math.round(v).toLocaleString() },
        border: { color: 'transparent' },
        ...(yMax ? { max: yMax } : {}),
        ...(yLabel ? { title: { display: true, text: yLabel, color: C.text2, font: { size: 11 } } } : {})
      }
    }
  };
}

/* ══════════════════════════════
   CHART 1 — Función f(t)
══════════════════════════════ */
const c1 = new Chart(document.getElementById('chart1'), {
  type: 'line',
  data: {
    labels: LABELS,
    datasets: [{
      data: T.map(t => f(t)),
      borderColor: C.blue, borderWidth: 2.5,
      pointRadius: 0, tension: 0,
      fill: { target: 'origin', above: C.blueAlpha + '.09)' }
    }]
  },
  options: baseOpts()
});

function updateP1() {
  const b = +document.getElementById('base').value;
  const p = +document.getElementById('pend').value;
  document.getElementById('baseVal').textContent  = b;
  document.getElementById('pendVal').textContent  = p;
  document.getElementById('formula1').textContent = `f(t) = ${b} + ${p}t`;
  document.getElementById('m_f0').textContent  = Math.round(f(0, b, p)).toLocaleString();
  document.getElementById('m_f5').textContent  = Math.round(f(5, b, p)).toLocaleString();
  document.getElementById('m_f10').textContent = Math.round(f(10, b, p)).toLocaleString();
  c1.data.datasets[0].data = T.map(t => f(t, b, p));
  c1.update();
}
document.getElementById('base').addEventListener('input', updateP1);
document.getElementById('pend').addEventListener('input', updateP1);

/* ══════════════════════════════
   CHART 2 — Integral definida
══════════════════════════════ */
const c2 = new Chart(document.getElementById('chart2'), {
  type: 'line',
  data: {
    labels: LABELS,
    datasets: [
      {
        data: T.map(t => f(t)),
        borderColor: C.blue, borderWidth: 2, pointRadius: 0, tension: 0, fill: false
      },
      {
        data: T.map(t => f(t)),
        borderColor: 'transparent',
        backgroundColor: C.tealAlpha + '.2)',
        fill: { target: 'origin' },
        pointRadius: 0, tension: 0
      }
    ]
  },
  options: baseOpts()
});

function updateP2() {
  let a = +document.getElementById('limA').value;
  let b = +document.getElementById('limB').value;
  if (a >= b) { a = b - 1; document.getElementById('limA').value = a; }
  document.getElementById('limAVal').textContent = a;
  document.getElementById('limBVal').textContent = b;
  const Fa = F(a), Fb = F(b), res = Fb - Fa;
  document.getElementById('m_Fa').textContent        = Math.round(Fa).toLocaleString();
  document.getElementById('m_Fb').textContent        = Math.round(Fb).toLocaleString();
  document.getElementById('m_intResult').textContent = Math.round(res).toLocaleString();
  document.getElementById('formula2').textContent =
    `∫${a}${b} (50 + 10t) dt = [50t + 5t²]${a}${b} = ${Math.round(res).toLocaleString()}`;
  c2.data.datasets[1].data = T.map(t => (t >= a && t <= b) ? f(t) : null);
  c2.update();
}
document.getElementById('limA').addEventListener('input', updateP2);
document.getElementById('limB').addEventListener('input', updateP2);

/* ══════════════════════════════
   CHART 3 — Acumulado F(t)
══════════════════════════════ */
const c3 = new Chart(document.getElementById('chart3'), {
  type: 'line',
  data: {
    labels: LABELS,
    datasets: [
      {
        data: T.map(t => F(t)),
        borderColor: C.amber, borderWidth: 2.5,
        pointRadius: 0, tension: 0,
        fill: { target: 'origin', above: C.amberAlpha + '.08)' }
      },
      {
        data: [],
        borderColor: C.rose, borderWidth: 1.5, borderDash: [5, 4],
        pointRadius: 0, fill: false
      }
    ]
  },
  options: { ...baseOpts(1200), ...{
    scales: {
      x: baseOpts().scales.x,
      y: { ...baseOpts().scales.y, max: 1200 }
    }
  }}
});

function updateP3() {
  const tc = +document.getElementById('tCursor').value;
  document.getElementById('tCursorVal').textContent  = tc;
  document.getElementById('m_curT').textContent  = tc;
  document.getElementById('m_curF').textContent  = Math.round(f(tc)).toLocaleString();
  document.getElementById('m_curFt').textContent = Math.round(F(tc)).toLocaleString();
  c3.data.datasets[1].data = T.map(t => t <= tc + 0.05 ? F(tc) : null);
  c3.update();
}
document.getElementById('tCursor').addEventListener('input', updateP3);
updateP3();

/* ══════════════════════════════
   CHART 4 — Comparación modelos
══════════════════════════════ */
const c4 = new Chart(document.getElementById('chart4'), {
  type: 'line',
  data: {
    labels: LABELS,
    datasets: [
      { label: 'Lineal',      data: T.map(t => f(t)),      borderColor: C.blue,  borderWidth: 2.5, pointRadius: 0, tension: 0,   fill: false },
      { label: 'Exponencial', data: T.map(t => fExpo(t)),  borderColor: C.rose,  borderWidth: 2,   pointRadius: 0, tension: 0,   fill: false, borderDash: [7, 3] },
      { label: 'Logístico',   data: T.map(t => fLogis(t)), borderColor: C.teal,  borderWidth: 2,   pointRadius: 0, tension: 0.4, fill: false, borderDash: [3, 3] },
      { label: 'Cap. máx.',   data: T.map(() => 300),       borderColor: C.amberAlpha + '.5)', borderWidth: 1, pointRadius: 0, borderDash: [4, 4], fill: false }
    ]
  },
  options: {
    ...baseOpts(420),
    plugins: {
      ...baseOpts().plugins,
      legend: { display: false }
    }
  }
});

function updateP4() {
  ['lineal','expo','logis'].forEach((key, i) => {
    const el  = document.getElementById('tog_' + key);
    const isOn = el.classList.contains('on');
    c4.data.datasets[i].hidden = !isOn;
  });
  c4.update();
}

document.querySelectorAll('.toggle-item').forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('on');
    updateP4();
  });
});

/* ══════════════════════════════
   CHART 5 — Recursos servidor
══════════════════════════════ */
const c5 = new Chart(document.getElementById('chart5'), {
  type: 'line',
  data: {
    labels: LABELS,
    datasets: [
      { label: '📊 CPU (%)',            data: T.map(t => F(t)*4/100), borderColor: C.blue,  borderWidth: 2, pointRadius: 0, tension: 0.2, fill: false },
      { label: '🧠 Memoria RAM (%)',    data: T.map(t => F(t)*6/100), borderColor: C.amber, borderWidth: 2, pointRadius: 0, tension: 0.2, fill: false, borderDash: [5,3] },
      { label: '🌐 Ancho de banda (%)', data: T.map(t => F(t)*8/100), borderColor: C.teal,  borderWidth: 2, pointRadius: 0, tension: 0.2, fill: false, borderDash: [2,3] }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 500 },
    plugins: {
      legend: {
        display: true, position: 'top',
        labels: { color: C.text2, font: { size: 12, family: "'DM Sans'" }, boxWidth: 16, padding: 20, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: '#1e2335', borderColor: 'rgba(255,255,255,.1)', borderWidth: 1,
        titleColor: '#eef0f6', bodyColor: '#8b91a8', padding: 12, cornerRadius: 10,
        callbacks: { label: ctx => '  ' + Math.round(ctx.parsed.y) + '%' }
      }
    },
    scales: {
      x: { grid: { color: C.grid }, ticks: { color: C.text2, font: { size: 11 } }, border: { color: 'transparent' } },
      y: { grid: { color: C.grid }, ticks: { color: C.text2, font: { size: 11 }, callback: v => Math.round(v) + '%' }, border: { color: 'transparent' }, title: { display: true, text: 'Uso del recurso (%)', color: C.text2, font: { size: 11 } } }
    }
  }
});

function updateC5() {
  const cf = +document.getElementById('cpuF').value;
  const mf = +document.getElementById('memF').value;
  const bf = +document.getElementById('bwF').value;
  document.getElementById('cpuFVal').textContent = cf;
  document.getElementById('memFVal').textContent = mf;
  document.getElementById('bwFVal').textContent  = bf;
  c5.data.datasets[0].data = T.map(t => F(t)*cf/100);
  c5.data.datasets[1].data = T.map(t => F(t)*mf/100);
  c5.data.datasets[2].data = T.map(t => F(t)*bf/100);
  c5.update();
}
document.getElementById('cpuF').addEventListener('input', updateC5);
document.getElementById('memF').addEventListener('input', updateC5);
document.getElementById('bwF').addEventListener('input', updateC5);

/* ══════════════════════════════
   CHART 6 — Escalamiento
══════════════════════════════ */
const c6 = new Chart(document.getElementById('chart6'), {
  type: 'line',
  data: {
    labels: LABELS,
    datasets: [
      { label: 'Demanda F(t)',        data: T.map(t => F(t)),        borderColor: C.rose,  borderWidth: 2.5, pointRadius: 0, tension: 0,   fill: false },
      { label: 'Capacidad del sistema', data: T.map(t => 300+20*t),  borderColor: C.teal,  borderWidth: 2.5, pointRadius: 0, tension: 0,   fill: false, borderDash: [7, 3] },
      { label: 'Déficit',  data: [], borderColor: 'transparent', backgroundColor: C.roseAlpha+'.1)',  fill: { target: '0' }, pointRadius: 0 },
      { label: 'Holgura',  data: [], borderColor: 'transparent', backgroundColor: C.tealAlpha+'.08)', fill: { target: '0' }, pointRadius: 0 }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
    plugins: {
      legend: { display: true, position: 'top', labels: { color: C.text2, font: { size: 12 }, boxWidth: 16, padding: 20, usePointStyle: true } },
      tooltip: {
        backgroundColor: '#1e2335', borderColor: 'rgba(255,255,255,.1)', borderWidth: 1,
        titleColor: '#eef0f6', bodyColor: '#8b91a8', padding: 12, cornerRadius: 10,
        callbacks: { label: ctx => '  ' + Math.round(ctx.parsed.y).toLocaleString() + ' usuarios' }
      }
    },
    scales: {
      x: { grid: { color: C.grid }, ticks: { color: C.text2, font: { size: 11 } }, border: { color: 'transparent' } },
      y: { grid: { color: C.grid }, ticks: { color: C.text2, font: { size: 11 }, callback: v => Math.round(v).toLocaleString() }, border: { color: 'transparent' }, title: { display: true, text: 'Usuarios', color: C.text2, font: { size: 11 } } }
    }
  }
});

function updateC6() {
  const ci = +document.getElementById('capIni').value;
  const cg = +document.getElementById('capGrow').value;
  document.getElementById('capIniVal').textContent  = ci;
  document.getElementById('capGrowVal').textContent = cg;
  const cap = T.map(t => ci + cg*t);
  const dem = T.map(t => F(t));
  c6.data.datasets[1].data = cap;
  c6.data.datasets[2].data = cap.map((c, i) => dem[i] >  c ? c    : null);
  c6.data.datasets[3].data = cap.map((c, i) => dem[i] <= c ? cap[i] : null);
  let cross = '—';
  for (let i = 1; i < T.length; i++) {
    if (dem[i] >= cap[i]) { cross = 'día ' + T[i].toFixed(1); break; }
  }
  document.getElementById('m_cross').textContent    = cross;
  document.getElementById('m_dem10').textContent    = Math.round(F(10)).toLocaleString();
  document.getElementById('m_cap10').textContent    = Math.round(ci + cg*10).toLocaleString();
  c6.update();
}
document.getElementById('capIni').addEventListener('input', updateC6);
document.getElementById('capGrow').addEventListener('input', updateC6);
updateC6();

/* ══════════════════════════════
   CHART 7 — Barras diarias
══════════════════════════════ */
const barColors = DAYS.map(d => {
  const r  = (d - 1) / 9;
  const R  = Math.round(59  + r * 180);
  const G  = Math.round(127 + r * (127 - 127));
  const B  = Math.round(245 - r * 100);
  return `rgba(${R},${G-20},${B},.85)`;
});

new Chart(document.getElementById('chart7'), {
  type: 'bar',
  data: {
    labels: DAYS.map(d => 'Día ' + d),
    datasets: [{
      label: 'Usuarios/día',
      data: DAYS.map(d => f(d)),
      backgroundColor: barColors,
      borderRadius: 6,
      borderSkipped: false
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 900, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e2335', borderColor: 'rgba(255,255,255,.1)', borderWidth: 1,
        titleColor: '#eef0f6', bodyColor: '#8b91a8', padding: 12, cornerRadius: 10,
        callbacks: { label: ctx => '  ' + Math.round(ctx.parsed.y) + ' usuarios/día' }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: C.text2, font: { size: 11 } }, border: { color: 'transparent' } },
      y: { grid: { color: C.grid }, ticks: { color: C.text2, font: { size: 11 }, callback: v => Math.round(v) }, border: { color: 'transparent' }, title: { display: true, text: 'Usuarios / día', color: C.text2, font: { size: 11 } } }
    }
  }
});

/* ══════════════════════════════
   CHARTS RESUMEN (mini)
══════════════════════════════ */
const miniOpts = {
  responsive: true, maintainAspectRatio: false, animation: { duration: 700 },
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } }
};

new Chart(document.getElementById('cS1'), {
  type: 'line',
  data: { labels: LABELS, datasets: [{ data: T.map(t => f(t)), borderColor: C.blue, borderWidth: 2, pointRadius: 0, tension: 0, fill: { target: 'origin', above: C.blueAlpha+'.08)' } }] },
  options: miniOpts
});
new Chart(document.getElementById('cS2'), {
  type: 'line',
  data: { labels: LABELS, datasets: [
    { data: T.map(t => f(t)), borderColor: C.blue, borderWidth: 1.5, pointRadius: 0, tension: 0, fill: false },
    { data: T.map(t => f(t)), borderColor: 'transparent', backgroundColor: C.tealAlpha+'.2)', fill: { target: 'origin' }, pointRadius: 0 }
  ]},
  options: miniOpts
});
new Chart(document.getElementById('cS3'), {
  type: 'line',
  data: { labels: LABELS, datasets: [{ data: T.map(t => F(t)), borderColor: C.amber, borderWidth: 2, pointRadius: 0, tension: 0, fill: { target: 'origin', above: C.amberAlpha+'.08)' } }] },
  options: miniOpts
});
new Chart(document.getElementById('cS4'), {
  type: 'line',
  data: { labels: LABELS, datasets: [
    { data: T.map(t => f(t)),      borderColor: C.blue, borderWidth: 1.5, pointRadius: 0, tension: 0,   fill: false },
    { data: T.map(t => fExpo(t)),  borderColor: C.rose, borderWidth: 1.5, pointRadius: 0, tension: 0,   fill: false, borderDash: [5,3] },
    { data: T.map(t => fLogis(t)), borderColor: C.teal, borderWidth: 1.5, pointRadius: 0, tension: 0.4, fill: false, borderDash: [2,3] }
  ]},
  options: { ...miniOpts, scales: { x: { display: false }, y: { display: false, max: 400 } } }
});

/* ══════════════════════════════
   TABS
══════════════════════════════ */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t  => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.panel).classList.add('active');
    setTimeout(() => { [c1,c2,c3,c4].forEach(c => c.resize()); }, 60);
  });
});

/* ══════════════════════════════
   KPI ANIMACIÓN AL CARGAR
══════════════════════════════ */
function animateValue(el, from, to, duration) {
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * ease).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

window.addEventListener('load', () => {
  animateValue(document.getElementById('kpi_f10'),  0, 150,  900);
  animateValue(document.getElementById('kpi_int'),  0, 1000, 1100);
  animateValue(document.getElementById('kpi_Ft'),   0, 500,  1000);
  animateValue(document.getElementById('kpi_dias'), 0, 10,   700);
});
