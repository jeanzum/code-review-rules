# 🤝 Guía de Contribución

¡Gracias por querer contribuir a las reglas de revisión de código de Q10!

## 📋 Antes de Contribuir

1. **Lee las reglas existentes** en `rules/REVIEW_RULES.md`
2. **Verifica que tu regla no exista** ya
3. **Piensa en el impacto** - ¿Esta regla realmente mejora la calidad del código?

## ✅ Tipos de Contribuciones

### 1. Agregar una Nueva Regla

**Cuando agregar:**
- Has visto un patrón problemático repetido en PRs
- Hay una best practice de Q10 Jack que no está documentada
- Quieres prevenir un bug común

**Formato:**
```markdown
### X.Y Nombre Descriptivo de la Regla

❌ **BLOCKER:** Qué no hacer

\`\`\`csharp
// MAL
código problemático
\`\`\`

✅ **MEJOR:** Qué hacer en su lugar

\`\`\`csharp
// BIEN
código correcto
\`\`\`

**Razón:** Por qué esta regla existe y su impacto.
```

### 2. Modificar una Regla Existente

**Cuándo modificar:**
- La regla es demasiado estricta/laxa
- El ejemplo no es claro
- La explicación necesita mejoras

**Proceso:**
1. Explica en el PR **por qué** la regla debe cambiar
2. Incluye ejemplos de código real si es posible
3. Menciona si afectará PRs existentes

### 3. Mejorar Documentación

**Siempre bienvenido:**
- Corrección de typos
- Mejores ejemplos
- Explicaciones más claras
- Links a recursos externos

## 🔄 Proceso de Contribución

### Paso 1: Fork/Branch

```bash
# Opción A: Si tienes acceso al repo
git checkout -b feature/add-rule-datetime

# Opción B: Si no tienes acceso
# Fork el repo en GitHub, luego:
git clone https://github.com/TU_USUARIO/code-review-rules.git
```

### Paso 2: Hacer Cambios

```bash
# Editar reglas
nano rules/REVIEW_RULES.md

# Validar localmente
node scripts/validate.js rules/REVIEW_RULES.md

# Ver estadísticas
grep -c "^###" rules/REVIEW_RULES.md
```

### Paso 3: Commit

**Formato de commit messages:**

```
feat: agregar regla para prohibir DateTime.Now
fix: corregir ejemplo en regla de IDisposable
docs: mejorar explicación de reglas de LINQ
refactor: reorganizar categoría de Seguridad
```

**Tipos:**
- `feat`: Nueva regla
- `fix`: Corrección de regla existente
- `docs`: Solo documentación
- `refactor`: Reorganización sin cambios de comportamiento

### Paso 4: Push y PR

```bash
git add rules/REVIEW_RULES.md
git commit -m "feat: agregar regla para prohibir DateTime.Now"
git push origin feature/add-rule-datetime
```

Luego en GitHub:
1. Crear Pull Request
2. Llenar la plantilla del PR
3. Esperar validación automática
4. Responder a comentarios del review

## 📝 Plantilla de Pull Request

```markdown
## Tipo de Cambio
- [ ] Nueva regla
- [ ] Modificación de regla existente
- [ ] Mejora de documentación
- [ ] Fix de bug

## Descripción
<!-- Describe qué cambia y por qué -->

## Regla Afectada
<!-- Número/nombre de la regla si aplica -->

## Motivación
<!-- Por qué este cambio es necesario -->

## Ejemplos de Código Real
<!-- Si es posible, muestra código real donde esta regla aplica -->

## Impacto
- [ ] Este cambio es breaking (hará que PRs válidos fallen)
- [ ] Este cambio es backwards compatible
- [ ] Esto solo afecta reglas futuras

## Checklist
- [ ] Validé localmente con `node scripts/validate.js`
- [ ] Agregué ejemplos de código bueno y malo
- [ ] Expliqué la razón de la regla
- [ ] Revisé que no exista una regla similar
```

## ✅ Checklist de Calidad

Antes de crear el PR, verifica:

- [ ] La regla tiene un nombre descriptivo
- [ ] Incluye ejemplo de código **MAL**
- [ ] Incluye ejemplo de código **BIEN**
- [ ] Explica la **razón** de la regla
- [ ] Define severidad clara (BLOCKER, WARNING, etc.)
- [ ] Los bloques de código tienen sintaxis correcta
- [ ] La regla es específica (no vaga)
- [ ] El impacto está claro

## 🚫 Qué NO Hacer

❌ **No agregar reglas de estilo personal**
   - Las reglas deben basarse en best practices o prevenir bugs

❌ **No ser demasiado específico a un caso único**
   - Las reglas deben aplicar a múltiples situaciones

❌ **No agregar reglas sin ejemplos**
   - Los ejemplos ayudan al equipo a entender

❌ **No cambiar múltiples reglas en un PR**
   - Un cambio por PR facilita el review

❌ **No usar lenguaje vago**
   - "Evita esto cuando puedas" → ❌
   - "Prohibido usar X, usar Y en su lugar" → ✅

## 🎯 Ejemplos de Buenos PRs

### Ejemplo 1: Nueva Regla

```markdown
**Título:** feat: prohibir DateTime.Now en favor de Institucion.FechaHoraActual

**Descripción:**
Agregando regla para prohibir `DateTime.Now` ya que en Q10 Jack siempre
debemos usar `Institucion.FechaHoraActual` para respetar la zona horaria
de la institución.

**Motivación:**
He visto 3 bugs en el último mes donde usaron `DateTime.Now` y causó
problemas con instituciones en zonas horarias diferentes.

**Impacto:**
Breaking - PRs con `DateTime.Now` serán rechazados.
```

### Ejemplo 2: Mejorar Regla

```markdown
**Título:** fix: aclarar cuándo usar .Any() vs .Count()

**Descripción:**
La regla actual solo dice "usar .Any()" pero no explica que .Count()
como propiedad (sin paréntesis) es OK en listas materializadas.

**Motivación:**
El bot rechazó un PR válido que usaba `myList.Count` (propiedad).
Necesitamos aclarar la distinción entre `.Count` y `.Count()`.
```

## 📞 ¿Preguntas?

- **Issues:** Abre un issue para discutir antes de hacer un PR grande
- **Telegram:** Pregunta en el grupo del equipo
- **Email:** arestrepos@q10.com

## 🙏 Reconocimiento

Todos los contribuidores son reconocidos en el [CHANGELOG.md](CHANGELOG.md).

---

**¡Gracias por ayudar a mejorar la calidad de código en Q10!** 🎉
