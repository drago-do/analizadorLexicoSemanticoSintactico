//Este es el archivo en el que se desarrollara el codigo del Analizador Sintactico
//Language: javascript
//Variables Globales para trabajar nuestro lenguaje de programacion
let errorEncontrado = "";

function mainSintactico() {
  //Comprueba si la tabla de simbolos esta vacia
  if (tablaDeSimbolos.length > 0) {
    //Recorre la tabla de simbolos con un for
    for (var i = 0; i < tablaDeSimbolos.length; i++) {
      //!Comprueba si existe classe en la tabla de simbolos
      if (tablaDeSimbolos[i].opCode == "c") {
        const [evaluaClasePrincipal, nuevai] = clasePrincipal(
          tablaDeSimbolos,
          i
        );
        if (evaluaClasePrincipal == false) {
          errorEncontrado =
            errorEncontrado +
            "\n Error en la clase principal, linea: " +
            tablaDeSimbolos[i].linea;
          errorSintactico(errorEncontrado);
          break;
        } else {
          //console.log("Clase principal correcta");
          //console.log(tablaDeFunciones);
          i = nuevai - 1;
          continue;
        }
      }
      //!Comprueba si existe variabili en la tabla de simbolos
      if (tablaDeSimbolos[i].opCode == "iVar") {
        const [evaluaVariables, nuevai] = variabili(tablaDeSimbolos, i);
        if (evaluaVariables == false) {
          errorEncontrado =
            errorEncontrado +
            "\n Error en la declaracion de variables, linea: " +
            tablaDeSimbolos[i].linea;
          errorSintactico(errorEncontrado);
          break;
        } else {
          //console.log("Variabili correctas");
          //console.log(tablaDeFunciones);
          i = nuevai - 1;
          continue;
        }
      }
      //!Comprueba si se crean variables en la subclase variabili
      if (
        tablaDeSimbolos[i].opCode == "tdT" ||
        tablaDeSimbolos[i].opCode == "tdP" ||
        tablaDeSimbolos[i].opCode == "tdC" ||
        tablaDeSimbolos[i].opCode == "tdB"
      ) {
        const [evaluaVariables, nuevai] = declaracionVariables(
          tablaDeSimbolos,
          i
        );
        if (evaluaVariables == false) {
          errorEncontrado =
            errorEncontrado +
            "\n Error en la declaracion de variables, linea: " +
            tablaDeSimbolos[i].linea;
          errorSintactico(errorEncontrado);
          break;
        } else {
          //console.log("Declaracion de variables correctas");
          //console.log(tablaDeVariables);
          i = nuevai - 1;
          continue;
        }
      }
      //!Comprueba si se crea principale_inizio dentro de la clase principal
      if (tablaDeSimbolos[i].opCode == "cmi") {
        const [evaluaPrincipale_inizio, nuevai] = principale_inizio(
          tablaDeSimbolos,
          i
        );
        if (evaluaPrincipale_inizio == false) {
          errorEncontrado =
            errorEncontrado +
            "\n Error en la linea: " +
            tablaDeSimbolos[i].linea;
          errorSintactico(errorEncontrado);
          break;
        } else {
          //console.log("Principale_inizio correcto");
          //console.log(tablaDeFunciones);
          i = nuevai - 1;
          continue;
        }
      }

      //!Comprueba si se crean metodos dentro de la clase principal
      if (tablaDeSimbolos[i].opCode == "mi") {
        const [evaluaMetodos, nuevai] = comprobarMetodo(tablaDeSimbolos, i);
        if (evaluaMetodos == false) {
          errorEncontrado =
            errorEncontrado +
            "\n Error en la linea: " +
            tablaDeSimbolos[i].linea;
          errorSintactico(errorEncontrado);
          break;
        } else {
          //console.log("Metodos correctos");
          //console.log(tablaDeFunciones);
          i = nuevai - 1;
          continue;
        }
      }

      //!Comprueba si existe el cierre de una subclase, classe_principale o metodo
      if (tablaDeSimbolos[i].opCode == "fcm") {
        if (!cierreDeFuncion(tablaDeFunciones, tablaDeSimbolos[i].linea)) {
          errorEncontrado =
            errorEncontrado +
            "\n Error en la linea: " +
            tablaDeSimbolos[i].linea;
          errorSintactico(errorEncontrado);
          break;
        }
        continue;
      }
      //!Comprueba si existe el cierre de classe
      if (tablaDeSimbolos[i].opCode == "fc") {
        if (!cierreDeClase(tablaDeFunciones, tablaDeSimbolos[i].linea)) {
          errorEncontrado =
            errorEncontrado +
            "\n Error en la linea: " +
            tablaDeSimbolos[i].linea;
          errorSintactico(errorEncontrado);
          break;
        }
        continue;
      }

      //!Error de pasar caracter  de fin de lineas ?
      if (tablaDeSimbolos[i].opCode == "fin?") {
        continue;
      }
      //!Error para caracteres no reconocidos
      if (tablaDeSimbolos[i].opCode == "tokenErr") {
        errorEncontrado =
          "Error en la linea: " +
          tablaDeSimbolos[i].linea +
          ". Caracter no reconocido o no valido";
        errorSintactico(errorEncontrado);
        break;
      }
      //!Error para sintaxis incorrecta, cuando el opCode no es reconocido por las condiciones anteriores
      errorEncontrado =
        "Error en la linea: " +
        tablaDeSimbolos[i].linea +
        ". Sintaxis incorrecta o no reconocida.";
      errorSintactico(errorEncontrado);
      break;
    }
  } else {
    alert(
      "La tabla de simbolos esta vacia. \n Realiza el analisis lexico primero"
    );
  }
  //!Para ver el seguimiento de la ejecucion del analizador sintactico
  console.log("Tabla de funciones: ");
  console.log(tablaDeFunciones);
  console.log("Tabla de variables: ");
  console.log(tablaDeVariables);
}

//!Funcion para testeo-- HTML boton "Prueba"
function test() {
  let sentenciasCorrectas = sentencias(
    tablaDeFunciones[tablaDeFunciones.length - 3].sentencias
  );
  if (!sentenciasCorrectas[0]) {
    errorSintactico(errorEncontrado);
  }
}

//!Funcion para mandar errores a la consola de html
function errorSintactico(error) {
  //Hacer el textarea no editable, con el fin de que no se pueda modificar. El contorno de este en color rojo y el texto rojo en negrita
  document.getElementById("erroresSintacticos").style.borderColor = "red";
  document.getElementById("erroresSintacticos").style.color = "red";
  document.getElementById("erroresSintacticos").style.fontWeight = "bold";
  //Envia el texto de errorEncontrado al textarea en el html con el id 'erroresSintacticos'
  document.getElementById("erroresSintacticos").value = error;
  console.error(error);
}

//Funcion para rescatar la ultima posicion de la tabla de la tabla de funciones y modificar un valor (cierre de funcion)
function cierreDeFuncion(tablaFunciones, lineaDeCierre) {
  let posicion = tablaFunciones.length - 1;
  if (!tablaFunciones[posicion].cierre) {
    tablaFunciones[posicion].cierre = lineaDeCierre;
    return true;
  } else {
    errorEncontrado =
      errorEncontrado +
      "No se puede cerrar la funcion '" +
      tablaFunciones[posicion].nombre +
      "', esta ya fue cerrada anteriormente.";
    return false;
  }
}
//Funcion para rescatar la primera posicion de la tabla de funciones y modificar un valor (cierre de classe)
function cierreDeClase(tablaFunciones, lineaDeCierre) {
  let posicion = 0;
  if (!tablaFunciones[posicion].cierre) {
    tablaFunciones[posicion].cierre = lineaDeCierre;
    return true;
  } else {
    errorEncontrado =
      errorEncontrado +
      "No se puede cerrar la clase, esta ya fue cerrada anteriormente." +
      tablaFunciones[posicion].cierre;
    return false;
  }
}

//Busquedas en la tabla de funciones, para ver si existe una funciones con el mismo nombre o no exite ninguna
function buscarEnTablaDeFunciones(nombre) {
  if (tablaDeFunciones.length > 0) {
    for (var i = 0; i < tablaDeFunciones.length; i++) {
      if (tablaDeFunciones[i].nombre == nombre) {
        let linea = tablaDeFunciones[i].linea;
        let cierre = tablaDeFunciones[i].cierre;
        return [true, linea, cierre];
      }
    }
  }
  return [false, 0, 0];
}

//Busquedas en la tabla de variables, para ver si existe una variable con el mismo nombre o no exite ninguna
function buscarEnTablaDeVariables(nombre) {
  if (tablaDeVariables.length > 0) {
    for (var i = 0; i < tablaDeVariables.length; i++) {
      if (tablaDeVariables[i].nombre == nombre) {
        let posicion = i;
        return [true, posicion];
      }
    }
  }
  return [false, 0, 0];
}

function resolverValoresDeVariables(exprecion) {
  //Recorre la cadena exprecion hasta que encuentre una variable (variables empiezan con $)
  for (var i = 0; i < exprecion.length; i++) {
    if (exprecion[i] == "$") {
      let inicioDeVariable = i;
      //Si encuentra una variable,recupera el nombre completo con un ciclo while hasta que el nombre de la variable sea diferente de [a-zA-Z0-9]. Despues busca en la tabla de variables
      let nombre = "";
      i++;
      while (/[a-zA-Z0-9]/.test(exprecion[i]) && i < exprecion.length) {
        nombre = nombre + exprecion[i];
        i++;
      }
      let variable = buscarEnTablaDeVariables("$" + nombre);
      //Si encuentra la variable, comprueba si es de tipo entero o flotante y la reemplaza por su valor
      if (variable[0]) {
        if (
          tablaDeVariables[variable[1]].tipo == "numE" ||
          tablaDeVariables[variable[1]].tipo == "numF"
        ) {
          exprecion =
            exprecion.substring(0, inicioDeVariable) +
            tablaDeVariables[variable[1]].valor +
            exprecion.substring(i, exprecion.length);
          return [true, exprecion];
        } else {
          errorEncontrado =
            errorEncontrado +
            "\nLa variable '" +
            nombre +
            "' no es de tipo numero";
          return [false, 0];
        }
      } else {
        errorEncontrado =
          errorEncontrado +
          "\nLa variable '" +
          nombre +
          "' no existe. Declarala primero en 'variabili'";
        return [false, 0];
      }
    }
  }
  return [true, exprecion];
}
//Verificar si se puede declarar una variable, metodo, clase o subclase
function tengoLosPadresCorrectos(tablaDeSimbolos, i) {
  // console.log("Tabla de funciones: ");
  // console.log(tablaDeFunciones);
  // console.log("Tabla de variables: ");
  // console.log(tablaDeVariables);
  //Verifica mediante los valores que retorna el metodo 'buscarEnTablaDeFunciones' si puede existir la declaracion
  let soy = tablaDeSimbolos[i].opCode;
  let nombreVariable = tablaDeSimbolos[i].token;
  let estoyEn = tablaDeSimbolos[i].linea;
  let hacerClaseBase = false;
  let miPadreEs;
  let miHermanoEs;
  let soySuHijo;
  let miHermanoCerro;
  // console.log("Soy: " + soy);
  //Verificar si la tabla de funciones esta vacia
  if (tablaDeFunciones.length > 0) {
    miPadreEs = tablaDeFunciones[0].tipo;
    miHermanoEs = tablaDeFunciones[tablaDeFunciones.length - 1].tipo;
    soySuHijo = !tablaDeFunciones[0].cierre;
    miHermanoCerro = tablaDeFunciones[tablaDeFunciones.length - 1].cierre;
    if (miPadreEs == miHermanoEs) {
      miHermanoEs = false;
      miHermanoCerro = true;
    }
    if (miHermanoCerro > 0) {
      miHermanoCerro = true;
    }
  } else {
    hacerClaseBase = true;
  }
  let caso = 0;
  //*1.-Si soy una clase debo verificar que la clase principal padre exista, que se encuentre en la tabla de funciones declarada antes y que no se haya cerrado y que no soy un impostor (que una clase igual ya exista)
  //!Regla 1 aplicada
  //*2.-Si soy un metodo debo verificar que la clase padre exista, que se encuentre en la tabla de funciones declarada antes y que no se haya cerrado
  //!Regla 2 aplicada
  //3.-Si soy una sentencia debo verificar que la clase prinzipale_inizio o un metodo sea el que me contenga, que se encuentre en la tabla de funciones declarada antes y que no se haya cerrado
  //*4.-Si soy la declaracion de una variable debo verificar que la clase Variables exista y que sea la que me contenga, que se encuentre en la tabla de funciones declarada antes y que no se haya cerrado
  //!Regla 4 aplicada
  //*5.-Si soy una clase principal, debo verificar que yo no sea un impostor (que una clase principal ya exista)
  //!Regla 5 aplicada

  if (soy == "iVar" || soy == "cmi") caso = 1;
  if (soy == "mi") caso = 2;
  if (soy == "sentencia") caso = 3;
  if (soy == "tdT" || soy == "tdP" || soy == "tdC" || soy == "tdB") caso = 4;
  if (soy == "c") caso = 5;
  // console.log(caso);
  switch (caso) {
    case 2:
      if (miPadreEs == "c") {
        if (soySuHijo) {
          if (
            miHermanoEs == "iVar" ||
            (miHermanoEs == "mi" && miHermanoCerro)
          ) {
            return true;
          } else {
            errorEncontrado =
              errorEncontrado +
              "No se puede declarar el metodo '" +
              nombreVariable +
              "', la clase '" +
              miHermanoEs +
              "' no esta cerrada. O el metodo no esta enseguida de la clase 'variabili'";
            return false;
          }
        } else {
          errorEncontrado =
            errorEncontrado +
            "No se puede declarar un metodo fuera de la clase base.";
          return false;
        }
      } else {
        errorEncontrado =
          errorEncontrado +
          "No se puede declarar un metodo sin la existencia de una clase base.";
        return false;
      }
      break;
    case 5:
      if (hacerClaseBase) {
        return true;
      } else {
        errorEncontrado =
          errorEncontrado +
          "No se puede declarar la clase '" +
          nombreVariable +
          "', ya existe una clase principal.";
        return false;
      }
      break;
    case 4:
      if (miPadreEs == "c") {
        if (soySuHijo) {
          if (miHermanoEs == "iVar" && !miHermanoCerro) {
            return true;
          } else {
            errorEncontrado =
              errorEncontrado +
              "No se puede declarar la variable fuera de la clase variabili'" +
              nombreVariable +
              "', no se encuentra dentro de la clase 'variabili', o esta ya cerro.";
            return false;
          }
        } else {
          errorEncontrado =
            errorEncontrado +
            "No se encontro clase base para la variable '" +
            nombreVariable +
            "' en la linea " +
            estoyEn +
            ". ¿Esta declarando fuera de la clase base?";
          return false;
        }
      } else {
        errorEncontrado =
          errorEncontrado +
          "No se encontro clase base para la variable '" +
          nombreVariable +
          "' en la linea " +
          estoyEn +
          ".";
        return false;
      }
      break;
    case 1:
      //console.log("Mi padre es " + miPadreEs + " y soy su hijo? " + soySuHijo);
      //console.log("Mi hermano es " + miHermanoEs);
      //console.log("Mi hermano cerró? " + miHermanoCerro);
      if (miPadreEs == "c") {
        if (soySuHijo) {
          if (miHermanoCerro < estoyEn || miHermanoCerro) {
            //Buscar con el metodo 'buscarEnTablaDeFunciones' si existe una clase principal con el mismo nombre
            let [existe, l, c] = buscarEnTablaDeFunciones(soy);
            if (!existe) {
              return true;
            } else {
              errorEncontrado =
                "Ya existe un " +
                nombreVariable +
                ", solo puede declarar una " +
                nombreVariable;
              return false;
            }
          } else {
            errorEncontrado =
              errorEncontrado +
              "No se puede declarar una subclase sin haber cerrado la subclase anterior: Las subclase no pueden tener sub-subclases. Clase en conflicto: " +
              miHermanoEs +
              ".";
            return false;
          }
        } else {
          errorEncontrado =
            errorEncontrado +
            "No se puede declarar una subclase fuera de la clase base.";
          return false;
        }
      } else {
        errorEncontrado =
          errorEncontrado +
          "No se puede declarar una subclase sin antes definir la clase base.";
        return false;
      }
  }

  // let [existePrincipal, linea, cierre] =
  //   buscarEnTablaDeFunciones("Clase Principal");
  // let [existePrincipal_inizio, linea_inizio, cierre_inizio] =
  //   buscarEnTablaDeFunciones("principale_inizio");
  // if (existePrincipal_inizio == false) {
  //   if (
  //     (existePrincipal == true &&
  //       linea < OrigenOPcode[pos].linea &&
  //       cierre == false) ||
  //     cierre > OrigenOPcode[i].linea
  //   ) {
  //   }
  // }
}

//!Metodo para comprobar la construccion de la clase base de nuestro programa
function clasePrincipal(OrigenOPcode, pos) {
  if (tengoLosPadresCorrectos(OrigenOPcode, pos)) {
    let argumentosDeClasePrincipal = [];
    pos++;
    let linea = OrigenOPcode[pos].linea;
    let columna = OrigenOPcode[pos].columna;
    let tipo = "c";
    let nombre = OrigenOPcode[pos].token;
    if (OrigenOPcode[pos].opCode == "nCM") {
      pos++;
      if (OrigenOPcode[pos].opCode == "arg") {
        pos++;
        if (OrigenOPcode[pos].opCode == "rp:") {
          pos++;
          //Recuperar los argumentos de la clase principal
          const [evaluaArgumentos, argumentos, nuevai] =
            construirTablaDeArgumentos(OrigenOPcode, pos);
          if (evaluaArgumentos == true) {
            pos = nuevai;
            argumentosDeClasePrincipal = argumentos;
            //console.log(argumentosDeClasePrincipal);
          } else {
            errorEncontrado =
              errorEncontrado +
              "\n Error en los argumentos de la clase principal";
            return [false, pos];
          }
          if (OrigenOPcode[pos].opCode == "rp:") {
            pos++;
            if (OrigenOPcode[pos].opCode == "io") {
              pos++;
              construirTablaDeFunciones(
                linea,
                columna,
                tipo,
                nombre,
                argumentosDeClasePrincipal,
                false
              );
              return [true, pos];
            } else {
              errorEncontrado =
                "Falta el caracter '~' de apertura de clase principal";
              return [false, pos];
            }
          } else {
            errorEncontrado =
              "Falta el caracter 'dos puntos' de cierre de la clase principal";
            return [false, pos];
          }
        } else {
          errorEncontrado =
            "Faltan el caracter 'dos puntos' de apertura para argumentos";
          return [false, pos];
        }
      } else {
        errorEncontrado = "Palabra reserva: 'argo' no encontrada.";
        return [false, pos];
      }
    } else {
      errorEncontrado =
        "Nombre de clase no declarado de forma correcta o no existe.";
      return [false, pos];
    }
  } else {
    errorEncontrado =
      errorEncontrado + "\nNo se puede declarar la clase principal";
    return [false, pos];
  }
}

//!Metodo para comprobar la construccion de variabili de nuestro programa
function variabili(OrigenOPcode, i) {
  if (tengoLosPadresCorrectos(OrigenOPcode, i)) {
    let argumentosDeVariables = [];
    if (OrigenOPcode[i].opCode == "iVar") {
      let linea = OrigenOPcode[i].linea;
      let columna = OrigenOPcode[i].columna;
      let tipo = "iVar";
      let nombre = OrigenOPcode[i].token;
      i++;
      if (OrigenOPcode[i].opCode == "rp:") {
        i++;
        //Recuperar los argumentos de variabili
        const [evaluaArgumentos, argumentos, nuevai] =
          construirTablaDeArgumentos(OrigenOPcode, i);
        if (evaluaArgumentos == true) {
          i = nuevai;
          argumentosDeVariables = argumentos;
          //console.log(argumentosDeVariables);
        } else {
          errorEncontrado =
            errorEncontrado +
            "\n Error en los argumentos de la declaracion de variables";
          return [false, i];
        }
        if (OrigenOPcode[i].opCode == "rp:") {
          i++;
          if (OrigenOPcode[i].opCode == "io") {
            i++;
            construirTablaDeFunciones(
              linea,
              columna,
              tipo,
              nombre,
              argumentosDeVariables,
              false
            );
            return [true, i];
          } else {
            errorEncontrado =
              "Falta el caracter '~' de apertura de declaracion de variables";
            return [false, i];
          }
        } else {
          errorEncontrado =
            "Falta el caracter 'dos puntos' de cierre de declaracion de variables";
          return [false, i];
        }
      } else {
        errorEncontrado =
          "Faltan el caracter 'dos puntos' de apertura para declaracion de variables";
        return [false, i];
      }
    } else {
      errorEncontrado = "Palabra reserva: 'variabili' no encontrada.";
      return [false, i];
    }
  } else {
    errorEncontrado =
      errorEncontrado +
      "\nComprueba  los padres de la declaracion de variabili";
    return [false, i];
  }
}

//!Metodo para comprobar la construccion de principale_inizio de nuestro programa dentro de la clase principal
function principale_inizio(OrigenOPcode, pos) {
  if (tengoLosPadresCorrectos(OrigenOPcode, pos)) {
    let argumentosDePrincipale_inizio = [];
    if (OrigenOPcode[pos].opCode == "cmi") {
      let linea = OrigenOPcode[pos].linea;
      let columna = OrigenOPcode[pos].columna;
      let tipo = "cmi";
      let nombre = OrigenOPcode[pos].token;
      pos++;
      if (OrigenOPcode[pos].opCode == "rp:") {
        pos++;
        //Recuperar los argumentos de principale_inizio
        const [evaluaArgumentos, argumentos, nuevai] =
          construirTablaDeArgumentos(OrigenOPcode, pos);
        if (evaluaArgumentos == true) {
          pos = nuevai;
          argumentosDePrincipale_inizio = argumentos;
          //console.log(argumentosDePrincipale_inizio);
        } else {
          errorEncontrado =
            errorEncontrado + "\n Error en los argumentos de principale_inizio";
          return [false, pos];
        }
        if (OrigenOPcode[pos].opCode == "rp:") {
          pos++;
          if (OrigenOPcode[pos].opCode == "io") {
            pos++;
            let [sentencias, nuevai] = construirTablaDeSentencias(
              OrigenOPcode,
              pos
            );
            pos = nuevai;
            let cierre = OrigenOPcode[nuevai].linea;
            construirTablaDeFunciones(
              linea,
              columna,
              tipo,
              nombre,
              argumentosDePrincipale_inizio,
              false,
              sentencias
            );
            return [true, pos];
          } else {
            errorEncontrado =
              "Falta el caracter '~' de apertura de principale_inizio";
            return [false, pos];
          }
        } else {
          errorEncontrado =
            "Falta el caracter 'dos puntos' de cierre de principale_inizio";
          return [false, pos];
        }
      } else {
        errorEncontrado =
          "Faltan el caracter 'dos puntos' de apertura para principale_inizio";
        return [false, pos];
      }
    } else {
      errorEncontrado = "Palabra reserva: 'principale_inizio' no encontrada.";
      return [false, pos];
    }
  } else {
    errorEncontrado = +errorEncontrado;
    ("No se encontro la clase principal. No puedes declarar principale_inizio fuera de la clase principal.");
    return [false, pos];
  }
}

//!Metodo para comprobar la construccion de variables de nuestro programa dentro de la subclase variabili
function declaracionVariables(origenOPcode, pos) {
  if (tengoLosPadresCorrectos(origenOPcode, pos)) {
    //Verificar el caso a aplicar mediante el opCode Recibido
    let caso;
    //Caso 1: Para variables de tipo entero o flotante
    if (origenOPcode[pos].opCode == "tdT" || origenOPcode[pos].opCode == "tdP")
      caso = 1;
    //Caso 2: Para variables de tipo String
    if (origenOPcode[pos].opCode == "tdC") caso = 2;
    //Caso 3: Para variables de tipo booleano
    if (origenOPcode[pos].opCode == "tdB") caso = 3;

    let linea = origenOPcode[pos].linea;
    let nombreVariable;
    let palabraReservada = tipoDeDato(origenOPcode[pos].opCode);
    let valor = 0;
    switch (caso) {
      case 1:
        //Caso para declarar variable entera o flotante
        pos++;
        if (origenOPcode[pos].opCode == "nVar") {
          nombreVariable = origenOPcode[pos].token;
          pos++;
          if (origenOPcode[pos].opCode == "asig=") {
            pos++;
            const [booleano, nuevai, exprecionEvaluada] = aritLogic(
              origenOPcode,
              pos
            );
            if (booleano == true) {
              pos = nuevai;
              valor = exprecionEvaluada;
              if (palabraReservada == "numE") {
                if (Number.isInteger(valor)) {
                  construirTablaDeVariables(
                    linea,
                    palabraReservada,
                    nombreVariable,
                    valor
                  );
                  return [true, pos];
                } else {
                  errorEncontrado =
                    errorEncontrado +
                    "Error en la declaracion de variables, el valor obtenido despues de la evaluacion aritmetica no es un entero. Se esperaba un entero.";
                  return [false, pos];
                }
              } else {
                construirTablaDeVariables(
                  linea,
                  palabraReservada,
                  nombreVariable,
                  valor
                );
                return [true, pos];
              }
            } else {
              errorEncontrado =
                errorEncontrado +
                "Error al evaluar la exprecion matematica que va a asignar a la variable. Si tu expresion esta bien, asegurate de haber terminado de declarar al sentecia con '?'";
              return [false, pos];
            }
          } else if (origenOPcode[pos].opCode == "fin?") {
            pos++;
            construirTablaDeVariables(
              linea,
              palabraReservada,
              nombreVariable,
              0
            );
            return [true, pos];
          } else {
            errorEncontrado =
              errorEncontrado +
              "Se esperaba el operador de asignacion para inicializar la variable. O en todo caso el final de la sentencia con el operador: '?' ";
            return [false, pos + 1];
          }
        } else {
          errorEncontrado =
            errorEncontrado +
            "Se esperaba el nombre de variable despues de el tipo de dato 'totale'";
          return [false, pos];
        }
        break;
      case 2:
        //Caso para declarar variable de tipo String
        pos++;
        if (origenOPcode[pos].opCode == "nVar") {
          nombreVariable = origenOPcode[pos].token;
          pos++;
          if (origenOPcode[pos].opCode == "asig=") {
            pos++;
            if (origenOPcode[pos].opCode == "cad") {
              valor = origenOPcode[pos].token;
              pos++;
              if (origenOPcode[pos].opCode == "fin?") {
                pos++;
                construirTablaDeVariables(
                  linea,
                  palabraReservada,
                  nombreVariable,
                  valor
                );
                return [true, pos];
              } else {
                errorEncontrado =
                  errorEncontrado +
                  "Error en la sentencia, no se encontro '?' despues de la cadena";
                return [false, pos];
              }
            } else {
              errorEncontrado =
                errorEncontrado +
                "Error en la sentencia, se esperaba una cadena despues de la asignacion a un tipo de dato catena (string)";
              return [false, pos];
            }
          } else if (origenOPcode[pos].opCode == "fin?") {
            pos++;
            construirTablaDeVariables(
              linea,
              palabraReservada,
              nombreVariable,
              ""
            );
            return [true, pos];
          } else {
            errorEncontrado =
              errorEncontrado +
              "Se esperaba el operador de asignacion para inicializar la variable. O en todo caso el final de la sentencia con el operador: '?' ";
            return [false, pos + 1];
          }
        } else {
          errorEncontrado =
            errorEncontrado +
            "Error en la sentencia, se esperaba el nombre de variable despues de el tipo de dato 'catena'";
          return [false, pos];
        }
        break;
      case 3:
        //Caso para declarar variable de tipo booleano
        pos++;
        if (origenOPcode[pos].opCode == "nVar") {
          nombreVariable = origenOPcode[pos].token;
          pos++;
          if (origenOPcode[pos].opCode == "asig=") {
            pos++;
            if (
              origenOPcode[pos].opCode == "tdF" ||
              origenOPcode[pos].opCode == "tdV"
            ) {
              valor = origenOPcode[pos].token;
              pos++;
              if (origenOPcode[pos].opCode == "fin?") {
                pos++;
                construirTablaDeVariables(
                  linea,
                  palabraReservada,
                  nombreVariable,
                  valor
                );
                return [true, pos];
              } else {
                errorEncontrado =
                  errorEncontrado +
                  "Error en la sentencia, no se encontro '?' despues del tipo de dato 'bool'";
                return [false, pos];
              }
            } else {
              errorEncontrado =
                errorEncontrado +
                "Error en la sentencia, se esperaba un tipo de dato 'booleano' despues de la asignacion a un tipo de dato 'bool'";
              return [false, pos];
            }
          } else if (origenOPcode[pos].opCode == "fin?") {
            pos++;
            construirTablaDeVariables(
              linea,
              palabraReservada,
              nombreVariable,
              "IMPOSTORE"
            );
            return [true, pos];
          } else {
            errorEncontrado =
              errorEncontrado +
              "Se esperaba el operador de asignacion para inicializar la variable. O en todo caso el final de la sentencia con el operador: '?' ";
            return [false, pos];
          }
        } else {
          errorEncontrado =
            errorEncontrado +
            "Error en la sentencia, se esperaba el nombre de variable despues de el tipo de dato 'bool'";
          return [false, pos];
        }

      default:
        break;
    }
  } else {
    errorEncontrado =
      errorEncontrado + "Parece que la variable esta donde no debe estar.";
    return [false, pos + 1];
  }
}

//!Metodo para comprobar la construccion de metodos de nuestro programa dentro de la clase base
function comprobarMetodo(OPcode, pos) {
  if (tengoLosPadresCorrectos(OPcode, pos)) {
    let argumentosDeMetodo = [];
    let linea = OPcode[pos].linea;
    let columna = OPcode[pos].columna;
    let tipo = OPcode[pos].opCode;
    pos++;
    if (OPcode[pos].opCode == "nCM") {
      let nombreMetodo = OPcode[pos].token;
      pos++;
      if (OPcode[pos].opCode == "rp:") {
        pos++;
        //Recuperar los argumentos del metodo
        const [evaluaArgumentos, argumentos, nuevai] =
          construirTablaDeArgumentos(OPcode, pos);
        if (evaluaArgumentos) {
          pos = nuevai;
          argumentosDeMetodo = argumentos;
        } else {
          errorEncontrado =
            errorEncontrado + "Error en los argumentos del metodo";
          return [false, pos];
        }
        if (OPcode[pos].opCode == "rp:") {
          pos++;
          if (OPcode[pos].opCode == "ci") {
            pos++;
            if (OPcode[pos].opCode == "io") {
              pos++;
              let [sentencias, nuevai] = construirTablaDeSentencias(
                OPcode,
                pos
              );
              pos = nuevai;
              let cierre = OPcode[nuevai].linea;
              construirTablaDeFunciones(
                linea,
                columna,
                tipo,
                nombreMetodo,
                argumentosDeMetodo,
                cierre, //tal vez que sea nuevai
                sentencias
              );
              //Metodo para comprobar sentencias
              return [true, pos + 1];
            } else {
              errorEncontrado =
                "Se esperaba 'io' (~) despues de la sentencia 'ci' (_inizio)";
            }
          } else {
            errorEncontrado =
              "Se esperaba 'ci' (_inizio) despues de la sentencia 'rp:' (:)";
          }
        } else {
          errorEncontrado =
            "Se esperaba 'rp:' (:) para el cierre de la declaracion de argumentos del metodo";
        }
      } else {
        errorEncontrado =
          "Error en la sentencia, no se encontro ':' despues del nombre del metodo";
      }
    } else {
      errorEncontrado = errorEncontrado + "Se esperaba el nombre del metodo";
      return [false, pos];
    }
  } else {
    errorEncontrado =
      +errorEncontrado +
      "\nError en la sentencia, el metodo '" +
      OPcode[pos + 1].token +
      "' no esta en el lugar correcto";
    return [false, pos];
  }
}

//!Metodo que rescata las sentencias dentro de un metodo
function construirTablaDeSentencias(OPcode, pos) {
  let sentencias = [];
  let linea = [];
  let evitarRep;
  let nuevai = pos;
  for (pos = pos; pos < OPcode.length; pos++) {
    nuevai = pos;
    evitarRep = 0;
    if (OPcode[pos].opCode != "fcm") {
      if (OPcode[pos].opCode != "com") {
        //Mientras el opcode no sea el final de la sentencia recupera las sentencias
        while (
          OPcode[pos].opCode != "fin?" &&
          OPcode[pos].opCode != "io" &&
          evitarRep < 100 &&
          OPcode[pos].opCode != "edcFR"
        ) {
          // console.log("Sentencia:");
          linea.push(OPcode[pos]);
          pos++;
          evitarRep++;
        }
        linea.push(OPcode[pos]);
        sentencias.push(linea);
        linea = [];
      }
    } else {
      break;
    }
  }
  // console.log(sentencias);
  return [sentencias, nuevai];
}
//sentencias()
//!Metodo para comprobar las sentencias dentro de un metodo o clase
function sentencias(listaDeSentencias) {
  for (let i = 0; i < listaDeSentencias.length; i++) {
    let sentencia = listaDeSentencias[i];
    let opCode = sentencia[0].opCode;
    let cicloForAnidado = 0;
    let condicionIfAnidado = 0;
    switch (opCode) {
      case "nVar":
        //Asignacion de variables
        if (!sentenciaAsignacionVariable(sentencia)) {
          errorSintactico(errorEncontrado);
          return [false, i];
        } else {
          continue;
        }
        break;
      case "mfRi":
        //Funcion nativa del lenguage que funciona de input
        if (!sentenciaFuncionNativaInput(sentencia)) {
          errorSintactico(errorEncontrado);
          return [false, i];
        } else {
          continue;
        }
        break;
      case "mfSt":
        //Funcion nativa del lenguage que funciona de output
        if (!sentenciaFuncionNativaOuput(sentencia)) {
          errorSintactico(errorEncontrado);
          return [false, i];
        } else {
          continue;
        }
        break;
      case "mfCh":
        //Asignacion de variables
        if (!sentenciaLlamadaFuncionChimare(sentencia, 1)) {
          errorSintactico(errorEncontrado);
          return [false, i];
        } else {
          continue;
        }
        break;
      case "edcR":
        //Verificar ciclo for
        if (!sentenciaCicloFor(sentencia, 1)) {
          errorSintactico(errorEncontrado);
          return [false, i];
        } else {
          cicloForAnidado++;
          continue;
        }
        break;
      case "edcFR":
        //Verificar ciclo for
        cicloForAnidado--;
        continue;
        break;

      case "edcSe":
        //Verificar condicion  if
        if (!sentenciaCondicionIf(sentencia, 1)) {
          errorSintactico(errorEncontrado);
          return [false, i];
        } else {
          condicionIfAnidado++;
          continue;
        }
        break;

      case "edcAl":
        //Verificar condicion  else
        if (sentencia[1].opCode == "io") {
          continue;
        } else {
          errorEncontrado = "Se esperaba 'io' despues de la sentencia 'edcAl'";
          return [false, i];
        }
        break;

      case "edcFS":
        //Verificar ciclo for
        condicionIfAnidado--;
        continue;
        break;

      default:
        errorEncontrado =
          errorEncontrado +
          "Error en la sentencia de la linea " +
          sentencia[0].linea +
          "Sentencia no reconocida";
        return [false, i];
        break;
    }
  }
  return [true, 0];
}

//Metodo para realizar las sentencias de asignacion de variables
function sentenciaAsignacionVariable(sentencia) {
  let i = 0;
  let nombreVariable1 = sentencia[i].token;
  let variable1 = ([existe, posicion] =
    buscarEnTablaDeVariables(nombreVariable1));
  if (variable1[0]) {
    i++;
    if (sentencia[i].opCode == "asig=") {
      i++;
      //Si el tipo de dato siguiente es una cadena
      if (sentencia[i].opCode == "cad") {
        //Verificar que la variable sea de tipo cadena
        if (tablaDeVariables[posicion].tipo == "cad") {
          //asigna la cadena a la variable
          let cadena = sentencia[i].token;
          tablaDeVariables[posicion].valor = cadena;
          console.log(tablaDeVariables);
          return true;
        } else {
          errorEncontrado =
            errorEncontrado +
            "Error en la asignacion de la variable, la variable " +
            nombreVariable1 +
            " no es de tipo catena";
          return false;
        }
      } else if (
        sentencia[i].opCode == "numE" ||
        sentencia[i].opCode == "numF" ||
        sentencia[i].opCode == "nVar"
      ) {
        //Verifica y evalua la exprecion matematica
        const [evaluaExpresion, pos, evaluada] = aritLogic(sentencia, i);
        if (evaluaExpresion) {
          //Verificar si la variable1 es de tipo entero
          if (tablaDeVariables[posicion].tipo == "numE") {
            //Verificar que 'evaluada' sea de tipo entero
            if (Number.isInteger(evaluada)) {
              //Asigna el valor de la exprecion a la variable
              tablaDeVariables[posicion].valor = evaluada;
              return true;
            } else {
              errorEncontrado =
                errorEncontrado +
                "Error en la asignacion de la variable, la variable " +
                nombreVariable1 +
                " no puede recibir el valor de esta operacion por que el resultado no es de tipo entero";
              return false;
            }
          } else if (tablaDeVariables[posicion].tipo == "numF") {
            //Asignar el valor de la exprecion a la variable
            tablaDeVariables[posicion].valor = evaluada;
            return true;
          } else {
            errorEncontrado =
              errorEncontrado +
              "Error en la asignacion de la variable, la variable " +
              nombreVariable1 +
              " no es de tipo numero, por lo tanto no puede recibir el valor de esta operacion";
            return false;
          }
        } else {
          errorEncontrado =
            errorEncontrado +
            "Error en la asignacion de la variable, la variable ";
          return false;
        }
      } else if (sentencia[i].opCode == "tdV" || sentencia[i].opCode == "tdF") {
        //Verificar que la variable sea de tipo booleano
        if (tablaDeVariables[posicion].tipo == "tdB") {
          //Asignar el valor de la exprecion a la variable
          tablaDeVariables[posicion].valor = sentencia[i].token;
          return true;
        } else {
          errorEncontrado =
            errorEncontrado +
            "Error en la asignacion de la variable, la variable " +
            nombreVariable1 +
            " no es de tipo booleano";
          return false;
        }
      } else if (sentencia[i].opCode == "mfCh") {
        i++;
        let llamadaFuncionCorrecta = sentenciaLlamadaFuncionChimare(
          sentencia,
          i
        );
        if (llamadaFuncionCorrecta) {
          return true;
        } else {
          errorEncontrado =
            errorEncontrado +
            "Error en la asignacion de la variable, La llaamada a la funcion " +
            nombreVariable1 +
            " no es correcta. Error en la linea " +
            sentencia[i].linea;
          return false;
        }
      } else {
        errorEncontrado =
          errorEncontrado +
          "Error en la asignacion de la variable, lo que se intenta asignas a la variable  " +
          nombreVariable1 +
          "  no es de tipo cadena, boleana ni numerica. Error en la linea " +
          sentencia[i].linea;
        return false;
      }
    } else {
      errorEncontrado =
        errorEncontrado +
        "Error en la asignacion de variables, se esperaba '=' para asignar un nuevo valor a la variable " +
        sentencia[0].token;
      return false;
    }
  } else {
    errorEncontrado =
      errorEncontrado +
      "Error en la asignacion de valores, la variable " +
      sentencia[0].token +
      " no existe. Declarala antes en la clase 'variabili'";
    return false;
  }
}

//Metodo para revisar las sentencia de input nativa del lenguaje
function sentenciaFuncionNativaInput(sentencia) {
  pos = 1;
  if (sentencia[pos].opCode == "rp:") {
    pos++;
    if (sentencia[pos].opCode == "nVar") {
      pos++;
      if (sentencia[pos].opCode == "rp:") {
        pos++;
        if (sentencia[pos].opCode == "fin?") {
          return true;
        } else {
          errorEncontrado =
            errorEncontrado +
            "Se esperaba el final de la sentencia '?'" +
            "Error en la linea" +
            sentencia[pos].linea;
          return false;
        }
      } else {
        errorEncontrado =
          errorEncontrado +
          "Se esperaba un ':' despues de el nomre de la variable en la sentencia 'ricevere' " +
          "Error en la linea" +
          sentencia[pos].linea;
        return false;
      }
    } else {
      errorEncontrado =
        errorEncontrado +
        "Error en la funcion nativa 'ricevere', se esperaba una variable en la que recibir el  input." +
        "Error en la linea" +
        sentencia[pos].linea;
      return false;
    }
  } else {
    errorEncontrado =
      errorEncontrado +
      "Error en la sentencia de input 'ricevere', se esperaba ':' antes del nombre de la variable" +
      "Error en la linea" +
      sentencia[pos].linea;
    return false;
  }
}
//Metodo para revisar las sentencias de output nativa del lenguaje
function sentenciaFuncionNativaOuput(sentencia) {
  pos = 1;
  if (sentencia[pos].opCode == "rp:") {
    pos++;
    if (
      sentencia[pos].opCode == "nVar" ||
      sentencia[pos].opCode == "numE" ||
      sentencia[pos].opCode == "numF" ||
      sentencia[pos].opCode == "tdB" ||
      sentencia[pos].opCode == "tdB" ||
      sentencia[pos].opCode == "cad" ||
      sentencia[pos].opCode == "mfCh"
    ) {
      if (sentencia[pos].opCode == "mfCh") {
        pos++;
        let llamadaCorrecta = sentenciaLlamadaFuncionChimare(sentencia, pos);
        if (llamadaCorrecta[0] == false) {
          errorEncontrado =
            errorEncontrado + "Error en la linea " + sentencia[pos].linea;
        } else {
          pos = llamadaCorrecta[1] - 1;
        }
      }
      pos++;
      if (sentencia[pos].opCode == "rp:") {
        pos++;
        if (sentencia[pos].opCode == "fin?") {
          return true;
        } else {
          errorEncontrado =
            errorEncontrado +
            "Se esperaba el final de la sentencia '?'" +
            "Error en la linea " +
            sentencia[pos].linea;
          return false;
        }
      } else {
        errorEncontrado =
          errorEncontrado +
          "Se esperaba un ':' despues de el nomre de la variable" +
          "Error en la linea " +
          sentencia[pos].linea;
        return false;
      }
    } else {
      errorEncontrado =
        errorEncontrado +
        "Error en la funcion nativa, se esperaba una variable, numero entero, flotante, booleano o cadena que imprimir." +
        "Error en la linea " +
        sentencia[pos].linea;
      return false;
    }
  } else {
    errorEncontrado =
      errorEncontrado +
      "Error en la sentencia de output (stampa), se esperaba ':' antes del nombre de la variable" +
      "Error en la linea " +
      sentencia[pos].linea;
    return false;
  }
}

//Metodo para revisar las sentencias para llamada de funciones
function sentenciaLlamadaFuncionChimare(sentencia, pos) {
  if (sentencia[pos].opCode == "rp:") {
    pos++;
    if (sentencia[pos].opCode == "nCM") {
      //Rescatar nombre de la funcion
      let nombreFuncion = sentencia[pos].token;
      pos++;
      if (sentencia[pos].opCode == "rp:") {
        pos++;
        //Construccion tabla de argumentos
        const [evaluaArgumentos, argumentos, nuevaPosicion] =
          construirTablaDeArgumentos(sentencia, pos);
        if (evaluaArgumentos == true) {
          pos = nuevaPosicion;
          argumentosDeFuncion = argumentos;
          //Revisar si la funcion existe
          let funcionExiste = buscarEnTablaDeFunciones(nombreFuncion);
          if (funcionExiste[0] == true) {
            pos++;
            if (sentencia[pos].opCode == "rp:") {
              pos++;
              if (sentencia[pos].opCode == "fin?") {
                return true;
              } else {
                if (sentencia[pos].opCode == "rp:") {
                  return [true, pos];
                }
                errorEncontrado =
                  errorEncontrado +
                  "Se esperaba el final de la sentencia '?'" +
                  "Error en la linea " +
                  sentencia[pos].linea;
              }
            } else {
              errorEncontrado =
                errorEncontrado +
                "Se esperaba un ':' para finalizar el llamado de la funcion. Error en la linea " +
                sentencia[pos].linea;
            }
          } else {
            errorEncontrado =
              errorEncontrado +
              "Error en la llamada de funcion, la funcion " +
              nombreFuncion +
              " no existe. Declarala antes de usarla. Error en la linea " +
              sentencia[posicion].linea;
            return false;
          }
        } else {
          errorEncontrado =
            errorEncontrado +
            "Losr agumentos de la funcion tienen problemas para ser evaluados. Error en la linea " +
            sentencia[pos].linea;
          return false;
        }
      } else {
        errorEncontrado =
          errorEncontrado +
          "Error en la llamada de la funcion " +
          nombreFuncion +
          " se esperaba ':' despues  el nombre de la funcion para la declaracion de los parametros";
        sentencia[pos].linea;
        return false;
      }
    } else {
      errorEncontrado =
        errorEncontrado +
        "Se esperaba el nombre de la funcion a llamar en la funcion chimare. " +
        "Error en la linea " +
        sentencia[pos].linea;
      return false;
    }
  } else {
    errorEncontrado =
      errorEncontrado +
      "Error en la sentencia de llamada de funcion, se esperaba el operador ':' para el inicio de los argumentos de chimare. " +
      "Error en la linea " +
      sentencia[pos].linea;
    return false;
  }
}
//Metodo para revisar las sentencias de el ciclo for
function sentenciaCicloFor(sentencia, pos) {
  if (sentencia[pos].opCode == "rp:") {
    pos++;
    if (sentencia[pos].opCode == "nVar") {
      pos++;
      if (sentencia[pos].opCode == "asig=") {
        pos++;
        if (sentencia[pos].opCode == "numE") {
          pos++;
          if (sentencia[pos].opCode == "sep,") {
            pos++;
            if (sentencia[pos].opCode == "or<") {
              pos++;
              if (sentencia[pos].opCode == "nVar") {
                pos++;
                if (sentencia[pos].opCode == "rp:") {
                  pos++;
                  if (sentencia[pos].opCode == "io") {
                    return true;
                  } else {
                    errorEncontrado =
                      errorEncontrado +
                      "Se esperaba el operador de inicio 'io' en la linea " +
                      sentencia[pos].linea;
                    return false;
                  }
                } else {
                  errorEncontrado =
                    errorEncontrado +
                    "Error en declaracion repitere, se esperaba un operador ':' . Error en la linea " +
                    sentencia[pos].linea;
                  return false;
                }
              } else {
                errorEncontrado =
                  errorEncontrado +
                  "Se esperaba una variable despues del operador 'or<' en la sentencia de ciclo for. Error en la linea " +
                  sentencia[pos].linea;
                return false;
              }
            } else {
              errorEncontrado =
                errorEncontrado +
                "Error en la sentencia de ciclo for, se esperaba 'or<' despues de la coma. " +
                "Error en la linea " +
                sentencia[pos].linea;
              return false;
            }
          } else {
            errorEncontrado =
              errorEncontrado +
              "Error en la sentencia de ciclo for, se esperaba un ',' despues de la variable inicial. Error en la linea " +
              sentencia[pos].linea;
            return false;
          }
        } else {
          errorEncontrado =
            errorEncontrado +
            "Error en la linea " +
            sentencia[pos].linea +
            "Se esperaba un numero entero desde el que inciar el ciclo ripetere";
          return false;
        }
      } else {
        errorEncontrado =
          errorEncontrado +
          "Se esperaba ' = ' despues de la variable. Error en la linea " +
          sentencia[pos].linea;
        return false;
      }
    } else {
      errorEncontrado =
        errorEncontrado +
        "Se esperaba una variable de indice para el ciclo ripetere. Error en linea " +
        sentencia[pos].linea;
      return false;
    }
  } else {
    errorEncontrado =
      errorEncontrado +
      "Se esperaba el uso del operador ':' despues de la palabra reservada ripetere. Error en la linea " +
      sentencia[pos].linea;
    return false;
  }
}

//Metodo para revisar las sentencias de la condicion if
function sentenciaCondicionIf(sentencia, pos) {
  if (sentencia[pos].opCode == "rp:") {
    pos++;
    let evaluable = evaluarCondicionIf(sentencia, pos);
    if (evaluable[0]) {
      pos = evaluable[1] + 1;
      if (sentencia[pos].opCode == "io") {
        return true;
      } else {
        errorEncontrado =
          errorEncontrado +
          "Se esperaba el operador de inicio 'io' en la linea " +
          sentencia[pos].linea;
        return false;
      }
    } else {
      errorEncontrado =
        errorEncontrado +
        "Error en la sentencia de condicion if, la condicion no es evaluable. Error en la linea " +
        sentencia[pos].linea;
      return false;
    }
  } else {
    errorEncontrado =
      errorEncontrado +
      "Se esperaba el operador ':' despues de la palabra reservada 'se'. Error en la linea " +
      sentencia[pos].linea;
  }
}
//!FALTA TERMINAR PARA FASE DE EJECUCION, FALTA TERMINAR PARA FASE DE EJECUCIONFALTA TERMINAR PARA FASE DE EJECUCIONFALTA TERMINAR PARA FASE DE EJECUCIONFALTA TERMINAR PARA FASE DE EJECUCIONFALTA TERMINAR PARA FASE DE EJECUCIONFALTA TERMINAR PARA FASE DE EJECUCIONFALTA TERMINAR PARA FASE DE EJECUCIONFALTA TERMINAR PARA FASE DE EJECUCION
//Metodo para evaluar las sentencias de la condicion if
function evaluarCondicionIf(sentencia, pos) {
  //Recuperar la expresion a evaluar concatenando valores hasta que el opCode de la sentencia sea 'rp:'
  let expresion = "";
  while (sentencia[pos].opCode != "rp:") {
    expresion = expresion + sentencia[pos].token;
    pos++;
  }
  console.log("valor op: " + sentencia[pos].opCode);
  console.log("Expresion a evaluar: " + expresion);
  //Si la exprecion a evaluar es VERO o IMPOSTORE retornar true
  if (expresion == "VERO" || expresion == "IMPOSTORE") {
    return [true, pos];
  } else {
    //Si la exprecion recuperada contiene variables (empiezan con $nombreDeVariable) se remplaza el valor de cada variable
    //con el valor de la variable en el scope actual

    //Recuperar posicion de la variable

    while (expresion.includes("$")) {
      let nombreVariable = "$";
      let posicionVariable = expresion.indexOf("$");
      //Recuperar caracteres siguientes hasta que sean  igual  de un simbolo como <>=!
      for (let index = posicionVariable; index < expresion.length; index++) {
        //Mientras no se encuentre un simbolo de comparacion seguir recuperando caracteres
        if (
          expresion[index] != "<" &&
          expresion[index] != ">" &&
          expresion[index] != "=" &&
          expresion[index] != "!"
        ) {
          //Concatenar el nombre de la variable
          let nombreVariable = nombreVariable + expresion[index];
          //Remplazar el nombre de la variable por el valor 2
          expresion = expresion.replace(nombreVariable, "2");
        }
      }
      return true;

      //Recuperar el valor de la variable
      let resultadoBusquedaVariable = buscarEnTablaDeVariables(nombreVariable);
      if (resultadoBusquedaVariable[0]) {
      } else {
        errorEncontrado =
          errorEncontrado +
          "No existe la variable " +
          nombreVariable +
          " en el scope actual. No puedes comparar nada con una variable no declarada. Error en la linea " +
          sentencia[pos].linea;
      }
    }
    //Si la exprecion a evaluar contiene operadores logicos se evalua
    resultadoEvaluacion = eval(expresion);
    console.log("Resultado de la evaluacion: " + resultadoEvaluacion);
    return [resultadoEvaluacion, pos];
  }

  //Evaluar la expresion
  let resultado = eval(expresion);
}

//Metodo que retorna el tipo de dato de un opCode
function tipoDeDato(opCode) {
  let tipoDeDato = "Indefinido";
  if (opCode == "tdT") tipoDeDato = "numE";
  if (opCode == "tdP") tipoDeDato = "numF";
  if (opCode == "tdC") tipoDeDato = "cad";
  if (opCode == "tdB") tipoDeDato = "boo";
  return tipoDeDato;
}

//Metodo para construir los objetos de la tabla de variables
function construirTablaDeVariables(_linea, _tipo, _nombre, _valor) {
  //insertamos un nuevo objeto en la tabla de variables
  tablaDeVariables.push({
    linea: _linea,
    tipo: _tipo,
    nombre: _nombre,
    valor: _valor,
  });
}
//Metodo para construir los objetos de la tabla de funciones
function construirTablaDeFunciones(
  _linea,
  _columna,
  _tipo,
  _nombre,
  _valor,
  _cierre,
  _sentencias
) {
  //insertamos un nuevo objeto en la tabla de variables
  tablaDeFunciones.push({
    linea: _linea,
    columna: _columna,
    tipo: _tipo,
    nombre: _nombre,
    valor: _valor,
    cierre: _cierre,
    sentencias: _sentencias,
  });
}

//Metodo para construir los elementos que componen los argumentos de metodos, clases, etc
//!Recibe la posicion de la tabla de simbolos y retorna un arreglo con los argumentos y la posicion del final de los argumentos
function construirTablaDeArgumentos(OrigenOPcode, i) {
  let argumentos = [];
  //mientras el siguiente elemento sea diferente de el opcode de "rp:" guardar el objeto obtenido en argumentosDeClasePrincipal
  while (OrigenOPcode[i].opCode != "rp:") {
    //Omite los separadores de argumentos
    if (OrigenOPcode[i].opCode == "sep,") {
      i++;
      continue;
    }
    //Recupera los argumentos de la clase principal que son expresiones matematicas, devuelve la exprecion evaluada
    if (
      OrigenOPcode[i].opCode == "numE" ||
      OrigenOPcode[i].opCode == "numF" ||
      OrigenOPcode[i].opCode == "oa("
    ) {
      const [booleano, nuevai, exprecionEvaluada] = aritLogic(OrigenOPcode, i);
      if (booleano == true) {
        i = nuevai;
        argumentos.push(exprecionEvaluada);
        continue;
      } else {
        errorEncontrado =
          errorEncontrado +
          "\nError al evaluar la exprecion matematica dentro de los argumentos";
        return [false, "", i];
      }
    }
    //Recupera los argumentos que son variables
    argumentos.push(OrigenOPcode[i].token);
    i++;
  }
  return [true, argumentos, i];
}

//Comprobar que las operaciones sean correctas
function aritLogic(OrigenOPcode, i) {
  let exprecion = "";
  let exprecionOriginal;
  let exprecionConVariablesAsignadas = "";
  //Mientras el siguiente elemento no sea diferente de el opcode de "numE", "numF", "oa+", "oa-", "oa*", "oa/" o "oa%" guardar la concatenacon de los valores en la variable evaluacionAritmetica.
  // while (
  //   OrigenOPcode[i].opCode == "numE" ||
  //   OrigenOPcode[i].opCode == "numF" ||
  //   OrigenOPcode[i].opCode == "oa+" ||
  //   OrigenOPcode[i].opCode == "oa-" ||
  //   OrigenOPcode[i].opCode == "oa*" ||
  //   OrigenOPcode[i].opCode == "oa/" ||
  //   OrigenOPcode[i].opCode == "oa%" ||
  //   OrigenOPcode[i].opCode == "oa(" ||
  //   OrigenOPcode[i].opCode == "oa)"
  // ) {
  //   exprecion = exprecion + OrigenOPcode[i].token;
  //   i++;
  // }
  //Mientras el origenOPcode.opCode sea diferente de "sep," y sea diferente de "rp:" guardar la concatenacion de los valores en la variable evaluacionAritmetica.
  while (
    OrigenOPcode[i].opCode != "sep," &&
    OrigenOPcode[i].opCode != "rp:" &&
    OrigenOPcode[i].opCode != "fin?"
  ) {
    exprecion = exprecion + OrigenOPcode[i].token;
    i++;
  }
  //Guardamos la exprecion original para poder evaluarla despues
  exprecionOriginal = exprecion;
  //console.log("Exprecion original: " + exprecionOriginal);
  //Validamos si es que la exprecion involucra variables
  while (exprecion.includes("$")) {
    //Si la exprecion contiene variables, evaluamos la exprecion
    const [evaluacionV, exprecionNueva] = resolverValoresDeVariables(exprecion);
    if (evaluacionV) {
      exprecion = exprecionNueva;
    } else {
      errorEncontrado =
        errorEncontrado + "\nError al evaluar la exprecion matematica";
      return [false, i, exprecionOriginal];
    }
  }

  exprecionConVariablesAsignadas = exprecion;

  //console.log("Exprecion evaluando variables: " + exprecion);
  //!Hasta este momento tenemos una exprecion cruda, tal que '5+5', se convertira en 'e+e' para ser evaluada
  //Eliminar puntos decimales de la exprecion
  exprecion = exprecion.replace(/\./g, "");
  //Remplazar los numeros con la letra 'e'
  exprecion = exprecion.replace(/[0-9]+/g, "e");
  if (evaluarExprecion(exprecion) == false) {
    errorEncontrado =
      errorEncontrado +
      "\nExprecion matematica mal escrita: " +
      exprecionOriginal;
    return [false, i, exprecionOriginal];
  } else {
    return [true, i, eval(exprecionConVariablesAsignadas)];
  }
}

let stopRecursive = 0;
function evaluarExprecion(exprecion) {
  //*console.log("Evaluando: " + exprecion);
  stopRecursive++;
  if (exprecion == "e" || stopRecursive == 100) {
    //*console.log("Recursividad: " + stopRecursive);
    return exprecion;
  } else {
    let caso = 0;
    //!Verificando la Primera regla
    //Si la exprecion a evaluar contiene 'e+e' este se remplaza por 'e'
    if (exprecion.includes("e+e")) caso = 1;
    //!Verificando la Segunda regla
    //Si la exprecion a evaluar contiene 'e-e' este se remplaza por 'e'
    if (exprecion.includes("e-e")) caso = 2;
    //!Verificando la Tercera regla
    //Si la exprecion a evaluar contiene 'e*e' este se remplaza por 'e'
    if (exprecion.includes("e*e")) caso = 3;
    //!Verificando la Cuarta regla
    //Si la exprecion a evaluar cont1iene 'e/e' este se remplaza por 'e'
    if (exprecion.includes("e/e")) caso = 4;
    //!Verificando la Quinta regla
    //Si la exprecion a evaluar contiene 'e%e' este se remplaza por 'e'
    if (exprecion.includes("e%e")) caso = 5;
    //!Sexta regla
    //Si la exprecuon contiene parentesis, primero se evalua esto
    if (exprecion.includes("(")) caso = 6;
    //!Septima regla
    //Si la exprecion empieza con '(' y termina con ')' eliminar primer y ultimo caracter
    if (
      exprecion.substring(0, 1) == "(" &&
      exprecion.substring(exprecion.length - 1, exprecion.length) == ")"
    )
      caso = 7;
    //!Octava regla
    //Si la exprecion a evanluar contiene 'ee' este se remplaza por 'e'
    if (exprecion.includes("ee")) caso = 8;

    switch (caso) {
      case 8:
        //*console.log("Octava regla");
        exprecion = exprecion.replace(/ee/g, "e");
        break;
      case 7:
        //*console.log("Septima regla");
        exprecion = exprecion.substring(1, exprecion.length - 1);
        break;
      case 6:
        //*console.log("Sexta regla");
        let contenidoParentesis = "";
        let contadorParentesis = 0;
        let parAbre = 0;
        let parCierra = 0;
        //Extraer el contenido del primeros parentesis
        for (let i = 0; i < exprecion.length; i++) {
          if (exprecion[i] == "(" && contadorParentesis == 0) {
            parAbre = i;
            contadorParentesis++;
            continue;
          }
          if (exprecion[i] == "(") {
            contadorParentesis++;
            continue;
          }
          if (exprecion[i] == ")") {
            contadorParentesis--;
          }
          if (exprecion[i] == ")" && contadorParentesis == 0) {
            parCierra = i + 1;
          }
        }
        //contenido antes de parentesis
        let CaP = exprecion.substring(0, parAbre);
        //contenido despues de parentesis
        let CdP = exprecion.substring(parCierra, exprecion.length);
        //Contenido dentro del parentesis
        contenidoParentesis = exprecion.substring(parAbre, parCierra);
        //*console.log("Contenido parentesis: " + contenidoParentesis);
        //Llamada recursiva
        exprecion = CaP + evaluarExprecion(contenidoParentesis) + CdP;
        //*console.log("Resultado: " + exprecion);
        break;
      case 5:
        //*console.log("Quinta regla");
        exprecion = exprecion.replace(/e%e/g, "e");
        break;
      case 4:
        //*console.log("Cuarta regla");
        exprecion = exprecion.replace(/e\/e/g, "e");
        break;
      case 3:
        //*console.log("Tercera regla");
        exprecion = exprecion.replace(/e\*e/g, "e");
        break;
      case 2:
        //*console.log("Segunda regla");
        exprecion = exprecion.replace(/e-e/g, "e");
        break;
      case 1:
        //*console.log("Primera regla");
        exprecion = exprecion.replace(/e\+e/g, "e");
        break;

      default:
        errorEncontrado =
          errorEncontrado +
          "Funcion recursiva 'evaluarExprecion()' dice: No hay reglas gramaticales que aplicar a la exprecion";
        return false;
        break;
    }
    return evaluarExprecion(exprecion);
  }
}
