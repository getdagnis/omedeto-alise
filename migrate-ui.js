import fs from 'fs';
import path from 'path';

const STARTER_SRC = 'agent/react-aria-starter/src';
const UI_DIR = 'src/components-ui';
const COMP_DIR = 'src/components';
const THEME_DIR = 'src/styles/ui-theme';

const ATOMICS = [
  'Button', 'Checkbox', 'CheckboxGroup', 'ColorArea', 'ColorField', 'ColorPicker', 'ColorSlider',
  'ColorSwatch', 'ColorSwatchPicker', 'ColorThumb', 'ColorWheel', 'ComboBox', 'DateField', 'DatePicker',
  'DateRangePicker', 'Form', 'InputGroup', 'Link', 'Meter', 'NumberField', 'ProgressBar', 'ProgressCircle',
  'RadioGroup', 'RangeCalendar', 'SearchField', 'SegmentedControl', 'Select', 'Slider', 'Switch', 'TagGroup',
  'TextField', 'TimeField', 'ToggleButton', 'ToggleButtonGroup', 'Tooltip', 'Toolbar', 'Content'
];

const STRUCTURALS = [
  'Breadcrumbs', 'Calendar', 'CommandPalette', 'Dialog', 'Disclosure', 'DisclosureGroup', 'DropZone',
  'GridList', 'ListBox', 'Menu', 'Modal', 'Popover', 'Separator', 'Sheet', 'Table', 'Tabs', 'Toast', 'Tree'
];

[UI_DIR, COMP_DIR, THEME_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }));

fs.copyFileSync(path.join(STARTER_SRC, 'theme.css'), path.join(THEME_DIR, 'theme.css'));
fs.copyFileSync(path.join(STARTER_SRC, 'utilities.css'), path.join(THEME_DIR, 'utilities.css'));

function convertCssToSass(css, destDir) {
  const relPath = path.relative(destDir, THEME_DIR);
  let sass = `@import "${relPath}/theme.css"\n@import "${relPath}/utilities.css"\n\n`;
  sass += css.replace(/;/g, '').replace(/\{/g, '').replace(/\}/g, '').split('\n').filter(l => l.trim() !== '').map(l => l.replace(/^\s+/, '  ')).join('\n');
  return sass;
}

function migrateComponent(name, isAtomic) {
  const destDir = isAtomic ? UI_DIR : COMP_DIR;
  const tsxPath = path.join(STARTER_SRC, `${name}.tsx`);
  const cssPath = path.join(STARTER_SRC, `${name}.css`);
  if (!fs.existsSync(tsxPath)) return;
  let tsx = fs.readFileSync(tsxPath, 'utf8');
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf8');
    fs.writeFileSync(path.join(destDir, `${name}.module.sass`), convertCssToSass(css, destDir));
    tsx = tsx.replace(new RegExp(`import './${name}.css';`, 'g'), `import styles from './${name}.module.sass';`);
    tsx = tsx.replace(/className="([^"]+)"/g, (match, classes) => {
      const parts = classes.split(' ').map(c => c.startsWith('react-aria-') ? `styles['${c}']` : `"${c}"`);
      return `className={\`${parts.map(p => p.startsWith('styles') ? `\${${p}}` : p.replace(/"/g, '')).join(' ')}\`}`;
    });
  }
  tsx = tsx.replace(/import \{([^}]+)\} from 'react-aria-components';/g, (match, imports) => {
    const parts = imports.split(',').map(i => i.trim());
    const types = parts.filter(p => p.endsWith('Props') || p.includes('Result') || p.endsWith('RenderProps'));
    const comps = parts.filter(p => !types.includes(p));
    let res = '';
    if (comps.length > 0) res += `import { ${comps.join(', ')} } from 'react-aria-components';\n`;
    if (types.length > 0) res += `import type { ${types.join(', ')} } from 'react-aria-components';`;
    return res.trim();
  });
  tsx = tsx.replace(/from '\.\/([^']+)'/g, (match, target) => {
    if (ATOMICS.includes(target)) return isAtomic ? match : `from '../components-ui/${target}'`;
    if (STRUCTURALS.includes(target)) return isAtomic ? `from '../components/${target}'` : match;
    return match;
  });
  tsx = tsx.replace(/'use client';\n/g, '').replace(/import React from 'react';\n/g, '');
  fs.writeFileSync(path.join(destDir, `${name}.tsx`), tsx);
}

ATOMICS.forEach(n => migrateComponent(n, true));
STRUCTURALS.forEach(n => migrateComponent(n, false));
console.log('Migration complete');
