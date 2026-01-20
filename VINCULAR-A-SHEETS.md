# Cómo Vincular el Proyecto Standalone a Google Sheets

Ya creaste el proyecto standalone con `clasp create --type standalone`. Ahora necesitas vincularlo a tu hoja de cálculo.

## Opción 1: Copiar el Código Directamente (MÁS FÁCIL)

### Paso 1: Abre tu Google Sheets
```
1. Ve a: https://sheets.google.com
2. Abre la hoja donde quieres usar el generador
   (o crea una nueva hoja)
```

### Paso 2: Abre el Editor de Apps Script desde Sheets
```
1. En el menú de Sheets: Extensiones → Apps Script
2. Se abrirá el editor con un nuevo proyecto
3. Elimina el código de ejemplo (function myFunction())
```

### Paso 3: Crear los Archivos del Script

**Archivo 1: Code.gs**
```javascript
// En el editor, ya tienes un archivo Code.gs
// Reemplaza todo su contenido con:
```

Copia y pega el contenido completo de `src/Code.gs` (las 207 líneas).

**Archivo 2: GeneradorCertificados.gs**
```
1. En el editor de Apps Script, clic en el icono "+"
2. Selecciona "Script"
3. Nómbralo: GeneradorCertificados
4. Pega el contenido completo de src/GeneradorCertificados.gs
```

**Archivo 3: Config.gs**
```
1. Clic nuevamente en "+" → "Script"
2. Nómbralo: Config
3. Pega el contenido completo de src/Config.gs
```

### Paso 4: Configurar appsscript.json

```
1. En el editor, clic en el ícono de engranaje ⚙️ (Configuración del proyecto)
2. Marca la casilla: "Mostrar el archivo de manifiesto 'appsscript.json' en el editor"
3. Vuelve al editor (ícono <> Editor)
4. Ahora verás appsscript.json en la lista de archivos
5. Ábrelo y reemplaza su contenido con el de src/appsscript.json
```

### Paso 5: Guardar el Proyecto

```
1. Clic en el ícono de disquete 💾 o Ctrl+S
2. Asigna un nombre al proyecto: "Generador de Certificados"
```

### Paso 6: Ejecutar por Primera Vez

```
1. En el editor, selecciona la función: onOpen
2. Clic en "Ejecutar" (▶️)
3. Google pedirá permisos:
   - Clic en "Revisar permisos"
   - Selecciona tu cuenta
   - Clic en "Avanzado"
   - Clic en "Ir a Generador de Certificados (no seguro)"
   - Clic en "Permitir"
```

### Paso 7: Probar el Menú

```
1. Vuelve a tu Google Sheets
2. Refresca la página (F5)
3. Espera 10-30 segundos
4. Deberías ver el menú "Certificados" en la barra superior
```

---

## Opción 2: Usar el Proyecto Standalone Existente (AVANZADO)

Si quieres mantener el proyecto standalone que ya creaste y vincularlo:

### Paso 1: Obtener el Script ID de tu Proyecto Standalone

```bash
# El Script ID está en .clasp.json
cat .clasp.json

# Verás algo como:
# {
#   "scriptId": "ABC123XYZ456...",
#   "rootDir": "./src"
# }
```

### Paso 2: Agregar una Librería al Proyecto de Sheets

**Desde Google Sheets:**

```
1. Extensiones → Apps Script
2. En el editor: Configuración (+) → Libraries
3. Pega el Script ID de tu proyecto standalone
4. Clic en "Buscar"
5. Selecciona la versión más reciente
6. Guarda
```

**NOTA:** Esta opción es más compleja y requiere llamar a las funciones como:
```javascript
LibraryName.functionName()
```

---

## Opción 3: Vincular el Proyecto Standalone usando Clasp (AVANZADO)

Si quieres vincular tu proyecto standalone a una hoja específica después de crearlo:

### Paso 1: Editar .clasp.json

```bash
nano .clasp.json
```

Añade el ID de tu Google Sheets:

```json
{
  "scriptId": "TU_SCRIPT_ID_AQUI",
  "rootDir": "./src",
  "parentId": ["ID_DE_TU_GOOGLE_SHEETS"]
}
```

**Cómo obtener el ID de tu Google Sheets:**
```
URL: https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
```

### Paso 2: Hacer Push

```bash
clasp push
```

**PROBLEMA:** Google Apps Script NO permite vincular un proyecto standalone existente a un contenedor (Sheets) después de crearlo.

---

## RECOMENDACIÓN FINAL

**La forma MÁS FÁCIL es la Opción 1**: Copiar el código directamente al editor de Apps Script desde Google Sheets.

### Resumen de la Opción 1:

1. Abre tu Google Sheets
2. Extensiones → Apps Script
3. Copia el código de los 3 archivos .gs
4. Configura appsscript.json
5. Ejecuta `onOpen()` una vez
6. Refresca Sheets
7. ¡Listo!

---

## Archivo de Referencia Rápida

Para copiar y pegar fácilmente, aquí están los contenidos:

### Contenido de src/Code.gs
```
Ver el archivo: src/Code.gs
Copiar desde la línea 1 hasta la 207
```

### Contenido de src/GeneradorCertificados.gs
```
Ver el archivo: src/GeneradorCertificados.gs
Copiar desde la línea 1 hasta la 208
```

### Contenido de src/Config.gs
```
Ver el archivo: src/Config.gs
Copiar desde la línea 1 hasta la 187
```

### Contenido de src/appsscript.json
```json
{
  "timeZone": "America/Mexico_City",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/script.container.ui"
  ]
}
```

---

## Después de Vincular

Una vez que el código esté en tu Google Sheets:

1. **Prepara tu hoja:**
   ```
   A1: NOMBRE
   B1: CORREO
   A2: Juan Pérez
   B2: juan@test.com
   ```

2. **Configura los IDs:**
   - Menú: Certificados → Configurar IDs
   - Ingresa Template ID y Carpeta ID

3. **Genera certificados:**
   - Menú: Certificados → Generar Certificados

---

## Solución de Problemas

### El menú no aparece después de copiar el código

**Solución:**
```
1. En Apps Script, selecciona función: onOpen
2. Clic en Ejecutar
3. Acepta los permisos
4. Vuelve a Sheets y refresca (F5)
```

### Error: "Cannot read property 'getUi' of null"

**Causa:** El código se está ejecutando desde Apps Script, no desde Sheets.

**Solución:**
```
Ejecuta el script DESDE Google Sheets, no desde el editor de Apps Script.
```

### No puedo ver appsscript.json

**Solución:**
```
1. Apps Script → Configuración (⚙️)
2. Marca: "Mostrar el archivo de manifiesto 'appsscript.json'"
```

---

## Comandos Útiles

Si decides mantener sincronización con clasp después:

```bash
# Ver el proyecto en el navegador
clasp open

# Bajar cambios que hiciste en el editor web
clasp pull

# Subir cambios locales
clasp push

# Ver logs
clasp logs
```

---

**¿Listo para empezar?** Usa la **Opción 1** y copia el código directamente a tu Google Sheets.
