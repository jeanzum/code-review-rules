# 🔧 Reglas de Revisión - Code Review Agent Q10

Este repositorio contiene las reglas de revisión de código para el **Code Review Agent** que analiza automáticamente Pull Requests en Bitbucket.

## 🚀 Cómo Funciona

Cuando alguien mueve una issue en Jira a "Revisión Pull", el Code Review Agent:

1. Detecta el PR en Bitbucket
2. Analiza el código usando **estas reglas**
3. Comenta inline en el código
4. Aprueba o rechaza el PR
5. Actualiza Jira automáticamente

**Este repositorio controla qué reglas aplica el agente.**

---

## 📝 Cómo Agregar/Modificar Reglas

### Opción 1: Edición Web (Recomendada para cambios pequeños)

1. Ve a [`rules/REVIEW_RULES.md`](rules/REVIEW_RULES.md)
2. Click en el ícono de lápiz ✏️ (Edit)
3. Modifica las reglas
4. Scroll abajo → **Propose changes**
5. Crea Pull Request
6. Espera aprobación del Team Lead
7. Merge → **GitHub Actions despliega automáticamente**

### Opción 2: Clonar y Editar Localmente (Para cambios grandes)

```bash
# Clonar
git clone https://github.com/YOUR_ORG/code-review-rules.git
cd code-review-rules

# Crear branch
git checkout -b add-new-rule

# Editar
nano rules/REVIEW_RULES.md

# Commit y push
git add rules/REVIEW_RULES.md
git commit -m "feat: agregar regla para prohibir DateTime.Now"
git push origin add-new-rule

# Ir a GitHub y crear Pull Request
```

---

## 📋 Formato de las Reglas

### Estructura Básica:

```markdown
## X. 🎯 Categoría Principal

### X.Y Nombre de la Regla Específica

❌ **BLOCKER:** Descripción de qué está prohibido

\`\`\`csharp
// MAL
DateTime.Now  // ❌ No usar
\`\`\`

✅ **MEJOR:** Descripción de la forma correcta

\`\`\`csharp
// BIEN
Institucion.FechaHoraActual  // ✅ Usar esto
\`\`\`

**Razón:** Explicación de por qué esta regla existe y el impacto de no seguirla.
```

### Severidades:

| Emoji | Nivel | Descripción | Comportamiento del Bot |
|-------|-------|-------------|------------------------|
| ❌ | **BLOCKER** | Crítico, debe corregirse | PR **rechazado**, Jira → "En Curso" |
| ⚠️ | **WARNING** | Importante, corregir pronto | PR **rechazado**, Jira → "En Curso" |
| 💡 | **SUGERENCIA** | Mejora opcional | PR aprobado con comentario |
| ✅ | **USAR** | Mejor práctica | Informativo |

> ⚠️ **Importante:** Actualmente **CUALQUIER finding** (blocker o warning) rechaza el PR. El código debe estar 100% limpio para aprobar.

---

## ✅ Validación Automática

Cuando creas un Pull Request, **GitHub Actions valida**:

- ✅ Formato correcto de Markdown
- ✅ Mínimo 25 reglas definidas
- ✅ Bloques de código válidos
- ✅ Sintaxis correcta
- ✅ Categorías principales presentes

**Si la validación falla** → No se puede hacer merge

---

## 🔄 Proceso de Aprobación y Deploy

```
Developer edita reglas
   ↓
Crea Pull Request
   ↓
GitHub Actions valida automáticamente
   ↓
Team Lead / Arquitecto revisa cambios
   ↓
Aprueba y hace merge a main
   ↓
GitHub Actions despliega:
   1. Backup del archivo actual
   2. Upload del nuevo archivo (SSH)
   3. Reinicia Code Review Agent
   4. Notifica en Telegram
   ↓
✅ Nueva regla activa en ~2 minutos
```

---

## 🔙 Rollback (Revertir Cambios)

Si una regla causa problemas:

### Opción 1: Revert por GitHub UI

1. Ve a [Commits](../../commits/main)
2. Encuentra el commit problemático
3. Click en `⋮` → **Revert**
4. Crea PR con el revert
5. Merge → Deploy automático de versión anterior

### Opción 2: Revert por CLI

```bash
# Ver historial
git log --oneline rules/REVIEW_RULES.md

# Revertir último commit
git revert HEAD

# Push
git push origin main

# GitHub Actions despliega automáticamente
```

---

## 📊 Ver Reglas en Producción

### En el Servidor:

```bash
# SSH al servidor (si tienes acceso)
ssh deploy@servidor-openclaw

# Ver archivo activo
cat /data/workspace/code-review-agent/knowledge/REVIEW_RULES.md

# Ver backups disponibles
ls -lth /data/workspace/code-review-agent/knowledge/*.backup.*

# Restaurar backup específico (si necesario)
cp /data/workspace/code-review-agent/knowledge/REVIEW_RULES.md.backup.TIMESTAMP \
   /data/workspace/code-review-agent/knowledge/REVIEW_RULES.md
```

### Logs de Deploy:

Ve a [Actions](../../actions) para ver el historial de deploys y logs.

---

## 🧪 Testing Local

Antes de crear un PR, valida localmente:

```bash
# Validar reglas
node scripts/validate.js rules/REVIEW_RULES.md

# Ver estadísticas
grep -c "^###" rules/REVIEW_RULES.md  # Contar reglas
grep -c '```' rules/REVIEW_RULES.md   # Contar ejemplos
```

---

## 📖 Ejemplos de Código

- Ver `examples/good/` para ejemplos de código correcto
- Ver `examples/bad/` para ejemplos de código incorrecto

Estos ejemplos ayudan al equipo a entender las reglas.

---

## 🛠️ Configuración (Solo para Admins)

### GitHub Secrets Necesarios:

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `SERVER_HOST` | Host del servidor OpenClaw | `servidor.q10.com` |
| `SERVER_USER` | Usuario SSH para deploy | `deploy` |
| `DEPLOY_SSH_KEY` | Private key SSH para acceso | `-----BEGIN RSA...` |

**Configurar en:** Settings → Secrets and variables → Actions → New repository secret

### Branch Protection:

**Rama `main` debe tener:**

- ☑ Require pull request before merging
- ☑ Require status checks to pass before merging
  - ☑ `validate` workflow
- ☑ Require conversation resolution before merging
- ☐ Allow force pushes: **NO**
- ☐ Allow deletions: **NO**

---

## 📊 Estadísticas

Ver [Insights](../../pulse) para:

- Contribuidores activos
- Frecuencia de cambios
- Pull Requests abiertas/cerradas

---

## 🔔 Notificaciones

Todos los deploys se notifican automáticamente en **Telegram** (chat ID: 6186805225) con:

- 👤 Quién hizo el cambio
- 📝 Mensaje del commit
- 🔗 Link al commit en GitHub

---

## 🆘 Ayuda y Soporte

- **Issues:** Reporta bugs o sugiere mejoras en [Issues](../../issues)
- **Contacto:** Alejo Restrepo (arestrepos@q10.com)
- **Telegram:** El Code Review Agent notifica automáticamente

---

## 📚 Recursos Adicionales

- [Propuesta original del sistema CI/CD](https://github.com/YOUR_ORG/code-review-rules/blob/main/docs/CI-CD-PROPOSAL.md)
- [Documentación del Code Review Agent](#)
- [Guía de contribución](CONTRIBUTING.md)

---

## 📜 Historial de Cambios

Ver [CHANGELOG.md](CHANGELOG.md) para el historial completo de cambios en las reglas.

---

## 🎯 Reglas Actuales

**Total de reglas:** ~26  
**Última actualización:** Ver [último commit](../../commits/main/rules/REVIEW_RULES.md)

### Categorías:

1. 🚀 Optimización y LINQ
2. 🏗️ Arquitectura y Capas
3. 🔒 Seguridad
4. 🎨 Buenas Prácticas (próximamente)
5. 📱 JavaScript/Frontend
6. 📊 SQL y Dapper (próximamente)

---

## 🤝 Contribuir

¿Quieres agregar una regla?

1. Lee este README
2. Revisa las reglas existentes en [`rules/REVIEW_RULES.md`](rules/REVIEW_RULES.md)
3. Crea un PR siguiendo el formato establecido
4. Explica claramente la razón de la nueva regla

**Todas las contribuciones son bienvenidas y revisadas por el equipo.**

---

**🤖 Este sistema permite que el equipo mejore continuamente las prácticas de código de Q10.**
