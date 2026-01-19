/**
 * GENERADOR DE CERTIFICADOS - Menú Principal
 * 
 * Este archivo crea el menú personalizado en Google Sheets
 * y maneja las interacciones del usuario.
 */

/**
 * Función que se ejecuta automáticamente al abrir la hoja de cálculo
 * Crea el menú personalizado "Certificados" en la barra de menú
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Certificados')
    .addItem('Generar Certificados', 'mostrarDialogoGeneracion')
    .addSeparator()
    .addItem('Configurar IDs', 'mostrarDialogoConfiguracion')
    .addItem('Ver Configuración Actual', 'mostrarConfiguracionActual')
    .addSeparator()
    .addItem('Ayuda', 'mostrarAyuda')
    .addToUi();
}

/**
 * Muestra un diálogo para confirmar la generación de certificados
 */
function mostrarDialogoGeneracion() {
  var ui = SpreadsheetApp.getUi();
  
  // Validar que la configuración esté completa
  if (!validarConfiguracion()) {
    ui.alert(
      'Configuración Incompleta',
      'Por favor, configura primero los IDs del template y la carpeta de destino.\n\n' +
      'Ve a: Certificados → Configurar IDs',
      ui.ButtonSet.OK
    );
    return;
  }
  
  var respuesta = ui.alert(
    'Generar Certificados',
    '¿Estás seguro de que deseas generar los certificados?\n\n' +
    'Se procesarán todos los registros de la hoja activa.',
    ui.ButtonSet.YES_NO
  );
  
  if (respuesta == ui.Button.YES) {
    generarTodosCertificados();
  }
}

/**
 * Muestra un diálogo para configurar los IDs necesarios
 */
function mostrarDialogoConfiguracion() {
  var html = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            line-height: 1.6;
          }
          .campo {
            margin-bottom: 15px;
          }
          label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
          }
          input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
          }
          button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
          }
          button:hover {
            background-color: #45a049;
          }
          .ayuda {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <h2>Configuración de IDs</h2>
        
        <div class="campo">
          <label for="templateId">ID del Template (Google Docs):</label>
          <input type="text" id="templateId" placeholder="Ej: 1abc123XYZ..." />
          <div class="ayuda">
            Abre el documento template y copia el ID de la URL:<br>
            docs.google.com/document/d/<strong>ID_AQUI</strong>/edit
          </div>
        </div>
        
        <div class="campo">
          <label for="carpetaId">ID de la Carpeta de Destino:</label>
          <input type="text" id="carpetaId" placeholder="Ej: 1xyz789ABC..." />
          <div class="ayuda">
            Abre la carpeta en Drive y copia el ID de la URL:<br>
            drive.google.com/drive/folders/<strong>ID_AQUI</strong>
          </div>
        </div>
        
        <button onclick="guardarConfiguracion()">Guardar Configuración</button>
        
        <script>
          // Cargar configuración actual
          google.script.run.withSuccessHandler(function(config) {
            if (config.TEMPLATE_ID) {
              document.getElementById('templateId').value = config.TEMPLATE_ID;
            }
            if (config.CARPETA_DESTINO_ID) {
              document.getElementById('carpetaId').value = config.CARPETA_DESTINO_ID;
            }
          }).obtenerConfiguracion();
          
          function guardarConfiguracion() {
            var templateId = document.getElementById('templateId').value.trim();
            var carpetaId = document.getElementById('carpetaId').value.trim();
            
            if (!templateId || !carpetaId) {
              alert('Por favor, completa ambos campos.');
              return;
            }
            
            google.script.run
              .withSuccessHandler(function() {
                alert('Configuración guardada exitosamente.');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Error al guardar: ' + error.message);
              })
              .guardarConfiguracion(templateId, carpetaId);
          }
        </script>
      </body>
    </html>
  `)
  .setWidth(500)
  .setHeight(400);
  
  SpreadsheetApp.getUi().showModalDialog(html, 'Configuración de Certificados');
}

/**
 * Muestra la configuración actual en un alert
 */
function mostrarConfiguracionActual() {
  var config = obtenerConfiguracion();
  var ui = SpreadsheetApp.getUi();
  
  var mensaje = 'CONFIGURACIÓN ACTUAL:\n\n';
  mensaje += 'Template ID: ' + (config.TEMPLATE_ID || 'No configurado') + '\n';
  mensaje += 'Carpeta Destino ID: ' + (config.CARPETA_DESTINO_ID || 'No configurado') + '\n\n';
  mensaje += 'Estado: ' + (validarConfiguracion() ? 'Configuración completa' : 'Configuración incompleta');
  
  ui.alert('Configuración Actual', mensaje, ui.ButtonSet.OK);
}

/**
 * Muestra información de ayuda
 */
function mostrarAyuda() {
  var ui = SpreadsheetApp.getUi();
  
  var mensaje = 'GENERADOR DE CERTIFICADOS - AYUDA\n\n';
  mensaje += '1. Configura los IDs del template y carpeta de destino\n';
  mensaje += '   (Certificados → Configurar IDs)\n\n';
  mensaje += '2. Asegúrate de que tu hoja tenga estas columnas:\n';
  mensaje += '   - NOMBRE (columna A)\n';
  mensaje += '   - CORREO (columna B)\n\n';
  mensaje += '3. El template debe contener el placeholder: {{NOMBRE}}\n\n';
  mensaje += '4. Ejecuta: Certificados → Generar Certificados\n\n';
  mensaje += 'Los PDFs se guardarán con el nombre de cada participante.\n\n';
  mensaje += 'Repositorio: github.com/tu-usuario/CERTIFICADOS-EDUCACION-CONTINUA';
  
  ui.alert('Ayuda', mensaje, ui.ButtonSet.OK);
}

/**
 * Función de prueba para verificar que todo funciona
 */
function testMenu() {
  Logger.log('Menú cargado correctamente');
  Logger.log('Configuración: ' + JSON.stringify(obtenerConfiguracion()));
}
