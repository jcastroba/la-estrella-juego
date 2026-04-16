const PUNTOS_INTERES = [
{ nombre: 'La Raya', x: 50, y: 84 },
{ nombre: 'Peñas Blancas', x: 30, y: 79 },
{ nombre: 'Bermejela', x: 21, y: 71 },
{ nombre: 'Pueblo Viejo', x: 24, y: 59 },
{ nombre: 'El Pedrero', x: 16, y: 49 },
{ nombre: 'San José', x: 16, y: 31 },
{ nombre: 'Ferrería', x: 41, y: 17 },
{ nombre: 'San Agustín · Suramérica', x: 64, y: 26 },
{ nombre: 'Zona Industrial', x: 70, y: 39 },
{ nombre: 'Ancón', x: 57, y: 54 },
{ nombre: 'Sierra Morena', x: 64, y: 64 },
{ nombre: 'Tablacita', x: 76, y: 64 },
{ nombre: 'San Isidro 2', x: 70, y: 77 },
{ nombre: 'Parque Principal', x: 44, y: 41 },
];
const PERSONAJES = [
{ id: 'ardilla', nombre: 'La Ardilla', img: 'assets/img/ardilla.webp' },
{ id: 'corona', nombre: 'La Corona', img: 'assets/img/corona.webp' },
{ id: 'flor', nombre: 'La Flor', img: 'assets/img/flor.webp' },
{ id: 'guacamaya', nombre: 'La Guacamaya',img: 'assets/img/guacamaya.webp' },
];
const QUIZ_DATA = [
{
id: 'quiz1',
pregunta: '¿En qué año fue fundado el municipio de La Estrella?',
opciones: ['1586', '1686', '1786'],
respuesta: 1,
explicacion: '¡Correcto! La Estrella fue fundada en 1686. ¡En 2026 celebramos 340 años!'
},
{
id: 'quiz2',
pregunta: '¿Cómo se llaman los habitantes de La Estrella?',
opciones: ['Estrelleños', 'Siderenses', 'Estrellenses'],
respuesta: 1,
explicacion: '¡Exacto! Los habitantes de La Estrella se llaman Siderenses, un nombre muy especial.'
},
{
id: 'quiz3',
pregunta: '¿En qué área metropolitana está ubicado el municipio de La Estrella?',
opciones: ['Valle de Aburrá', 'Oriente Antioqueño', 'Suroeste Antioqueño'],
respuesta: 0,
explicacion: '¡Muy bien! La Estrella hace parte del Valle de Aburrá, el corazón de Antioquia.'
},
{
id: 'quiz4',
pregunta: '¿Cuántas puntas tiene la estrella en el símbolo del municipio?',
opciones: ['5 puntas', '6 puntas', '8 puntas'],
respuesta: 2,
explicacion: '¡Correcto! La estrella del municipio tiene 8 puntas, representando su brillo y tradición.'
}
];
const DATOS_DATA = [
{
id: 'dato1',
titulo: 'Peñas Blancas',
icono: '🏔️',
texto: 'Las Peñas Blancas son formaciones rocosas naturales que han servido de referencia a los habitantes de La Estrella desde tiempos ancestrales. ¡Son parte del paisaje siderense!',
puntos: 30,
quizRapido: {
pregunta: '¿Para qué han servido las Peñas Blancas a los habitantes de La Estrella?',
opciones: ['Como zona de cultivos', 'Como referencia desde tiempos ancestrales', 'Como fuente de agua'],
respuesta: 1
}
},
{
id: 'dato2',
titulo: 'El Pedrero',
icono: '🌿',
texto: 'El Pedrero es una zona natural que conserva la rica biodiversidad del municipio, con flora y fauna típica del Valle de Aburrá. ¡Un tesoro verde de La Estrella!',
puntos: 30,
quizRapido: {
pregunta: '¿Qué conserva la zona natural de El Pedrero?',
opciones: ['Documentos históricos coloniales', 'La biodiversidad con flora y fauna del Valle de Aburrá', 'Ruinas de una antigua ferrería'],
respuesta: 1
}
},
{
id: 'dato3',
titulo: 'San Agustín - Suramérica',
icono: '🌎',
texto: 'Este barrio representa la diversidad y el espíritu integrador de La Estrella. Su nombre evoca las raíces profundas que conectan al municipio con toda América.',
puntos: 30,
quizRapido: {
pregunta: '¿Qué representa el barrio San Agustín - Suramérica?',
opciones: ['La industria y el comercio siderense', 'La diversidad y el espíritu integrador de La Estrella', 'El centro administrativo del municipio'],
respuesta: 1
}
},
{
id: 'dato4',
titulo: 'La Ferrería',
icono: '⚒️',
texto: '¡La Ferrería fue uno de los primeros centros de producción de hierro en Colombia! Su legado industrial sigue siendo una parte fundamental de la identidad siderense.',
puntos: 30,
quizRapido: {
pregunta: '¿Por qué es famosa La Ferrería de La Estrella?',
opciones: ['Por ser la primera iglesia de Antioquia', 'Por ser uno de los primeros centros de producción de hierro en Colombia', 'Por ser el mercado más antiguo del Valle de Aburrá'],
respuesta: 1
}
},
{
id: 'dato5',
titulo: 'Parque Principal',
icono: '🌳',
texto: 'El Parque Principal es el corazón de La Estrella, donde la comunidad se reúne para celebrar sus fiestas, eventos culturales y tradiciones que hacen única a esta tierra.',
puntos: 30,
quizRapido: {
pregunta: '¿Qué ocurre en el Parque Principal de La Estrella?',
opciones: ['Se producen artesanías para exportar', 'La comunidad se reúne a celebrar fiestas y eventos culturales', 'Se realizan competencias deportivas nacionales'],
respuesta: 1
}
}
];
const CASILLAS = [
{ id: 0, type: 'inicio', nombre: '¡Inicio! La Raya', x: 53, y: 87 },
{ id: 1, type: 'dato', nombre: 'Peñas Blancas', x: 46, y: 82, eventoId: 'dato1' },
{ id: 2, type: 'minijuego', nombre: 'Bermejela', x: 37, y: 74, eventoId: 'mini1' },
{ id: 3, type: 'quiz', nombre: 'Pueblo Viejo', x: 31, y: 65, eventoId: 'quiz1' },
{ id: 4, type: 'dato', nombre: 'El Pedrero', x: 29, y: 55, eventoId: 'dato2' },
{ id: 5, type: 'suerte', nombre: '¡Estrella de la Suerte!', x: 29, y: 44 },
{ id: 6, type: 'minijuego', nombre: 'San José', x: 32, y: 33, eventoId: 'mini2' },
{ id: 7, type: 'quiz', nombre: 'La Ferrería', x: 40, y: 20, eventoId: 'quiz2' },
{ id: 8, type: 'dato', nombre: 'San Agustín · Suramérica', x: 46, y: 12, eventoId: 'dato3' },
{ id: 9, type: 'minijuego', nombre: 'Zona Industrial', x: 57, y: 18, eventoId: 'mini3' },
{ id: 10, type: 'colaboracion', nombre: '¡Todos Juntos!', x: 67, y: 29 },
{ id: 11, type: 'quiz', nombre: 'Ancón', x: 72, y: 41, eventoId: 'quiz3' },
{ id: 12, type: 'minijuego', nombre: 'Sierra Morena', x: 69, y: 53, eventoId: 'mini4' },
{ id: 13, type: 'dato', nombre: 'Tablacita', x: 63, y: 61, eventoId: 'dato4' },
{ id: 14, type: 'penalidad', nombre: 'Desvío del Camino', x: 63, y: 72 },
{ id: 15, type: 'quiz', nombre: 'San Isidro', x: 69, y: 83, eventoId: 'quiz4' },
{ id: 16, type: 'minijuego', nombre: 'Camino al Centro', x: 48, y: 68, eventoId: 'mini5' },
{ id: 17, type: 'dato', nombre: 'Parque Principal', x: 43, y: 57, eventoId: 'dato5' },
{ id: 18, type: 'meta', nombre: '¡La Gran Estrella!', x: 49, y: 45 },
];
const JUGADORES_CONFIG = [
{ nombre: 'Jugador 1', color: '#FF6471', colorClaro: '#FFD6D9', personaje: 0 },
{ nombre: 'Jugador 2', color: '#94C11E', colorClaro: '#DFF0A8', personaje: 1 },
{ nombre: 'Jugador 3', color: '#FFD100', colorClaro: '#FFF3A0', personaje: 2 },
{ nombre: 'Jugador 4', color: '#152D49', colorClaro: '#B0C4D8', personaje: 3 },
];
const SUERTE_EVENTOS = [
{ texto: '¡Encontraste una estrella de la suerte! Avanzas 2 casillas.', tipo: 'avanza', valor: 2 },
{ texto: '¡El viento siderense te impulsa! Ganas 50 puntos bonus.', tipo: 'puntos', valor: 50 },
{ texto: '¡La Ardilla te guía! Avanzas 1 casilla extra.', tipo: 'avanza', valor: 1 },
{ texto: '¡La ardilla te da su energía! Ganas 30 puntos bonus.', tipo: 'puntos', valor: 30 },
];
const PENALIDAD_EVENTOS = [
{ texto: '¡Ups! Tomaste el camino equivocado. Retrocedes 2 casillas.', tipo: 'retrocede', valor: 2 },
{ texto: '¡Desvío en la ruta! Pierdes tu próximo turno.', tipo: 'pierdeturno', valor: 0 },
];
const MINIJUEGO_DATA = {
mini1: {
nombre: 'Atrapa la Estrella',
descripcion: '¡Haz clic en todas las estrellas que caigan! Tienes 15 segundos.',
icono: '⭐'
},
mini2: {
nombre: 'Memoria Siderense',
descripcion: '¡Encuentra todos los pares! Recuerda bien las cartas.',
icono: '🧠'
},
mini3: {
nombre: 'Ahorcado Siderense',
descripcion: '¡Adivina la palabra relacionada con La Estrella!',
icono: '🔤'
},
mini4: {
nombre: 'Simón Siderense',
descripcion: '¡Repite la secuencia de colores! Sigue el patrón.',
icono: '🎨'
},
mini5: {
nombre: 'Palabras Revueltas',
descripcion: '¡Descifra el nombre revuelto del municipio!',
icono: '🔀'
}
};
const AHORCADO_PALABRAS = [
{ palabra: 'SIDERENSE', pista: 'Así se llaman los habitantes de La Estrella' },
{ palabra: 'FERRERIA', pista: 'Primer lugar de producción de hierro en Colombia' },
{ palabra: 'ESTRELLA', pista: 'El nombre de nuestro municipio' },
];
const PALABRAS_REVUELTAS = [
{ revuelta: 'DRAESLAT', original: 'LA ESTRELLA', pista: 'El nombre de nuestro municipio' },
{ revuelta: 'SEDERINSE', original: 'SIDERENSE', pista: 'El gentilicio de La Estrella' },
{ revuelta: 'IRRAFERE', original: 'FERRERIA', pista: 'Lugar histórico de producción' },
];
const MEMORIA_PARES = [
{ id: 'a', icono: '⭐', nombre: 'Estrella' },
{ id: 'b', icono: '🌿', nombre: 'Naturaleza' },
{ id: 'c', icono: '⚒️', nombre: 'Ferrería' },
{ id: 'd', icono: '🐿️', nombre: 'Ardilla' },
{ id: 'e', icono: '🌽', nombre: 'Maíz' },
{ id: 'f', icono: '🏘️', nombre: 'Pueblo' },
];