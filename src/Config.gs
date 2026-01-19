/**
 * GENERADOR DE CERTIFICADOS - Configuración
 * 
 * Este archivo maneja la configuración persistente del script
 * usando Properties Service de Google Apps Script.
 */

/**
 * Obtiene la configuración actual del script
 * Los valores se almacenan en las propiedades del documento
 * 
 * @return {Object} Objeto con la configuración
 */
function obtenerConfiguracion() {
  var propiedades = PropertiesService.getDocumentProperties();
  
  return {
    TEMPLATE_ID: propiedades.getProperty('TEMPLATE_ID'),
    CARPETA_DESTINO_ID: propiedades.getProperty('CARPETA_DESTINO_ID')
  };
}

/**
 * Guarda la configuración del script
 * 
 * @param {string} templateId - ID del documento template en Google Docs
 * @param {string} carpetaId - ID de la carpeta de destino en Drive
 */
function guardarConfiguracion(templateId, carpetaId) {
  try {
    var propiedades = PropertiesService.getDocumentProperties();
    
    // Validar que los IDs no estén vacíos
    if (!templateId || !carpetaId) {
      throw new Error('Los IDs no pueden estar vacíos');
    }
    
    // Validar que el template existe y es accesible
    try {
      DriveApp.getFileById(templateId);
    } catch (e) {
      throw new Error('El ID del template no es válido o no tienes acceso a él');
    }
    
    // Validar que la carpeta existe y es accesible
    try {
      DriveApp.getFolderById(carpetaId);
    } catch (e) {
      throw new Error('El ID de la carpeta no es válido o no tienes acceso a ella');
    }
    
    // Guardar las propiedades
    propiedades.setProperties({
      'TEMPLATE_ID': templateId.trim(),
      'CARPETA_DESTINO_ID': carpetaId.trim()
    });
    
    Logger.log('Configuración guardada exitosamente');
    return true;
    
  } catch (error) {
    Logger.log('Error al guardar configuración: ' + error.message);
    throw error;
  }
}

/**
 * Valida que la configuración esté completa y sea válida
 * 
 * @return {boolean} true si la configuración es válida
 */
function validarConfiguracion() {
  var config = obtenerConfiguracion();
  
  if (!config.TEMPLATE_ID || !config.CARPETA_DESTINO_ID) {
    Logger.log('Configuración incompleta');
    return false;
  }
  
  // Validar que los recursos existan
  try {
    DriveApp.getFileById(config.TEMPLATE_ID);
    DriveApp.getFolderById(config.CARPETA_DESTINO_ID);
    return true;
  } catch (error) {
    Logger.log('Error al validar configuración: ' + error.message);
    return false;
  }
}

/**
 * Resetea toda la configuración (útil para testing)
 */
function resetearConfiguracion() {
  var propiedades = PropertiesService.getDocumentProperties();
  propiedades.deleteAllProperties();
  Logger.log('Configuración reseteada');
}

/**
 * Muestra la configuración actual en el log (para debugging)
 */
function mostrarConfiguracionLog() {
  var config = obtenerConfiguracion();
  Logger.log('=== CONFIGURACIÓN ACTUAL ===');
  Logger.log('Template ID: ' + (config.TEMPLATE_ID || 'No configurado'));
  Logger.log('Carpeta Destino ID: ' + (config.CARPETA_DESTINO_ID || 'No configurado'));
  Logger.log('Estado: ' + (validarConfiguracion() ? 'Válida' : 'Inválida'));
  Logger.log('==========================');
}

/**
 * Obtiene información detallada del template configurado
 * 
 * @return {Object} Información del template o null
 */
function obtenerInfoTemplate() {
  try {
    var config = obtenerConfiguracion();
    if (!config.TEMPLATE_ID) {
      return null;
    }
    
    var template = DriveApp.getFileById(config.TEMPLATE_ID);
    return {
      nombre: template.getName(),
      url: template.getUrl(),
      id: template.getId(),
      fechaModificacion: template.getLastUpdated(),
      propietario: template.getOwner().getEmail()
    };
  } catch (error) {
    Logger.log('Error al obtener info del template: ' + error.message);
    return null;
  }
}

/**
 * Obtiene información detallada de la carpeta de destino
 * 
 * @return {Object} Información de la carpeta o null
 */
function obtenerInfoCarpeta() {
  try {
    var config = obtenerConfiguracion();
    if (!config.CARPETA_DESTINO_ID) {
      return null;
    }
    
    var carpeta = DriveApp.getFolderById(config.CARPETA_DESTINO_ID);
    return {
      nombre: carpeta.getName(),
      url: carpeta.getUrl(),
      id: carpeta.getId(),
      fechaModificacion: carpeta.getLastUpdated()
    };
  } catch (error) {
    Logger.log('Error al obtener info de la carpeta: ' + error.message);
    return null;
  }
}

/**
 * Exporta la configuración actual como JSON (para respaldo)
 * 
 * @return {string} JSON con la configuración
 */
function exportarConfiguracion() {
  var config = obtenerConfiguracion();
  return JSON.stringify(config, null, 2);
}

/**
 * Importa configuración desde un JSON
 * 
 * @param {string} jsonConfig - String JSON con la configuración
 */
function importarConfiguracion(jsonConfig) {
  try {
    var config = JSON.parse(jsonConfig);
    guardarConfiguracion(config.TEMPLATE_ID, config.CARPETA_DESTINO_ID);
    Logger.log('Configuración importada exitosamente');
  } catch (error) {
    throw new Error('Error al importar configuración: ' + error.message);
  }
}
