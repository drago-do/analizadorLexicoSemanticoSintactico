let argumentosActuales;
function mainInterprete(funcionAejecutar, argumentos) {
  argumentosActuales = argumentos;
  //Realizar la interpretacion de las sentencias empezando por la lista de sentencias de la clase principal
  let funcionPrincipal = recuperarFuncion(funcionAejecutar);
  let estructuraSi = false;
  let estructuraEntonces = false;
  let ejecucion = true;
  funcionPrincipal.sentencias.forEach((sentencia) => {
    //Sentencia if
    if (sentencia[0].opCode == "edcAl") {
      if (estructuraEntonces) {
        ejecucion = true;
      } else {
        ejecucion = false;
      }
    }
    if (ejecucion) {
      switch (sentencia[0].opCode) {
        case "nVar":
          //Asignacion a variable
          asignacionDeVariable(sentencia[0].token, sentencia, false);
          break;
        case "mfRi":
          //Llamada a funcion de input
          const [valorEntrada, nombreVariable] = funcionInput(sentencia);
          //Asignar el valor de la variable
          asignacionDeVariable(nombreVariable, valorEntrada, true);
          break;

        case "mfSt":
          //Llamada a funcion de impresion
          funcionOutput(sentencia);
          break;

        case "mfCh":
          //Llamada a una funcion escrita por el usuario
          llamadaFuncionChimare(sentencia);
          break;

        case "edcR":
          //Ejecutar sentencia de ciclo for
          ejecutarCicloFor(funcionPrincipal.sentencias, sentencia[0].linea);
          break;

        case "edcSe":
          //Ejecutar sentencia condicional if
          let resultado = ejecutarCondicionalIf(sentencia);
          if (resultado) {
            estructuraSi = true;
          } else {
            estructuraEntonces = true;
            ejecucion = false;
          }
          break;

        case "edcFS":
          //Termina la ejecucion de la sentencia condicional if
          estructuraSi = false;
          estructuraEntonces = false;
          ejecucion = true;
          break;

        default:
          break;
      }
    }
  });
}

//Metodo para ejecutar la sentencia condicional if
function ejecutarCondicionalIf(sentencia) {
  //rescatar la condicion a evaluar que empieza en la posicion 2 y termina cuando el siguiente opCode es rp:
  let condicion = sentencia.slice(2, sentencia.length - 2);
  console.log(condicion);
  //Recuperar el token de cada elemento de la condicion y concatenarlo en una cadena
  let cadenaCondicion = "";
  condicion.forEach((elemento) => {
    //Si el token del elemento contiene una variable, se debe resolver su valor
    if (elemento.token.includes("$")) {
      let valor = devolverValorDeVariable(elemento.token);
      cadenaCondicion += valor;
    } else {
      cadenaCondicion += elemento.token;
    }
  });
  return eval(cadenaCondicion);
}

//Metodo para ejecutar el ciclo for
function ejecutarCicloFor(sentenciasDeFuncion, lineaDeInicioFor) {
  console.error(sentenciasDeFuncion);
  //Regresar el valor de la sentencia[0].linea cuando sea fin del ciclo for (opCode "edcFR") en las sentenciasDeFuncion
  let lineaDeFinFor;
  sentenciasDeFuncion.forEach((sentencia) => {
    if (sentencia[0].opCode == "edcFR") {
      lineaDeFinFor = sentencia[0].linea;
    }
  });
  //Obtener el index de la sentencia de inicio del ciclo for
  let indexDeInicioFor = sentenciasDeFuncion.findIndex(
    (sentencia) => sentencia[0].linea == lineaDeInicioFor
  );
  //Recupera el valor inicial de el indice del ciclo for y el nombre de la variable
  let valorInicialIndex = sentenciasDeFuncion[indexDeInicioFor][4].token;
  let nombreVariableIndex = sentenciasDeFuncion[indexDeInicioFor][2].token;
  //Recupera el valor final de el indice del ciclo for y el nombre de la variable
  let nombreVariableValorFinal = sentenciasDeFuncion[indexDeInicioFor][7].token;
  let valorFinalIndex = devolverValorDeVariable(nombreVariableValorFinal) - 1;
  //Recupera solo las sentencias que estan dentro de el ciclo for (Las que su valor .linea sea mayor que "lineaDeInicioFor" y menor que "lineaDeFinFor")
  let sentenciasDelCicloFor = sentenciasDeFuncion.filter(
    (sentencia) =>
      sentencia[0].linea > lineaDeInicioFor &&
      sentencia[0].linea < lineaDeFinFor
  );
  //Crear un objeto de tipo cicloFor con el atributo sentencias
  let cicloFor = {
    nombre: "cicloFor",
    sentencias: sentenciasDelCicloFor,
  };
  //Insetar en tabla de funciones el objeto cicloFor
  tablaDeFunciones.push(cicloFor);
  //Ejecutar las sentencias del ciclo for
  for (let index = valorInicialIndex; index < valorFinalIndex; index++) {
    //Asignar el valor del indice al nombre de la variable
    asignacionDeVariable(nombreVariableIndex, index, true);
    //Ejecutar las sentencias del ciclo for
    mainInterprete("cicloFor");
  }
}

function llamadaFuncionChimare(sentencia) {
  let nombreFuncion = sentencia[2].token;
  let funcion = recuperarFuncion(nombreFuncion);
  //Ejecutar la funcion
  mainInterprete(funcion.nombre);
}

function recuperarFuncion(nombreFuncion) {
  let funcionRetornar;
  tablaDeFunciones.forEach((funcion) => {
    if (funcion.nombre == nombreFuncion) {
      funcionRetornar = funcion;
    }
  });
  return funcionRetornar;
}

function asignacionDeVariable(nombre, sentencia, input) {
  let variableObj = tablaDeVariables.find(
    (variable) => variable.nombre == nombre
  );
  if (input) {
    variableObj.valor = sentencia;
  } else {
    //Recuperar el valor de la variable a asignar, empieza en sentencia[2] y termina en sentencia.length - 1
    let valorAsignar = sentencia.slice(2, sentencia.length - 1);
    if (valorAsignar.length == 1) {
      valorAsignar = resolverValoresDeVariables(valorAsignar[0].token);
      variableObj.valor = valorAsignar[1];
    } else {
      //Concatenar los valores que contiene el array valor
      let exprecion = concatenarExprecion(valorAsignar);
      const [evaluado, exprecionNueva] = resolverValoresDeVariables(exprecion);
      //Evaluar la expresion
      variableObj.valor = eval(exprecionNueva);
    }
  }
}

//función que devuelve el valor de una variable en la tabla de variables
function devolverValorDeVariable(nombreVariable) {
  let variableObj = tablaDeVariables.find(
    (variable) => variable.nombre == nombreVariable
  );
  return variableObj.valor;
}

//Funcion que concatena los valores de un array
function concatenarExprecion(valor) {
  let exprecion = "";
  valor.forEach((valor) => {
    exprecion += valor.token;
  });
  return exprecion;
}

//Crear funcion de input, habilita la entrada de una variable via consola
function funcionInput(sentencia) {
  let nombreVariable = sentencia[2].token;
  //Detener la ejecucion hasta que se ingrese un valor

  let valorEntrada = textoConsola(
    "Ingrese el valor de la variable " + nombreVariable + ": ",
    true
  );

  return [valorEntrada, nombreVariable];
}

function funcionOutput(sentencia) {
  //Recuperar el valor de la variable a imprimir, empieza en sentencia[2] y termina en sentencia.length - 2
  let valorImprimir = sentencia.slice(2, sentencia.length - 2);
  if (valorImprimir.length == 1) {
    valorImprimir = resolverValoresDeVariables(valorImprimir[0].token);
    textoConsola(valorImprimir[1], false);
  } else {
    //Concatenar los valores que contiene el array valor
    let exprecion = concatenarExprecion(valorImprimir);
    const [evaluado, exprecionNueva] = resolverValoresDeVariables(exprecion);
    //Evaluar la expresion
    valorImprimir = eval(exprecionNueva);
    textoConsola("valorImprimir", false);
    textoConsola(valorImprimir, false);
  }
}

//Funcion que permite la entrada de texto por consola
function textoConsola(mensaje, input) {
  //Recuperar textarea de html con id consola
  let consola = document.getElementById("consola");
  //Mostrar mensaje en consola en una nueva linea
  consola.value += "\n" + mensaje;
  //Verificar si es un input
  if (input) {
    //Habilita la entrada de texto por consola y retorna el valor ingresado
    valorInput = prompt(mensaje);
    //Agregar el valor ingresado a la consola
    consola.value += " " + valorInput;
    return valorInput;
  } else {
    return true;
  }
}
