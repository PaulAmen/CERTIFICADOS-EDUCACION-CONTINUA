/**
 * GENERADOR DE CERTIFICADOS - Lógica Principal
 * 
 * Este archivo contiene la lógica para generar los certificados
 * en PDF a partir del template de Google Docs.
 */

/**
 * Función principal que genera todos los certificados
 * Lee la hoja activa y procesa cada fila
 */
function generarTodosCertificados() {
  try {
    var config = obtenerConfiguracion();
    var hoja = SpreadsheetApp.getActiveSheet();
    var ui = SpreadsheetApp.getUi();
    
    // Obtener todos los datos (desde la fila 2, asumiendo que la fila 1 son encabezados)
    var ultimaFila = hoja.getLastRow();
    
    if (ultimaFila < 2) {
      ui.alert('No hay datos', 'No se encontraron registros para procesar.', ui.ButtonSet.OK);
      return;
    }
    
    var datos = hoja.getRange(2, 1, ultimaFila - 1, 2).getValues();
    var totalProcesados = 0;
    var errores = [];
    
    // Mostrar mensaje de inicio
    SpreadsheetApp.getActiveSpreadsheet().toast(
      'Procesando ' + datos.length + ' certificado(s)...',
      'Generando Certificados',
      -1
    );
    
    // Procesar cada fila
    for (var i = 0; i < datos.length; i++) {
      var nombre = datos[i][0];
      var correo = datos[i][1];
      
      // Validar que haya nombre
      if (!nombre || nombre.toString().trim() === '') {
        Logger.log('Fila ' + (i + 2) + ': Sin nombre, omitida');
        continue;
      }
      
      try {
        generarCertificado(nombre, correo, config);
        totalProcesados++;
        
        // Actualizar progreso cada 5 certificados
        if (totalProcesados % 5 === 0) {
          SpreadsheetApp.getActiveSpreadsheet().toast(
            'Procesados ' + totalProcesados + ' de ' + datos.length,
            'Progreso',
            3
          );
        }
        
      } catch (error) {
        Logger.log('Error en fila ' + (i + 2) + ': ' + error.message);
        errores.push('Fila ' + (i + 2) + ' (' + nombre + '): ' + error.message);
      }
    }
    
    // Mostrar resultado final
    var mensaje = 'Certificados generados exitosamente: ' + totalProcesados;
    
    if (errores.length > 0) {
      mensaje += '\n\nErrores encontrados (' + errores.length + '):\n';
      mensaje += errores.slice(0, 5).join('\n');
      if (errores.length > 5) {
        mensaje += '\n... y ' + (errores.length - 5) + ' más. Revisa los logs.';
      }
    }
    
    ui.alert('Proceso Completado', mensaje, ui.ButtonSet.OK);
    
    // Ocultar mensaje de progreso
    SpreadsheetApp.getActiveSpreadsheet().toast('', '', 1);
    
  } catch (error) {
    Logger.log('Error general: ' + error.message);
    SpreadsheetApp.getUi().alert(
      'Error',
      'Ocurrió un error al generar los certificados:\n' + error.message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Genera un certificado individual para un participante
 * 
 * @param {string} nombre - Nombre del participante
 * @param {string} correo - Correo del participante (opcional)
 * @param {Object} config - Objeto de configuración con IDs
 */
function generarCertificado(nombre, correo, config) {
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
    
    // 10. Eliminar la copia temporal del Google Docs
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
