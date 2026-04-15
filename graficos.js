/* ══════════════════════════════════════════════
   graficos.js
   Análisis de Crecimiento de Usuarios
   Ingeniería de Sistemas
══════════════════════════════════════════════ */

/* ═══════════════════ DATOS BASE ═══════════════════ */
const T    = Array.from({ length: 101 }, (_, i) => i / 10);
const DAYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/* ── funciones matemáticas ── */
function f(t, b = 50, p = 10) { return b + p * t; }
function F(t, b = 50, p = 10) { return b * t + (p / 2) * t * t; }
function fExpo(t)  { return 50 * Math.exp(0.18 * t); }
function fLogis(t) { return 300 / (1 + Math.exp(-0.8 * (t - 5))); }

const tLabels = T.map(t => t.toFixed(1));

/* ── opciones base para Chart.js ── */
function baseOpts(yMax) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500, easing: 'easeInOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ' ' + Math.round(ctx.parsed.y) + ' usuarios' } }
    },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,.05)' }, ticks: { maxTicksLimit: 11, font: { size: 11 } } },
      y: {
        grid: { color: 'rgba(0,0,0,.05)' },
        ticks: { font: { size: 11 }, callback: v => Math.round(v) },
        ...(yMax ? { max: yMax } : {})
      }
    }
  };
}

/* ═══════════════════ CHART 1 — Función f(t) ═══════════════════ */
const c1 = new Chart(document.getElementById('chart1'), {
  type: 'line',
  data: {
    labels: tLabels,
    datasets: [{
      data: T.map(t => f(t)),
      borderColor: '#3b82f6',
      borderWidth: 2.5,
      pointRadius: 0,
      tension: 0,
      fill: { target: 'origin', above: 'rgba(59,130,246,.09)' }
    }]
  },
  options: baseOpts()
});

function updateP1() {
  const base = +document.getElementById('base').value;
  const pend = +document.getElementById('pend').value;
  document.getElementById('baseVal').textContent  = base;
  document.getElementById('pendVal').textContent  = pend;
  document.getElementById('formula1').textContent = `f(t) = ${base} + ${pend}t`;
  document.getElementById('f0').textContent  = Math.round(f(0, base, pend));
  document.getElementById('f5').textContent  = Math.round(f(5, base, pend));
  document.getElementById('f10').textContent = Math.round(f(10, base, pend));
  c1.data.datasets[0].data = T.map(t => f(t, base, pend));
  c1.update();
}
document.getElementById('base').addEventListener('input', updateP1);
document.getElementById('pend').addEventListener('input', updateP1);

/* ═══════════════════ CHART 2 — Integral definida ═══════════════════ */
const c2 = new Chart(document.getElementById('chart2'), {
  type: 'line',
  data: {
    labels: tLabels,
    datasets: [
      {
        data: T.map(t => f(t)),
        borderColor: '#3b82f6', borderWidth: 2, pointRadius: 0, tension: 0, fill: false
      },
      {
        data: T.map(t => f(t)),
        borderColor: 'transparent',
        backgroundColor: 'rgba(16,185,129,.22)',
        fill: { target: 'origin' },
        pointRadius: 0,
        tension: 0
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
  const Fa  = F(a), Fb = F(b), res = Fb - Fa;
  document.getElementById('Fa').textContent        = Math.round(Fa);
  document.getElementById('Fb').textContent        = Math.round(Fb);
  document.getElementById('intResult').textContent = Math.round(res);
  document.getElementById('formula2').textContent  =
    `∫${a}${b} (50+10t) dt = [50t+5t²]${a}${b} = ${Math.round(res)}`;
  c2.data.datasets[1].data = T.map(t => (t >= a && t <= b) ? f(t) : null);
  c2.update();
}
document.getElementById('limA').addEventListener('input', updateP2);
document.getElementById('limB').addEventListener('input', updateP2);

/* ═══════════════════ CHART 3 — Acumulado F(t) ═══════════════════ */
const c3 = new Chart(document.getElementById('chart3'), {
  type: 'line',
  data: {
    labels: tLabels,
    datasets: [
      {
        data: T.map(t => F(t)),
        borderColor: '#d97706', borderWidth: 2.5, pointRadius: 0, tension: 0,
        fill: { target: 'origin', above: 'rgba(217,119,6,.09)' }
      },
      {
        data: [],
        borderColor: '#ef4444', borderWidth: 1.5, borderDash: [5, 4],
        pointRadius: 0, fill: false
      }
    ]
  },
  options: {
    ...baseOpts(),
    scales: {
      x: baseOpts().scales.x,
      y: { ...baseOpts().scales.y, max: 1100 }
    }
  }
});

function updateP3() {
  const tc = +document.getElementById('tCursor').value;
  document.getElementById('tCursorVal').textContent = tc;
  document.getElementById('curT').textContent  = tc;
  document.getElementById('curF').textContent  = Math.round(f(tc));
  document.getElementById('curFt').textContent = Math.round(F(tc));
  c3.data.datasets[1].data = T.map(t => t <= tc + 0.05 ? F(tc) : null);
  c3.update();
}
document.getElementById('tCursor').addEventListener('input', updateP3);
updateP3();

/* ═══════════════════ CHART 4 — Comparación de modelos ═══════════════════ */
const c4 = new Chart(document.getElementById('chart4'), {
  type: 'line',
  data: {
    labels: tLabels,
    datasets: [
      { label: 'Lineal',      data: T.map(t => f(t)),      borderColor: '#3b82f6', borderWidth: 2.5, pointRadius: 0, tension: 0,   fill: false },
      { label: 'Exponencial', data: T.map(t => fExpo(t)),  borderColor: '#ec4899', borderWidth: 2,   pointRadius: 0, tension: 0,   fill: false, borderDash: [6, 3] },
      { label: 'Logístico',   data: T.map(t => fLogis(t)), borderColor: '#10b981', borderWidth: 2,   pointRadius: 0, tension: 0.3, fill: false, borderDash: [2, 3] },
      { label: 'Cap. 300',    data: T.map(() => 300),       borderColor: 'rgba(180,100,10,.45)', borderWidth: 1, pointRadius: 0, borderDash: [4, 4], fill: false }
    ]
  },
  options: baseOpts(400)
});

function updateP4() {
  c4.data.datasets[0].hidden = !document.getElementById('showLineal').checked;
  c4.data.datasets[1].hidden = !document.getElementById('showExpo').checked;
  c4.data.datasets[2].hidden = !document.getElementById('showLogis').checked;
  c4.update();
}
document.getElementById('showLineal').addEventListener('change', updateP4);
document.getElementById('showExpo').addEventListener('change', updateP4);
document.getElementById('showLogis').addEventListener('change', updateP4);

/* ═══════════════════ CHART 5 — Recursos del servidor ═══════════════════ */
const c5 = new Chart(document.getElementById('chart5'), {
  type: 'line',
  data: {
    labels: tLabels,
    datasets: [
      { label: 'CPU (%)',            data: T.map(t => F(t) * 4 / 100), borderColor: '#3b82f6', borderWidth: 2, pointRadius: 0, tension: 0.2, fill: false },
      { label: 'Memoria (%)',        data: T.map(t => F(t) * 6 / 100), borderColor: '#d97706', borderWidth: 2, pointRadius: 0, tension: 0.2, fill: false, borderDash: [5, 3] },
      { label: 'Ancho de banda (%)', data: T.map(t => F(t) * 8 / 100), borderColor: '#10b981', borderWidth: 2, pointRadius: 0, tension: 0.2, fill: false, borderDash: [2, 3] }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
    plugins: {
      legend: { display: true, position: 'top', labels: { font: { size: 11 }, boxWidth: 12, padding: 16 } },
      tooltip: { callbacks: { label: ctx => ' ' + Math.round(ctx.parsed.y) + '%' } }
    },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,.05)' }, ticks: { maxTicksLimit: 11, font: { size: 11 } } },
      y: {
        grid: { color: 'rgba(0,0,0,.05)' },
        ticks: { font: { size: 11 }, callback: v => Math.round(v) + '%' },
        title: { display: true, text: 'Uso de recurso (%)', font: { size: 11 } }
      }
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
  c5.data.datasets[0].data = T.map(t => F(t) * cf / 100);
  c5.data.datasets[1].data = T.map(t => F(t) * mf / 100);
  c5.data.datasets[2].data = T.map(t => F(t) * bf / 100);
  c5.update();
}
document.getElementById('cpuF').addEventListener('input', updateC5);
document.getElementById('memF').addEventListener('input', updateC5);
document.getElementById('bwF').addEventListener('input', updateC5);

/* ═══════════════════ CHART 6 — Escalamiento ═══════════════════ */
const c6 = new Chart(document.getElementById('chart6'), {
  type: 'line',
  data: {
    labels: tLabels,
    datasets: [
      { label: 'Demanda acumulada F(t)', data: T.map(t => F(t)),        borderColor: '#ef4444', borderWidth: 2.5, pointRadius: 0, tension: 0, fill: false },
      { label: 'Capacidad del sistema',  data: T.map(t => 300 + 20 * t), borderColor: '#10b981', borderWidth: 2.5, pointRadius: 0, tension: 0, fill: false, borderDash: [6, 3] },
      { label: 'Déficit',  data: [], borderColor: 'transparent', backgroundColor: 'rgba(239,68,68,.12)',  fill: { target: '0' }, pointRadius: 0 },
      { label: 'Holgura',  data: [], borderColor: 'transparent', backgroundColor: 'rgba(16,185,129,.12)', fill: { target: '0' }, pointRadius: 0 }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
    plugins: {
      legend: { display: true, position: 'top', labels: { font: { size: 11 }, boxWidth: 12, padding: 16 } },
      tooltip: { callbacks: { label: ctx => ' ' + Math.round(ctx.parsed.y) + ' usuarios' } }
    },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,.05)' }, ticks: { maxTicksLimit: 11, font: { size: 11 } } },
      y: {
        grid: { color: 'rgba(0,0,0,.05)' },
        ticks: { font: { size: 11 }, callback: v => Math.round(v) },
        title: { display: true, text: 'Usuarios', font: { size: 11 } }
      }
    }
  }
});

function updateC6() {
  const ci = +document.getElementById('capIni').value;
  const cg = +document.getElementById('capGrow').value;
  document.getElementById('capIniVal').textContent  = ci;
  document.getElementById('capGrowVal').textContent = cg;
  const capData = T.map(t => ci + cg * t);
  const demData = T.map(t => F(t));
  c6.data.datasets[1].data = capData;
  c6.data.datasets[2].data = capData.map((cap, i) => demData[i] >  cap ? cap : null);
  c6.data.datasets[3].data = capData.map((cap, i) => demData[i] <= cap ? capData[i] : null);
  let cross = '—';
  for (let i = 1; i < T.length; i++) {
    if (demData[i] >= capData[i]) { cross = T[i].toFixed(1); break; }
  }
  document.getElementById('crossDay').textContent  = cross;
  document.getElementById('demandAt10').textContent = Math.round(F(10));
  document.getElementById('capAt10').textContent    = Math.round(ci + cg * 10);
  c6.update();
}
document.getElementById('capIni').addEventListener('input', updateC6);
document.getElementById('capGrow').addEventListener('input', updateC6);
updateC6();

/* ═══════════════════ CHART 7 — Barras diarias ═══════════════════ */
const barColors = DAYS.map(d => {
  const ratio = (d - 1) / 9;
  const r  = Math.round(59  + ratio * (239 - 59));
  const g  = Math.round(130 + ratio * (68  - 130));
  const b2 = Math.round(246 + ratio * (68  - 246));
  return `rgba(${r},${g},${b2},0.85)`;
});

new Chart(document.getElementById('chart7'), {
  type: 'bar',
  data: {
    labels: DAYS.map(d => 'Día ' + d),
    datasets: [{
      label: 'Usuarios/día',
      data: DAYS.map(d => f(d)),
      backgroundColor: barColors,
      borderRadius: 5,
      borderSkipped: false
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 800, easing: 'easeOutBounce' },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ' ' + Math.round(ctx.parsed.y) + ' usuarios/día' } }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: {
        grid: { color: 'rgba(0,0,0,.05)' },
        ticks: { font: { size: 11 }, callback: v => Math.round(v) },
        title: { display: true, text: 'Usuarios / día', font: { size: 11 } }
      }
    }
  }
});

/* ═══════════════════ CHARTS RESUMEN (S1–S4) ═══════════════════ */
const miniOpts = {
  responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } }
};

new Chart(document.getElementById('chartS1'), {
  type: 'line',
  data: { labels: tLabels, datasets: [{ data: T.map(t => f(t)), borderColor: '#3b82f6', borderWidth: 2, pointRadius: 0, tension: 0, fill: { target: 'origin', above: 'rgba(59,130,246,.09)' } }] },
  options: miniOpts
});

new Chart(document.getElementById('chartS2'), {
  type: 'line',
  data: { labels: tLabels, datasets: [
    { data: T.map(t => f(t)), borderColor: '#3b82f6', borderWidth: 1.5, pointRadius: 0, tension: 0, fill: false },
    { data: T.map(t => f(t)), borderColor: 'transparent', backgroundColor: 'rgba(16,185,129,.22)', fill: { target: 'origin' }, pointRadius: 0 }
  ]},
  options: miniOpts
});

new Chart(document.getElementById('chartS3'), {
  type: 'line',
  data: { labels: tLabels, datasets: [{ data: T.map(t => F(t)), borderColor: '#d97706', borderWidth: 2, pointRadius: 0, tension: 0, fill: { target: 'origin', above: 'rgba(217,119,6,.09)' } }] },
  options: miniOpts
});

new Chart(document.getElementById('chartS4'), {
  type: 'line',
  data: { labels: tLabels, datasets: [
    { data: T.map(t => f(t)),      borderColor: '#3b82f6', borderWidth: 1.5, pointRadius: 0, tension: 0,   fill: false },
    { data: T.map(t => fExpo(t)),  borderColor: '#ec4899', borderWidth: 1.5, pointRadius: 0, tension: 0,   fill: false, borderDash: [5, 3] },
    { data: T.map(t => fLogis(t)), borderColor: '#10b981', borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false, borderDash: [2, 3] }
  ]},
  options: { ...miniOpts, scales: { x: { display: false }, y: { display: false, max: 400 } } }
});

/* ═══════════════════ TABS ═══════════════════ */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t  => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.panel).classList.add('active');
    setTimeout(() => { [c1, c2, c3, c4].forEach(c => c.resize()); }, 60);
  });
});
