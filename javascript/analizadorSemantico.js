/*
Los errores semánticos a considerar son:
1. Type mismatch - Inconsistencia de tipos. (operaciones no válidas porque los tipos no son compatibles, por ejemplo: 5 / "hola"
2. Undeclared Variable (variable usada pero no declarada o sin asignación de algún valor) x = y + 1 (pero nunca le asignaste nada a y)
3. Reserved identifier misuse (sí se declaró pero no se usó) x = 5, (y luego nunca la usaste en ningún lado).
4. Multiple declaration (la declaraste muchas veces, int x; int y; int x; )
5. Querer usar una variable en un ámbito local en otro ámbito local. (la declaraste dentro de una función pero la quieres usar en otra función.
De esos CINCO, resuelva CUATRO (el 5 es OPCIONAL) en su analizador semántico.
1,2,3 y 5 aplican para tipados estáticos o dinámicos.
4 aplica para tipado estático solamente.
*/
function mainSemantico() {
  // console.log("Iniciando Analizador Semantico");
  let resultado1 = typeMismatch();
  let resultado2 = undeclaredVariable();
  let resultado3 = reservedIdentifier();
  let resultado4 = multipleDeclaration();
  // console.log(tablaDeVariables);
  if (
    resultado1 == false ||
    resultado2 == false ||
    resultado3 == false ||
    resultado4 == false
  ) {
    // console.log("Errores Semanticos");
    errorSemantico(errorEncontrado);
  }
}

function multipleDeclaration() {
  //Verificar que no se haya declarado una variable con el mismo nombre $var x = 5, $var x = 6;
  let variablesRepetidas = [];
  tablaDeVariables.forEach((variable) => {
    if (variablesRepetidas.includes(variable.nombre)) {
      errorEncontrado =
        "Error Semantico: Multiple declaration de  la  variable " +
        variable.nombre;
      return false;
    } else {
      variablesRepetidas.push(variable.nombre);
    }
  });
}

function reservedIdentifier() {
  //Crear un array con los nombres de las variables.
  let nombresDeVariables = [];
  tablaDeVariables.forEach((variable) => {
    //Guardar en el array los nombres de las variables.
    nombresDeVariables.push(variable.nombre);
  });

  tablaDeFunciones.forEach((metodo) => {
    //Si el metodo es igual a "mi" o "cmi"
    if (metodo.tipo == "mi" || metodo.tipo == "cmi") {
      metodo.sentencias.forEach((lineasDeSentencia) => {
        lineasDeSentencia.forEach((sentencia) => {
          sentenciaToken = sentencia.token;
          // console.log(sentencia);
          //Si el token es una variable y no esta en el array de nombres de variables (no esta declarada)
          if (
            sentencia.opCode == "nVar" &&
            !nombresDeVariables.includes(sentencia.token)
          ) {
            errorEncontrado =
              errorEncontrado +
              "La variable " +
              sentencia.token +
              " no esta declarada en la clase variabili. Error en la linea " +
              sentencia.linea +
              " \n";
          }
          //Si el token es una variable y esta declarada sumarle 1 al contador de la variable en el valor "uso".
          if (
            sentencia.opCode == "nVar" &&
            nombresDeVariables.includes(sentencia.token)
          ) {
            let variable = tablaDeVariables.find(
              (variable) => variable.nombre == sentencia.token
            );
            variable.uso++;
          }
        });
      });
    }
  });
  //Recuperar todas las variables que no se hayan usado. (uso = 0)
  let variablesSinUso = tablaDeVariables.filter(
    (variable) => variable.uso == 0
  );
  //Recorrer el array de variables sin uso y agregarlos al error.
  variablesSinUso.forEach((variable) => {
    errorEncontrado =
      errorEncontrado +
      "La variable " +
      variable.nombre +
      " no se uso en ninguna sentencia. Variable  en la linea " +
      variable.linea +
      " \n";
  });
  return errorEncontrado == "";
}

function undeclaredVariable() {
  return true;
  //Este codigo ya fue implementado en el analizador sintáctico.
  //Por lo que no es necesario implementarlo aquí.
  //Las variables que no se haya asignado ningun valor, se les asigna un valor por defecto, "" , IMPOSTORE, 0.
}

function typeMismatch() {
  return true;
  //Este codigo ya fue implementado en el analizador sintáctico.
  //Por lo que no es necesario implementarlo aquí.
}

function errorSemantico(error) {
  //Hacer el textarea no editable, con el fin de que no se pueda modificar. El contorno de este en color rojo y el texto rojo en negrita
  document.getElementById("erroresSintacticos").style.borderColor = "red";
  document.getElementById("erroresSintacticos").style.color = "red";
  document.getElementById("erroresSintacticos").style.fontWeight = "bold";
  //Envia el texto de errorEncontrado al textarea en el html con el id 'erroresSintacticos'
  document.getElementById("erroresSintacticos").value = error;
  console.error(error);
}
