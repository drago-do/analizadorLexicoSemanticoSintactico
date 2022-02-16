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

      //Si la cadena empieza con espacios o tabulaciones, se eliminan
      while (lineasCodigo[i][j] == " " || lineasCodigo[i][j] == "\t") {
        //Borrar espacios y tabulaciones
        lineasCodigo[i] = lineasCodigo[i].substring(1);
      }

      //!Si los siguientes 6 caracteres contienen la palabra reservada "classe"
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
      //!Si la linea empieza con un #, es un comentario
      if (lineasCodigo[i].substring(j) == "#") {
        construirTablaDeSimbolos(i + 1, j + 1, "comentario", "#");
      }
      //!Si la linea empieza con la palabra variavili, es una palabra reservada
      if (lineasCodigo[i].substring(j, j + 9) == "variavili") {
        console.error("vari")
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "variavili");
      }
      //!Si encuentra el simbolo =, es una asignacion
      if (lineasCodigo[i].charAt(j) == "=") {
        construirTablaDeSimbolos(i + 1, j + 1, "asignacion", "=");
      }
      //!Si encuentra el simbolo +, es un operador aritmetico
      if (lineasCodigo[i].charAt(j) == "+") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador aritmetico", "+");
      }
      //!Si encuentra el simbolo -, es un operador aritmetico
      if (lineasCodigo[i].charAt(j) == "-") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador aritmetico", "-");
      }
      //!Si encuentra el simbolo *, es un operador aritmetico
      if (lineasCodigo[i].charAt(j) == "*") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador aritmetico", "*");
      }
      //!Si encuentra el simbolo /, es un operador aritmetico
      if (lineasCodigo[i].charAt(j) == "/") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador aritmetico", "/");
      }
      //!Si encuentra el simbolo %, es un operador aritmetico
      if (lineasCodigo[i].charAt(j) == "%") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador aritmetico", "%");
      }
      //!Si encuentra el simbolo <, es un operador relacional
      if (lineasCodigo[i].charAt(j) == "<") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador relacional", "<");
      }
      //!Si encuentra el simbolo >, es un operador relacional
      if (lineasCodigo[i].charAt(j) == ">") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador relacional", ">");
      }
      //!Si encuentra el simbolo ==, es un operador relacional
      if (lineasCodigo[i].charAt(j) == "==") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador relacional", "==");
      }
      //!Si encuentra el simbolo !=, es un operador relacional
      if (lineasCodigo[i].charAt(j) == "!=") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador relacional", "!=");
      }
      //!Si encuentra el simbolo &&, es un operador logico
      if (lineasCodigo[i].charAt(j) == "&&") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador logico", "&&");
      }
      //!Si encuentra el simbolo ||, es un operador logico
      if (lineasCodigo[i].charAt(j) == "||") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador logico", "||");
      }
      //!Si encuentra el simbolo !, es un operador logico
      if (lineasCodigo[i].charAt(j) == "!") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador logico", "!");
      }
      //!Si encuentra el simbolo :, es el remplazo de parentesis
      if (lineasCodigo[i].charAt(j) == ":") {
        construirTablaDeSimbolos(i + 1, j + 1, "remp parentesis", ":");
      }

      //!Si encuentra el simbolo ?, es el fin de una linea de codigo
      if (lineasCodigo[i].charAt(j) == "?") {
        construirTablaDeSimbolos(i + 1, j + 1, "fin de linea", "?");
      }
      //!Si encuentra la palabra totale, es una palabra reservada para definir enteros
      if (lineasCodigo[i].substring(j, j + 6) == "totale") {
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "totale");
      }
      //!Si encuentra la palabra punto, es una palabra reservada para definir flotantes
      if (lineasCodigo[i].substring(j, j + 3) == "punto") {
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "punto");
      }
      //!Si encuentra la palabra catena, es una palabra reservada para definir cadenas
      if (lineasCodigo[i].substring(j, j + 6) == "catena") {
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "catena");
      }
      //!Si encuentra la palabra bool, es una palabra reservada para definir booleanos
      if (lineasCodigo[i].substring(j, j + 4) == "bool") {
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "bool");
      }
      // //!Si encuentras "", es un string
      // if (lineasCodigo[i].charAt(j) == "\"") {
      //   console.error("Hey")
      //   let cadenaEntreComillas = "";
      //   while (lineasCodigo[i].charAt(j+1) != "\"") {
      //     cadenaEntreComillas += lineasCodigo[i].charAt(j);
      //     console.error(cadenaEntreComillas);
      //     j++;
      //   }
      //   construirTablaDeSimbolos(i + 1, j + 1, "string", cadenaEntreComillas);
      // }


      //!Si encuentra el simbolo $, es el inicio del nombre de una variable que solo contiene letras y numeros
      if (lineasCodigo[i].charAt(j) == "$") {
        let nombreVariable = "";
        while ( /[a-zA-Z0-9]/.test(lineasCodigo[i].charAt(j)) ) {
          j++;
          nombreVariable += lineasCodigo[i].charAt(j);
        }
        construirTablaDeSimbolos(i + 1, j + 1, "nombre de variable", nombreVariable);
      }


      if (lineasCodigo[i] == " ") {
        continue;
      }
    }
  }
  console.log("Termino de recorrer el texto y recuperar tokens");
  console.log(tablaDeSimbolos);
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
