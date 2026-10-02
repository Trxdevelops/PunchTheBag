Write & Fight

Write & Fight es un minijuego web que consiste en batallar contra un enemigo, en caso de escribir la palabra antes de que se vacie la barra de tiempo golpearemos al boss y en caso de no conseguirlo en el tiempo indicado seremos golpeados, al tumbarlo una ronda pasaremos a la siguiente que aumentara de dificultad

Uso de IA

Use claude (cowork) para apoyarme que me propusiera ideas, y que me ofreciera ideas de implementacion, siempre comprobando su funcionamiento adecuado y comparando con otras ideas, dicutiendolas con el para entender porque eran optimas y pidiendole fuentes fiables donde pudiera ver porque el funcionamiento era mas optimo y/o adecuado.

Ejemplos de Prompts

"Cual es la forma mas optima de realizar la comprobacion de si la palabra esta correctamente escrita"

"Organiza el codigo para que sea mas legible y se sienta mas profesional de forma que sea mas comprensible para la persona que tenga que leerlo"

Verificacion

Recargaba y jugaba tras cada cambio de ahí salieron arreglos, como los de la distribucion de los elementos en pantalla, el tamano de las fuentes de los laterales, comprobaciones de mayusculas y tildes que debian ser eliminadas para darle dinamismo al juego, ajustes de la animacion del sprite en css,...

Por otra parte como mencione anteriormente para la verificacion del contenido generado o consultado a Claude, le solicite sus fuentes para comprobar que lo que me decia era cierto.

Verificacion

para verificar el funcionamiento de los cambios realizados recargaba la pagina

Hecho a mano:

Ciertas partes del codigo fueron escritas a mano, otras escritas por la IA y revisadas por mi y otras fueron escritas por mi revisadas por la IA y de nuevo revisadas por mi

Autopsia

La barra de tiempo la vacio con una transicion de css en vez de con un setInterval, que es lo que tenia antes. El setInterval cambiaba el ancho veinte veces por segundo obligando a recalcular la pagina entera, y encima acumulaba retraso. Lo que pierdo es saber desde javascript cuanto tiempo queda, solo se cuando acaba, pero no lo necesito porque no muestro el tiempo en numeros.

El sprite del boss lo amplio con background-size en vez de con transform: scale(). El scale agranda el dibujo pero no el hueco que ocupa el elemento, asi que se veia a 210 px reservando solo 140 y se montaba encima de la barra de vida. A cambio, cambiar el tamaño ahora obliga a tocar tres numeros a la vez en vez de uno.
