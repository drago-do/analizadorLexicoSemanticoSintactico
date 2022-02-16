// Este es el archivo en el que se desarrollara el codigo del analizador lexico
var tablaDeSimbolos = [];
var cadenaDeCodigo = [];
//Metodo que se encarga recuperar el texto del documento html

function getTexto() {
  //Recuperamos el texto del documento html
  var texto = document.getElementById("input");
  //Organiza el texto en un array donde cada posicion es una linea
  var lineasCodigo = texto.value.split("\n");
  //Recuperamos los cadenaDeCodigo de cada linea
  getcadenaDeCodigo(lineasCodigo);
}

//Metodo para recuperar los cadenaDeCodigo de cada linea de texto
function getcadenaDeCodigo(lineasCodigo) {
  //Recorremos cada linea
  console.log("El codigo tiene: " + lineasCodigo.length + " lineas");
  for (var i = 0; i < lineasCodigo.length; i++) {
    console.log("Se esta recorriendo la linea: " + i);
    //Recuperamos cada caracter de la linea
    for (var j = 0; j < lineasCodigo[i].length; j++) {
      //Si los siguientes 6 caracteres contienen la palabra reservada "classe"
      if (lineasCodigo[i].substring(0, j + 6) == "classe") {
        //Recuperamos la palabra reservada "classe"
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "classe");
        //Recuperamos el nombre de la clase detectando los caracteres que le siguen, hasta encontrar un espacio
        var nombreClase = "";
        while (lineasCodigo[i].charAt(j + 7) != " ") {
          nombreClase += lineasCodigo[i].charAt(j + 7);
          j++;
        }
        console.log(nombreClase);
        //Guardamos el nombre de la clase en la tabla de simbolos
        construirTablaDeSimbolos(i + 1, j + 7, "nombre de clase", nombreClase);
        //Recuperar los argumentos de la clase detectando los caracteres que le siguen, hasta encontrar un ~
        var argumentos = "";
        let k = j + 7;
        while (lineasCodigo[i].charAt(k) != "~") {
          //si es espacio lo ignora
          if (lineasCodigo[i].charAt(k) == " ") {
            k++;
            continue;
          } else {
            argumentos += lineasCodigo[i].charAt(k);
            k++;
          }
        }
        //Guardamos los argumentos de la clase en la tabla de simbolos
        construirTablaDeSimbolos(
          i + 1,
          j + 8,
          "argumentos de clase",
          argumentos
        );
        console.log(tablaDeSimbolos);
      }
      if (lineasCodigo[i].substring(j) == "#") {
        construirTablaDeSimbolos(i + 1, j + 1, "comentario", "#");
      }

      if (lineasCodigo[i] == " ") {
        continue;
      }
    }
  }
  console.log("Termino de recorrer el texto y recuperar tokens");
}

//Metodo para construir los objetos de la tabla de simbolos
function construirTablaDeSimbolos(_linea, _columna, _tipo, _token) {
  //insertamos un nuevo objeto en la tabla de simbolos
  tablaDeSimbolos.push({
    linea: _linea,
    columna: _columna,
    tipo: _tipo,
    token: _token,
  });
}
