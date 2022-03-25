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
          console.log(tablaDeFunciones);
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
      }
      //!Para ver el seguimiento de la ejecucion del analizador sintactico
        console.log("Tabla de funciones: ");
        console.log(tablaDeFunciones);
        console.log("Tabla de variables: ");
        console.log(tablaDeVariables);
    }
  } else {
    alert(
      "La tabla de simbolos esta vacia. \n Realiza el analisis lexico primero"
    );
  }
}

//!Funcion para testeo-- HTML boton "Prueba"
function test() {}

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
      if (tablaDeFunciones[i].tipo == nombre) {
        let linea = tablaDeFunciones[i].linea;
        let cierre = tablaDeFunciones[i].cierre;
        return [true, linea, cierre];
      }
    }
  }
  return [false, 0, 0];
}

//!Metodo para comprobar la construccion de la clase base de nuestro programa
function clasePrincipal(OrigenOPcode, pos) {
  let argumentosDeClasePrincipal = [];
  for (i = pos; i < OrigenOPcode.length; i++) {
    if (OrigenOPcode[i].opCode == "c") {
      i++;
      let linea = OrigenOPcode[i].linea;
      let columna = OrigenOPcode[i].columna;
      let tipo = "Clase Principal";
      let nombre = OrigenOPcode[i].token;
      if (OrigenOPcode[i].opCode == "nCM") {
        i++;
        if (OrigenOPcode[i].opCode == "arg") {
          i++;
          if (OrigenOPcode[i].opCode == "rp:") {
            i++;
            //Recuperar los argumentos de la clase principal
            const [evaluaArgumentos, argumentos, nuevai] =
              construirTablaDeArgumentos(OrigenOPcode, i);
            if (evaluaArgumentos == true) {
              i = nuevai;
              argumentosDeClasePrincipal = argumentos;
              //console.log(argumentosDeClasePrincipal);
            } else {
              errorEncontrado =
                errorEncontrado +
                "\n Error en los argumentos de la clase principal";
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
                  argumentosDeClasePrincipal,
                  false
                );
                return [true, i];
              } else {
                errorEncontrado =
                  "Falta el caracter '~' de apertura de clase principal";
                return [false, i];
              }
            } else {
              errorEncontrado =
                "Falta el caracter 'dos puntos' de cierre de la clase principal";
              return [false, i];
            }
          } else {
            errorEncontrado =
              "Faltan el caracter 'dos puntos' de apertura para argumentos";
            return [false, i];
          }
        } else {
          errorEncontrado = "Palabra reserva: 'argo' no encontrada.";
          return [false, i];
        }
      } else {
        errorEncontrado =
          "Nombre de clase no declarado de forma correcta o no existe.";
        return [false, i];
      }
    } else {
      errorEncontrado = "Palabra reserva: 'classe' no encontrada.";
      return [false, i];
    }
  }
}

//!Metodo para comprobar la construccion de variabili de nuestro programa
function variabili(OrigenOPcode, i) {
  //Verifica mediante los valores que retorna el metodo 'buscarEnTablaDeFunciones' si existe la clase principal y si la linea en la que se declaro es menor a la linea en la que se encuentra variabili, y si su valor de cierre es false. Si es asi ejecuta el codigo de la funcion.
  let [existePrincipal, linea, cierre] =
    buscarEnTablaDeFunciones("Clase Principal");
  let [existeVariabili, linea_inizio, cierre_inizio] =
    buscarEnTablaDeFunciones("Variables");
  if (existeVariabili == false) {
    if (
      (existePrincipal == true &&
        linea < OrigenOPcode[i].linea &&
        cierre == false) ||
      cierre > OrigenOPcode[i].linea
    ) {
      let argumentosDeVariables = [];
      if (OrigenOPcode[i].opCode == "iVar") {
        let linea = OrigenOPcode[i].linea;
        let columna = OrigenOPcode[i].columna;
        let tipo = "Variables";
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
        "No se puede declarar variables fuera de la clase principal";
      return [false, i];
    }
  } else {
    errorEncontrado = "Ya existe una declaracion de variables";
    return [false, i];
  }
}

//!Metodo para comprobar la construccion de principale_inizio de nuestro programa dentro de la clase principal
function principale_inizio(OrigenOPcode, pos) {
  //Verifica mediante los valores que retorna el metodo 'buscarEnTablaDeFunciones' si existe la clase principal y si la linea en la que se declaro es menor a la linea en la que se encuentra el principale_inizio, y si su valor de cierre es false. Si es asi ejecuta el codigo de la funcion.
  let [existePrincipal, linea, cierre] =
    buscarEnTablaDeFunciones("Clase Principal");
  let [existePrincipal_inizio, linea_inizio, cierre_inizio] =
    buscarEnTablaDeFunciones("principale_inizio");
  if (existePrincipal_inizio == false) {
    if (
      (existePrincipal == true &&
        linea < OrigenOPcode[pos].linea &&
        cierre == false) ||
      cierre > OrigenOPcode[i].linea
    ) {
      let argumentosDePrincipale_inizio = [];
      if (OrigenOPcode[pos].opCode == "cmi") {
        let linea = OrigenOPcode[pos].linea;
        let columna = OrigenOPcode[pos].columna;
        let tipo = "principale_inizio";
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
              errorEncontrado +
              "\n Error en los argumentos de principale_inizio";
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
                argumentosDePrincipale_inizio,
                false
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
        errorEncontradoo =
          "Palabra reserva: 'principale_inizio' no encontrada.";
        return [false, pos];
      }
    } else {
      errorEncontrado =
        "No se encontro la clase principal. No puedes declarar principale_inizio fuera de la clase principal.";
      return [false, pos];
    }
  } else {
    errorEncontrado =
      "Ya se declaro principale_inizio, solo puede existir una vez.";
    return [false, pos];
  }
}

//!Metodo para comprobar la construccion de variables de nuestro programa dentro de la subclase variabili
function declaracionVariables(origenOPcode, pos) {
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
          construirTablaDeVariables(linea, palabraReservada, nombreVariable, 0);
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
  return [false, pos + 1];
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
  _cierre
) {
  //insertamos un nuevo objeto en la tabla de variables
  tablaDeFunciones.push({
    linea: _linea,
    columna: _columna,
    tipo: _tipo,
    nombre: _nombre,
    valor: _valor,
    cierre: _cierre,
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
    return [true, i, eval(exprecionOriginal)];
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
