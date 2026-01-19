# Guía de Instalación Detallada

Esta guía te llevará paso a paso desde la configuración inicial en tu PC con Arch Linux hasta tener el sistema completamente funcional.

## Índice

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Instalación de Dependencias](#instalación-de-dependencias)
3. [Configuración de Git y GitHub](#configuración-de-git-y-github)
4. [Instalación y Configuración de Clasp](#instalación-y-configuración-de-clasp)
5. [Preparación de Google Workspace](#preparación-de-google-workspace)
6. [Despliegue del Script](#despliegue-del-script)
7. [Verificación](#verificación)
8. [Solución de Problemas](#solución-de-problemas)

---

## Requisitos del Sistema

### Software Necesario

- **Sistema Operativo:** Arch Linux (o cualquier distribución Linux)
- **Git:** v2.30 o superior
- **Node.js:** v14.x o superior
- **npm:** v6.x o superior

### Cuentas Necesarias

- Cuenta de Google (Gmail)
- Cuenta de GitHub (opcional pero recomendado)

---

## Instalación de Dependencias

### 1. Actualizar el Sistema

```bash
sudo pacman -Syu
```

### 2. Instalar Git

```bash
# Verificar si Git ya está instalado
git --version

# Si no está instalado:
sudo pacman -S git
```

### 3. Instalar Node.js y npm

```bash
# Instalar Node.js (incluye npm)
sudo pacman -S nodejs npm

# Verificar instalación
node --version
npm --version
```

### 4. Configurar Git (si es la primera vez)

```bash
# Configurar tu nombre
git config --global user.name "Tu Nombre"

# Configurar tu email
git config --global user.email "tu.email@example.com"

# Verificar configuración
git config --list
```

---

## Configuración de Git y GitHub

### 1. Crear Repositorio Local

Si ya clonaste el repositorio, este paso ya está hecho. Si no:

```bash
# Navegar al directorio del proyecto
cd ~/Projects/CERTIFICADOS-EDUCACION-CONTINUA

# Verificar que Git está inicializado
git status
```

### 2. Crear Repositorio en GitHub

#### Opción A: Usando la CLI de GitHub (gh)

```bash
# Instalar GitHub CLI
sudo pacman -S github-cli

# Autenticarse
gh auth login

# Crear repositorio remoto
gh repo create CERTIFICADOS-EDUCACION-CONTINUA --public --source=. --remote=origin

# Hacer push
git push -u origin main
```

#### Opción B: Manualmente desde el Navegador

1. Ve a https://github.com/new
2. Nombre del repositorio: `CERTIFICADOS-EDUCACION-CONTINUA`
3. Descripción: "Generador automático de certificados en PDF con Google Apps Script"
4. Visibilidad: Público o Privado (tu elección)
5. NO inicialices con README, .gitignore o licencia
6. Clic en "Create repository"

Luego, conecta el repositorio local:

```bash
# Conectar con el remoto (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/CERTIFICADOS-EDUCACION-CONTINUA.git

# Verificar conexión
git remote -v

# Hacer push de la rama principal
git branch -M main
git push -u origin main
```

---

## Instalación y Configuración de Clasp

### 1. Instalar Clasp Globalmente

```bash
# Instalar clasp
sudo npm install -g @google/clasp

# Verificar instalación
clasp --version
```

### 2. Autenticarse con Google

```bash
# Iniciar sesión
clasp login
```

Esto abrirá tu navegador. Debes:

1. Seleccionar tu cuenta de Google
2. Permitir el acceso solicitado
3. Verás un mensaje de éxito en la terminal

### 3. Habilitar la API de Google Apps Script

1. Ve a https://script.google.com/home/usersettings
2. Activa "Google Apps Script API"

---

## Preparación de Google Workspace

### 1. Crear la Hoja de Cálculo

1. Ve a https://sheets.google.com
2. Crea una nueva hoja de cálculo
3. Nómbrala: "Certificados - Participantes"
4. Añade encabezados en la primera fila:
   - Columna A: `NOMBRE`
   - Columna B: `CORREO`

### 2. Crear el Template de Certificado

1. Ve a https://docs.google.com
2. Crea un nuevo documento
3. Diseña tu certificado
4. Inserta el texto `{{NOMBRE}}` donde quieres que aparezca el nombre
5. Guarda como "Template Certificado"
6. Copia el ID del documento de la URL:
   ```
   https://docs.google.com/document/d/1ABC123XYZ.../edit
   El ID es: 1ABC123XYZ...
   ```

### 3. Crear la Carpeta de Destino

1. Ve a https://drive.google.com
2. Crea una nueva carpeta
3. Nómbrala: "Certificados Generados"
4. Copia el ID de la carpeta de la URL:
   ```
   https://drive.google.com/drive/folders/1XYZ789ABC...
   El ID es: 1XYZ789ABC...
   ```

---

## Despliegue del Script

### 1. Navegar al Directorio del Proyecto

```bash
cd ~/Projects/CERTIFICADOS-EDUCACION-CONTINUA
```

### 2. Crear Proyecto de Apps Script

Tienes dos opciones:

#### Opción A: Proyecto Standalone (Independiente)

```bash
clasp create --type standalone --title "Generador de Certificados"
```

#### Opción B: Proyecto vinculado a Google Sheets (RECOMENDADO)

Primero, obtén el ID de tu hoja de cálculo:
```
URL: https://docs.google.com/spreadsheets/d/1SHEET_ID_AQUI/edit
```

Luego:

```bash
clasp create --type sheets --title "Generador de Certificados"
```

Se creará un archivo `.clasp.json` con la configuración.

### 3. Configurar la Raíz del Código

Edita `.clasp.json` para que apunte a la carpeta `src`:

```json
{
  "scriptId": "TU_SCRIPT_ID_AQUI",
  "rootDir": "./src"
}
```

### 4. Subir el Código a Google Apps Script

```bash
# Subir todos los archivos
clasp push

# Si pregunta por sobrescribir, responde 'yes'
```

### 5. Abrir el Proyecto en el Navegador

```bash
clasp open
```

Esto abrirá el editor de Apps Script en tu navegador.

---

## Verificación

### 1. Verificar los Archivos Subidos

En el editor de Apps Script, debes ver:
- Code.gs
- GeneradorCertificados.gs
- Config.gs
- appsscript.json

### 2. Vincular con Google Sheets (si no lo hiciste antes)

Si creaste un proyecto standalone, debes vincularlo manualmente:

1. En el editor de Apps Script, ve a **Configuración del proyecto** (ícono de engranaje)
2. Busca el "Script ID" y cópialo
3. Abre tu Google Sheets
4. Ve a **Extensiones → Apps Script**
5. Pega el código o conecta el proyecto

### 3. Probar el Menú

1. Abre tu Google Sheets
2. Refresca la página (F5)
3. Deberías ver un nuevo menú llamado "Certificados"
4. Si no aparece inmediatamente, espera unos segundos y refresca nuevamente

### 4. Configurar los IDs

1. En Google Sheets, ve a **Certificados → Configurar IDs**
2. Ingresa:
   - ID del Template (del documento de Google Docs)
   - ID de la Carpeta (de Google Drive)
3. Haz clic en **Guardar Configuración**

### 5. Prueba con Datos de Ejemplo

1. Añade algunos datos de prueba en tu hoja:
   
   | NOMBRE | CORREO |
   |--------|--------|
   | Juan Pérez | juan@test.com |
   | María López | maria@test.com |

2. Ve a **Certificados → Generar Certificados**
3. Confirma la acción
4. Revisa la carpeta de destino en Drive

---

## Solución de Problemas

### Error: "clasp: command not found"

**Causa:** clasp no está instalado correctamente.

**Solución:**
```bash
sudo npm install -g @google/clasp
```

### Error: "User has not enabled the Apps Script API"

**Causa:** La API no está habilitada.

**Solución:**
1. Ve a https://script.google.com/home/usersettings
2. Activa "Google Apps Script API"

### Error: "Permission denied" al instalar clasp

**Causa:** Permisos insuficientes.

**Solución:**
```bash
# Opción 1: Usar sudo
sudo npm install -g @google/clasp

# Opción 2: Cambiar el directorio de npm global
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @google/clasp
```

### El menú "Certificados" no aparece

**Causa:** El script no se ha cargado o hay un error.

**Solución:**
1. Refresca la página de Google Sheets
2. Verifica que los archivos estén en Apps Script
3. Revisa los logs en Apps Script (**Ver → Registros de ejecución**)
4. Ejecuta manualmente la función `onOpen()` desde el editor

### Error: "El ID del template no es válido"

**Causa:** El ID copiado es incorrecto o no tienes acceso.

**Solución:**
1. Verifica que copiaste solo el ID (sin la parte "/edit")
2. Asegúrate de tener acceso al documento
3. Prueba abriendo el documento directamente con: `https://docs.google.com/document/d/TU_ID/edit`

### Timeout en la ejecución

**Causa:** Demasiados certificados para procesar en una sola ejecución.

**Solución:**
- Google Apps Script tiene un límite de 6 minutos por ejecución
- Procesa máximo 50-100 certificados a la vez
- Divide tu lista en lotes más pequeños

---

## Próximos Pasos

Una vez completada la instalación:

1. Lee [USO.md](USO.md) para aprender a usar el sistema
2. Personaliza el template de certificado según tus necesidades
3. Configura datos reales de participantes
4. Genera tus certificados

---

## Recursos Adicionales

- [Documentación de Clasp](https://github.com/google/clasp)
- [Documentación de Google Apps Script](https://developers.google.com/apps-script)
- [Guía de Google Sheets API](https://developers.google.com/sheets/api)
- [Repositorio del Proyecto](https://github.com/TU_USUARIO/CERTIFICADOS-EDUCACION-CONTINUA)

---

**Nota:** Si encuentras algún problema no cubierto en esta guía, por favor abre un [Issue en GitHub](https://github.com/TU_USUARIO/CERTIFICADOS-EDUCACION-CONTINUA/issues).
