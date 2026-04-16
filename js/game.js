function sanitize(str) {
return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
}
let _diceId = 0;
function getDiceSVG(value) {
const dotMap = {
1: [[50, 50]],
2: [[28, 28], [72, 72]],
3: [[28, 28], [50, 50], [72, 72]],
4: [[28, 28], [72, 28], [28, 72], [72, 72]],
5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
};
const dots = (dotMap[value] || dotMap[1])
.map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="8.5" fill="#1B2A4A"/>`)
.join('');
const fid = 'ds' + (++_diceId);
return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<defs>
<filter id="${fid}"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter>
</defs>
<rect x="4" y="4" width="92" height="92" rx="18" ry="18"
fill="white" stroke="#ddd" stroke-width="2" filter="url(#${fid})"/>
${dots}
</svg>`;
}
const Game = {
state: {
jugadores: [],
turnoActual: 0,
casillas: CASILLAS,
fase: 'titulo',
gameOver: false,
},
showScreen(id) {
document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
const el = document.getElementById(id);
if (el) el.classList.add('active');
this.state.fase = id.replace('screen-', '');
},
initTitulo() {
document.getElementById('btn-jugar').addEventListener('click', () => {
this.showScreen('screen-config');
this.initConfig();
});
const dadoDecoEl = document.getElementById('dado-deco');
if (dadoDecoEl) dadoDecoEl.innerHTML = getDiceSVG(Math.ceil(Math.random() * 6));
},
initConfig() {
let numJugadores = 1;
const selPersonaje = [0, 1, 2, 3];
const buildItem = (i) => {
const cfg = JUGADORES_CONFIG[i];
const opts = PERSONAJES.map((p, pi) => `
<div class="personaje-opt${selPersonaje[i] === pi ? ' selected' : ''}"
data-jugador="${i}" data-pi="${pi}"
style="${selPersonaje[i] === pi ? `border-color:${cfg.color}` : ''}">
<img src="${p.img}" alt="${p.nombre}">
</div>`).join('');
return `
<div class="jugador-config-item" style="border-color:${cfg.color}">
<div class="jugador-config-header">
<div class="jugador-token-num" style="background:${cfg.color}">${i + 1}</div>
<input type="text" id="nombre-j${i}" placeholder="${cfg.nombre}"
maxlength="12" class="nombre-input" value="${cfg.nombre}"/>
</div>
<div class="personaje-selector">${opts}</div>
</div>`;
};
const updateJugadoresUI = () => {
document.querySelectorAll('.num-btn').forEach(btn =>
btn.classList.toggle('selected', parseInt(btn.dataset.num) === numJugadores)
);
const div = document.getElementById('config-nombres');
div.innerHTML = '';
for (let i = 0; i < numJugadores; i++) div.insertAdjacentHTML('beforeend', buildItem(i));
document.querySelectorAll('.personaje-opt').forEach(opt => {
opt.addEventListener('click', () => {
const ji = parseInt(opt.dataset.jugador);
const pi = parseInt(opt.dataset.pi);
selPersonaje[ji] = pi;
const color = JUGADORES_CONFIG[ji].color;
document.querySelectorAll(`.personaje-opt[data-jugador="${ji}"]`).forEach(o => {
const sel = parseInt(o.dataset.pi) === pi;
o.classList.toggle('selected', sel);
o.style.borderColor = sel ? color : '';
});
});
});
};
document.querySelectorAll('.num-btn').forEach(btn =>
btn.addEventListener('click', () => { numJugadores = parseInt(btn.dataset.num); updateJugadoresUI(); })
);
updateJugadoresUI();
document.getElementById('btn-comenzar').addEventListener('click', () => {
this.state.jugadores = [];
for (let i = 0; i < numJugadores; i++) {
const cfg = JUGADORES_CONFIG[i];
const nombre = sanitize(document.getElementById(`nombre-j${i}`)?.value.trim() || cfg.nombre);
this.state.jugadores.push({
idx: i, nombre,
color: cfg.color, colorClaro: cfg.colorClaro,
personaje: PERSONAJES[selPersonaje[i]],
posicion: 0, puntos: 0, turnosSkip: 0, terminado: false,
});
}
this.showScreen('screen-tablero');
this.initTablero();
});
},
initTablero() {
document.getElementById('dado-display').innerHTML = getDiceSVG(1);
this.actualizarPanelJugadores();
this.updateDadoBtn();
const img = document.querySelector('.mapa-bg');
if (img.complete && img.naturalWidth) {
this.renderTablero();
} else {
img.addEventListener('load', () => this.renderTablero(), { once: true });
}
this._resizeHandler = () => this.renderTablero();
window.addEventListener('resize', this._resizeHandler);
},
getMapOverlay() {
const container = document.querySelector('.mapa-area');
const img = document.querySelector('.mapa-bg');
if (!container || !img) return null;
const cW = container.clientWidth;
const cH = container.clientHeight;
const iW = img.naturalWidth || 1700;
const iH = img.naturalHeight || 1200;
// Siempre hacer zoom al área de casillas (x: 29–72%, y: 12–87%)
// con padding suficiente para labels y tokens en todos los tamaños de pantalla
const scaleBase = Math.min(cW / iW, cH / iH);
const rWBase = iW * scaleBase;
const rHBase = iH * scaleBase;
const X1 = 0.20, X2 = 0.81, Y1 = 0.06, Y2 = 0.95;
const bboxW = (X2 - X1) * rWBase;
const bboxH = (Y2 - Y1) * rHBase;
const zoom = Math.min(cW / bboxW, cH / bboxH);
const rW = rWBase * zoom;
const rH = rHBase * zoom;
const oX = cW / 2 - ((X1 + X2) / 2) * rW;
const oY = cH / 2 - ((Y1 + Y2) / 2) * rH;
return { oX, oY, rW, rH, isMobile: window.innerWidth <= 700 };
},
mapPx(xPct, yPct) {
const o = this.getMapOverlay();
if (!o) return { left: xPct + '%', top: yPct + '%' };
return {
left: (o.oX + (xPct / 100) * o.rW) + 'px',
top: (o.oY + (yPct / 100) * o.rH) + 'px',
};
},
renderTablero() {
const mapaEl = document.getElementById('mapa-container');
mapaEl.innerHTML = '';
const o = this.getMapOverlay();
if (!o) return;
// Posicionar la imagen explícitamente para que coincida con el overlay en todos los tamaños
const bgImg = document.querySelector('.mapa-bg');
bgImg.style.cssText = `position:absolute;left:${o.oX}px;top:${o.oY}px;width:${o.rW}px;height:${o.rH}px;object-fit:fill;`;
const overlay = document.createElement('div');
overlay.id = 'map-overlay';
overlay.style.cssText = `position:absolute;left:${o.oX}px;top:${o.oY}px;width:${o.rW}px;height:${o.rH}px;overflow:visible;`;
mapaEl.appendChild(overlay);
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('viewBox', '0 0 100 100');
svg.setAttribute('preserveAspectRatio', 'none');
svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;';
const pts = CASILLAS.map(c => `${c.x},${c.y}`).join(' ');
const mkLine = (stroke, width, dash) => {
const l = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
l.setAttribute('points', pts);
l.setAttribute('fill', 'none');
l.setAttribute('stroke', stroke);
l.setAttribute('stroke-width', width);
l.setAttribute('stroke-linecap', 'round');
l.setAttribute('stroke-linejoin', 'round');
if (dash) l.setAttribute('stroke-dasharray', dash);
return l;
};
svg.appendChild(mkLine('rgba(0,0,0,0.65)', '2.5', null));
svg.appendChild(mkLine('#FFD100', '1.5', '4,3'));
overlay.appendChild(svg);
CASILLAS.forEach((c, i) => {
const el = document.createElement('div');
el.className = `casilla casilla-${c.type}`;
el.id = `casilla-${i}`;
el.style.left = c.x + '%';
el.style.top = c.y + '%';
const isStart = i === 0;
const isMeta = i === CASILLAS.length - 1;
const numLabel = isStart ? 'INICIO' : isMeta ? 'FINAL' : i;
el.innerHTML = `
<div class="casilla-label${c.y <= 22 ? ' casilla-label-below' : ''}">${c.nombre}</div>
<div class="casilla-num">${numLabel}</div>
`;
overlay.appendChild(el);
});
this.renderTokens();
},
renderTokens() {
document.querySelectorAll('.token').forEach(t => t.remove());
const overlay = document.getElementById('map-overlay');
if (!overlay) return;
const offsets = [[-3.5,-3.5],[3.5,-3.5],[-3.5,3.5],[3.5,3.5]];
this.state.jugadores.forEach((j, ji) => {
const c = CASILLAS[j.posicion];
const [ox, oy] = offsets[ji] || [0, 0];
const token = document.createElement('div');
token.className = `token token-${ji}${ji === this.state.turnoActual && !this.state.gameOver ? ' token-activo' : ''}`;
token.id = `token-${ji}`;
token.style.left = (c.x + ox) + '%';
token.style.top = (c.y + oy) + '%';
token.style.borderColor = j.color;
token.style.boxShadow = `0 0 0 2px ${j.color}, 0 2px 6px rgba(0,0,0,0.5)`;
token.innerHTML = `<img src="${j.personaje.img}" alt="${j.nombre}" class="token-img">`;
overlay.appendChild(token);
});
},
actualizarPanelJugadores() {
const panel = document.getElementById('panel-jugadores');
panel.innerHTML = '';
const jugadores = this.state.jugadores;
const turno = this.state.turnoActual;
// Tarjeta del jugador en turno
const j = jugadores[turno];
if (!j) return;
const card = document.createElement('div');
card.className = 'jugador-card jugador-activo';
card.style.borderColor = j.color;
card.innerHTML = `<div class="jugador-token-mini" style="border-color:${j.color}"><img src="${j.personaje.img}" alt="${j.nombre}" style="width:100%;height:100%;object-fit:contain;border-radius:50%;"></div><div class="jugador-info"><div class="jugador-nombre">${j.nombre}</div><div class="jugador-pts"><strong>${j.puntos}</strong> pts</div><div class="jugador-pos">Casilla ${j.posicion}/${CASILLAS.length - 1}</div></div>${j.terminado ? '<div class="jugador-terminado">🏁</div>' : ''}`;
panel.appendChild(card);
// Puntos del resto en mini-chips
if (jugadores.length > 1) {
const chips = document.createElement('div');
chips.className = 'jugadores-chips';
jugadores.forEach((jj, i) => {
if (i === turno) return;
const chip = document.createElement('div');
chip.className = 'jugador-chip';
chip.style.borderColor = jj.color;
chip.innerHTML = `<div class="chip-dot" style="background:${jj.color}"></div><span>${jj.nombre}</span><strong>${jj.puntos}</strong>`;
chips.appendChild(chip);
});
panel.appendChild(chips);
}
},
updateDadoBtn() {
const btn = document.getElementById('btn-dado');
const j = this.state.jugadores[this.state.turnoActual];
btn.disabled = !j || this.state.gameOver;
if (j) document.getElementById('turno-actual').textContent = `Turno: ${j.nombre}`;
},
lanzarDado() {
const btn = document.getElementById('btn-dado');
btn.disabled = true;
const j = this.state.jugadores[this.state.turnoActual];
if (j.turnosSkip > 0) {
j.turnosSkip--;
this.mostrarMensaje(`${j.nombre} pierde este turno.`, '😓');
setTimeout(() => this.siguienteTurno(), 2000);
return;
}
const dadoEl = document.getElementById('dado-display');
dadoEl.classList.add('dado-rolling');
let ticks = 0;
const total = 14;
const roll = setInterval(() => {
const v = Math.ceil(Math.random() * 6);
dadoEl.innerHTML = getDiceSVG(v);
ticks++;
if (ticks >= total) {
clearInterval(roll);
const resultado = Math.ceil(Math.random() * 6);
dadoEl.innerHTML = getDiceSVG(resultado);
dadoEl.classList.remove('dado-rolling');
dadoEl.classList.add('dado-stop');
setTimeout(() => dadoEl.classList.remove('dado-stop'), 400);
this.moverJugador(resultado);
}
}, 80);
},
moverJugador(pasos) {
const j = this.state.jugadores[this.state.turnoActual];
const destino = Math.min(j.posicion + pasos, CASILLAS.length - 1);
this.animarMovimiento(j.posicion, destino, () => {
if (j.posicion === CASILLAS.length - 1) {
j.puntos += 200; j.terminado = true;
this.actualizarPanelJugadores();
this.mostrarMensaje(`🏆 ¡${j.nombre} llegó a La Gran Estrella! +200 pts`, '🎉');
setTimeout(() => this.verificarFinJuego(), 2500);
} else {
setTimeout(() => this.activarEvento(CASILLAS[j.posicion]), 500);
}
});
},
animarMovimiento(desde, hasta, callback) {
let pos = desde;
const ji = this.state.turnoActual;
const paso = () => {
if (pos >= hasta) {
this.renderTokens(); this.actualizarPanelJugadores(); callback(); return;
}
pos++;
this.state.jugadores[ji].posicion = pos;
this.renderTokens();
const el = document.getElementById(`casilla-${pos}`);
if (el) { el.classList.add('casilla-highlight'); setTimeout(() => el.classList.remove('casilla-highlight'), 380); }
setTimeout(paso, 420);
};
paso();
},
activarEvento(casilla) {
switch (casilla.type) {
case 'dato': this.mostrarDato(casilla.eventoId); break;
case 'quiz': this.mostrarQuiz(casilla.eventoId); break;
case 'minijuego': this.lanzarMinijuego(casilla.eventoId); break;
case 'suerte': this.activarSuerte(); break;
case 'penalidad': this.activarPenalidad(); break;
case 'colaboracion': this.activarColaboracion(); break;
default: this.siguienteTurno();
}
},
mostrarDato(eventoId) {
const dato = DATOS_DATA.find(d => d.id === eventoId);
if (!dato) { this.siguienteTurno(); return; }
this.abrirOverlay(`
<div class="overlay-dato">
<div class="dato-icono">${dato.icono}</div>
<h2>¡Dato Curioso!</h2>
<h3>${dato.titulo}</h3>
<p>${dato.texto}</p>
<p class="dato-aviso">¡Léelo bien! Luego habrá una pregunta rápida para ganar los puntos.</p>
<button id="overlay-ok" class="btn-primary">¡Listo, pregúntame!</button>
</div>
`, () => this.mostrarQuizRapidoDato(dato));
},
mostrarQuizRapidoDato(dato) {
const quiz = dato.quizRapido;
const j = this.state.jugadores[this.state.turnoActual];
this.abrirOverlay(`
<div class="overlay-quiz overlay-quiz-rapido">
<div class="quiz-icono">⚡</div>
<h2>¡Pregunta Rápida!</h2>
<p class="quiz-pregunta">${quiz.pregunta}</p>
<div class="quiz-opciones">
${quiz.opciones.map((op, i) =>
`<button class="opcion-btn" data-idx="${i}">${String.fromCharCode(65+i)}) ${op}</button>`
).join('')}
</div>
</div>
`, null);
document.querySelectorAll('.opcion-btn').forEach(btn => {
btn.addEventListener('click', () => {
const idx = parseInt(btn.dataset.idx);
const correcto = idx === quiz.respuesta;
document.querySelectorAll('.opcion-btn').forEach((b, i) => {
b.disabled = true;
if (i === quiz.respuesta) b.classList.add('correcta');
else if (i === idx) b.classList.add('incorrecta');
});
const msgEl = document.createElement('div');
msgEl.className = `quiz-resultado ${correcto ? 'correcto' : 'incorrecto'}`;
if (correcto) {
j.puntos += dato.puntos;
this.actualizarPanelJugadores();
msgEl.innerHTML = `✅ ¡Correcto! Demostraste que lo leíste. <strong>+${dato.puntos} puntos</strong>`;
} else {
msgEl.innerHTML = `❌ ¡Ups! La respuesta era: <strong>${quiz.opciones[quiz.respuesta]}</strong>. Sin puntos esta vez.`;
}
document.querySelector('.overlay-quiz-rapido').appendChild(msgEl);
const okBtn = document.createElement('button');
okBtn.className = 'btn-primary';
okBtn.textContent = 'Continuar';
okBtn.style.marginTop = '12px';
okBtn.addEventListener('click', () => { this.cerrarOverlay(); this.siguienteTurno(); });
document.querySelector('.overlay-quiz-rapido').appendChild(okBtn);
});
});
},
mostrarQuiz(eventoId) {
const quiz = QUIZ_DATA.find(q => q.id === eventoId);
if (!quiz) { this.siguienteTurno(); return; }
this.abrirOverlay(`
<div class="overlay-quiz">
<div class="quiz-icono">❓</div>
<h2>¡Pregunta!</h2>
<p class="quiz-pregunta">${quiz.pregunta}</p>
<div class="quiz-opciones">
${quiz.opciones.map((op, i) =>
`<button class="opcion-btn" data-idx="${i}">${String.fromCharCode(65+i)}) ${op}</button>`
).join('')}
</div>
</div>
`, null);
document.querySelectorAll('.opcion-btn').forEach(btn => {
btn.addEventListener('click', () => {
const idx = parseInt(btn.dataset.idx);
const correcto = idx === quiz.respuesta;
const j = this.state.jugadores[this.state.turnoActual];
document.querySelectorAll('.opcion-btn').forEach((b, i) => {
b.disabled = true;
if (i === quiz.respuesta) b.classList.add('correcta');
else if (i === idx) b.classList.add('incorrecta');
});
const msgEl = document.createElement('div');
msgEl.className = `quiz-resultado ${correcto ? 'correcto' : 'incorrecto'}`;
msgEl.innerHTML = correcto
? `✅ ${quiz.explicacion} <strong>+100 puntos</strong>`
: `❌ ${quiz.explicacion}`;
document.querySelector('.overlay-quiz').appendChild(msgEl);
if (correcto) { j.puntos += 100; this.actualizarPanelJugadores(); }
const okBtn = document.createElement('button');
okBtn.className = 'btn-primary'; okBtn.textContent = 'Continuar';
okBtn.style.marginTop = '12px';
okBtn.addEventListener('click', () => { this.cerrarOverlay(); this.siguienteTurno(); });
document.querySelector('.overlay-quiz').appendChild(okBtn);
});
});
},
lanzarMinijuego(eventoId) {
const info = MINIJUEGO_DATA[eventoId];
if (!info) { this.siguienteTurno(); return; }
this.abrirOverlay(`
<div class="overlay-minijuego">
<div class="mg-intro">
<div class="mg-intro-icono">${info.icono}</div>
<h2>${info.nombre}</h2>
<p>${info.descripcion}</p>
<button id="overlay-ok" class="btn-primary">¡Vamos!</button>
</div>
<div id="mg-area" class="mg-area" style="display:none"></div>
</div>
`, null);
document.getElementById('overlay-ok').addEventListener('click', () => {
document.querySelector('.mg-intro').style.display = 'none';
const area = document.getElementById('mg-area');
area.style.display = 'block';
Minigames.launch(eventoId, area, (score, mensaje) => {
const j = this.state.jugadores[this.state.turnoActual];
j.puntos += score; this.actualizarPanelJugadores();
area.innerHTML = `
<div class="mg-resultado">
<div class="mg-resultado-icono">${score >= 100 ? '🌟' : score >= 50 ? '⭐' : '😊'}</div>
<h3>${score >= 100 ? '¡Excelente!' : score >= 50 ? '¡Bien hecho!' : '¡Sigue practicando!'}</h3>
<p>${mensaje}</p>
<div class="puntos-ganados">+${score} puntos</div>
<button id="mg-continuar" class="btn-primary">Continuar</button>
</div>`;
document.getElementById('mg-continuar').addEventListener('click', () => {
this.cerrarOverlay(); this.siguienteTurno();
});
});
});
},
activarSuerte() {
const evento = SUERTE_EVENTOS[Math.floor(Math.random() * SUERTE_EVENTOS.length)];
const j = this.state.jugadores[this.state.turnoActual];
this.abrirOverlay(`
<div class="overlay-suerte">
<div class="suerte-icono">⭐</div>
<h2>¡Estrella de la Suerte!</h2>
<p>${evento.texto}</p>
${evento.tipo === 'puntos' ? `<div class="puntos-ganados">+${evento.valor} puntos</div>` : ''}
<button id="overlay-ok" class="btn-primary">¡Genial!</button>
</div>
`, () => {
if (evento.tipo === 'puntos') { j.puntos += evento.valor; this.actualizarPanelJugadores(); this.siguienteTurno(); }
else if (evento.tipo === 'avanza') {
const nuevaPos = Math.min(j.posicion + evento.valor, CASILLAS.length - 1);
this.animarMovimiento(j.posicion, nuevaPos, () => {
if (j.posicion === CASILLAS.length - 1) { j.puntos += 200; j.terminado = true; this.verificarFinJuego(); }
else this.activarEvento(CASILLAS[j.posicion]);
});
}
});
},
activarPenalidad() {
const evento = PENALIDAD_EVENTOS[Math.floor(Math.random() * PENALIDAD_EVENTOS.length)];
const j = this.state.jugadores[this.state.turnoActual];
this.abrirOverlay(`
<div class="overlay-penalidad">
<div class="penalidad-icono">🌀</div>
<h2>¡Desvío!</h2>
<p>${evento.texto}</p>
<button id="overlay-ok" class="btn-primary">Continuar</button>
</div>
`, () => {
if (evento.tipo === 'retrocede') { j.posicion = Math.max(0, j.posicion - evento.valor); this.renderTokens(); this.actualizarPanelJugadores(); }
else if (evento.tipo === 'pierdeturno') { j.turnosSkip += 1; }
this.siguienteTurno();
});
},
activarColaboracion() {
this.abrirOverlay(`
<div class="overlay-colaboracion">
<div class="colab-icono">🤝</div>
<h2>¡Todos Juntos!</h2>
<p>En La Estrella somos comunidad. ¡<strong>Todos los jugadores</strong> ganan 25 puntos!</p>
<div class="puntos-ganados">+25 para cada uno</div>
<button id="overlay-ok" class="btn-primary">¡Qué alegría!</button>
</div>
`, () => { this.state.jugadores.forEach(j => j.puntos += 25); this.actualizarPanelJugadores(); this.siguienteTurno(); });
},
siguienteTurno() {
this.actualizarPanelJugadores();
let next = (this.state.turnoActual + 1) % this.state.jugadores.length;
let intentos = 0;
while (this.state.jugadores[next].terminado && intentos < this.state.jugadores.length) {
next = (next + 1) % this.state.jugadores.length; intentos++;
}
if (intentos >= this.state.jugadores.length) { this.finJuego(); return; }
this.state.turnoActual = next;
this.renderTokens(); this.actualizarPanelJugadores(); this.updateDadoBtn();
},
verificarFinJuego() {
if (this.state.jugadores.some(j => j.terminado)) { setTimeout(() => this.finJuego(), 2000); return; }
this.siguienteTurno();
},
finJuego() {
if (this.state.gameOver) return;
this.state.gameOver = true;
const sorted = [...this.state.jugadores].sort((a, b) => b.puntos - a.puntos);
const ganador = sorted[0];
const tabla = sorted.map((j, i) => `
<div class="resultado-fila${i === 0 ? ' ganador' : ''}">
<div class="resultado-pos">${['🏆','🥈','🥉','4º'][i] || (i+1)+'º'}</div>
<div class="resultado-token" style="border:3px solid ${j.color}">
<img src="${j.personaje.img}" alt="${j.nombre}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
</div>
<div class="resultado-nombre">${j.nombre}</div>
<div class="resultado-puntos">${j.puntos} pts</div>
</div>`).join('');
document.getElementById('fin-titulo').textContent = `¡${ganador.nombre} es el gran explorador siderense!`;
document.getElementById('fin-tabla').innerHTML = tabla;
this.showScreen('screen-fin');
},
abrirOverlay(html, onOk) {
const overlay = document.getElementById('screen-overlay');
document.getElementById('overlay-content').innerHTML = html;
overlay.classList.add('active');
if (onOk) {
const okBtn = document.getElementById('overlay-ok');
if (okBtn) okBtn.addEventListener('click', () => { this.cerrarOverlay(); onOk(); });
}
},
cerrarOverlay() {
document.getElementById('screen-overlay').classList.remove('active');
},
mostrarMensaje(texto, icono = 'ℹ️') {
const el = document.getElementById('mensaje-flotante');
if (!el) return;
el.innerHTML = `${icono} ${texto}`;
el.classList.add('visible');
setTimeout(() => el.classList.remove('visible'), 2800);
},
init() {
this.showScreen('screen-titulo');
this.initTitulo();
document.getElementById('btn-dado').addEventListener('click', () => {
if (!this.state.gameOver) this.lanzarDado();
});
const reload = () => { if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler); location.reload(); };
document.getElementById('btn-nuevo-juego').addEventListener('click', reload);
document.getElementById('btn-reiniciar').addEventListener('click', reload);
}
};
document.addEventListener('DOMContentLoaded', () => Game.init());