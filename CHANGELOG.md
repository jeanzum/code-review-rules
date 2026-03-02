# Changelog

Todos los cambios notables en las reglas de revisión de código serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Agregado
- Sistema CI/CD con GitHub Actions
- Validación automática de reglas en Pull Requests
- Deploy automático al servidor OpenClaw
- Notificaciones en Telegram para cada deploy
- Documentación completa (README, CONTRIBUTING)

## [1.0.0] - 2026-03-02

### Agregado
- Reglas iniciales de revisión (26 reglas)
- Categoría: Optimización y LINQ (C#)
  - Eficiencia en ciclos
  - Validación de colecciones
  - Gestión de memoria
- Categoría: Arquitectura y Capas
  - Inyección de dependencias
  - SessionManager vs servicios
- Categoría: Seguridad
  - [AllowAnonymous] sin justificación
  - SQL injection
- Categoría: JavaScript/Frontend
  - Uso de var vs const/let
- Sistema de severidades:
  - BLOCKER: Código se rechaza
  - WARNING: Código se rechaza
  - SUGERENCIA: Código se aprueba con comentario

### Notas
- Primera versión migrada desde archivo local del servidor
- Validador funcional implementado
- Sistema de CI/CD operacional

---

## Formato de Entradas

### Agregado
Para nuevas reglas o características.

### Cambiado
Para cambios en reglas existentes.

### Obsoleto
Para reglas que pronto serán removidas.

### Removido
Para reglas que fueron eliminadas.

### Corregido
Para correcciones de bugs en reglas o ejemplos.

### Seguridad
Para cambios relacionados con vulnerabilidades.

---

## Contribuidores

- Alejo Restrepo (@arestrepos) - Configuración inicial y migración
- OpenClaw Bot - Sistema de CI/CD

---

[Unreleased]: https://github.com/YOUR_ORG/code-review-rules/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/YOUR_ORG/code-review-rules/releases/tag/v1.0.0
