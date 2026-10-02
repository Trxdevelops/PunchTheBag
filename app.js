const puntosEl = document.getElementById('puntos');
const rondaEl = document.getElementById('ronda');
const vidaBoss = document.getElementById('vida-boss');
const vidaJugador = document.getElementById('vida-jugador');
const barraTiempo = document.getElementById('barra-tiempo');
const sprite = document.getElementById('sprite');
const avisoEl = document.getElementById('aviso');
const palabraEl = document.getElementById('palabra');
const entrada = document.getElementById('entrada');
const columnaJuego = document.querySelector('.juego');

const zonaInicio = document.getElementById('zona-inicio');
const zonaJuego = document.getElementById('zona-juego');
const zonaDerrota = document.getElementById('zona-derrota');

const finRonda = document.getElementById('fin-ronda');
const finPalabras = document.getElementById('fin-palabras');
const finPrecision = document.getElementById('fin-precision');
const finTiempo = document.getElementById('fin-tiempo');
const finPuntos = document.getElementById('fin-puntos');
const esRecordEl = document.getElementById('es-record');

const sinRecord = document.getElementById('sin-record');
const listaMejor = document.getElementById('mejor');
const mejorPuntos = document.getElementById('mejor-puntos');
const mejorRonda = document.getElementById('mejor-ronda');
const mejorPalabras = document.getElementById('mejor-palabras');
const mejorPrecision = document.getElementById('mejor-precision');
const mejorTiempo = document.getElementById('mejor-tiempo');

const palabras = {
  facil: ['casa', 'perro', 'gato', 'sol', 'luna', 'agua', 'flor', 'mesa', 'libro', 'mano',
          'cielo', 'mar', 'nube', 'lluvia', 'fuego', 'tierra', 'noche', 'playa', 'bosque', 'campo',
          'pajaro', 'leon', 'tigre', 'lobo', 'conejo', 'manzana', 'queso', 'ropa', 'reloj', 'lapiz'],

  media: ['jardin', 'montaña', 'ventana', 'bicicleta', 'cuaderno', 'profesor', 'ordenador', 'pantalla',
          'teclado', 'internet', 'escalera', 'armario', 'espejo', 'lampara', 'biblioteca', 'universidad',
          'laboratorio', 'calendario', 'desayuno', 'restaurante', 'castillo', 'desierto', 'cascada',
          'eclipse', 'huracan', 'terremoto', 'horizonte', 'atardecer', 'ingeniero', 'periodista'],

  dificil: ['extraordinario', 'murcielago', 'ferrocarril', 'incomprensible', 'responsabilidad',
            'caracteristica', 'extraterrestre', 'imprescindible', 'infraestructura', 'videoconferencia',
            'reestructuracion', 'industrializacion', 'reconocimiento', 'funcionamiento', 'procedimiento',
            'acontecimiento', 'envejecimiento', 'incondicional', 'desobediencia', 'autosuficiente',
            'cortocircuito', 'hipersensibilidad', 'desorientacion', 'discriminacion', 'globalizacion',
            'automatizacion', 'especializacion', 'deforestacion', 'sostenibilidad', 'biodiversidad']
};

let vidaDelJugador = 100;
let vidaDelBoss = 100;
let puntos = 0;
let ronda = 1;
let acertadas = 0;
let totales = 0;
let palabraActual = '';
let palabraLimpia = '';
let tiempoInicio = 0;
let tiempoId = null;
let partidaAcabada = false;

function nivelActual() {
  if (ronda <= 2) return 'facil';
  if (ronda <= 5) return 'media';
  return 'dificil';
}

function tiempoLimite() {

  const msPorLetra = Math.max(180, 480 - (ronda - 1) * 30);
  return palabraActual.length * msPorLetra;
}

function dañoQueRecibo() {

  return Math.min(35, 10 + (ronda - 1) * 3);
}

const TILDES = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' };

function limpiar(texto) {
  return texto.toLowerCase().replace(/[áéíóú]/g, function (letra) {
    return TILDES[letra];
  });
}

function nuevaPalabra() {
  const lista = palabras[nivelActual()];
  palabraActual = lista[Math.floor(Math.random() * lista.length)];
  palabraLimpia = limpiar(palabraActual);

  palabraEl.textContent = palabraActual;
  entrada.value = '';
  entrada.focus();

  empezarTiempo();
}

function empezarTiempo() {
  clearTimeout(tiempoId);
  const ms = tiempoLimite();

  barraTiempo.style.transition = 'none';
  barraTiempo.style.transform = 'scaleX(1)';
  barraTiempo.offsetWidth;

  barraTiempo.style.transition = `transform ${ms}ms linear`;
  barraTiempo.style.transform = 'scaleX(0)';

  tiempoId = setTimeout(fallo, ms);
}

function acierto() {
  clearTimeout(tiempoId);
  acertadas++;
  totales++;

  vidaDelBoss = Math.max(0, vidaDelBoss - 10);
  puntos += 105;

  pintarBarra(vidaBoss, vidaDelBoss);
  puntosEl.textContent = puntos;

  if (vidaDelBoss === 0) {
    bossDerrotado();
  } else {
    nuevaPalabra();
  }
}

function bossDerrotado() {
  ronda++;
  vidaDelBoss = 100;

  pintarBarra(vidaBoss, 100);
  rondaEl.textContent = ronda;
  mostrarAviso(`¡Boss derrotado! Ronda ${ronda}`);

  nuevaPalabra();
}

function fallo() {
  clearTimeout(tiempoId);
  totales++;

  vidaDelJugador = Math.max(0, vidaDelJugador - dañoQueRecibo());
  pintarBarra(vidaJugador, vidaDelJugador);

  atacar();
  temblar();

  if (vidaDelJugador === 0) {
    finPartida();
  } else {
    nuevaPalabra();
  }
}

function atacar() {
  sprite.classList.remove('atacando');
  sprite.offsetWidth;
  sprite.classList.add('atacando');
}

sprite.addEventListener('animationend', function () {
  sprite.classList.remove('atacando');
});

function pintarBarra(barra, valor) {
  barra.style.width = `${valor}%`;

  if (valor > 50) {
    barra.className = 'relleno bien';
  } else if (valor > 20) {
    barra.className = 'relleno medio';
  } else {
    barra.className = 'relleno mal';
  }
}

let temblorId = null;

function temblar() {
  columnaJuego.classList.remove('golpe');
  columnaJuego.offsetWidth;
  columnaJuego.classList.add('golpe');

  clearTimeout(temblorId);
  temblorId = setTimeout(function () {
    columnaJuego.classList.remove('golpe');
  }, 300);
}

let avisoId = null;

function mostrarAviso(texto) {
  avisoEl.textContent = texto;

  clearTimeout(avisoId);
  avisoId = setTimeout(function () {
    avisoEl.textContent = '';
  }, 2000);
}

function mostrarZona(zona) {
  zonaInicio.classList.add('oculto');
  zonaJuego.classList.add('oculto');
  zonaDerrota.classList.add('oculto');
  zona.classList.remove('oculto');
}

function precision() {
  if (totales === 0) return 0;
  return Math.round((acertadas / totales) * 100);
}

function segundosJugados() {
  return Math.round((Date.now() - tiempoInicio) / 1000);
}

function finPartida() {
  partidaAcabada = true;
  clearTimeout(tiempoId);

  const resultado = {
    puntos: puntos,
    ronda: ronda,
    palabras: acertadas,
    precision: precision(),
    tiempo: segundosJugados()
  };

  finRonda.textContent = resultado.ronda;
  finPalabras.textContent = resultado.palabras;
  finPrecision.textContent = resultado.precision;
  finTiempo.textContent = resultado.tiempo;
  finPuntos.textContent = resultado.puntos;

  esRecordEl.textContent = comprobarRecord(resultado) ? '¡Nuevo récord!' : '';

  mostrarZona(zonaDerrota);
}

const CLAVE = 'writefight-mejor';
let mejor = JSON.parse(localStorage.getItem(CLAVE));

function pintarMejor() {
  if (!mejor) return;

  sinRecord.classList.add('oculto');
  listaMejor.classList.remove('oculto');

  mejorPuntos.textContent = mejor.puntos;
  mejorRonda.textContent = mejor.ronda;
  mejorPalabras.textContent = mejor.palabras;
  mejorPrecision.textContent = mejor.precision;
  mejorTiempo.textContent = mejor.tiempo;
}

function comprobarRecord(resultado) {
  if (mejor && resultado.puntos <= mejor.puntos) {
    return false;
  }

  mejor = resultado;
  localStorage.setItem(CLAVE, JSON.stringify(mejor));
  pintarMejor();
  return true;
}

function empezarPartida() {
  vidaDelJugador = 100;
  vidaDelBoss = 100;
  puntos = 0;
  ronda = 1;
  acertadas = 0;
  totales = 0;
  partidaAcabada = false;
  tiempoInicio = Date.now();

  pintarBarra(vidaBoss, 100);
  pintarBarra(vidaJugador, 100);
  puntosEl.textContent = 0;
  rondaEl.textContent = 1;
  avisoEl.textContent = '';

  mostrarZona(zonaJuego);
  nuevaPalabra();
}

entrada.addEventListener('input', function () {
  if (partidaAcabada) return;

  if (entrada.value.length !== palabraLimpia.length) return;

  if (limpiar(entrada.value) === palabraLimpia) {
    acierto();
  }
});

document.getElementById('btn-empezar').addEventListener('click', empezarPartida);
document.getElementById('btn-reiniciar').addEventListener('click', empezarPartida);

document.addEventListener('keydown', function (evento) {
  if (evento.key === 'F2') {
    evento.preventDefault();
    document.body.classList.toggle('claro');
  }
});

pintarMejor();
