# Generador de Certificados - Google Apps Script

Sistema automatizado para generar certificados en PDF a partir de un template de Google Docs, utilizando datos de una hoja de cálculo de Google Sheets.

## Características

- Generación automática de certificados en formato PDF
- Template personalizable en Google Docs
- Reemplazo dinámico del placeholder `{{NOMBRE}}`
- Almacenamiento organizado en Google Drive
- Interfaz amigable con menú personalizado en Google Sheets
- Procesamiento por lotes de múltiples participantes
- Indicadores de progreso en tiempo real
- Manejo robusto de errores

## Requisitos Previos

- Cuenta de Google (Gmail)
- Acceso a Google Drive, Docs y Sheets
- Node.js v14 o superior (para usar clasp)
- Git instalado en tu sistema
- Cuenta de GitHub (opcional, para control de versiones)

## Estructura del Proyecto

```
CERTIFICADOS-EDUCACION-CONTINUA/
├── .gitignore
├── README.md
├── src/
│   ├── Code.gs                    # Menú principal y UI
│   ├── GeneradorCertificados.gs   # Lógica de generación
│   ├── Config.gs                  # Gestión de configuración
│   └── appsscript.json            # Configuración del proyecto
└── docs/
    ├── INSTALACION.md             # Guía de instalación detallada
    └── USO.md                     # Manual de usuario
```

## Instalación Rápida

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/CERTIFICADOS-EDUCACION-CONTINUA.git
   cd CERTIFICADOS-EDUCACION-CONTINUA
   ```

2. **Instalar clasp:**
   ```bash
   npm install -g @google/clasp
   ```

3. **Autenticarse con Google:**
   ```bash
   clasp login
   ```

4. **Crear proyecto vinculado a tu Google Sheets:**
   ```bash
   clasp create --type sheets --title "Generador de Certificados"
   ```

5. **Subir el código:**
   ```bash
   clasp push
   ```

Para instrucciones detalladas, consulta [INSTALACION.md](docs/INSTALACION.md)

## Configuración

### Preparar el Template de Google Docs

1. Crea un documento en Google Docs con el diseño de tu certificado
2. Inserta el placeholder `{{NOMBRE}}` donde quieres que aparezca el nombre del participante
3. Copia el ID del documento desde la URL:
   ```
   https://docs.google.com/document/d/ID_DEL_DOCUMENTO/edit
   ```

### Preparar la Carpeta de Destino

1. Crea una carpeta en Google Drive donde se guardarán los PDFs
2. Copia el ID de la carpeta desde la URL:
   ```
   https://drive.google.com/drive/folders/ID_DE_LA_CARPETA
   ```

### Configurar el Script

1. Abre tu Google Sheets
2. Ve al menú **Certificados → Configurar IDs**
3. Ingresa el ID del template y el ID de la carpeta
4. Haz clic en **Guardar Configuración**

## Uso Básico

### Formato de la Hoja de Cálculo

Tu hoja debe tener el siguiente formato:

| NOMBRE          | CORREO                    |
|-----------------|---------------------------|
| Juan Pérez      | juan.perez@example.com    |
| María González  | maria.gonzalez@example.com|
| Carlos López    | carlos.lopez@example.com  |

### Generar Certificados

1. Abre tu hoja de cálculo con los datos de participantes
2. Ve al menú **Certificados → Generar Certificados**
3. Confirma la operación
4. Espera a que se procesen todos los certificados
5. Los PDFs se guardarán en la carpeta configurada

Para más detalles, consulta [USO.md](docs/USO.md)

## Funcionalidades del Menú

- **Generar Certificados**: Procesa todos los registros de la hoja activa
- **Configurar IDs**: Establece el template y carpeta de destino
- **Ver Configuración Actual**: Muestra la configuración guardada
- **Ayuda**: Información rápida de uso

## Permisos Requeridos

El script necesita los siguientes permisos de Google:

- **Sheets**: Leer datos de la hoja de cálculo actual
- **Drive**: Acceder y crear archivos en Drive
- **Docs**: Copiar y editar documentos
- **UI**: Mostrar menús y diálogos personalizados

## Solución de Problemas

### Error: "Configuración incompleta"
**Solución:** Ve a Certificados → Configurar IDs y asegúrate de haber guardado ambos IDs.

### Error: "El ID del template no es válido"
**Solución:** Verifica que hayas copiado correctamente el ID del documento y que tengas acceso al mismo.

### Los certificados no se generan
**Solución:** Revisa que la hoja tenga datos en las columnas A (NOMBRE) y B (CORREO), empezando desde la fila 2.

### Timeout en la ejecución
**Solución:** Si tienes más de 50 certificados, considera procesarlos en lotes más pequeños.

## Desarrollo

### Estructura del Código

- **Code.gs**: Maneja la interfaz de usuario y el menú
- **GeneradorCertificados.gs**: Contiene la lógica principal de generación
- **Config.gs**: Gestiona la configuración persistente usando Properties Service

### Testing

Puedes probar el script con un solo certificado usando:

```javascript
testGenerarUnCertificado()
```

### Logs

Para ver los logs de ejecución:
1. En el editor de Apps Script, ve a **Ver → Registros de ejecución**

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commitea tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Soporte

Si encuentras algún problema o tienes preguntas:

- Abre un [Issue](https://github.com/TU_USUARIO/CERTIFICADOS-EDUCACION-CONTINUA/issues) en GitHub
- Consulta la documentación en la carpeta `docs/`

## Autor

Desarrollado con fines educativos para automatizar la generación de certificados de educación continua.

## Agradecimientos

- Google Apps Script Platform
- Comunidad de desarrolladores de Google Workspace

---

**Nota:** Recuerda reemplazar `TU_USUARIO` con tu nombre de usuario de GitHub en las URLs del repositorio.
