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
      //Comprueba si existe classe en la tabla de simbolos
      if (tablaDeSimbolos[i].opCode == "c") {
        if (clasePrincipal(tablaDeSimbolos, i) == false) {
          errorEncontrado =
            errorEncontrado +
            "\n Error en la clase principal, linea: " +
            tablaDeSimbolos[i].linea;
          console.error(errorEncontrado);
        } else {
          console.log("Clase principal correcta");
          console.log(tablaDeVariables);
        }
      }
    }
  } else {
    alert(
      "La tabla de simbolos esta vacia. \n Realiza el analisis lexico primero"
    );
  }
}

function clasePrincipal(OrigenOPcode, pos) {
  let argumentosDeClasePrincipal = [];
  let evaluacionAritmetica = "";
  for (i = pos; i < OrigenOPcode.length; i++) {
    if (OrigenOPcode[i].opCode == "c") {
      profundidad++;
      i++;
      let linea = OrigenOPcode[i].linea;
      let columna = OrigenOPcode[i].columna;
      let tipo = OrigenOPcode[i].tipo;
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
                "\n Error en los argumentos de la clase principal";
              return false;
            }
            if (OrigenOPcode[i].opCode == "rp:") {
              i++;
              if (OrigenOPcode[i].opCode == "io") {
                construirTablaDeVariables(
                  linea,
                  columna,
                  tipo,
                  nombre,
                  argumentosDeClasePrincipal
                );
                return true;
              } else {
                errorEncontrado =
                  "Falta el caracter '~' de apertura de clase principal";
              }
            } else {
              errorEncontrado =
                "Falta el caracter 'dos puntos' de cierre de la clase principal";
            }
          } else {
            errorEncontrado =
              "Faltan el caracter 'dos puntos' de apertura para argumentos";
            return false;
          }
        } else {
          errorEncontrado = "Palabra reserva: 'arg' no encontrada.";
          return false;
        }
      } else {
        errorEncontrado =
          "Nombre de clase no declarado de forma correcta o no existe.";
        return false;
      }
    } else {
      errorEncontrado = "Palabra reserva: 'classe' no encontrada.";
      return false;
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
    if (OrigenOPcode[i].opCode == "numE" || OrigenOPcode[i].opCode == "numF" || OrigenOPcode[i].opCode == "oa(") {
      const [booleano, nuevai, exprecionEvaluada] = aritLogic(OrigenOPcode, i);
      if (booleano == true) {
        i = nuevai;
        argumentos.push(exprecionEvaluada);
        continue;
      } else {
        errorEncontrado = "Exprecion matematica no correcta";
        console.error(errorEncontrado);
        return [false,"",i];
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
  while (
    OrigenOPcode[i].opCode == "numE" ||
    OrigenOPcode[i].opCode == "numF" ||
    OrigenOPcode[i].opCode == "oa+" ||
    OrigenOPcode[i].opCode == "oa-" ||
    OrigenOPcode[i].opCode == "oa*" ||
    OrigenOPcode[i].opCode == "oa/" ||
    OrigenOPcode[i].opCode == "oa%" ||
    OrigenOPcode[i].opCode == "oa(" ||
    OrigenOPcode[i].opCode == "oa)"
  ) {
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
    errorEncontrado = "Exprecion matematica no correcta";
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
    ) caso =7;
    //!Octava regla
    //Si la exprecion a evanluar contiene 'ee' este se remplaza por 'e'
    if (exprecion.includes("ee")) caso =8;
      

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
        console.error(
          "Funcion recursiva 'evaluarExprecion()' dice: No hay reglas gramaticales que aplicar a la exprecion"
        );
        return false;
        break;
    }
    return evaluarExprecion(exprecion);
  }
}

