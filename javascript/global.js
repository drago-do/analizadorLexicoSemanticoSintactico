//Variables Globales para trabajar nuestro lenguaje de programacion

var tablaDeSimbolos = [];
let numberOfLines;
let tablaDeVariables = [];
let tablaDeFunciones = [];

//Funcion para limpiar la consola de errores Sintacticos
function limpiarFlujoDeTrabajo() {
  document.getElementById("erroresSintacticos").value = "";
  tablaDeFunciones = [];
  tablaDeVariables = [];
  tablaDeSimbolos = [];
  numberOfLines = 0;

  var datos = document.getElementById("tablaDeDatos");
  var simbolos = document.getElementById("tablaDeSimbolos");
  var consola = document.getElementById("consola");
  //Limpiar consola
  consola.value = "";
  var drowCount = datos.rows.length;
  var srowCount = simbolos.rows.length;
  //console.log(rowCount);
  if (drowCount <= 1) {
    //alert("No se puede eliminar el encabezado");
  } else datos.deleteRow(drowCount - 1);

  let i = 1;
  while (srowCount - 1 != i) {
    simbolos.deleteRow(srowCount - i);
    i++;
  }
}
