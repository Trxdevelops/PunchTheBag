# Write & Fight

Write & Fight es un minijuego web que consiste en batallar contra un enemigo, en caso de escribir la palabra antes de que se vacie la barra de tiempo golpearemos al boss y en caso de no conseguirlo en el tiempo indicado seremos golpeados, al tumbarlo una ronda pasaremos a la siguiente que aumentara de dificultad

El repositorio se llama PunchTheBag porque es el nombre con el que arranque el proyecto; el juego acabo llamandose Write & Fight.

## Como probarlo

Abre `index.html` en el navegador y pulsa «Empezar». Escribe la palabra que aparece y pulsa Enter, o deja que se complete sola al llegar al numero de letras. No hace falta poner las tildes.

**Palabra secreta: teclea `oscuro` fuera del campo de escribir (por ejemplo en la pantalla de inicio) para activar el modo oscuro.**

## Uso de IA

Use claude (cowork) para apoyarme que me propusiera ideas, y que me ofreciera ideas de implementacion, siempre comprobando su funcionamiento adecuado y comparando con otras ideas, dicutiendolas con el para entender porque eran optimas y pidiendole fuentes fiables donde pudiera ver porque el funcionamiento era mas optimo y/o adecuado.

### Ejemplos de prompts

"Cual es la forma mas optima de realizar la comprobacion de si la palabra esta correctamente escrita"

"Organiza el codigo para que sea mas legible y se sienta mas profesional de forma que sea mas comprensible para la persona que tenga que leerlo"

### Verificacion

Recargaba y jugaba tras cada cambio, de ahi salieron arreglos como los de la distribucion de los elementos en pantalla, el tamaño de las fuentes de los laterales, comprobaciones de mayusculas y tildes que debian ser eliminadas para darle dinamismo al juego, ajustes de la animacion del sprite en css... Tambien probe los casos raros: escribir la palabra mal, dejar que se agote el tiempo, tumbar al boss para ver que sube de ronda sin cortar la partida, perder del todo, y que una partida peor no pise el record guardado.

Por otra parte, como mencione antes, para la verificacion del contenido generado o consultado a Claude le solicite sus fuentes para comprobar que lo que me decia era cierto.

### Hecho a mano

Ciertas partes del codigo fueron escritas a mano, otras escritas por la IA y revisadas por mi, y otras fueron escritas por mi, revisadas por la IA y de nuevo revisadas por mi.

## Autopsia

1. La barra de tiempo la vacio con una transicion de css en vez de con un setInterval, que es lo que tenia antes. El setInterval cambiaba el ancho veinte veces por segundo obligando a recalcular la pagina entera, y encima acumulaba retraso. Lo que pierdo es saber desde javascript cuanto tiempo queda, solo se cuando acaba, pero no lo necesito porque no muestro el tiempo en numeros.

2. El sprite del boss lo amplio con background-size en vez de con transform: scale(). El scale agranda el dibujo pero no el hueco que ocupa el elemento, asi que se veia a 210 px reservando solo 140 y se montaba encima de la barra de vida. A cambio, cambiar el tamaño ahora obliga a tocar tres numeros a la vez en vez de uno.

## Creditos

El sprite del boss es Glass Joe, del juego Punch-Out!! de Nintendo. No es material propio y se usa unicamente con fines academicos para esta practica.
