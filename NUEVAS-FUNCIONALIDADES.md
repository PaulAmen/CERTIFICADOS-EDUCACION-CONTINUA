# Nuevas Funcionalidades Agregadas

## 1. Columna de Links a Certificados

### ¿Qué hace?
- Crea automáticamente una columna **LINK** (columna C) en tu hoja de cálculo
- Cada vez que se genera un certificado, guarda el link directo al PDF en esa columna
- Permite acceso rápido a los certificados sin buscar en Drive

### Formato de la hoja:

```
| A: NOMBRE          | B: CORREO              | C: LINK                                    |
|--------------------|------------------------|--------------------------------------------|
| Juan Pérez         | juan@email.com         | https://drive.google.com/file/d/...        |
| María López        | maria@email.com        | https://drive.google.com/file/d/...        |
```

### Beneficios:
- Acceso directo con un clic al certificado de cada persona
- Puedes compartir el link individual fácilmente
- Sabes qué certificados ya fueron generados (tienen link)
- Si vuelves a ejecutar, solo procesa los que no tienen link

---

## 2. Continuación Automática después de 6 minutos

### ¿Qué hace?
Google Apps Script tiene un límite de **6 minutos** de ejecución. Esta funcionalidad:

1. **Monitorea el tiempo** de ejecución constantemente
2. **Pausa automáticamente** antes de llegar al límite (a los 5 minutos)
3. **Programa una continuación** automática en 1 minuto
4. **Retoma el proceso** exactamente donde lo dejó
5. **Repite el ciclo** hasta completar todos los certificados

### ¿Cómo funciona?

```
Ejecución 1: Procesa certificados 1-50 (5 min) → Pausa → Programa trigger
      ↓ (espera 1 minuto)
Ejecución 2: Procesa certificados 51-100 (5 min) → Pausa → Programa trigger
      ↓ (espera 1 minuto)
Ejecución 3: Procesa certificados 101-150 → Completa
```

### Ventajas:
- Procesa **cantidades ilimitadas** de certificados
- No necesitas estar presente
- Automático y sin intervención manual
- Evita perder progreso por timeouts

### Cancelar ejecuciones automáticas:
Si por alguna razón quieres detener el proceso:
```
Menú: Certificados → Cancelar Ejecuciones Automáticas
```

---

## 3. Detección de Certificados Ya Procesados

### ¿Qué hace?
El script ahora es **inteligente** y:
- Verifica si una fila ya tiene un link en la columna C
- Si tiene link, **omite** esa fila (ya fue procesada)
- Solo procesa las filas sin link

### Beneficios:
- Puedes **reanudar** procesos interrumpidos
- Si agregas nuevos participantes, solo procesa los nuevos
- No duplica certificados
- Ahorra tiempo y recursos

### Ejemplo:

**Antes de ejecutar:**
```
| NOMBRE     | CORREO          | LINK |
|------------|-----------------|------|
| Juan       | juan@email.com  | https://... |  ← Ya procesado, se omite
| María      | maria@email.com | https://... |  ← Ya procesado, se omite
| Carlos     | carlos@email.com|              |  ← Nuevo, se procesa
| Ana        | ana@email.com   |              |  ← Nuevo, se procesa
```

**Después de ejecutar:**
```
| NOMBRE     | CORREO          | LINK |
|------------|-----------------|------|
| Juan       | juan@email.com  | https://... |
| María      | maria@email.com | https://... |
| Carlos     | carlos@email.com| https://... |  ← Link agregado
| Ana        | ana@email.com   | https://... |  ← Link agregado
```

---

## Cómo Actualizar tu Script

Si ya tienes el código instalado, necesitas actualizar estos archivos:

### Actualizar GeneradorCertificados.gs

Reemplaza TODO el contenido del archivo con el nuevo código de:
```
src/GeneradorCertificados.gs
```

### Actualizar Code.gs

Reemplaza TODO el contenido del archivo con el nuevo código de:
```
src/Code.gs
```

### Pasos en el Editor de Apps Script:

1. Abre tu Google Sheets
2. **Extensiones → Apps Script**
3. Selecciona **GeneradorCertificados.gs**
4. Borra todo y pega el nuevo código
5. Selecciona **Code.gs**
6. Borra todo y pega el nuevo código
7. **Guardar** (Ctrl+S)
8. Vuelve a Sheets y **refresca** (F5)

---

## Nuevas Opciones en el Menú

El menú "Certificados" ahora incluye:

```
Certificados
├── Generar Certificados
├── ─────────────────────
├── Configurar IDs
├── Ver Configuración Actual
├── ─────────────────────
├── Cancelar Ejecuciones Automáticas  ← NUEVO
├── ─────────────────────
└── Ayuda
```

---

## Preguntas Frecuentes

### ¿Qué pasa si cierro la pestaña mientras se ejecuta?
No hay problema. El proceso continúa automáticamente en segundo plano.

### ¿Cómo sé si el proceso está en ejecución?
Revisa la columna LINK. Los certificados en proceso irán apareciendo.

### ¿Puedo detener el proceso?
Sí, usa: **Certificados → Cancelar Ejecuciones Automáticas**

### ¿Qué pasa si hay un error en una fila?
Se marca como "ERROR: mensaje" en la columna LINK y continúa con las demás.

### ¿Puedo regenerar un certificado específico?
Sí, borra el link de esa fila y vuelve a ejecutar. Solo procesará las filas sin link.

### ¿Los links expiran?
No, los links de Google Drive son permanentes mientras el archivo exista.

### ¿Cuántos certificados puede procesar?
Ilimitados. El sistema se encarga de dividir el trabajo en lotes.

---

## Estimación de Tiempos

Aproximadamente se pueden generar **2-3 certificados por minuto** (dependiendo de la complejidad del template).

**Ejemplos:**
- 50 certificados = ~20-25 minutos (1 ejecución)
- 150 certificados = ~60-75 minutos (2-3 ejecuciones)
- 300 certificados = ~2-2.5 horas (4-6 ejecuciones)

El sistema se encarga de todo automáticamente.

---

## Registro de Cambios (Changelog)

### Versión 2.0 (Actualización Actual)

**Agregado:**
- ✅ Columna LINK automática con links a certificados
- ✅ Continuación automática para procesos largos
- ✅ Detección de certificados ya procesados
- ✅ Opción para cancelar ejecuciones automáticas
- ✅ Triggers automáticos programados

**Mejorado:**
- ⚡ Rendimiento optimizado
- 🛡️ Mejor manejo de errores
- 📊 Indicadores de progreso más claros

### Versión 1.0 (Original)

**Funcionalidades iniciales:**
- Generación básica de certificados
- Menú personalizado
- Configuración de IDs
- Sistema de templates

---

## Soporte

Si tienes problemas con las nuevas funcionalidades:

1. Verifica que actualizaste ambos archivos (Code.gs y GeneradorCertificados.gs)
2. Refresca Google Sheets después de actualizar
3. Revisa los logs: **Apps Script → Ver → Registros de ejecución**
4. Abre un issue en GitHub con los detalles del error

---

**Repositorio:** https://github.com/TU_USUARIO/CERTIFICADOS-EDUCACION-CONTINUA
