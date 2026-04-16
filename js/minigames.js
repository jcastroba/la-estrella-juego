const Minigames = {
mini1: {
timer: null,
interval: null,
caught: 0,
total: 12,
render() {
return `
<div class="mg-atrapa">
<div class="mg-header">
<h3>⭐ Atrapa la Estrella</h3>
<p>¡Haz clic en todas las estrellas antes de que desaparezcan!</p>
</div>
<div class="mg-stats">
<span>Atrapadas: <strong id="mg-caught">0</strong> / ${this.total}</span>
<span>Tiempo: <strong id="mg-timer">15</strong>s</span>
</div>
<div id="mg-canvas" class="mg-canvas-atrapa"></div>
<button id="mg-start-btn" class="btn-primary">¡Comenzar!</button>
</div>
`;
},
init(onFinish) {
this.caught = 0;
this.onFinish = onFinish;
document.getElementById('mg-start-btn').addEventListener('click', () => {
document.getElementById('mg-start-btn').style.display = 'none';
this.start();
});
},
start() {
let timeLeft = 15;
let starsCreated = 0;
const canvas = document.getElementById('mg-canvas');
const spawnStar = () => {
if (starsCreated >= this.total) return;
starsCreated++;
const star = document.createElement('div');
star.className = 'falling-star';
star.textContent = '⭐';
star.style.left = (Math.random() * 80 + 5) + '%';
star.style.top = (Math.random() * 70 + 5) + '%';
star.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
canvas.appendChild(star);
star.addEventListener('click', () => {
if (star.dataset.caught) return;
star.dataset.caught = '1';
this.caught++;
document.getElementById('mg-caught').textContent = this.caught;
star.textContent = '✨';
star.style.transform = 'scale(1.5)';
setTimeout(() => star.remove(), 400);
});
setTimeout(() => {
if (!star.dataset.caught) star.remove();
}, 2500);
};
this.interval = setInterval(spawnStar, 1200);
this.timer = setInterval(() => {
timeLeft--;
const el = document.getElementById('mg-timer');
if (el) el.textContent = timeLeft;
if (timeLeft <= 0) this.end();
}, 1000);
},
end() {
clearInterval(this.timer);
clearInterval(this.interval);
const score = Math.round((this.caught / this.total) * 150);
this.onFinish(score, `¡Atrapaste ${this.caught} de ${this.total} estrellas!`);
}
},
mini2: {
cards: [],
flipped: [],
matched: 0,
moves: 0,
locked: false,
render() {
return `
<div class="mg-memoria">
<div class="mg-header">
<h3>🧠 Memoria Siderense</h3>
<p>¡Encuentra todos los pares de íconos de La Estrella!</p>
</div>
<div class="mg-stats">
<span>Pares: <strong id="mg-matched">0</strong> / 6</span>
<span>Intentos: <strong id="mg-moves">0</strong></span>
</div>
<div id="mg-grid" class="mg-grid-memoria"></div>
</div>
`;
},
init(onFinish) {
this.onFinish = onFinish;
this.matched = 0;
this.moves = 0;
this.flipped = [];
this.locked = false;
const pairs = [...MEMORIA_PARES, ...MEMORIA_PARES];
this.cards = pairs.sort(() => Math.random() - 0.5).map((p, i) => ({ ...p, idx: i, revealed: false, matched: false }));
const grid = document.getElementById('mg-grid');
this.cards.forEach((card, i) => {
const el = document.createElement('div');
el.className = 'memoria-card';
el.dataset.idx = i;
el.innerHTML = `<div class="card-inner"><div class="card-front">?</div><div class="card-back">${card.icono}</div></div>`;
el.addEventListener('click', () => this.flip(i, el));
grid.appendChild(el);
});
},
flip(idx, el) {
const card = this.cards[idx];
if (this.locked || card.revealed || card.matched) return;
card.revealed = true;
el.classList.add('flipped');
this.flipped.push({ idx, el, card });
if (this.flipped.length === 2) {
this.locked = true;
this.moves++;
document.getElementById('mg-moves').textContent = this.moves;
const [a, b] = this.flipped;
if (a.card.id === b.card.id) {
a.card.matched = true; b.card.matched = true;
a.el.classList.add('matched'); b.el.classList.add('matched');
this.matched++;
document.getElementById('mg-matched').textContent = this.matched;
this.flipped = [];
this.locked = false;
if (this.matched === 6) {
setTimeout(() => {
const score = Math.max(0, 150 - (this.moves - 6) * 10);
this.onFinish(score, `¡Encontraste todos los pares en ${this.moves} intentos!`);
}, 600);
}
} else {
setTimeout(() => {
a.card.revealed = false; b.card.revealed = false;
a.el.classList.remove('flipped'); b.el.classList.remove('flipped');
this.flipped = [];
this.locked = false;
}, 900);
}
}
}
},
mini3: {
palabra: '',
pista: '',
letrasUsadas: [],
errores: 0,
maxErrores: 6,
render() {
const entry = AHORCADO_PALABRAS[Math.floor(Math.random() * AHORCADO_PALABRAS.length)];
this.palabra = entry.palabra;
this.pista = entry.pista;
this.letrasUsadas = [];
this.errores = 0;
return `
<div class="mg-ahorcado">
<div class="mg-header">
<h3>🔤 Ahorcado Siderense</h3>
<p class="mg-pista">Pista: <em>${this.pista}</em></p>
</div>
<div id="mg-display" class="ahorcado-display"></div>
<div class="ahorcado-errores">Errores: <strong id="mg-errores">0</strong> / ${this.maxErrores}</div>
<div id="mg-teclado" class="ahorcado-teclado"></div>
<div id="mg-letras-usadas" class="letras-usadas"></div>
</div>
`;
},
init(onFinish) {
this.onFinish = onFinish;
this.updateDisplay();
const teclado = document.getElementById('mg-teclado');
'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').forEach(letra => {
const btn = document.createElement('button');
btn.className = 'letra-btn';
btn.textContent = letra;
btn.addEventListener('click', () => this.adivinar(letra, btn));
teclado.appendChild(btn);
});
},
updateDisplay() {
const el = document.getElementById('mg-display');
if (!el) return;
el.innerHTML = this.palabra.split('').map(l =>
l === ' ' ? '<span class="letra-espacio"> </span>' :
this.letrasUsadas.includes(l) ? `<span class="letra-revelada">${l}</span>` : '<span class="letra-oculta">_</span>'
).join('');
},
adivinar(letra, btn) {
if (this.letrasUsadas.includes(letra)) return;
this.letrasUsadas.push(letra);
btn.disabled = true;
btn.classList.add('usada');
const usadasEl = document.getElementById('mg-letras-usadas');
if (usadasEl) usadasEl.textContent = 'Usadas: ' + this.letrasUsadas.join(', ');
if (!this.palabra.includes(letra)) {
this.errores++;
btn.classList.add('error');
document.getElementById('mg-errores').textContent = this.errores;
} else {
btn.classList.add('correcto');
}
this.updateDisplay();
const ganado = this.palabra.split('').filter(l => l !== ' ').every(l => this.letrasUsadas.includes(l));
if (ganado) {
const score = Math.max(0, 150 - this.errores * 25);
setTimeout(() => this.onFinish(score, `¡Adivinaste "${this.palabra}" con ${this.errores} errores!`), 600);
} else if (this.errores >= this.maxErrores) {
setTimeout(() => this.onFinish(0, `La palabra era: "${this.palabra}". ¡Sigue practicando!`), 600);
}
}
},
mini4: {
secuencia: [],
paso: 0,
mostrando: false,
colores: ['#E53E3E', '#3182CE', '#38A169', '#F5C518'],
nombres: ['Rojo', 'Azul', 'Verde', 'Amarillo'],
nivel: 0,
render() {
return `
<div class="mg-simon">
<div class="mg-header">
<h3>🎨 Simón Siderense</h3>
<p>¡Repite la secuencia de colores! Observa bien.</p>
</div>
<div class="mg-stats">
<span>Nivel: <strong id="mg-nivel">0</strong></span>
</div>
<div class="simon-grid">
<button class="simon-btn" id="simon-0" style="background:#E53E3E"></button>
<button class="simon-btn" id="simon-1" style="background:#3182CE"></button>
<button class="simon-btn" id="simon-2" style="background:#38A169"></button>
<button class="simon-btn" id="simon-3" style="background:#F5C518"></button>
</div>
<p id="mg-simon-msg" class="simon-msg">¡Presiona Iniciar cuando estés listo!</p>
<button id="mg-start-btn" class="btn-primary">¡Comenzar!</button>
</div>
`;
},
init(onFinish) {
this.onFinish = onFinish;
this.secuencia = [];
this.nivel = 0;
document.getElementById('mg-start-btn').addEventListener('click', () => {
document.getElementById('mg-start-btn').style.display = 'none';
this.siguienteNivel();
});
this.colores.forEach((_, i) => {
document.getElementById(`simon-${i}`).addEventListener('click', () => {
if (!this.mostrando) this.presionar(i);
});
});
},
siguienteNivel() {
this.nivel++;
this.paso = 0;
document.getElementById('mg-nivel').textContent = this.nivel;
document.getElementById('mg-simon-msg').textContent = '¡Observa la secuencia!';
this.secuencia.push(Math.floor(Math.random() * 4));
setTimeout(() => this.mostrarSecuencia(), 800);
},
mostrarSecuencia() {
this.mostrando = true;
let i = 0;
const interval = setInterval(() => {
const idx = this.secuencia[i];
this.iluminar(idx);
i++;
if (i >= this.secuencia.length) {
clearInterval(interval);
setTimeout(() => {
this.mostrando = false;
document.getElementById('mg-simon-msg').textContent = '¡Ahora tú! Repite la secuencia.';
}, 700);
}
}, 700);
},
iluminar(idx) {
const btn = document.getElementById(`simon-${idx}`);
btn.style.filter = 'brightness(2)';
setTimeout(() => btn.style.filter = 'brightness(1)', 400);
},
presionar(idx) {
this.iluminar(idx);
if (idx !== this.secuencia[this.paso]) {
const score = Math.min(150, (this.nivel - 1) * 30);
document.getElementById('mg-simon-msg').textContent = '¡Ups! Secuencia incorrecta.';
setTimeout(() => this.onFinish(score, `¡Llegaste al nivel ${this.nivel - 1}!`), 800);
return;
}
this.paso++;
if (this.paso >= this.secuencia.length) {
if (this.nivel >= 5) {
setTimeout(() => this.onFinish(150, `¡Perfecto! ¡Completaste todos los niveles!`), 400);
} else {
document.getElementById('mg-simon-msg').textContent = '¡Bien! Siguiente nivel...';
setTimeout(() => this.siguienteNivel(), 1000);
}
}
}
},
mini5: {
entrada: [],
objetivo: '',
letrasDisp: [],
timerInterval: null,
render() {
const entry = PALABRAS_REVUELTAS[Math.floor(Math.random() * PALABRAS_REVUELTAS.length)];
this.objetivo = entry.original;
this.pista = entry.pista;
this.letrasDisp = entry.revuelta.split('').sort(() => Math.random() - 0.5);
this.entrada = [];
return `
<div class="mg-revueltas">
<div class="mg-header">
<h3>🔀 Palabras Revueltas</h3>
<p>Pista: <em>${this.pista}</em></p>
</div>
<div class="mg-stats">
<span>Tiempo: <strong id="mg-timer">30</strong>s</span>
</div>
<div id="mg-entrada" class="revueltas-entrada"></div>
<div id="mg-letras" class="revueltas-letras"></div>
<button id="mg-borrar" class="btn-secondary">⌫ Borrar</button>
</div>
`;
},
init(onFinish) {
this.onFinish = onFinish;
this.entrada = [];
this.actualizarDisplay();
const letrasEl = document.getElementById('mg-letras');
this.letrasDisp.forEach((l, i) => {
const btn = document.createElement('button');
btn.className = 'letra-btn-rev';
btn.textContent = l;
btn.dataset.idx = i;
btn.addEventListener('click', () => {
if (btn.disabled) return;
btn.disabled = true;
this.entrada.push({ letra: l, idx: i, btn });
this.actualizarDisplay();
this.verificar();
});
letrasEl.appendChild(btn);
});
document.getElementById('mg-borrar').addEventListener('click', () => {
if (this.entrada.length > 0) {
const last = this.entrada.pop();
last.btn.disabled = false;
this.actualizarDisplay();
}
});
let t = 30;
this.timerInterval = setInterval(() => {
t--;
const el = document.getElementById('mg-timer');
if (el) el.textContent = t;
if (t <= 0) {
clearInterval(this.timerInterval);
this.onFinish(0, `¡Se acabó el tiempo! La respuesta era: ${this.objetivo}`);
}
}, 1000);
},
actualizarDisplay() {
const el = document.getElementById('mg-entrada');
if (!el) return;
el.innerHTML = this.entrada.map(e =>
`<span class="letra-entrada">${e.letra}</span>`
).join('') + (this.entrada.length === 0 ? '<span class="placeholder-entrada">Toca las letras...</span>' : '');
},
verificar() {
const palabraActual = this.entrada.map(e => e.letra).join('');
if (palabraActual === this.objetivo.replace(/ /g, '')) {
clearInterval(this.timerInterval);
const timerEl = document.getElementById('mg-timer');
const bonus = timerEl ? parseInt(timerEl.textContent) : 0;
const score = 100 + Math.round(bonus * 1.67);
setTimeout(() => this.onFinish(Math.min(score, 150), `¡Correcto! La palabra es: ${this.objetivo}`), 400);
}
}
},
launch(id, container, onFinish) {
const mg = this[id];
if (!mg) { onFinish(0, 'Minijuego no disponible.'); return; }
container.innerHTML = mg.render.call(mg);
setTimeout(() => mg.init.call(mg, onFinish), 50);
}
};