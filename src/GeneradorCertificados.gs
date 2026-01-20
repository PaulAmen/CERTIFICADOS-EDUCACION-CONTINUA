/**
 * GENERADOR DE CERTIFICADOS - Lógica Principal
 * 
 * Este archivo contiene la lógica para generar los certificados
 * en PDF a partir del template de Google Docs.
 */

/**
 * Función principal que genera todos los certificados
 * Lee la hoja activa y procesa cada fila
 * Incluye continuación automática si se acerca al límite de tiempo
 */
function generarTodosCertificados() {
  var startTime = new Date().getTime();
  var MAX_EXECUTION_TIME = 5 * 60 * 1000; // 5 minutos (dejamos margen de 1 min)
  
  try {
    var config = obtenerConfiguracion();
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = spreadsheet.getActiveSheet();
    
    // Determinar si estamos en un trigger automático o ejecución manual
    var esTriggerAutomatico = esEjecucionDesdeTrigger();
    
    // Asegurar que existe la columna de LINK
    verificarColumnaLink(hoja);
    
    // Obtener todos los datos
    var ultimaFila = hoja.getLastRow();
    
    if (ultimaFila < 2) {
      if (!esTriggerAutomatico) {
        SpreadsheetApp.getUi().alert('No hay datos', 'No se encontraron registros para procesar.', SpreadsheetApp.getUi().ButtonSet.OK);
      }
      Logger.log('No hay datos para procesar');
      return;
    }
    
    var totalProcesados = 0;
    var errores = [];
    var procesoContinuado = false;
    
    // Mostrar mensaje de inicio (solo funciona en ejecución manual)
    if (!esTriggerAutomatico) {
      spreadsheet.toast(
        'Procesando certificados...',
        'Generando Certificados',
        -1
      );
    }
    Logger.log('Iniciando generación de certificados. Total de filas: ' + ultimaFila);
    
    // Procesar cada fila
    for (var i = 2; i <= ultimaFila; i++) {
      // Verificar tiempo de ejecución
      var currentTime = new Date().getTime();
      if (currentTime - startTime > MAX_EXECUTION_TIME) {
        Logger.log('Tiempo límite alcanzado en ' + ((currentTime - startTime) / 1000) + ' segundos');
        Logger.log('Programando continuación...');
        programarContinuacion();
        procesoContinuado = true;
        break;
      }
      
      var nombre = hoja.getRange(i, 1).getValue();
      var correo = hoja.getRange(i, 2).getValue();
      var linkExistente = hoja.getRange(i, 3).getValue();
      
      // Saltar si ya tiene link (ya se procesó)
      if (linkExistente && linkExistente.toString().trim() !== '' && !linkExistente.toString().startsWith('ERROR')) {
        Logger.log('Fila ' + i + ': Ya procesada, saltando');
        continue;
      }
      
      // Validar que haya nombre
      if (!nombre || nombre.toString().trim() === '') {
        Logger.log('Fila ' + i + ': Sin nombre, omitida');
        continue;
      }
      
      try {
        var resultado = generarCertificado(nombre, correo, config, i, hoja);
        totalProcesados++;
        
        // Actualizar progreso cada 5 certificados (solo en ejecución manual)
        if (totalProcesados % 5 === 0) {
          Logger.log('Progreso: ' + totalProcesados + ' certificados procesados');
          if (!esTriggerAutomatico) {
            spreadsheet.toast(
              'Procesados ' + totalProcesados + ' certificados',
              'Progreso',
              3
            );
          }
        }
        
      } catch (error) {
        Logger.log('Error en fila ' + i + ': ' + error.message);
        errores.push('Fila ' + i + ' (' + nombre + '): ' + error.message);
        // Marcar error en la hoja
        hoja.getRange(i, 3).setValue('ERROR: ' + error.message);
      }
    }
    
    // Ocultar mensaje de progreso (solo en ejecución manual)
    if (!esTriggerAutomatico) {
      spreadsheet.toast('', '', 1);
    }
    
    // Log del resultado
    Logger.log('Proceso finalizado. Certificados procesados: ' + totalProcesados);
    if (errores.length > 0) {
      Logger.log('Errores encontrados: ' + errores.length);
      errores.forEach(function(e) { Logger.log('  - ' + e); });
    }
    
    // Mostrar resultado final solo si no se continuará automáticamente Y no es trigger
    if (!procesoContinuado && !esTriggerAutomatico) {
      var mensaje = 'Certificados generados exitosamente: ' + totalProcesados;
      
      if (errores.length > 0) {
        mensaje += '\n\nErrores encontrados (' + errores.length + '):\n';
        mensaje += errores.slice(0, 5).join('\n');
        if (errores.length > 5) {
          mensaje += '\n... y ' + (errores.length - 5) + ' más. Revisa los logs.';
        }
      }
      
      SpreadsheetApp.getUi().alert('Proceso Completado', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);
    } else if (procesoContinuado) {
      Logger.log('Proceso pausado. Se procesaron ' + totalProcesados + ' certificados.');
      Logger.log('El proceso continuará automáticamente en 1 minuto.');
    }
    
  } catch (error) {
    Logger.log('Error general: ' + error.message);
    Logger.log('Stack trace: ' + error.stack);
    
    // Solo mostrar alert si no es un trigger automático
    if (!esEjecucionDesdeTrigger()) {
      try {
        SpreadsheetApp.getUi().alert(
          'Error',
          'Ocurrió un error al generar los certificados:\n' + error.message,
          SpreadsheetApp.getUi().ButtonSet.OK
        );
      } catch (e) {
        Logger.log('No se pudo mostrar alert de error: ' + e.message);
      }
    }
  }
}

/**
 * Genera un certificado individual para un participante
 * 
 * @param {string} nombre - Nombre del participante
 * @param {string} correo - Correo del participante (opcional)
 * @param {Object} config - Objeto de configuración con IDs
 * @param {number} fila - Número de fila en la hoja (para actualizar link)
 * @param {Sheet} hoja - Objeto de la hoja activa
 */
function generarCertificado(nombre, correo, config, fila, hoja) {
  try {
    // 1. Obtener el template original
    var templateDoc = DriveApp.getFileById(config.TEMPLATE_ID);
    
    // 2. Crear una copia del template
    var nombreArchivo = 'Certificado - ' + nombre.toString().trim();
    var copiaDoc = templateDoc.makeCopy(nombreArchivo);
    
    // 3. Abrir el documento copiado para editarlo
    var doc = DocumentApp.openById(copiaDoc.getId());
    var body = doc.getBody();
    
    // 4. Reemplazar el placeholder {{NOMBRE}} con el nombre real
    body.replaceText('{{NOMBRE}}', nombre.toString().trim());
    
    // 5. Guardar y cerrar el documento
    doc.saveAndClose();
    
    // 6. Esperar un momento para que se guarden los cambios
    Utilities.sleep(500);
    
    // 7. Exportar como PDF
    var pdfBlob = copiaDoc.getAs('application/pdf');
    pdfBlob.setName(nombreArchivo + '.pdf');
    
    // 8. Obtener la carpeta de destino
    var carpetaDestino = DriveApp.getFolderById(config.CARPETA_DESTINO_ID);
    
    // 9. Guardar el PDF en la carpeta
    var pdfFile = carpetaDestino.createFile(pdfBlob);
    
    // 10. Actualizar la celda con el link al PDF
    if (fila && hoja) {
      hoja.getRange(fila, 3).setValue(pdfFile.getUrl());
    }
    
    // 11. Eliminar la copia temporal del Google Docs
    copiaDoc.setTrashed(true);
    
    Logger.log('Certificado generado: ' + nombreArchivo + '.pdf');
    
    return {
      success: true,
      nombre: nombre,
      pdfId: pdfFile.getId(),
      pdfUrl: pdfFile.getUrl()
    };
    
  } catch (error) {
    throw new Error('Error al generar certificado para ' + nombre + ': ' + error.message);
  }
}

/**
 * Función de prueba para generar un solo certificado
 * Útil para testing antes de procesar todo el lote
 */
function testGenerarUnCertificado() {
  var config = obtenerConfiguracion();
  
  if (!validarConfiguracion()) {
    Logger.log('ERROR: Configuración incompleta');
    return;
  }
  
  try {
    var resultado = generarCertificado('Juan Pérez', 'juan@example.com', config);
    Logger.log('Test exitoso: ' + JSON.stringify(resultado));
  } catch (error) {
    Logger.log('Test falló: ' + error.message);
  }
}

/**
 * Limpia el nombre de archivo para evitar caracteres inválidos
 * 
 * @param {string} nombre - Nombre a limpiar
 * @return {string} Nombre limpio
 */
function limpiarNombreArchivo(nombre) {
  // Eliminar caracteres no permitidos en nombres de archivo
  return nombre.toString().replace(/[/\\?%*:|"<>]/g, '-').trim();
}

/**
 * Obtiene información de un certificado generado
 * 
 * @param {string} nombreArchivo - Nombre del archivo a buscar
 * @return {Object} Información del archivo o null
 */
function buscarCertificado(nombreArchivo) {
  try {
    var config = obtenerConfiguracion();
    var carpeta = DriveApp.getFolderById(config.CARPETA_DESTINO_ID);
    var archivos = carpeta.getFilesByName(nombreArchivo);
    
    if (archivos.hasNext()) {
      var archivo = archivos.next();
      return {
        nombre: archivo.getName(),
        url: archivo.getUrl(),
        id: archivo.getId(),
        fecha: archivo.getDateCreated()
      };
    }
    
    return null;
  } catch (error) {
    Logger.log('Error al buscar certificado: ' + error.message);
    return null;
  }
}

/**
 * Verifica que exista la columna LINK y la crea si no existe
 * 
 * @param {Sheet} hoja - Hoja activa
 */
function verificarColumnaLink(hoja) {
  var encabezado = hoja.getRange(1, 3).getValue();
  
  if (!encabezado || encabezado.toString().trim() === '') {
    hoja.getRange(1, 3).setValue('LINK');
    hoja.getRange(1, 3).setFontWeight('bold');
    Logger.log('Columna LINK creada en C1');
  }
}

/**
 * Programa una ejecución para continuar el procesamiento
 * Se ejecuta 1 minuto después del límite de tiempo
 */
function programarContinuacion() {
  // Eliminar triggers existentes de continuación
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'generarTodosCertificados') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  // Crear nuevo trigger para ejecutar en 1 minuto
  ScriptApp.newTrigger('generarTodosCertificados')
    .timeBased()
    .after(1 * 60 * 1000) // 1 minuto
    .create();
  
  Logger.log('Trigger de continuación creado para 1 minuto');
  
  // Notificar al usuario
  SpreadsheetApp.getActiveSpreadsheet().toast(
    'El proceso continuará automáticamente en 1 minuto. Puedes cerrar esta pestaña.',
    'Proceso en pausa',
    10
  );
}

/**
 * Limpia todos los triggers de continuación
 * Útil si quieres cancelar el proceso automático
 */
function limpiarTriggersAutomaticos() {
  var triggers = ScriptApp.getProjectTriggers();
  var eliminados = 0;
  
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'generarTodosCertificados') {
      ScriptApp.deleteTrigger(triggers[i]);
      eliminados++;
    }
  }
  
  Logger.log('Triggers eliminados: ' + eliminados);
  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Se cancelaron ' + eliminados + ' ejecución(es) automática(s) pendiente(s).',
    'Triggers Limpiados',
    5
  );
}

/**
 * Detecta si el script está siendo ejecutado desde un trigger automático
 * o desde la interfaz de usuario
 * 
 * @return {boolean} true si es un trigger, false si es ejecución manual
 */
function esEjecucionDesdeTrigger() {
  try {
    // Intentar obtener la UI. Si falla, es un trigger
    SpreadsheetApp.getUi();
    return false;
  } catch (e) {
    // Si no puede obtener UI, está ejecutándose desde un trigger
    return true;
  }
}
