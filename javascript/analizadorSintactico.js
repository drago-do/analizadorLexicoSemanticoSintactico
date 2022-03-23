//Este es el archivo en el que se desarrollara el codigo del Analizador Sintactico
//Language: javascript
//Variables Globales para trabajar nuestro lenguaje de programacion
let errorEncontrado = "";
var profundidad = 0;
//Profundidad 1 = Nunca se cerro la clase principal
//Profundidad 2 = Nunca se cerro la parte de variables, metodos, principale_inizio, etc
//Profundidad 3 = Nunca se cerro la parte de estructuras de control if, for, while, etc
//Profundidad n+ = Nunca se cerro la parte de estructuras de control anidadas

function mainSintactico() {
  //Comprueba si la tabla de simbolos esta vacia
  if (tablaDeSimbolos.length > 0) {
    //Recorre la tabla de simbolos con un for
    for (var i = 0; i < tablaDeSimbolos.length; i++) {
      //!Comprueba si existe classe en la tabla de simbolos
      if (
        tablaDeSimbolos[i].opCode == "c" ||
        !buscarEnTablaDeVariables("Clase Principal")
      ) {
        const [evaluaClasePrincipal, nuevai] = clasePrincipal(
          tablaDeSimbolos,
          i
        );
        if (evaluaClasePrincipal == false) {
          errorEncontrado =
            errorEncontrado +
            "\n Error en la clase principal, linea: " +
            tablaDeSimbolos[i].linea;
          console.error(errorEncontrado);
          errorSintactico(errorEncontrado);
          break;
        } else {
          console.log("Clase principal correcta");
          console.log(tablaDeVariables);
          i = nuevai;
        }
      } else {
        errorEncontrado = "No existe la clase principal";
      }
      //!Comprueba si existe variabili en la tabla de simbolos
      if (tablaDeSimbolos[i].opCode == "iVar") {
        const [evaluaVariables, nuevai] = variabili(tablaDeSimbolos, i);
        if (evaluaVariables == false) {
          errorEncontrado =
            errorEncontrado +
            "\n Error en la declaracion de variables, linea: " +
            tablaDeSimbolos[i].linea;
          console.error(errorEncontrado);
          errorSintactico(errorEncontrado);
          break;
        } else {
          console.log("Variables correctas");
          console.log(tablaDeVariables);
          i = nuevai;
        }
      }
    }
  } else {
    alert(
      "La tabla de simbolos esta vacia. \n Realiza el analisis lexico primero"
    );
  }
}

//!Funcion para testeo-- HTML boton "Prueba"
function test() {
  
}

//!Funcion para mandar errores a la consola de html
function errorSintactico(error) {
  //Hacer el textarea no editable, con el fin de que no se pueda modificar. El contorno de este en color rojo y el texto rojo en negrita
  document.getElementById("erroresSintacticos").style.borderColor = "red";
  document.getElementById("erroresSintacticos").style.color = "red";
  document.getElementById("erroresSintacticos").style.fontWeight = "bold";
  //Envia el texto de errorEncontrado al textarea en el html con el id 'erroresSintacticos'
  document.getElementById("erroresSintacticos").value = error;
}

//Busquedas en la tabla de variables, para ver si existe una variable con el mismo nombre o no exite ninguna
function buscarEnTablaDeVariables(nombre) {
  if (tablaDeVariables.length > 0) {
    for (var i = 0; i < tablaDeVariables.length; i++) {
      if (tablaDeVariables[i].tipo == nombre) {
        return true;
      }
    }
  }
  return false;
}

//!Metodo para comprobar la construccion de la clase base de nuestro programa
function clasePrincipal(OrigenOPcode, pos) {
  let argumentosDeClasePrincipal = [];
  for (i = pos; i < OrigenOPcode.length; i++) {
    if (OrigenOPcode[i].opCode == "c") {
      profundidad++;
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
                construirTablaDeVariables(
                  linea,
                  columna,
                  tipo,
                  nombre,
                  argumentosDeClasePrincipal
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
function variabili(OrigenOPcode, pos) {
  let argumentosDeVariables = [];
  for (i = pos; i < OrigenOPcode.length; i++) {
    if (OrigenOPcode[i].opCode == "iVar") {
      let linea = OrigenOPcode[i].linea;
      let columna = OrigenOPcode[i].columna;
      let tipo = "Variables";
      let nombre = OrigenOPcode[i].token;
      profundidad++;
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
            construirTablaDeVariables(
              linea,
              columna,
              tipo,
              nombre,
              argumentosDeVariables
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
  }
}

//Metodo para construir los objetos de la tabla de variables
function construirTablaDeVariables(_linea, _columna, _tipo, _nombre, _valor) {
  //insertamos un nuevo objeto en la tabla de variables
  tablaDeVariables.push({
    linea: _linea,
    columna: _columna,
    tipo: _tipo,
    nombre: _nombre,
    valor: _valor,
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
  while (OrigenOPcode[i].opCode != "sep," && OrigenOPcode[i].opCode != "rp:") {
    exprecion = exprecion + OrigenOPcode[i].token;
    i++;
  }
  //Guardamos la exprecion original para poder evaluarla despues
  exprecionOriginal = exprecion;

  //!Hasta este momento tenemos una exprecion cruda, tal que '5+5', se convertira en 'e+e' para ser evaluada
  //Eliminar puntos decimales de la exprecion
  exprecion = exprecion.replace(/\./g, "");
  //Remplazar los numeros con la letra 'e'
  exprecion = exprecion.replace(/[0-9]+/g, "e");
  if (evaluarExprecion(exprecion) == false) {
    errorEncontrado = errorEncontrado + "\nExprecion matematica mal escrita: "+exprecionOriginal;
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
