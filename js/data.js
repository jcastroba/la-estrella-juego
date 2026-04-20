const PUNTOS_INTERES = [
{ nombre: 'La Raya', x: 50, y: 84 },
{ nombre: 'Peñas Blancas', x: 30, y: 79 },
{ nombre: 'La Bermejala', x: 21, y: 71 },
{ nombre: 'Pueblo Viejo', x: 24, y: 59 },
{ nombre: 'El Pedrero', x: 16, y: 49 },
{ nombre: 'San José', x: 16, y: 31 },
{ nombre: 'La Ferrería', x: 41, y: 17 },
{ nombre: 'San Agustín · Suramérica', x: 64, y: 26 },
{ nombre: 'Zona Industrial', x: 70, y: 39 },
{ nombre: 'Ancón', x: 57, y: 54 },
{ nombre: 'Sierra Morena', x: 64, y: 64 },
{ nombre: 'Tablacita', x: 76, y: 64 },
{ nombre: 'San Isidro', x: 70, y: 77 },
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
opciones: ['1586', '1685', '1786'],
respuesta: 1,
explicacion: '¡Correcto! La Estrella fue fundada en 1685. ¡En 2026 celebramos 341 años!'
},
{
id: 'quiz2',
pregunta: '¿Elige cuál es un pájaro icónico de La Estrella?',
opciones: ['Pájaro carpintero', 'Carriquí', 'Cóndor de los Andes'],
respuesta: 1,
explicacion: '¡Exacto! El Carriquí es una de las aves icónicas de nuestro municipio.'
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
texto: '¡Sobre la montaña como una bandera que porta la virgen de Chiquinquirá, con su cielo al hombro avanza La Estrella buscando el futuro para la heredad!',
puntos: 30,
quizRapido: {
pregunta: '¿La estrofa de esta canción pertenece a?',
opciones: ['La nueva canción de Bad Bunny', 'Himno del Municipio de La Estrella', 'Himno de Antioquia'],
respuesta: 1
}
},
{
id: 'dato2',
titulo: 'El Pedrero',
icono: '🌿',
texto: 'La bandera de La Estrella está compuesta por tres colores y un elemento central que la hace única y significativa. El primer color representa la devoción a Nuestra Señora del Rosario de Chiquinquirá, el segundo simboliza la paz y la tranquilidad de sus habitantes, y el último resalta la riqueza de su naturaleza. Además incluye un elemento que guía e identifica al municipio, representando su nombre y el sentido de pertenencia.',
puntos: 30,
quizRapido: {
pregunta: '¿Cuáles son los colores y el elemento que tiene la bandera de La Estrella?',
opciones: ['Dorado, azul, amarillo y el elemento es el hacha', 'Azul, blanco y verde y el elemento es la estrella de ocho puntas', 'Fucsia, negro, café y el elemento es la estrella de cinco puntas'],
respuesta: 1
}
},
{
id: 'dato3',
titulo: 'San Agustín - Suramérica',
icono: '🌎',
texto: 'Los primeros habitantes de nuestro territorio fueron pueblos indígenas, comunidades originarias que se destacaron por su organización social, sus conocimientos agrícolas y su estrecha relación con la naturaleza. Estos grupos poblaron la región desde tiempos antiguos, dejando un importante legado cultural que forma parte de la identidad histórica del municipio.',
puntos: 30,
quizRapido: {
pregunta: '¿Cómo se llamaban los pueblos indígenas que habitaron nuestro territorio?',
opciones: ['Mayas y Mestizos', 'Anaconas', 'Wayuu y Zenú'],
respuesta: 1
}
},
{
id: 'dato4',
titulo: 'La Ferrería',
icono: '⚒️',
texto: 'La Estrella está conformada por barrios y sectores que le dan vida, historia y diversidad a nuestro municipio.',
puntos: 30,
quizRapido: {
pregunta: '¿Cuántos barrios tiene el municipio de La Estrella?',
opciones: ['35 barrios y veredas', '47 barrios', '12 veredas'],
respuesta: 1
}
},
{
id: 'dato5',
titulo: 'Parque Principal',
icono: '🌳',
texto: 'El gentilicio de los que habitamos este hermoso territorio pertenece al espacio sideral, porque vivir en La Estrella es vivir en el cielo.',
puntos: 30,
quizRapido: {
pregunta: '¿Cuál es el gentilicio de los habitantes de La Estrella?',
opciones: ['Estrellenses', 'Siderenses', 'Estrellados'],
respuesta: 1
}
}
];
const CASILLAS = [
{ id: 0, type: 'inicio', nombre: '¡Inicio! La Raya', x: 53, y: 87 },
{ id: 1, type: 'dato', nombre: 'Peñas Blancas', x: 46, y: 82, eventoId: 'dato1' },
{ id: 2, type: 'minijuego', nombre: 'La Bermejala', x: 37, y: 74, eventoId: 'mini1' },
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
{ palabra: 'FERRERIA', pista: 'Barrio del Municipio de La Estrella' },
{ palabra: 'ESTRELLA', pista: 'El nombre de nuestro municipio' },
];
const PALABRAS_REVUELTAS = [
{ revuelta: 'DRAESLAT', original: 'LA ESTRELLA', pista: 'El nombre de nuestro municipio' },
{ revuelta: 'SEDERINSE', original: 'SIDERENSE', pista: 'El gentilicio de La Estrella' },
{ revuelta: 'IRRAFERE', original: 'FERRERIA', pista: 'Barrio del Municipio de La Estrella' },
];
const MEMORIA_PARES = [
{ id: 'a', icono: '⭐', nombre: 'Estrella' },
{ id: 'b', icono: '🌿', nombre: 'Naturaleza' },
{ id: 'c', icono: '⚒️', nombre: 'Ferrería' },
{ id: 'd', icono: '🐿️', nombre: 'Ardilla' },
{ id: 'e', icono: '🌽', nombre: 'Maíz' },
{ id: 'f', icono: '🏘️', nombre: 'Pueblo' },
];