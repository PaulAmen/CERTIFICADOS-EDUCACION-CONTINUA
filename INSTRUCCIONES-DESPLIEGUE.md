# Instrucciones de Despliegue - Paso a Paso

Esta guía te ayudará a conectar tu repositorio local con GitHub y desplegar el código a Google Apps Script.

## PARTE 1: Conectar con GitHub

### Opción A: Usando GitHub CLI (Recomendado)

```bash
# 1. Instalar GitHub CLI (si no lo tienes)
sudo pacman -S github-cli

# 2. Autenticarse con GitHub
gh auth login
# Sigue las instrucciones en pantalla:
# - Selecciona: GitHub.com
# - Protocolo: HTTPS
# - Autenticar: Login with a web browser
# - Copia el código y pégalo en el navegador

# 3. Crear el repositorio en GitHub y conectarlo
gh repo create CERTIFICADOS-EDUCACION-CONTINUA \
  --public \
  --source=. \
  --remote=origin \
  --description="Generador automático de certificados en PDF con Google Apps Script"

# 4. Hacer push del código
git push -u origin main

# 5. Abrir el repositorio en el navegador (opcional)
gh repo view --web
```

### Opción B: Manualmente desde GitHub.com

```bash
# 1. Ve a tu navegador y abre: https://github.com/new

# 2. Configura el repositorio:
#    - Repository name: CERTIFICADOS-EDUCACION-CONTINUA
#    - Description: Generador automático de certificados en PDF con Google Apps Script
#    - Visibilidad: Public (o Private si prefieres)
#    - NO marques: Add a README, .gitignore, o license
#    - Clic en "Create repository"

# 3. En tu terminal, conecta el repositorio local con GitHub
#    (Reemplaza TU_USUARIO con tu nombre de usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/CERTIFICADOS-EDUCACION-CONTINUA.git

# 4. Verifica la conexión
git remote -v
# Deberías ver:
# origin  https://github.com/TU_USUARIO/CERTIFICADOS-EDUCACION-CONTINUA.git (fetch)
# origin  https://github.com/TU_USUARIO/CERTIFICADOS-EDUCACION-CONTINUA.git (push)

# 5. Hacer push de tu código
git branch -M main
git push -u origin main

# 6. Ingresa tus credenciales de GitHub si se solicitan
```

---

## PARTE 2: Configurar Google Apps Script con Clasp

### Paso 1: Instalar Clasp

```bash
# Instalar clasp globalmente
sudo npm install -g @google/clasp

# Verificar instalación
clasp --version
```

### Paso 2: Habilitar la API de Apps Script

```bash
# 1. Abre en tu navegador:
# https://script.google.com/home/usersettings

# 2. Activa el switch: "Google Apps Script API"
```

### Paso 3: Autenticarse con Google

```bash
# Iniciar sesión con tu cuenta de Google
clasp login

# Se abrirá tu navegador:
# 1. Selecciona tu cuenta de Google
# 2. Haz clic en "Permitir" para dar acceso a clasp
# 3. Verás un mensaje de confirmación
```

### Paso 4: Crear Hoja de Cálculo en Google Sheets

Antes de crear el proyecto con clasp, necesitas tu hoja de cálculo:

```bash
# 1. Ve a: https://sheets.google.com
# 2. Clic en "+ Crear nuevo"
# 3. Nombra la hoja: "Certificados - Base de Datos"
# 4. Agrega encabezados en la fila 1:
#    A1: NOMBRE
#    B1: CORREO
# 5. Copia el ID de la URL de tu hoja:
#    https://docs.google.com/spreadsheets/d/COPIA_ESTE_ID/edit
```

### Paso 5: Crear Proyecto de Apps Script

```bash
# Navegar al directorio del proyecto
cd ~/Projects/CERTIFICADOS-EDUCACION-CONTINUA

# Crear proyecto de Apps Script (opción standalone)
clasp create --type standalone --title "Generador de Certificados"

# Se creará un archivo .clasp.json con tu Script ID
```

### Paso 6: Configurar .clasp.json

```bash
# Editar el archivo .clasp.json para que apunte a la carpeta src
nano .clasp.json

# El contenido debe ser:
{
  "scriptId": "TU_SCRIPT_ID_AQUI",
  "rootDir": "./src"
}

# Guardar: Ctrl+O, Enter
# Salir: Ctrl+X
```

### Paso 7: Subir el Código a Google Apps Script

```bash
# Subir todos los archivos de la carpeta src
clasp push

# Si pregunta si quieres sobrescribir, responde: yes (y)
```

### Paso 8: Abrir el Proyecto en el Navegador

```bash
# Abrir el editor de Apps Script
clasp open

# Se abrirá tu navegador con el proyecto
```

---

## PARTE 3: Vincular Script con Google Sheets

### Método 1: Desde Google Sheets (Recomendado)

```bash
# 1. Abre tu Google Sheets
# 2. Ve a: Extensiones → Apps Script
# 3. Elimina el código de ejemplo (function myFunction())
# 4. Copia y pega el contenido de cada archivo .gs
#    - Code.gs
#    - GeneradorCertificados.gs
#    - Config.gs
# 5. Ve a Configuración del proyecto (ícono de engranaje)
# 6. Desplázate hasta "Scopes"
# 7. Pega el contenido de appsscript.json
# 8. Guarda el proyecto: Ctrl+S
# 9. Refresca tu Google Sheets
```

### Método 2: Usando Clasp Clone (Alternativo)

```bash
# Si ya vinculaste el script a una hoja específica:
clasp clone SCRIPT_ID
```

---

## PARTE 4: Configurar el Sistema

### 1. Crear Template de Certificado

```bash
# 1. Ve a: https://docs.google.com
# 2. Crea un nuevo documento
# 3. Diseña tu certificado
# 4. Inserta el placeholder: {{NOMBRE}}
# 5. Guarda como: "Template Certificado"
# 6. Copia el ID de la URL:
#    https://docs.google.com/document/d/COPIA_ESTE_ID/edit
```

### 2. Crear Carpeta de Destino

```bash
# 1. Ve a: https://drive.google.com
# 2. Clic derecho → Nueva carpeta
# 3. Nombra: "Certificados Generados"
# 4. Abre la carpeta
# 5. Copia el ID de la URL:
#    https://drive.google.com/drive/folders/COPIA_ESTE_ID
```

### 3. Configurar IDs en el Script

```bash
# 1. Abre tu Google Sheets
# 2. Espera a que aparezca el menú "Certificados" (puede tardar 10-30 seg)
# 3. Si no aparece, refresca la página (F5)
# 4. Ve a: Certificados → Configurar IDs
# 5. Ingresa:
#    - Template ID (del paso 1)
#    - Carpeta Destino ID (del paso 2)
# 6. Clic en "Guardar Configuración"
```

---

## PARTE 5: Prueba del Sistema

### 1. Agregar Datos de Prueba

```bash
# En tu Google Sheets:
# Fila 1: NOMBRE | CORREO
# Fila 2: Juan Pérez | juan@test.com
# Fila 3: María López | maria@test.com
```

### 2. Generar Certificados de Prueba

```bash
# 1. En Google Sheets: Certificados → Generar Certificados
# 2. Confirma con "Sí"
# 3. Espera el mensaje de finalización
# 4. Revisa la carpeta de Drive
```

### 3. Verificar Resultados

```bash
# Deberías ver en Drive:
# - Certificado - Juan Pérez.pdf
# - Certificado - María López.pdf
```

---

## PARTE 6: Mantenimiento del Código

### Actualizar el Código

```bash
# 1. Edita los archivos localmente en src/
# 2. Sube los cambios a Google Apps Script:
clasp push

# 3. Commitea los cambios en Git:
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

### Descargar Cambios desde Google Apps Script

```bash
# Si editaste el código en el navegador y quieres bajarlo:
clasp pull
```

### Ver Logs de Ejecución

```bash
# Ver los logs más recientes:
clasp logs

# O desde el navegador:
# Apps Script → Ver → Registros de ejecución
```

---

## Comandos de Referencia Rápida

### Git
```bash
git status              # Ver estado del repositorio
git add .               # Agregar cambios
git commit -m "msg"     # Crear commit
git push                # Subir a GitHub
git pull                # Bajar de GitHub
git log --oneline       # Ver historial
```

### Clasp
```bash
clasp login             # Autenticarse
clasp create            # Crear proyecto
clasp push              # Subir código
clasp pull              # Bajar código
clasp open              # Abrir en navegador
clasp logs              # Ver logs
clasp version           # Crear versión
clasp deploy            # Desplegar como web app
```

### npm
```bash
npm install -g @google/clasp    # Instalar clasp
npm list -g                     # Ver paquetes globales
npm update -g @google/clasp     # Actualizar clasp
```

---

## Solución de Problemas

### Error: "clasp: command not found"
```bash
# Reinstalar clasp
sudo npm install -g @google/clasp

# O configurar PATH de npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Error: "User has not enabled the Apps Script API"
```bash
# Ir a: https://script.google.com/home/usersettings
# Activar: "Google Apps Script API"
```

### Error: "Permission denied" al hacer push
```bash
# Verificar autenticación
git remote -v

# Re-autenticar si es necesario
gh auth login

# O usar SSH en lugar de HTTPS
git remote set-url origin git@github.com:TU_USUARIO/CERTIFICADOS-EDUCACION-CONTINUA.git
```

### El menú no aparece en Sheets
```bash
# 1. Refresca la página (F5)
# 2. Espera 30 segundos
# 3. Ejecuta manualmente onOpen():
#    En Apps Script: Ejecutar → onOpen
# 4. Acepta los permisos solicitados
```

---

## Próximos Pasos

1. Personaliza el template de certificado
2. Añade más datos de participantes
3. Genera tus certificados oficiales
4. Comparte el repositorio en GitHub
5. Considera agregar features adicionales:
   - Envío por email automático
   - Múltiples placeholders
   - Templates dinámicos
   - Reportes de generación

---

**Documentación Completa:**
- [README.md](README.md) - Información general
- [docs/INSTALACION.md](docs/INSTALACION.md) - Guía de instalación
- [docs/USO.md](docs/USO.md) - Manual de usuario

**Repositorio:** https://github.com/TU_USUARIO/CERTIFICADOS-EDUCACION-CONTINUA
