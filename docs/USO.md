# Manual de Uso - Generador de Certificados

Esta guía explica cómo usar el sistema para generar certificados en PDF de manera eficiente.

## Índice

1. [Preparación Inicial](#preparación-inicial)
2. [Uso Básico](#uso-básico)
3. [Funciones del Menú](#funciones-del-menú)
4. [Casos de Uso Avanzados](#casos-de-uso-avanzados)
5. [Buenas Prácticas](#buenas-prácticas)
6. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Preparación Inicial

### 1. Formato de la Hoja de Cálculo

Tu hoja de Google Sheets debe tener este formato exacto:

**Fila 1 (Encabezados):**
```
| A: NOMBRE | B: CORREO |
```

**Fila 2 en adelante (Datos):**
```
| Juan Pérez García        | juan.perez@example.com    |
| María González López     | maria.gonzalez@example.com|
| Carlos Alberto Rodríguez | carlos.rodriguez@example.com |
```

**Notas Importantes:**
- La columna A debe contener el nombre completo del participante
- La columna B contiene el correo electrónico (opcional, pero recomendado)
- Los encabezados DEBEN estar en la fila 1
- Los datos comienzan en la fila 2
- No dejes filas vacías entre los datos

### 2. Diseño del Template

El template de Google Docs debe incluir:

**Elementos Requeridos:**
- El texto `{{NOMBRE}}` exactamente donde quieres que aparezca el nombre
- Diseño visual del certificado (bordes, logos, firmas, etc.)

**Ejemplo de Template:**

```
╔════════════════════════════════════════════════╗
║                                                ║
║         CERTIFICADO DE PARTICIPACIÓN          ║
║                                                ║
║           Se otorga el presente a:            ║
║                                                ║
║                  {{NOMBRE}}                    ║
║                                                ║
║     Por haber completado exitosamente el      ║
║          Curso de Educación Continua          ║
║                                                ║
║            Fecha: 20 de Enero 2026            ║
║                                                ║
╚════════════════════════════════════════════════╝
```

**Consejos de Diseño:**
- Usa fuentes grandes y legibles
- Centra el nombre del participante
- Incluye logos institucionales
- Añade firmas digitales o imágenes de firmas
- Usa colores corporativos
- Mantén márgenes amplios para la impresión

---

## Uso Básico

### Paso 1: Verificar la Configuración

Antes de generar certificados por primera vez:

1. Abre tu Google Sheets
2. Ve al menú **Certificados → Ver Configuración Actual**
3. Verifica que:
   - Template ID esté configurado
   - Carpeta Destino ID esté configurado
   - Estado muestre "Configuración completa"

Si no está configurado:
- Ve a **Certificados → Configurar IDs**
- Ingresa los IDs necesarios
- Guarda la configuración

### Paso 2: Preparar los Datos

1. Ingresa los datos de los participantes en la hoja
2. Revisa que no haya:
   - Filas vacías
   - Nombres incompletos
   - Errores tipográficos

### Paso 3: Generar los Certificados

1. En Google Sheets, ve a **Certificados → Generar Certificados**
2. Se mostrará un diálogo de confirmación
3. Haz clic en **Sí**
4. Observa el indicador de progreso en la parte inferior
5. Espera el mensaje de finalización

### Paso 4: Verificar los Resultados

1. Ve a tu carpeta de Google Drive configurada
2. Verás los certificados en formato PDF
3. Cada archivo tendrá el nombre: `Certificado - [Nombre del Participante].pdf`

**Ejemplo:**
```
Certificado - Juan Pérez García.pdf
Certificado - María González López.pdf
Certificado - Carlos Alberto Rodríguez.pdf
```

---

## Funciones del Menú

### Generar Certificados

**Función:** Procesa todos los registros de la hoja activa y genera los PDFs.

**Proceso:**
1. Lee los datos de la hoja (desde fila 2)
2. Por cada participante:
   - Crea una copia del template
   - Reemplaza `{{NOMBRE}}`
   - Exporta a PDF
   - Guarda en la carpeta configurada
   - Elimina la copia temporal
3. Muestra resumen de resultados

**Tiempo estimado:** 2-3 segundos por certificado

### Configurar IDs

**Función:** Permite establecer o modificar los IDs del template y carpeta destino.

**Campos:**
- **ID del Template:** ID del documento de Google Docs
- **ID de la Carpeta:** ID de la carpeta de Google Drive

**Cómo obtener los IDs:**

**Para el Template (Google Docs):**
```
URL: https://docs.google.com/document/d/1ABC123XYZ456/edit
ID:  1ABC123XYZ456
```

**Para la Carpeta (Google Drive):**
```
URL: https://drive.google.com/drive/folders/1XYZ789ABC123
ID:  1XYZ789ABC123
```

### Ver Configuración Actual

**Función:** Muestra los IDs actualmente configurados.

**Información mostrada:**
- Template ID
- Carpeta Destino ID
- Estado de la configuración (completa/incompleta)

**Uso:** Útil para verificar antes de generar certificados o para debugging.

### Ayuda

**Función:** Muestra información rápida sobre el uso del sistema.

**Contenido:**
- Pasos básicos de configuración
- Formato requerido de la hoja
- Recordatorio del placeholder
- Enlace al repositorio

---

## Casos de Uso Avanzados

### Procesamiento por Lotes

Si tienes muchos certificados (>100):

**Opción 1: Dividir en Hojas Separadas**
```
Hoja 1: Participantes 1-50
Hoja 2: Participantes 51-100
Hoja 3: Participantes 101-150
```

Procesa cada hoja individualmente.

**Opción 2: Filtrar por Rangos**
1. Selecciona las filas que quieres procesar
2. Copia a una nueva hoja temporal
3. Genera los certificados
4. Repite con el siguiente lote

### Regenerar un Certificado Específico

Si necesitas regenerar un solo certificado:

1. Crea una nueva hoja temporal
2. Copia solo la fila del participante
3. Genera el certificado
4. Elimina el certificado antiguo de Drive (opcional)

### Múltiples Templates

Si necesitas diferentes diseños:

1. Configura el primer template
2. Genera los certificados del primer grupo
3. Cambia la configuración al segundo template
4. Genera los certificados del segundo grupo

### Testing Previo

Antes de procesar todos los certificados:

**Método Recomendado:**
1. Crea una copia de tu hoja
2. Deja solo 2-3 registros de prueba
3. Genera los certificados
4. Revisa que todo esté correcto
5. Procesa el lote completo

**Método Avanzado (para desarrolladores):**
1. Abre el editor de Apps Script
2. Ejecuta la función `testGenerarUnCertificado()`
3. Revisa los logs

---

## Buenas Prácticas

### Antes de Generar

- [ ] Verifica la ortografía de todos los nombres
- [ ] Asegúrate de que no haya filas vacías
- [ ] Revisa que el template esté actualizado
- [ ] Haz una prueba con 2-3 certificados primero
- [ ] Verifica que la carpeta de destino esté vacía o organizada

### Durante la Generación

- [ ] No cierres la pestaña de Google Sheets
- [ ] No edites la hoja mientras se procesan
- [ ] Observa el indicador de progreso
- [ ] Ten paciencia con lotes grandes

### Después de Generar

- [ ] Verifica que se generaron todos los certificados
- [ ] Revisa aleatoriamente 5-10 PDFs
- [ ] Confirma que los nombres estén correctos
- [ ] Organiza los certificados en subcarpetas si es necesario
- [ ] Haz backup de los PDFs

### Organización en Drive

Estructura recomendada:

```
📁 Certificados Generados/
  📁 2026/
    📁 Enero/
      📁 Curso de Excel/
        📄 Certificado - Juan Pérez.pdf
        📄 Certificado - María López.pdf
      📁 Curso de Python/
        📄 Certificado - Carlos Ruiz.pdf
```

---

## Preguntas Frecuentes

### ¿Cuántos certificados puedo generar a la vez?

**Respuesta:** Teóricamente ilimitados, pero por el límite de tiempo de ejecución de Google Apps Script (6 minutos), se recomienda procesar máximo 100-150 certificados por lote.

### ¿Qué pasa si hay un error en un nombre?

**Respuesta:** Tienes dos opciones:
1. Regenerar solo ese certificado (ver "Regenerar un Certificado Específico")
2. Corregir el nombre en la hoja y volver a generar todo (los archivos se sobrescribirán)

### ¿Puedo usar otros placeholders además de {{NOMBRE}}?

**Respuesta:** En la versión actual, solo `{{NOMBRE}}` está implementado. Para agregar más placeholders (como `{{CURSO}}`, `{{FECHA}}`, etc.), necesitas modificar el código en `GeneradorCertificados.gs`.

### ¿Los certificados se envían automáticamente por email?

**Respuesta:** No, la versión actual solo genera y guarda los PDFs. El envío por email puede agregarse como feature futuro.

### ¿Qué formato de nombre se recomienda?

**Respuesta:** Usa el formato completo como aparecerá en el certificado:
- ✅ Correcto: "Juan Carlos Pérez García"
- ❌ Evitar: "juan perez" o "J. Pérez"

### ¿Los archivos se sobrescriben si genero dos veces?

**Respuesta:** Google Drive permite múltiples archivos con el mismo nombre. Si generas dos veces, tendrás duplicados. Limpia la carpeta antes de regenerar.

### ¿Puedo usar el mismo script en varias hojas?

**Respuesta:** Sí, el script se instala en el archivo de Google Sheets específico. Puedes copiar el mismo script a otras hojas.

### ¿Qué sucede si elimino la carpeta de destino?

**Respuesta:** El script fallará. Debes crear una nueva carpeta y actualizar la configuración con su nuevo ID.

### ¿Cómo puedo compartir masivamente los certificados?

**Respuesta:** Puedes:
1. Compartir la carpeta completa de Drive
2. Usar un script adicional para enviar emails
3. Generar enlaces compartibles con Drive API

### ¿El script funciona en modo offline?

**Respuesta:** No, requiere conexión a internet ya que interactúa con Google Drive, Docs y Sheets en la nube.

---

## Solución de Problemas Comunes

### Problema: "No hay datos para procesar"

**Causa:** La hoja está vacía o solo tiene encabezados.

**Solución:** Añade al menos una fila de datos debajo de los encabezados.

### Problema: El nombre no se reemplaza en el PDF

**Causa:** El placeholder en el template no es exactamente `{{NOMBRE}}`.

**Solución:** 
1. Abre el template
2. Busca el texto (Ctrl+F)
3. Verifica que sea exactamente: `{{NOMBRE}}` (con dobles llaves)

### Problema: Los certificados no aparecen en Drive

**Causa:** El ID de la carpeta es incorrecto.

**Solución:**
1. Verifica el ID de la carpeta
2. Reconfigura en: Certificados → Configurar IDs
3. Asegúrate de tener permisos de escritura en la carpeta

### Problema: Error de timeout

**Causa:** Demasiados certificados en un lote.

**Solución:** Divide en lotes más pequeños (50-100 certificados).

### Problema: Caracteres especiales se ven mal

**Causa:** Encoding del nombre.

**Solución:** Evita caracteres especiales raros. Acentos normales (á, é, í, ó, ú, ñ) funcionan correctamente.

---

## Atajos de Teclado Útiles

En Google Sheets:
- `Alt + T` - Abrir menú Tools (puede variar según idioma)
- `Ctrl + F` - Buscar
- `Ctrl + H` - Buscar y reemplazar
- `Ctrl + D` - Rellenar hacia abajo

---

## Recursos Adicionales

- [Guía de Instalación](INSTALACION.md)
- [README Principal](../README.md)
- [Repositorio en GitHub](https://github.com/TU_USUARIO/CERTIFICADOS-EDUCACION-CONTINUA)

---

**¿Necesitas más ayuda?**

Abre un issue en GitHub: https://github.com/TU_USUARIO/CERTIFICADOS-EDUCACION-CONTINUA/issues
