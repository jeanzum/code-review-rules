#!/usr/bin/env node
/**
 * Validador de reglas de revisión
 * Verifica formato, estructura y consistencia
 */

const fs = require('fs');

const rulesFile = process.argv[2];

if (!rulesFile) {
  console.error('❌ Uso: node validate-rules.js <archivo>');
  process.exit(1);
}

console.log(`🔍 Validando ${rulesFile}...\n`);

const content = fs.readFileSync(rulesFile, 'utf8');
const lines = content.split('\n');

let errors = [];
let warnings = [];
let ruleCount = 0;
let exampleCount = 0;

// 1. Validar estructura básica
if (!content.includes('# Reglas de Revisión')) {
  errors.push('Falta título principal');
}

// 2. Contar reglas (###)
const rules = content.match(/^### /gm);
ruleCount = rules ? rules.length : 0;

if (ruleCount < 30) {
  errors.push(`Solo ${ruleCount} reglas encontradas (mínimo 30)`);
}

// 3. Verificar ejemplos de código
const codeBlocks = content.match(/```/g);
exampleCount = codeBlocks ? codeBlocks.length / 2 : 0;

if (exampleCount < 20) {
  warnings.push(`Solo ${exampleCount} ejemplos de código (recomendado 20+)`);
}

// 4. Verificar emojis de severidad
const hasBlockers = content.includes('❌ BLOCKER') || content.includes('❌ PROHIBIDO');
const hasWarnings = content.includes('⚠️ WARNING') || content.includes('✅ USAR');

if (!hasBlockers) {
  errors.push('Falta definir BLOCKERS (❌)');
}

if (!hasWarnings) {
  warnings.push('Falta definir WARNINGS (⚠️)');
}

// 5. Verificar categorías principales
const categories = [
  'Optimización',
  'Arquitectura',
  'Seguridad',
  'Buenas Prácticas',
  'JavaScript',
  'SQL'
];

categories.forEach(cat => {
  if (!content.includes(cat)) {
    warnings.push(`Categoría "${cat}" no encontrada`);
  }
});

// REPORTE
console.log('═══════════════════════════════════════');
console.log('  📊 RESULTADO DE VALIDACIÓN');
console.log('═══════════════════════════════════════\n');

console.log(`✅ Reglas: ${ruleCount}`);
console.log(`✅ Ejemplos de código: ${exampleCount}\n`);

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:');
  warnings.forEach(w => console.log(`   - ${w}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ ERRORES:');
  errors.forEach(e => console.log(`   - ${e}`));
  console.log('');
  console.log('❌ VALIDACIÓN FALLIDA\n');
  process.exit(1);
}

console.log('✅ VALIDACIÓN EXITOSA\n');
console.log('El archivo está listo para despliegue.\n');
process.exit(0);
