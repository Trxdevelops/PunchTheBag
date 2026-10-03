const VIDA_MAXIMA = 100;
const DANO_AL_BOSS = 10;
const PUNTOS_POR_ACIERTO = 105;
const DANO_BASE = 10;
const DANO_MAXIMO = 35;
const MS_POR_LETRA_BASE = 480;
const MS_POR_LETRA_MINIMO = 180;
const MS_TEMBLOR = 300;
const MS_AVISO = 2000;
const MAX_HISTORIAL = 5;
const CLAVE_MEJOR = 'writefight-mejor';
const CLAVE_HISTORIAL = 'writefight-historial';
const PALABRA_SECRETA = 'oscuro';

const puntosEl = document.getElementById('puntos');
const rondaEl = document.getElementById('ronda');
const vidaBoss = document.getElementById('vida-boss');
const vidaJugador = document.getElementById('vida-jugador');
const barraTiempo = document.getElementById('barra-tiempo');
const sprite = document.getElementById('sprite');
const avisoEl = document.getElementById('aviso');
const palabraEl = document.getElementById('palabra');
const entrada = document.getElementById('entrada');
const esRecordEl = document.getElementById('es-record');
const sinRecord = document.getElementById('sin-record');
const listaMejor = document.getElementById('mejor');
const historialEl = document.getElementById('historial');
const sinHistorial = document.getElementById('sin-historial');
const columnaJuego = document.querySelector('.juego');

const zonaInicio = document.getElementById('zona-inicio');
const zonaJuego = document.getElementById('zona-juego');
const zonaDerrota = document.getElementById('zona-derrota');

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

const TILDES = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' };

let vidaDelJugador = VIDA_MAXIMA;
let vidaDelBoss = VIDA_MAXIMA;
let puntos = 0;
let ronda = 1;
let acertadas = 0;
let totales = 0;
let palabraActual = '';
let palabraLimpia = '';
let tiempoInicio = 0;
let partidaAcabada = false;

let tiempoId = null;
let temblorId = null;
let avisoId = null;
let teclasPulsadas = '';

function leerGuardado(clave, porDefecto) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado === null ? porDefecto : JSON.parse(guardado);
  } catch (error) {
    return porDefecto;
  }
}

function escribirGuardado(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    return;
  }
}

let mejor = leerGuardado(CLAVE_MEJOR, null);
let historial = leerGuardado(CLAVE_HISTORIAL, []);

function nivelActual() {
  if (ronda <= 2) return 'facil';
  if (ronda <= 5) return 'media';
  return 'dificil';
}

function tiempoLimite() {
  const msPorLetra = Math.max(MS_POR_LETRA_MINIMO, MS_POR_LETRA_BASE - (ronda - 1) * 30);
  return palabraActual.length * msPorLetra;
}

function dañoQueRecibo() {
  return Math.min(DANO_MAXIMO, DANO_BASE + (ronda - 1) * 3);
}

function limpiar(texto) {
  return texto.toLowerCase().replace(/[áéíóú]/g, function (letra) {
    return TILDES[letra];
  });
}

function reiniciarAnimacion(elemento, clase) {
  elemento.classList.remove(clase);
  elemento.offsetWidth;
  elemento.classList.add(clase);
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

  vidaDelBoss = Math.max(0, vidaDelBoss - DANO_AL_BOSS);
  puntos += PUNTOS_POR_ACIERTO;

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
  vidaDelBoss = VIDA_MAXIMA;

  pintarBarra(vidaBoss, VIDA_MAXIMA);
  rondaEl.textContent = ronda;
  mostrarAviso(`¡Boss derrotado! Ronda ${ronda}`);

  nuevaPalabra();
}

function fallo() {
  clearTimeout(tiempoId);
  totales++;

  vidaDelJugador = Math.max(0, vidaDelJugador - dañoQueRecibo());
  pintarBarra(vidaJugador, vidaDelJugador);

  reiniciarAnimacion(sprite, 'atacando');
  temblar();

  if (vidaDelJugador === 0) {
    finPartida();
  } else {
    nuevaPalabra();
  }
}

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

function temblar() {
  reiniciarAnimacion(columnaJuego, 'golpe');
  clearTimeout(temblorId);
  temblorId = setTimeout(function () {
    columnaJuego.classList.remove('golpe');
  }, MS_TEMBLOR);
}

function mostrarAviso(texto) {
  avisoEl.textContent = texto;
  clearTimeout(avisoId);
  avisoId = setTimeout(function () {
    avisoEl.textContent = '';
  }, MS_AVISO);
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

function pintarResultado(prefijo, datos) {
  Object.entries(datos).forEach(function ([clave, valor]) {
    document.getElementById(`${prefijo}-${clave}`).textContent = valor;
  });
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

  pintarResultado('fin', resultado);
  esRecordEl.textContent = comprobarRecord(resultado) ? '¡Nuevo récord!' : '';
  anadirAlHistorial(resultado);

  mostrarZona(zonaDerrota);
}

function comprobarRecord(resultado) {
  if (mejor && resultado.puntos <= mejor.puntos) {
    return false;
  }

  mejor = resultado;
  escribirGuardado(CLAVE_MEJOR, mejor);
  pintarMejor();
  return true;
}

function pintarMejor() {
  if (!mejor) return;

  sinRecord.classList.add('oculto');
  listaMejor.classList.remove('oculto');
  pintarResultado('mejor', mejor);
}

function anadirAlHistorial(resultado) {
  historial.unshift(resultado);
  historial = historial.slice(0, MAX_HISTORIAL);
  escribirGuardado(CLAVE_HISTORIAL, historial);
  pintarHistorial();
}

function pintarHistorial() {
  historialEl.textContent = '';

  if (historial.length === 0) {
    sinHistorial.classList.remove('oculto');
    return;
  }
  sinHistorial.classList.add('oculto');

  historial.forEach(function (partida, posicion) {
    const fila = document.createElement('li');

    const numero = document.createElement('span');
    numero.className = 'numero';
    numero.textContent = `${posicion + 1}`;

    const detalle = document.createElement('span');
    detalle.textContent = `${partida.puntos} pts · ronda ${partida.ronda} · ${partida.precision}%`;

    fila.append(numero, detalle);
    historialEl.append(fila);
  });
}

function empezarPartida() {
  vidaDelJugador = VIDA_MAXIMA;
  vidaDelBoss = VIDA_MAXIMA;
  puntos = 0;
  ronda = 1;
  acertadas = 0;
  totales = 0;
  partidaAcabada = false;
  tiempoInicio = Date.now();

  pintarBarra(vidaBoss, VIDA_MAXIMA);
  pintarBarra(vidaJugador, VIDA_MAXIMA);
  puntosEl.textContent = 0;
  rondaEl.textContent = 1;
  avisoEl.textContent = '';

  mostrarZona(zonaJuego);
  nuevaPalabra();
}

function enviarPalabra() {
  if (partidaAcabada) return;

  if (limpiar(entrada.value) === palabraLimpia) {
    acierto();
  } else {
    fallo();
  }
}

entrada.addEventListener('input', function () {
  if (partidaAcabada) return;
  if (entrada.value.length !== palabraLimpia.length) return;

  if (limpiar(entrada.value) === palabraLimpia) {
    acierto();
  }
});

entrada.addEventListener('keydown', function (evento) {
  if (evento.key === 'Enter') {
    evento.preventDefault();
    enviarPalabra();
  }
});

document.addEventListener('keydown', function (evento) {
  if (evento.target === entrada) return;
  if (evento.key.length !== 1) return;

  teclasPulsadas = (teclasPulsadas + evento.key.toLowerCase()).slice(-PALABRA_SECRETA.length);

  if (teclasPulsadas === PALABRA_SECRETA) {
    document.body.classList.toggle('oscuro');
    teclasPulsadas = '';
  }
});

document.getElementById('btn-empezar').addEventListener('click', empezarPartida);
document.getElementById('btn-reiniciar').addEventListener('click', empezarPartida);

pintarMejor();
pintarHistorial();
