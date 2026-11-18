/* ============================================================
   Archivo JavaScript GENERAL para el Taller de Algoritmos
   Contiene la logica de los 5 algoritmos (sin POO, procedural).
   El problema 5 (tabla de amortizacion) usa ademas jQuery y DataTables.
   Cada pagina HTML usa solo las funciones que le corresponden.
   ============================================================ */

/* Utilidad comun: formatear numeros como pesos colombianos */
function fmtPesos(n){
  return '$' + n.toLocaleString('es-CO', { maximumFractionDigits: 2 });
}

/* ------------------------------------------------------------
   PROBLEMA 1: Valor absoluto de un numero
   ------------------------------------------------------------ */
function valorAbsoluto(){
  var err = document.getElementById('err');
  var box = document.getElementById('result');
  var numero = parseFloat(document.getElementById('numero').value);

  if (isNaN(numero)) { err.classList.add('show'); box.classList.remove('show'); return; }
  err.classList.remove('show');

  var absoluto;
  if (numero < 0) {
    absoluto = -numero;
  } else {
    absoluto = numero;
  }

  document.getElementById('salida').textContent = 'El valor absoluto es: ' + absoluto;
  document.getElementById('paso').textContent =
    (numero < 0)
      ? '¿numero < 0? Verdadero → absoluto = ' + numero + ' × (-1) = ' + absoluto
      : '¿numero < 0? Falso → absoluto = ' + numero;
  box.classList.add('show');
}

/* ------------------------------------------------------------
   PROBLEMA 2: Descuento de supermercado segun numero al azar
   ------------------------------------------------------------ */
function descuentoSupermercado(){
  var err = document.getElementById('err');
  var box = document.getElementById('result');
  var total = parseFloat(document.getElementById('total').value);

  if (isNaN(total) || total < 0) { err.classList.add('show'); box.classList.remove('show'); return; }
  err.classList.remove('show');

  var azar = Math.floor(Math.random() * 101); // numero al azar entre 0 y 100
  var descuento, porc;
  if (azar < 74) {
    descuento = total * 0.15; porc = '15%'; // 15%
  } else {
    descuento = total * 0.20; porc = '20%'; // 20%
  }
  var pagar = total - descuento;

  document.getElementById('azar').textContent = azar;
  document.getElementById('porc').textContent = porc + (azar < 74 ? ' (azar < 74)' : ' (azar ≥ 74)');
  document.getElementById('descuento').textContent = fmtPesos(descuento);
  document.getElementById('pagar').textContent = fmtPesos(pagar);
  box.classList.add('show');
}

/* ------------------------------------------------------------
   PROBLEMA 3: Salario neto de vendedores
   ------------------------------------------------------------ */
var SMLV = 644336;    // SMLV 2015
var AUXILIO = 74000;  // Auxilio de transporte 2015
var vendedores = [];

function agregarVendedor(){
  var err = document.getElementById('err');
  var cedula = document.getElementById('cedula').value.trim();
  var nombre = document.getElementById('nombre').value.trim();
  var codigo = document.getElementById('codigo').value.trim();
  var basico = parseFloat(document.getElementById('basico').value);
  var ventas = parseFloat(document.getElementById('ventas').value);
  var prestamos = parseFloat(document.getElementById('prestamos').value);

  if (!cedula || !nombre || !codigo || isNaN(basico) || isNaN(ventas) || isNaN(prestamos)) {
    err.textContent = 'Complete todos los campos con valores validos.'; err.classList.add('show'); return;
  }
  err.classList.remove('show'); err.textContent = '';

  // Auxilio si el basico esta entre 1 y 3 SMLV
  var auxilio;
  if (basico >= SMLV && basico <= 3 * SMLV) { auxilio = AUXILIO; } else { auxilio = 0; }

  var comision = ventas * 0.02;                      // comision del 2%
  var totalDevengado = basico + auxilio + comision;
  var deduccionObligatoria = basico * 0.05;          // 5% obligatorio sobre el basico
  var totalDeducciones = deduccionObligatoria + prestamos;
  var neto = totalDevengado - totalDeducciones;

  vendedores.push({ cedula:cedula, nombre:nombre, codigo:codigo,
                    basico:basico, auxilio:auxilio, comision:comision,
                    prestamos:prestamos, neto:neto });
  renderVendedores();

  ['cedula','nombre','codigo','basico','ventas','prestamos'].forEach(function(id){
    document.getElementById(id).value = '';
  });
  document.getElementById('cedula').focus();
}

function renderVendedores(){
  var tbody = document.getElementById('tbody');
  tbody.innerHTML = '';
  vendedores.forEach(function(v){
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td class="left">' + v.cedula + '</td>' +
      '<td class="left">' + v.nombre + '</td>' +
      '<td class="left">' + v.codigo + '</td>' +
      '<td>' + fmtPesos(v.basico) + '</td>' +
      '<td>' + fmtPesos(v.auxilio) + '</td>' +
      '<td>' + fmtPesos(v.comision) + '</td>' +
      '<td>' + fmtPesos(v.prestamos) + '</td>' +
      '<td class="neto">' + fmtPesos(v.neto) + '</td>';
    tbody.appendChild(tr);
  });
  document.getElementById('tabla').classList.toggle('show', vendedores.length > 0);
  document.getElementById('counter').textContent =
    vendedores.length ? ('Vendedores registrados: ' + vendedores.length) : '';
}

function limpiarVendedores(){ vendedores = []; renderVendedores(); }

/* ------------------------------------------------------------
   PROBLEMA 4: Matriz M(50,5) de alumnos
   Columnas: codigo, nota1, nota2, nota3, nota_final (promedio)
   ------------------------------------------------------------ */
var M = []; // matriz (arreglo de arreglos)

function agregarAlumno(){
  var err = document.getElementById('err');
  var codigo = document.getElementById('codigo').value.trim();
  var n1 = parseFloat(document.getElementById('n1').value);
  var n2 = parseFloat(document.getElementById('n2').value);
  var n3 = parseFloat(document.getElementById('n3').value);

  if (!codigo) { err.textContent = 'Ingrese el codigo del alumno.'; err.classList.add('show'); return; }
  // Control de rango 1.0 a 5.0
  if (isNaN(n1) || n1 < 1.0 || n1 > 5.0 ||
      isNaN(n2) || n2 < 1.0 || n2 > 5.0 ||
      isNaN(n3) || n3 < 1.0 || n3 > 5.0) {
    err.textContent = 'Nota invalida: las tres notas deben estar entre 1.0 y 5.0.';
    err.classList.add('show'); return;
  }
  err.classList.remove('show'); err.textContent = '';

  var final = (n1 + n2 + n3) / 3;
  M.push([codigo, n1, n2, n3, final]);
  renderAlumnos();

  ['codigo','n1','n2','n3'].forEach(function(id){ document.getElementById(id).value = ''; });
  document.getElementById('codigo').focus();
}

function clasificarAlumno(final){
  if (final === 5.0) return { t:'Aprobado / Maxima', c:'max' };
  if (final >= 3.0 && final <= 5.0) return { t:'Aprobado', c:'apro' };
  if (final >= 2.0 && final <= 2.9) return { t:'Recuperacion', c:'recu' };
  return { t:'Reprobado', c:'rep' };
}

function renderAlumnos(){
  var tbody = document.getElementById('tbody');
  tbody.innerHTML = '';
  var aprobados = 0, recuperacion = 0, maxima = 0;

  M.forEach(function(f){
    var final = f[4];
    // Conteos (misma logica del algoritmo: la maxima se cuenta aparte)
    if (final >= 3.0 && final <= 5.0) { aprobados++; }
    else if (final >= 2.0 && final <= 2.9) { recuperacion++; }
    if (final === 5.0) { maxima++; }

    var cl = clasificarAlumno(final);
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + f[0] + '</td>' +
      '<td>' + f[1].toFixed(1) + '</td>' +
      '<td>' + f[2].toFixed(1) + '</td>' +
      '<td>' + f[3].toFixed(1) + '</td>' +
      '<td><b>' + final.toFixed(2) + '</b></td>' +
      '<td><span class="tag ' + cl.c + '">' + cl.t + '</span></td>';
    tbody.appendChild(tr);
  });

  document.getElementById('cApro').textContent = aprobados;
  document.getElementById('cRecu').textContent = recuperacion;
  document.getElementById('cMax').textContent = maxima;
  document.getElementById('cards').style.display = M.length ? 'grid' : 'none';
  document.getElementById('tabla').classList.toggle('show', M.length > 0);
}

function limpiarAlumnos(){ M = []; renderAlumnos(); }

/* ------------------------------------------------------------
   Tecla Enter para las paginas con un solo campo (P1 y P2).
   Se verifica que el elemento exista antes de asociar el evento.
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function(){
  var campoNumero = document.getElementById('numero');
  if (campoNumero) campoNumero.addEventListener('keydown', function(e){ if (e.key === 'Enter') valorAbsoluto(); });

  var campoTotal = document.getElementById('total');
  if (campoTotal) campoTotal.addEventListener('keydown', function(e){ if (e.key === 'Enter') descuentoSupermercado(); });
});


/* ============================================================
   PROBLEMA 5: TABLA DE AMORTIZACIÓN (carpeta Problema4_Tabla_de_Amortizacion)
   ------------------------------------------------------------
   Esta sección SÍ usa jQuery y DataTables. Las páginas de los
   problemas 1 a 4 no los cargan, por eso los eventos de abajo
   solo se activan si existe jQuery y el formulario de amortización.

   ¿Qué hace este archivo?
     1. Lee del formulario: deuda, interés mensual y plazo.
     2. Valida los datos con las reglas del taller.
     3. Calcula la cuota fija (sistema francés) y arma la tabla
        mes a mes: cuota, interés, abono a capital y saldo.
     4. Muestra la tabla con DataTables (en español).
     5. Abre una ventana modal para imprimir la tabla.

   Librerías que usa (se cargan en el HTML antes de este archivo):
     - jQuery     → el signo $ para buscar elementos y manejar eventos.
     - DataTables → convierte una <table> normal en una tabla con
                    buscador, orden por columnas y paginación.
   ============================================================ */


/* ============================================================
   1. CONSTANTES: las REGLAS del negocio en un solo lugar.
      Si mañana cambia una regla, solo se cambia aquí.
   ============================================================ */
var DEUDA_MINIMA   = 2000000; // la deuda debe ser MAYOR a este valor
var INTERES_MINIMO = 1;       // 1 % mensual (mínimo permitido)
var INTERES_MAXIMO = 5;       // 5 % mensual (tasa de usura máxima de la regla)
var PLAZO_MINIMO   = 1;       // al menos 1 mes
var PLAZO_MAXIMO   = 360;     // máximo 30 años, para que la tabla no sea infinita

// Archivo oficial de traducción al español de DataTables (se pide por AJAX)
var URL_IDIOMA_ES = 'https://cdn.datatables.net/plug-ins/2.1.8/i18n/es-ES.json';

// Traducción de RESPALDO: se usa si no hay internet o el AJAX falla.
// Las palabras _START_, _END_, _TOTAL_, _MAX_ y _MENU_ las reemplaza DataTables.
var IDIOMA_ES_RESPALDO = {
  decimal: ',',
  thousands: '.',
  emptyTable: 'No hay datos disponibles en la tabla',
  info: 'Mostrando _START_ a _END_ de _TOTAL_ cuotas',
  infoEmpty: 'Mostrando 0 a 0 de 0 cuotas',
  infoFiltered: '(filtrado de _MAX_ cuotas en total)',
  lengthMenu: 'Mostrar _MENU_ cuotas',
  loadingRecords: 'Cargando...',
  processing: 'Procesando...',
  search: 'Buscar:',
  zeroRecords: 'No se encontraron resultados',
  paginate: { first: 'Primero', last: 'Último', next: 'Siguiente', previous: 'Anterior' },
  aria: { orderable: 'Ordenar por esta columna', orderableReverse: 'Invertir el orden de esta columna' }
};


/* ============================================================
   2. VARIABLES GLOBALES (se recuerdan mientras la página esté abierta)
   ============================================================ */
var tablaDT       = null;               // la tabla DataTables (null = aún no se ha creado)
var idiomaTabla   = IDIOMA_ES_RESPALDO; // idioma que usará DataTables
var ultimoCalculo = null;               // guarda el último resultado para imprimirlo


/* ============================================================
   3. FUNCIONES DE UTILIDAD (pequeñas ayudas reutilizables)
   ============================================================ */

/**
 * formatearPesos: convierte un número en texto de pesos colombianos.
 * Ejemplo: formatearPesos(1500000.5)  →  "$ 1.500.000,50"
 * @param {number} valor  número a formatear
 * @returns {string}      texto con signo $, puntos de miles y 2 decimales
 */
function formatearPesos(valor) {
  return valor.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * renderizarPesos: función que DataTables llama para CADA celda de dinero.
 * DataTables pide el dato de varias formas ("tipo"):
 *   - 'display' → lo que se ve en pantalla       → devolvemos "$ 1.500.000,00"
 *   - 'filter'  → lo que usa el buscador         → también el texto bonito
 *   - 'sort'    → lo que usa para ordenar        → devolvemos el NÚMERO puro
 * Así se ve bonito pero ordena bien (como número, no como texto).
 */
function renderizarPesos(dato, tipo) {
  if (tipo === 'display' || tipo === 'filter') {
    return formatearPesos(dato);
  }
  return dato;
}


/* ============================================================
   4. LEER Y VALIDAR LOS DATOS DEL FORMULARIO
   ============================================================ */

/**
 * leerDatosFormulario: toma lo que el usuario escribió en las 3 cajas.
 * $('#deuda').val() → jQuery busca el elemento con id="deuda" y lee su valor (texto).
 * parseFloat / Number → convierten ese texto en número.
 * @returns {{deuda:number, interes:number, plazo:number}}
 */
function leerDatosFormulario() {
  return {
    deuda:   parseFloat($('#deuda').val()),
    interes: parseFloat($('#interes').val()),
    plazo:   Number($('#plazo').val())
  };
}

/**
 * validarDatos: revisa las reglas del taller.
 * No muestra nada en pantalla: solo devuelve una LISTA de errores.
 * Si la lista queda vacía ([]), los datos son correctos.
 * @param {{deuda:number, interes:number, plazo:number}} datos
 * @returns {Array<{campo:string, mensaje:string}>}
 */
function validarDatos(datos) {
  var errores = [];

  // --- Regla 1: DEUDA positiva y mayor a 2.000.000 ---
  if (isNaN(datos.deuda)) {
    errores.push({ campo: 'deuda', mensaje: 'Escriba el valor de la deuda (solo números).' });
  } else if (datos.deuda <= 0) {
    errores.push({ campo: 'deuda', mensaje: 'La deuda debe ser un valor positivo.' });
  } else if (datos.deuda <= DEUDA_MINIMA) {
    errores.push({ campo: 'deuda', mensaje: 'La deuda debe ser mayor a ' + formatearPesos(DEUDA_MINIMA) + '.' });
  }

  // --- Regla 2: INTERÉS entre 1 % y 5 % mensual (usura) ---
  if (isNaN(datos.interes)) {
    errores.push({ campo: 'interes', mensaje: 'Escriba el interés mensual (solo números).' });
  } else if (datos.interes < INTERES_MINIMO) {
    errores.push({ campo: 'interes', mensaje: 'El interés debe ser positivo y mínimo ' + INTERES_MINIMO + '%.' });
  } else if (datos.interes > INTERES_MAXIMO) {
    errores.push({ campo: 'interes', mensaje: 'Supera la tasa de usura: máximo ' + INTERES_MAXIMO + '% mensual.' });
  }

  // --- Regla 3: PLAZO entero positivo de meses ---
  // Ojo: Number('') da 0, por eso revisamos también si la caja está vacía.
  if ($('#plazo').val() === '' || isNaN(datos.plazo)) {
    errores.push({ campo: 'plazo', mensaje: 'Escriba el plazo en meses.' });
  } else if (!Number.isInteger(datos.plazo)) {
    errores.push({ campo: 'plazo', mensaje: 'El plazo debe ser un número entero de meses (sin decimales).' });
  } else if (datos.plazo < PLAZO_MINIMO || datos.plazo > PLAZO_MAXIMO) {
    errores.push({ campo: 'plazo', mensaje: 'El plazo debe estar entre ' + PLAZO_MINIMO + ' y ' + PLAZO_MAXIMO + ' meses.' });
  }

  return errores;
}

/**
 * limpiarErrores: borra los mensajes rojos y el borde rojo de las cajas.
 */
function limpiarErrores() {
  $('.campo-error').text('');            // vacía todos los <small class="campo-error">
  $('#formAmortizacion input').removeClass('invalido');
  $('#err').removeClass('show').text('');
}

/**
 * mostrarErrores: pinta cada error debajo de su caja.
 * Por cada error busca el <small id="error-CAMPO"> y le pone el mensaje.
 * @param {Array<{campo:string, mensaje:string}>} errores
 */
function mostrarErrores(errores) {
  limpiarErrores();
  $.each(errores, function (indice, error) {
    $('#error-' + error.campo).text(error.mensaje);   // texto del error
    $('#' + error.campo).addClass('invalido');         // borde rojo en la caja
  });
  $('#err').addClass('show').text('Corrija los ' + errores.length + ' dato(s) marcados en rojo.');
  $('#' + errores[0].campo).trigger('focus');          // pone el cursor en el primer error
}


/* ============================================================
   5. CÁLCULOS FINANCIEROS (la "lógica" del algoritmo)
   ============================================================ */

/**
 * calcularCuotaFija: fórmula del sistema francés (cuota igual todos los meses).
 *
 *              P · i
 *   Cuota = ─────────────
 *           1 − (1 + i)^−n
 *
 *   P = deuda, i = interés mensual en decimal (2 % → 0.02), n = número de meses.
 *
 * @param {number} deuda        valor prestado (P)
 * @param {number} tasaMensual  interés en porcentaje, ej: 2.5
 * @param {number} plazo        número de meses (n)
 * @returns {number}            valor de la cuota mensual
 */
function calcularCuotaFija(deuda, tasaMensual, plazo) {
  var i = tasaMensual / 100;                 // pasar de porcentaje a decimal
  return (deuda * i) / (1 - Math.pow(1 + i, -plazo));
}

/**
 * generarTablaAmortizacion: arma la tabla mes por mes.
 *
 * En cada mes:
 *   interés del mes  = saldo pendiente × i
 *   abono a capital  = cuota − interés del mes
 *   nuevo saldo      = saldo pendiente − abono a capital
 *
 * En el último mes se ajusta el abono para que el saldo quede exactamente en 0
 * (por los decimales siempre sobra o falta una fracción de centavo).
 *
 * @returns {{cuota:number, filas:Array, totalIntereses:number, totalPagado:number, deuda:number, interes:number, plazo:number}}
 */
function generarTablaAmortizacion(deuda, tasaMensual, plazo) {
  var i = tasaMensual / 100;
  var cuota = calcularCuotaFija(deuda, tasaMensual, plazo);
  var saldo = deuda;
  var filas = [];
  var totalIntereses = 0;
  var totalPagado = 0;

  for (var mes = 1; mes <= plazo; mes++) {
    var interesMes = saldo * i;
    var abonoCapital = cuota - interesMes;
    var cuotaMes = cuota;

    if (mes === plazo) {               // último mes: se paga TODO lo que queda
      abonoCapital = saldo;
      cuotaMes = abonoCapital + interesMes;
    }

    saldo = saldo - abonoCapital;
    if (Math.abs(saldo) < 0.005) {     // menos de medio centavo = 0
      saldo = 0;
    }

    totalIntereses += interesMes;
    totalPagado += cuotaMes;

    // Cada fila es un arreglo en el MISMO orden de las columnas de la tabla
    filas.push([mes, cuotaMes, interesMes, abonoCapital, saldo]);
  }

  return {
    deuda: deuda,
    interes: tasaMensual,
    plazo: plazo,
    cuota: cuota,
    filas: filas,
    totalIntereses: totalIntereses,
    totalPagado: totalPagado
  };
}


/* ============================================================
   6. DATATABLES Y AJAX
   ============================================================ */

/**
 * cargarIdiomaConAjax: pide por AJAX el archivo de idioma español.
 * AJAX = pedir datos a un servidor SIN recargar la página.
 *   .done() → se ejecuta si la respuesta llegó bien.
 *   .fail() → se ejecuta si hubo error (sin internet, servidor caído…).
 * Si falla, la tabla igual sale en español gracias al RESPALDO.
 */
function cargarIdiomaConAjax() {
  $.ajax({
    url: URL_IDIOMA_ES,
    method: 'GET',
    dataType: 'json',   // esperamos un JSON
    timeout: 5000       // si en 5 segundos no responde, se considera error
  })
    .done(function (respuesta) {
      // $.extend mezcla los dos objetos: lo del servidor + lo que faltara del respaldo
      idiomaTabla = $.extend(true, {}, IDIOMA_ES_RESPALDO, respuesta);
      $('#estadoAjax').addClass('ok').text('✔ Idioma español de la tabla cargado por AJAX desde el CDN de DataTables.');
    })
    .fail(function () {
      idiomaTabla = IDIOMA_ES_RESPALDO;
      $('#estadoAjax').addClass('alerta').text('⚠ No se pudo cargar el idioma por AJAX; se usa la traducción local de respaldo.');
    });
}

/**
 * mostrarEnDataTable: pone las filas en la tabla DataTables.
 * - La PRIMERA vez crea la tabla con su configuración.
 * - Las siguientes veces solo borra las filas viejas y agrega las nuevas
 *   (crear la tabla dos veces sobre el mismo <table> da error).
 * @param {Array} filas  arreglo de arreglos [mes, cuota, interés, abono, saldo]
 */
function mostrarEnDataTable(filas) {
  if (tablaDT === null) {
    tablaDT = $('#tablaAmortizacion').DataTable({
      data: filas,                 // los datos vienen de un arreglo de JavaScript
      language: idiomaTabla,       // textos en español
      pageLength: 12,              // 12 cuotas por página (un año)
      lengthMenu: [12, 24, 36, 60, 120],
      order: [[0, 'asc']],         // ordenar por N° de cuota, de menor a mayor
      columns: [
        { title: 'N° cuota', className: 'dt-center' },
        { title: 'Cuota',           render: renderizarPesos, className: 'dt-right' },
        { title: 'Interés',         render: renderizarPesos, className: 'dt-right' },
        { title: 'Abono a capital', render: renderizarPesos, className: 'dt-right' },
        { title: 'Saldo',           render: renderizarPesos, className: 'dt-right' }
      ]
    });
  } else {
    tablaDT.clear().rows.add(filas).draw();   // borrar → agregar → redibujar
  }
}


/* ============================================================
   7. FUNCIÓN PRINCIPAL: se ejecuta al presionar "Calcular"
   ============================================================ */
function calcularAmortizacion() {
  var datos = leerDatosFormulario();        // paso 1: leer
  var errores = validarDatos(datos);        // paso 2: validar

  if (errores.length > 0) {                 // ¿hay errores?
    mostrarErrores(errores);                //   sí → mostrarlos y DETENERSE
    $('#seccionResultados').addClass('oculto');
    return;
  }
  limpiarErrores();                         //   no → seguir

  // paso 3: calcular
  ultimoCalculo = generarTablaAmortizacion(datos.deuda, datos.interes, datos.plazo);

  // paso 4: mostrar el resumen (DOM: cambiamos el texto de los elementos)
  $('#resCuota').text(formatearPesos(ultimoCalculo.cuota));
  $('#resIntereses').text(formatearPesos(ultimoCalculo.totalIntereses));
  $('#resTotal').text(formatearPesos(ultimoCalculo.totalPagado));

  // paso 5: mostrar la sección y llenar la tabla
  // (primero se muestra: DataTables calcula mejor los anchos si la tabla es visible)
  $('#seccionResultados').removeClass('oculto');
  mostrarEnDataTable(ultimoCalculo.filas);
}

/**
 * limpiarFormulario: deja todo como al abrir la página.
 */
function limpiarFormulario() {
  $('#formAmortizacion')[0].reset();       // [0] = elemento DOM puro; reset() vacía el form
  limpiarErrores();
  $('#seccionResultados').addClass('oculto');
  if (tablaDT !== null) {
    tablaDT.clear().draw();
  }
  ultimoCalculo = null;
  $('#deuda').trigger('focus');
}


/* ============================================================
   8. VENTANA MODAL E IMPRESIÓN
   ============================================================ */

/**
 * construirHtmlImpresion: arma (como texto HTML) el reporte que se imprime.
 * Incluye TODAS las cuotas (no solo la página visible de DataTables).
 * @param {object} calculo  el resultado de generarTablaAmortizacion
 * @returns {string}        HTML listo para meter en el modal
 */
function construirHtmlImpresion(calculo) {
  var fecha = new Date().toLocaleString('es-CO');
  var html = '';

  html += '<div class="impresion">';
  html += '<h3>Tabla de amortización — Cuota fija (sistema francés)</h3>';
  html += '<p class="fecha">Generada el ' + fecha + '</p>';

  html += '<div class="resumen">';
  html += '<div><b>Valor de la deuda:</b> ' + formatearPesos(calculo.deuda) + '</div>';
  html += '<div><b>Interés mensual:</b> ' + calculo.interes + ' %</div>';
  html += '<div><b>Plazo:</b> ' + calculo.plazo + ' meses</div>';
  html += '<div><b>Cuota mensual:</b> ' + formatearPesos(calculo.cuota) + '</div>';
  html += '<div><b>Total intereses:</b> ' + formatearPesos(calculo.totalIntereses) + '</div>';
  html += '<div><b>Total pagado:</b> ' + formatearPesos(calculo.totalPagado) + '</div>';
  html += '</div>';

  html += '<table><thead><tr>';
  html += '<th>N° cuota</th><th>Cuota</th><th>Interés</th><th>Abono a capital</th><th>Saldo</th>';
  html += '</tr></thead><tbody>';

  // Recorremos cada fila: fila[0]=mes, fila[1]=cuota, fila[2]=interés, fila[3]=abono, fila[4]=saldo
  $.each(calculo.filas, function (indice, fila) {
    html += '<tr>';
    html += '<td>' + fila[0] + '</td>';
    html += '<td>' + formatearPesos(fila[1]) + '</td>';
    html += '<td>' + formatearPesos(fila[2]) + '</td>';
    html += '<td>' + formatearPesos(fila[3]) + '</td>';
    html += '<td>' + formatearPesos(fila[4]) + '</td>';
    html += '</tr>';
  });

  html += '</tbody><tfoot><tr>';
  html += '<td>Totales</td>';
  html += '<td>' + formatearPesos(calculo.totalPagado) + '</td>';
  html += '<td>' + formatearPesos(calculo.totalIntereses) + '</td>';
  html += '<td>' + formatearPesos(calculo.deuda) + '</td>';
  html += '<td>—</td>';
  html += '</tr></tfoot></table>';
  html += '</div>';

  return html;
}

/**
 * abrirModalImpresion: llena el modal con el reporte y lo muestra.
 */
function abrirModalImpresion() {
  if (ultimoCalculo === null) {
    return;                                   // no hay nada calculado todavía
  }
  $('#zonaImpresion').html(construirHtmlImpresion(ultimoCalculo));
  $('#modalImprimir').addClass('abierto').attr('aria-hidden', 'false');
  $('body').addClass('modal-abierto');
  $('#btnImprimir').trigger('focus');
}

/**
 * cerrarModalImpresion: esconde el modal.
 */
function cerrarModalImpresion() {
  $('#modalImprimir').removeClass('abierto').attr('aria-hidden', 'true');
  $('body').removeClass('modal-abierto');
  $('#btnAbrirModal').trigger('focus');
}

/**
 * imprimirTabla: abre el cuadro de impresión del navegador.
 * El CSS (@media print) se encarga de que SOLO salga el contenido del modal.
 */
function imprimirTabla() {
  window.print();
}


/* ============================================================
   9. EVENTOS: conectar botones y teclas con las funciones.
   $(function(){ ... }) = "cuando el HTML esté listo, ejecuta esto".
   ============================================================ */
if (window.jQuery) {     // ¿la página cargó jQuery? (solo la de amortización lo hace)
$(function () {

  // Si esta página no tiene el formulario de amortización, no hacemos nada
  if (!document.getElementById('formAmortizacion')) {
    return;
  }

  cargarIdiomaConAjax();

  // Enviar el formulario (botón Calcular o tecla Enter)
  $('#formAmortizacion').on('submit', function (evento) {
    evento.preventDefault();   // evita que la página se recargue
    calcularAmortizacion();
  });

  $('#btnLimpiar').on('click', limpiarFormulario);

  // Mientras el usuario corrige una caja, se borra el error de esa caja
  $('#formAmortizacion input').on('input', function () {
    $(this).removeClass('invalido');
    $('#error-' + this.id).text('');
  });

  // Modal
  $('#btnAbrirModal').on('click', abrirModalImpresion);
  $('#btnImprimir').on('click', imprimirTabla);
  $('#btnCerrarModal, #btnCerrarX').on('click', cerrarModalImpresion);

  // Clic en el fondo oscuro (fuera de la caja) también cierra
  $('#modalImprimir').on('click', function (evento) {
    if (evento.target === this) {
      cerrarModalImpresion();
    }
  });

  // Tecla Escape cierra el modal
  $(document).on('keydown', function (evento) {
    if (evento.key === 'Escape' && $('#modalImprimir').hasClass('abierto')) {
      cerrarModalImpresion();
    }
  });
});
}   // fin del if (window.jQuery)
