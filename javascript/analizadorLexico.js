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
  //Limpiamos todo dato que exista anteriormente
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
      //******************************PALABRAS RESERVADAS**************************************
      //!Si la linea empieza con un principale_inizio, es una palabra reservada para inicio de la clase main
      if (lineasCodigo[i].substring(0, j + 17) == "principale_inizio") {
        //Se agrega la palabra reservada a la tabla de simbolos
        construirTablaDeSimbolos(
          i + 1,
          j + 1,
          "palabra reservada",
          "principale_inizio"
        );
        j = j + 16;
        continue;
      }

      //!Si la linea empieza con un classe, es una palabra reservada
      if (lineasCodigo[i].substring(0, j + 6) == "classe") {
        //Recuperamos la palabra reservada
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "classe");
        j = j + 5;
        continue;
      }
      //!Si la linea empieza con un metodo, es una palabra reservada para crear metodos
      if (lineasCodigo[i].substring(0, j + 6) == "metodo") {
        //Recuperamos la palabra reservada
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "metodo");
        j = j + 5;
        continue;
      }
      //!Si existe la palabra reservada _inizio, indica el comienzo de un metodo o clase
      if (lineasCodigo[i].substring(0, j + 7) == "_inicio") {
        //Recuperamos la palabra reservada
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "_inicio");
        j = j + 6;
        continue;
      }

      //!Si existe la palabra reservada argo, entonces se refiere a los argumentos de una clase
      if (lineasCodigo[i].substring(j, j + 4) == "argo") {
        //Guardamos la palabra reservada en nuestra tabla de simbolos
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "argo");
        j = j + 3;
        continue;
      }
      //!Si la linea empieza con la palabra variabili, es una palabra reservada
      if (lineasCodigo[i].substring(j, j + 9) == "variabili") {
        construirTablaDeSimbolos(
          i + 1,
          j + 1,
          "palabra reservada",
          "variabili"
        );
        j = j + 8;
        continue;
      }

      //!Si existe la palabra reservada fine_classe, entonces se refiere a el termino de una clase
      if (lineasCodigo[i].substring(j, j + 11) == "fine_classe") {
        //Guardamos la palabra reservada en nuestra tabla de simbolos
        construirTablaDeSimbolos(
          i + 1,
          j + 1,
          "palabra reservada",
          "fine_classe"
        );
        j = j + 10;
        continue;
      }
      //!Si se encuentra la palabra fine_ripetere, es el fin de la estructura de control "fine"
      if (lineasCodigo[i].substring(j, j + 13) == "fine_ripetere") {
        //Guardamos la palabra reservada en nuestra tabla de simbolos
        construirTablaDeSimbolos(
          i + 1,
          j + 1,
          "estructura de control",
          "fine_ripetere"
        );
        j = j + 12;
        continue;
      }
      //!Si la linea empieza con la palabra fine_se, es el fin de la estructura de control "if else"
      if (lineasCodigo[i].substring(j, j + 7) == "fine_se") {
        //Guardamos la palabra reservada en nuestra tabla de simbolos
        construirTablaDeSimbolos(
          i + 1,
          j + 1,
          "estructura de control",
          "fin_se"
        );
        j = j + 6;
        continue;
      }
      //!Si existe la palabra reservada fine, entonces se refiere a el termino de declaracion de variables, funciones, etc
      if (lineasCodigo[i].substring(j, j + 4) == "fine") {
        //Guardamos la palabra reservada en nuestra tabla de simbolos
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "fine");
        j = j + 3;
        continue;
      }

      //*******************METODOS O FUNCIONES PREDEFINIDAS***********************/
      //!Si la linea empieza con la palabra stampa, es una funcion predefinida
      if (lineasCodigo[i].substring(j, j + 6) == "stampa") {
        //Guardamos la palabra reservada en nuestra tabla de simbolos
        construirTablaDeSimbolos(i + 1, j + 1, "funcion", "stampa");
        j = j + 5;
        continue;
      }
      //!Si la linea empieza con la palabra ricevere, es una funcion predefinida
      if (lineasCodigo[i].substring(j, j + 8) == "ricevere") {
        //Guardamos la palabra reservada en nuestra tabla de simbolos
        construirTablaDeSimbolos(i + 1, j + 1, "funcion", "ricevere");
        j = j + 7;
        continue;
      }
      //!Si la linea empieza con la palabra chimare, es una funcion predefinida
      if (lineasCodigo[i].substring(j, j + 7) == "chimare") {
        //Guardamos la palabra reservada en nuestra tabla de simbolos
        construirTablaDeSimbolos(i + 1, j + 1, "funcion", "chimare");
        j = j + 6;
        continue;
      }
      //!Si la linea empieza con la palabra potenza, es una funcion predefinida
      if (lineasCodigo[i].substring(j, j + 7) == "potenza") {
        //Guardamos la palabra reservada en nuestra tabla de simbolos
        construirTablaDeSimbolos(i + 1, j + 1, "funcion", "potenza");
        j = j + 6;
        continue;
      }
      //!Si la linea empieza con la palabra dati, es una funcion predefinida
      if (lineasCodigo[i].substring(j, j + 4) == "dati") {
        //Guardamos la palabra reservada en nuestra tabla de simbolos
        construirTablaDeSimbolos(i + 1, j + 1, "funcion", "dati");
        j = j + 3;
        continue;
      }

      //**********************Estructuras de control -  Sentencias******************************/
      //!Si la linea empieza con la palabra ripetere, es la estructura de control "fir"
      if (lineasCodigo[i].substring(j, j + 8) == "ripetere") {
        //Guardamos la palabra reservada en nuestra tabla de simbolos
        construirTablaDeSimbolos(
          i + 1,
          j + 1,
          "estructura de control",
          "ripetere"
        );
        j = j + 7;
        continue;
      }

      //!Si la linea empieza con la palabra se, es la estructura de control "if"
      if (lineasCodigo[i].substring(j, j + 2) == "se") {
        //Guardamos la palabra reservada en nuestra tabla de simbolos
        construirTablaDeSimbolos(i + 1, j + 1, "estructura de control", "se");
        j = j + 1;
        continue;
      }
      //!Si la linea empieza con la palabra altra, es la estructura de control "else"
      if (lineasCodigo[i].substring(j, j + 5) == "altra") {
        //Guardamos la palabra reservada en nuestra tabla de simbolos
        construirTablaDeSimbolos(
          i + 1,
          j + 1,
          "estructura de control",
          "altra"
        );
        j = j + 4;
        continue;
      }

      //******************************OPERADORES ARITMETICOS**************************************
      //!Si encuentra el simbolo +, es un operador aritmetico
      if (lineasCodigo[i].charAt(j) == "+") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador aritmetico", "+");
        continue;
      }
      //!Si encuentra el simbolo -, es un operador aritmetico
      if (lineasCodigo[i].charAt(j) == "-") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador aritmetico", "-");
        continue;
      }
      //!Si encuentra el simbolo *, es un operador aritmetico
      if (lineasCodigo[i].charAt(j) == "*") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador aritmetico", "*");
        continue;
      }
      //!Si encuentra el simbolo /, es un operador aritmetico
      if (lineasCodigo[i].charAt(j) == "/") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador aritmetico", "/");
        continue;
      }
      //!Si encuentra el simbolo %, es un operador aritmetico
      if (lineasCodigo[i].charAt(j) == "%") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador aritmetico", "%");
        continue;
      }
      //******************************OPERADORES RELACIONALES**************************************
      //!Si encuentra el simbolo <=, es un operador relacional
      if (lineasCodigo[i].substring(j, j + 2) == "<=") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador relacional", "<=");
        j = j + 1;
        continue;
      }
      //!Si encuentra el simbolo >=, es un operador relacional
      if (lineasCodigo[i].substring(j, j + 2) == ">=") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador relacional", ">=");
        j = j + 1;
        continue;
      }

      //!Si encuentra el simbolo <, es un operador relacional
      if (lineasCodigo[i].charAt(j) == "<") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador relacional", "<");
        continue;
      }
      //!Si encuentra el simbolo >, es un operador relacional
      if (lineasCodigo[i].charAt(j) == ">") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador relacional", ">");
        continue;
      }
      //!Si encuentra el simbolo ==, es un operador relacional
      if (lineasCodigo[i].charAt(j) == "==") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador relacional", "==");
        continue;
      }
      //!Si encuentra el simbolo !=, es un operador relacional
      if (lineasCodigo[i].charAt(j) == "!=") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador relacional", "!=");
        continue;
      }

      //******************************OPERADOR DE ASIGNACION**************************************

      //!Si encuentra el simbolo =, es una asignacion
      if (lineasCodigo[i].charAt(j) == "=") {
        construirTablaDeSimbolos(i + 1, j + 1, "asignacion", "=");
        continue;
      }
      //*******************************OPERADORES LOGICOS******************************* */
      //!Si encuentra el simbolo &&, es un operador logico
      if (lineasCodigo[i].charAt(j) == "&") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador logico", "&&");
        continue;
      }
      //!Si encuentra el simbolo ||, es un operador logico
      if (lineasCodigo[i].charAt(j) == "||") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador logico", "||");
        continue;
      }
      //!Si encuentra el simbolo !, es un operador logico
      if (lineasCodigo[i].charAt(j) == "!") {
        construirTablaDeSimbolos(i + 1, j + 1, "operador logico", "!");
        continue;
      }
      //*******************************CARACTERES VARIADOS******************************* */

      //!Si encuentra el simbolo :, es el remplazo de parentesis
      if (lineasCodigo[i].charAt(j) == ":") {
        construirTablaDeSimbolos(i + 1, j + 1, "remp parentesis", ":");
        continue;
      }
      //!Si la linea tiene una ~, es el comienzo de una funcion o clase
      if (lineasCodigo[i].charAt(j) == "~") {
        construirTablaDeSimbolos(i + 1, j + 1, "I/O de metod o class", "~");
        continue;
      }
      //!Si encuentra el simbolo ?, es el fin de una linea de codigo
      if (lineasCodigo[i].charAt(j) == "?") {
        construirTablaDeSimbolos(i + 1, j + 1, "fin de linea", "?");
      }

      //!Si la linea empieza con un #, es un comentario
      if (lineasCodigo[i].substring(j, j + 1) === "#") {
        construirTablaDeSimbolos(i + 1, j + 1, "comentario", "#");
        break;
      }

      //****************************TIPOS DE DATO***************************************** */
      //!Si encuentra la palabra totale, es una palabra reservada para definir enteros
      if (lineasCodigo[i].substring(j, j + 6) == "totale") {
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "totale");
        j = j + 5;
        continue;
      }
      //!Si encuentra la palabra punto, es una palabra reservada para definir flotantes
      if (lineasCodigo[i].substring(j, j + 5) == "punto") {
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "punto");
        j = j + 4;
        continue;
      }
      //!Si encuentra la palabra catena, es una palabra reservada para definir cadenas
      if (lineasCodigo[i].substring(j, j + 6) == "catena") {
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "catena");
        j = j + 5;
        continue;
      }
      //!Si encuentra la palabra bool, es una palabra reservada para definir booleanos
      if (lineasCodigo[i].substring(j, j + 4) == "bool") {
        construirTablaDeSimbolos(i + 1, j + 1, "palabra reservada", "bool");
        j = j + 3;
        continue;
      }

      //******************* CONSTANTES, VARIABLES, NOMBRES Y CADENAS***********************/
      //!Si se encuentran numeros, entonces es un numero
      if (/[0-9]/.test(lineasCodigo[i].charAt(j))) {
        //Recuperamos el numero
        let numero = "";
        let puntos = 0;
        while (/[0-9.]/.test(lineasCodigo[i].charAt(j))) {
          //Recuperamos el numero
          
          numero += lineasCodigo[i][j];
          //!Si encuentra un punto, es un flotante
          //Si encuentra mas de un punto el programa ciclo finaliza
          if (lineasCodigo[i].charAt(j) == ".") {
            puntos++;
          }
          j++;
        }
        if (puntos > 1) {
            console.error("Error: Existe mas de un punto");
          construirTablaDeSimbolos(i + 1, j + 1, "token no reconocido", numero);
          j--;
          continue;
        }
        //Guardamos el numero en la tabla de simbolos
        construirTablaDeSimbolos(i + 1, j + 1, "numero", numero);
        j--;
        continue;
      }

      //!Si encuentra el simbolo $, es el inicio del nombre de una variable que solo contiene letras y numeros
      if (lineasCodigo[i].charAt(j) == "$") {
        let nombreVariable = "$";
        while (/[a-zA-Z0-9]/.test(lineasCodigo[i].charAt(j + 1))) {
          j++;
          nombreVariable += lineasCodigo[i].charAt(j);
        }
        construirTablaDeSimbolos(
          i + 1,
          j + 1,
          "nombre de variable",
          nombreVariable
        );
        continue;
      }

      //!Si encuentra el simbolo ", es una cadena de texto
      if (lineasCodigo[i].charCodeAt(j) == 34) {
        let cadena = "";
        while (lineasCodigo[i].charAt(j + 1) != '"') {
          j++;
          cadena += lineasCodigo[i].charAt(j);
        }
        construirTablaDeSimbolos(i + 1, j + 1, "cadena de texto", cadena);
        j++;
        continue;
      }

      //!Si existen letras en la linea y no empiezan con $ o #, entonces es el nombre de la clase o metodo
      if (
        lineasCodigo[i][j] != "$" &&
        lineasCodigo[i][j] != "#" &&
        /[a-zA-Z]/.test(lineasCodigo[i].charAt(j))
      ) {
        let nombreClaseMetodo = "";
        while (/[a-zA-Z0-9]/.test(lineasCodigo[i].charAt(j))) {
          //Recuperamos el nombre de la clase o metodo
          nombreClaseMetodo += lineasCodigo[i][j];
          j++;
        }
        //Guardamos el nombre de la clase o metodo en la tabla de simbolos
        construirTablaDeSimbolos(
          i + 1,
          j - nombreClaseMetodo.length,
          "nombre de clase o metodo",
          nombreClaseMetodo
        );
        continue;
      }
      //******************* ELIMINADOR DE ESPACIOS ***********************/

      if (lineasCodigo[i] == " ") {
        continue;
      }

      //!Si encuentra un caracter no reconocido, es un token no reconocido
      //Entra en un ciclo hasta que el siguiente caracter sea un espacio un tabulador un salto de linea o el final de la linea
      let tokenNoReconocido = "";
      while (
        lineasCodigo[i].charAt(j) != " " &&
        lineasCodigo[i].charAt(j) != "\t" &&
        lineasCodigo[i].charAt(j) != "\n" &&
        j < lineasCodigo[i].length
      ) {
        tokenNoReconocido += lineasCodigo[i][j];
        j++;
      }
      construirTablaDeSimbolos(
        i + 1,
        j + 1,
        "token no reconocido",
        tokenNoReconocido
      );
    }
  }
  //console.log("Termino de recorrer el texto y recuperar tokens");
  console.log(tablaDeSimbolos);
  mostrarTablaDeSimbolos(tablaDeSimbolos);
  mostrarTablaDeDatos(tablaDeSimbolos.length, lineasCodigo.length);
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

//Metodo para imrpimir la tabla de simbolos en una tabla html
function mostrarTablaDeSimbolos(tablaDeSimbolos) {
  let tabla = document.getElementById("tablaDeSimbolos");
  //Recorremos la tabla de simbolos
  for (let i = 0; i < tablaDeSimbolos.length; i++) {
    let linea = tablaDeSimbolos[i].linea;
    let columna = tablaDeSimbolos[i].columna;
    let tipo = tablaDeSimbolos[i].tipo;
    let token = tablaDeSimbolos[i].token;

    tabla.insertRow(-1).innerHTML =
      "<td>" +
      linea +
      "</td><td>" +
      columna +
      "</td><td>" +
      tipo +
      "</td><td>" +
      token +
      "</td>";
  }
}

//Metodo para imprimir la tabla de datos en una tabla html
function mostrarTablaDeDatos(tokens, lineas) {
  let tabla = document.getElementById("tablaDeDatos");

  tabla.insertRow(-1).innerHTML =
    "<td>" + tokens + "</td><td>" + lineas + "</td>";
}
//Metodo para limpiar la tabla de simbolos y de datos de el html
function limpiarTablas() {
  var datos = document.getElementById("tablaDeDatos");
  var simbolos = document.getElementById("tablaDeSimbolos");
  var drowCount = datos.rows.length;
  var srowCount = simbolos.rows.length;
  //console.log(rowCount);
  if (drowCount <= 1) {
    alert("No se puede eliminar el encabezado");
  } else datos.deleteRow(drowCount - 1);

  let i = 1;
  while (srowCount - 1 != i) {
    simbolos.deleteRow(srowCount - i);
    i++;
  }

  // tablaDeSimbolos = [];
}

function pruebas() {
  limpiarTablas();
}

function aritLogic(exprecion) {
  let e = exprecion;
  //condicion que evalua si existen numeros en e

  // condicion que evalua que en la expresion que solo existan numeros
  if (e == "e") {
    console.log("Correcto: " + exprecion);
  } else {
    console.error("Aun no cumple con la condicion");
    return;
  }
}
