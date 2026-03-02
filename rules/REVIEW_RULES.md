# Reglas de Revisión de Pull Requests - Q10 Jack

## 1. 🚀 Optimización y LINQ (C#)

### 1.1 Eficiencia en Ciclos
❌ **PROHIBIDO:** Llamadas a APIs externas o consultas a BD dentro de bucles
```csharp
// MAL
foreach (var item in items) {
    var data = await _api.GetDataAsync(item.Id); // ❌ API en loop
    var user = _db.Users.Find(item.UserId);      // ❌ DB en loop
}

// BIEN
var ids = items.Select(i => i.Id).ToList();
var allData = await _api.GetBatchDataAsync(ids); // ✅ Batch request
```

❌ **PROHIBIDO:** Polling indefinido sin timeout
```csharp
// MAL
while (true) { await CheckStatus(); } // ❌

// BIEN
var cts = new CancellationTokenSource(TimeSpan.FromMinutes(5));
while (!cts.Token.IsCancellationRequested) { ... } // ✅
```

### 1.2 Validación de Colecciones
✅ **USAR:** `.Any()` en lugar de `.Count() > 0`
```csharp
if (items.Any()) { ... }           // ✅ Eficiente
if (items.Count > 0) { ... }       // ✅ Propiedad (sin paréntesis)
if (items.Count() > 0) { ... }     // ❌ Método LINQ (itera toda la colección)
```

### 1.3 Gestión de Memoria
❌ **EVITAR:** `.ToList()` o `.ToArray()` innecesarios
```csharp
// MAL
var list = query.ToList();
foreach (var item in list) { ... } // ❌ Materializa todo en memoria

// BIEN
foreach (var item in query) { ... } // ✅ Itera bajo demanda
```

✅ **OBLIGATORIO:** `using` o `Dispose()` para IDisposable
```csharp
using (var connection = new SqlConnection(...)) { ... } // ✅
```

### 1.4 Métodos Nativos vs LINQ
✅ Si el objeto YA es `List<T>`, usar métodos propios
```csharp
var myList = new List<int> { 1, 2, 3 };

// BIEN
myList.Find(x => x > 1);      // ✅ Método nativo de List<T>
myList.Sort();                // ✅

// EVITAR
myList.FirstOrDefault(x => x > 1); // ❌ LINQ innecesario
```

### 1.5 Strings
✅ **OBLIGATORIO:** Usar `.JoinItemsWithComma()` para concatenar colecciones
```csharp
var names = users.Select(u => u.Name).JoinItemsWithComma(); // ✅
```

---

## 2. 🏗️ Arquitectura y Capas

### 2.1 Inyección de Dependencias
❌ **EVITAR:** Acceso directo a `SessionManager` en Controladores, ViewModels y Jobs
```csharp
// EVITAR (pero no blocker)
public class MyController : Controller {
    public ActionResult Index() {
        var userId = SessionManager.Usuario.Id; // ⚠️ Acceso directo
    }
}

// MEJOR - Inyección de dependencias
public class MyController : Controller {
    private readonly ICurrentUserService _currentUser;
    
    public MyController(ICurrentUserService currentUser) {
        _currentUser = currentUser;
    }
    
    public ActionResult Index() {
        var userId = _currentUser.Id; // ✅ Inyectado
    }
}

// TAMBIÉN OK - BaseServicio ya maneja SessionManager
var servicio = BaseServicio.Get<ServicioSeguridad>(); // ✅
// servicio.institucion y servicio.usuario ya están disponibles
```

**Nota:** `SessionManager` es un patrón legacy válido en Q10 Jack. La inyección de dependencias es preferible pero no obligatoria.

❌ **PROHIBIDO:** Conexiones a BD en Modelos o ViewModels
```csharp
// MAL en ViewModel
public string UserName => _db.Users.Find(UserId).Name; // ❌

// BIEN - Resolver en el servicio/repo
```

### 2.2 Caché
✅ **OBLIGATORIO:** Usar `RedisCacheManager`
```csharp
// BIEN
var data = await _redisCacheManager.GetOrSetAsync(key, () => ...); // ✅

// DEPRECADO
var data = CacheManager.Get(key); // ❌
```

### 2.3 Servicios Externos
✅ **OBLIGATORIO:** Usar `MvcApplication.GetHttpClient()`
```csharp
var client = MvcApplication.GetHttpClient(); // ✅
var response = await client.GetAsync(url);
```

### 2.4 Manejo de Fechas
❌ **PROHIBIDO:** `DateTime.Now`
```csharp
var now = DateTime.Now; // ❌

var now = Institucion.FechaHoraActual; // ✅
```

---

## 3. 🔒 Seguridad

### 3.1 Acceso
❌ **PROHIBIDO:** `[AllowAnonymous]` en acciones de controlador
```csharp
[AllowAnonymous] // ❌ NUNCA usar esto
public ActionResult MyAction() { ... }
```

### 3.2 Autorización
✅ **OBLIGATORIO:** Decoradores de permisos en TODAS las acciones
```csharp
[HasPermission(PermissionKeys.EditInvoice)]
public ActionResult Edit(int id) { ... } // ✅

// O validación manual
if (!IsAuthorized(PermissionKeys.EditInvoice)) return Forbidden(); // ✅
```

### 3.3 Sanitización
✅ **OBLIGATORIO:** Limpiar HTML del usuario con `main.js`
```javascript
var cleanHtml = sanitizeHtml(userInput); // ✅ (función de main.js)
```

### 3.4 Librerías
✅ Validar que paquetes NuGet estén actualizados y sin vulnerabilidades

---

## 4. 🧹 Clean Code

### 4.1 Nomenclatura
✅ Consistencia de idioma (español O inglés, NO mezclar)
```csharp
// MAL
public string UserName { get; set; }  // Inglés
public int EdadUsuario { get; set; }  // Español ❌ INCONSISTENTE

// BIEN (todo en un idioma)
public string NombreUsuario { get; set; }
public int EdadUsuario { get; set; }
```

### 4.2 Legibilidad
✅ Comentarios `<summary>` en propiedades/lógica compleja
```csharp
/// <summary>
/// Calcula el total incluyendo impuestos y descuentos aplicables según la región
/// </summary>
public decimal TotalConImpuestos { get; set; }
```

### 4.3 Limpieza
❌ Eliminar:
- Variables no usadas
- Parámetros no usados
- `using` no utilizados
- Referencias a NuGet no usados

### 4.4 Enums
❌ **PROHIBIDO:** Enums con tipo `char` para valores numéricos
```csharp
// MAL
public enum Status : char { Active = '1', Inactive = '0' } // ❌

// BIEN
public enum Status { Active = 1, Inactive = 0 } // ✅
```

✅ Eliminar miembros de Enum sin referencias

### 4.5 Valores Mágicos
❌ Strings/números "quemados"
```csharp
if (status == "ACTIVE") { ... } // ❌

if (status == StatusConstants.Active) { ... } // ✅
```

### 4.6 Duplicidad
❌ Evitar código duplicado - extraer a métodos comunes

---

## 5. 💻 Frontend (JavaScript & HTML)

### 5.1 Scope
✅ `const` por defecto, `let` si cambia
❌ **PROHIBIDO:** `var`
```javascript
const userId = 123;        // ✅
let counter = 0;           // ✅
var name = "John";         // ❌ PROHIBIDO
```

### 5.2 Reutilización
✅ Verificar `main.js` antes de crear funciones de utilidad

### 5.3 Convención de Nombres
```javascript
// JavaScript: camelCase
function getUserData() { ... }  // ✅
const userName = "John";        // ✅

// HTML: kebab-case
<div id="user-profile"></div>   // ✅
<div class="btn-primary"></div> // ✅
```

### 5.4 UX - Doble Clic
✅ **OBLIGATORIO:** Deshabilitar botones tras clic
```javascript
$('#submitBtn').on('click', function() {
    $(this).prop('disabled', true); // ✅ Previene doble submit
    // ... hacer petición
});
```

---

## 6. 🌐 AJAX y Asincronía

### 6.1 Métodos Asíncronos
✅ Si la acción usa AJAX, recomendar métodos `async` en backend
```csharp
// BIEN
public async Task<ActionResult> GetDataAsync() {
    var data = await _service.FetchDataAsync();
    return Json(data);
}
```

### 6.2 Operaciones Masivas
✅ Priorizar acciones masivas en lugar de múltiples requests
```javascript
// MAL
items.forEach(item => {
    $.post('/api/update', { id: item.id }); // ❌ N requests
});

// BIEN
$.post('/api/update-batch', { ids: items.map(i => i.id) }); // ✅ 1 request
```

### 6.3 Verbos HTTP
❌ **PROHIBIDO:** Datos sensibles en URL (QueryString) con POST
```javascript
// MAL
$.post('/api/update?password=secret123'); // ❌ En URL

// BIEN
$.post('/api/update', { password: 'secret123' }); // ✅ En body
```

---

## 🎯 Severidad de Violaciones

| Severidad | Ejemplos |
|-----------|----------|
| **BLOQUEANTE** 🔴 | API en loop, `[AllowAnonymous]`, datos en QueryString |
| **CRÍTICA** 🟠 | Falta permisos, `DateTime.Now`, `CacheManager` deprecado |
| **ALTA** 🟡 | `Count()` vs `Any()`, `var` en JS, falta `using` |
| **MEDIA** 🟢 | Inconsistencia idioma, falta comentarios, `.ToList()` innecesario |
| **BAJA** ⚪ | Nombres poco claros, código duplicado menor |

---

## 🤖 Uso por IA

Este documento está optimizado para que un agente de IA pueda:
1. Parsear las reglas estructuradamente
2. Detectar violaciones en diffs de código
3. Generar comentarios específicos con ejemplos
4. Clasificar por severidad
5. Sugerir correcciones concretas

<!-- Test final: 2026-03-02 15:23:17 UTC -->
