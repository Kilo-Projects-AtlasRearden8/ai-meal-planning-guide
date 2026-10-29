// AI Meal Planning Guide — verification script
// Copyright (c) 2026 Asdale Dynamics, LLC. MIT License.
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const errors = [];
const warnings = [];

function check(condition, message) {
  if (!condition) errors.push(message);
  return condition;
}

function note(condition, message) {
  if (!condition) warnings.push(message);
  return condition;
}

// ---- Required files ----
const requiredFiles = [
  'LICENSE',
  'README.md',
  'docs/00-introduction.md',
  'docs/01-getting-started-free-ai.md',
  'docs/02-pantry-to-menu.md',
  'docs/03-grocery-lists.md',
  'docs/04-dietary-restrictions.md',
  'docs/05-budget-recipes.md',
  'docs/06-step-by-step-prompts.md',
  'docs/07-printable-templates.md',
  'docs/08-privacy-rules.md',
  'docs/09-faq-glossary.md',
  'docs/index.md',
  'site/index.html',
  'site/css/style.css',
  'site/js/site.js',
  'site/templates/weekly-meal-plan.html',
  'site/templates/grocery-list.html',
];

for (const f of requiredFiles) {
  check(fs.existsSync(path.join(ROOT, f)), `Missing required file: ${f}`);
}

// ---- LICENSE exact copyright line ----
const license = fs.readFileSync(path.join(ROOT, 'LICENSE'), 'utf8');
check(
  license.includes('Copyright (c) 2026 Asdale Dynamics, LLC'),
  'LICENSE missing exact copyright line: Copyright (c) 2026 Asdale Dynamics, LLC'
);
check(
  license.includes('MIT License'),
  'LICENSE missing MIT License header'
);

// ---- README credits ----
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
check(
  readme.includes('Asdale Dynamics, LLC'),
  'README.md does not credit Asdale Dynamics, LLC'
);

// ---- No .github/workflows ----
check(
  !fs.existsSync(path.join(ROOT, '.github', 'workflows')),
  'Forbidden .github/workflows directory exists'
);

// ---- No secrets patterns ----
const secretPatterns = [
  /sk-[A-Za-z0-9]{20,}/,           // OpenAI-style keys
  /AKIA[0-9A-Z]{16}/,              // AWS access keys
  /-----BEGIN [A-Z ]+PRIVATE KEY-----/, // private keys
  /password\s*=\s*['"][^'"]{4,}/i, // password assignments
  /api[_-]?key\s*=\s*['"][^'"]{8,}/i,
];
const scanned = [];
for (const f of requiredFiles) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) scanned.push(p);
}
for (const f of scanned) {
  const content = fs.readFileSync(f, 'utf8');
  for (const re of secretPatterns) {
    if (re.test(content)) {
      errors.push(`Possible secret found in ${path.relative(ROOT, f)}`);
    }
  }
}

// ---- HTML link integrity ----
function extractHrefs(html) {
  const hrefs = [];
  const re = /href="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) hrefs.push(m[1]);
  return hrefs;
}

const htmlFiles = fs.readdirSync(path.join(ROOT, 'site')).filter(f => f.endsWith('.html'));
const templateFiles = fs.readdirSync(path.join(ROOT, 'site', 'templates')).filter(f => f.endsWith('.html'));
const allHtml = [...htmlFiles.map(f => 'site/' + f), ...templateFiles.map(f => 'site/templates/' + f)];

for (const f of allHtml) {
  const content = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const hrefs = extractHrefs(content);
  for (const h of hrefs) {
    if (h.startsWith('http') || h.startsWith('#') || h.startsWith('mailto:')) continue;
    // strip fragment/query
    const target = h.split('#')[0].split('?')[0];
    const resolved = path.normalize(path.join(path.dirname(f), target));
    const exists = fs.existsSync(path.join(ROOT, resolved));
    if (!exists) {
      errors.push(`Broken link in ${f}: ${h} (resolved to ${resolved})`);
    }
  }
}

// ---- Markdown link integrity within docs ----
function extractMdLinks(md) {
  const links = [];
  const re = /\[([^\]]*)\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(md)) !== null) links.push(m[2]);
  return links;
}

const docFiles = fs.readdirSync(path.join(ROOT, 'docs')).filter(f => f.endsWith('.md'));
for (const f of docFiles) {
  const content = fs.readFileSync(path.join(ROOT, 'docs', f), 'utf8');
  for (const l of extractMdLinks(content)) {
    if (l.startsWith('http') || l.startsWith('#') || l.startsWith('mailto:')) continue;
    const target = l.split('#')[0];
    const resolved = path.normalize(path.join('docs', target));
    if (!fs.existsSync(path.join(ROOT, resolved))) {
      errors.push(`Broken link in docs/${f}: ${l} (resolved to ${resolved})`);
    }
  }
}

// ---- Printable templates reference existing files ----
note(fs.existsSync(path.join(ROOT, 'site', 'templates', 'weekly-meal-plan.html')), 'Printable weekly meal planner missing');
note(fs.existsSync(path.join(ROOT, 'site', 'templates', 'grocery-list.html')), 'Printable grocery list missing');

// ---- Report ----
let failed = 0;
console.log('=== AI Meal Planning Guide — verification ===\n');

if (errors.length) {
  failed += errors.length;
  console.log(`ERRORS (${errors.length}):`);
  for (const e of errors) console.log(`  ✖ ${e}`);
  console.log('');
}

if (warnings.length) {
  console.log(`WARNINGS (${warnings.length}):`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
  console.log('');
}

if (failed === 0 && warnings.length === 0) {
  console.log('✔ All checks passed. No errors, no warnings.');
} else if (failed === 0) {
  console.log('✔ No errors. Warnings above are non-fatal.');
} else {
  console.log(`✖ ${failed} problem(s) found. Fix before committing.`);
}

process.exit(failed === 0 ? 0 : 1);
