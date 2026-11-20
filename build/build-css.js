// Generates assets/ieg.css and assets/pubs-theme.css from the ClientApp sources.
// Run from this folder: node build/build-css.js
// Needs ClientApp's node_modules (sass, postcss, @tailwindcss/postcss) to be installed.
const fs = require('fs');
const path = require('path');

const HERE = path.resolve(__dirname, '..');
const IEG = path.resolve(HERE, '../ClientApp');
const SRC = path.join(IEG, 'src');
const req = (m) => require(require.resolve(m, { paths: [IEG] }));
const sass = req('sass'), postcss = req('postcss'), tailwind = req('@tailwindcss/postcss');

const COMPONENTS = {
  'app-internal-main-layout': 'pages/main-layout/main-layout.scss',
  'app-sidebar': 'shared/sidebar/sidebar.scss',
  'app-header-utility-bar': 'shared/header-utility-bar/header-utility-bar.scss',
  'app-mobile-section-nav': 'shared/mobile-section-nav/mobile-section-nav.scss',
  'app-modal': 'shared/app-modal/app-modal.scss',
  'app-application-tabs': 'pages/external-user/shared/application-tabs/application-tabs.scss',
  'app-status-badge': 'pages/external-user/shared/status-badge/status-badge.scss',
  'app-table-pager': 'shared/table-pager/table-pager.scss',
  'app-toast': 'pages/external-user/shared/toast/toast.scss',
  'app-ui-checkbox': 'pages/external-user/shared/ui-checkbox/ui-checkbox.scss',
  'app-ui-select': 'pages/external-user/shared/ui-select/ui-select.scss',
  'app-ui-datepicker': 'pages/external-user/shared/ui-datepicker/ui-datepicker.scss',
  'app-select-control': 'shared/select-control/select-control.scss',
  'app-my-tasks': 'pages/internal-user/mytasks/my-tasks.scss',
  'app-approval-details-modal': 'pages/internal-user/mytasks/approval-details-modal.scss',
  'app-start-approval-modal': 'pages/internal-user/mytasks/start-approval-modal.scss',
  'app-task-reference-documents-modal': 'pages/internal-user/mytasks/start-approval-modal.scss',
  'app-approvers-picker-modal': 'pages/internal-user/mytasks/approvers-picker-modal.scss',
  'app-cancel-task-modal': 'pages/internal-user/mytasks/cancel-task-modal.scss',
  'app-complete-review-modal': 'pages/internal-user/assign/complete-review-modal.scss',
  'app-setup-review-modal': 'pages/internal-user/assign/setup-review-modal.scss',
  'app-select-documents-picker-modal': 'pages/internal-user/assign/select-documents-picker-modal.scss',
  'app-reference-documents-picker-modal': 'pages/internal-user/assign/reference-documents-picker-modal.scss',
  'app-validation-message-modal': 'shared/validation-message-modal/validation-message-modal.scss',
  'app-delete-confirm-modal': 'shared/delete-confirm-modal/delete-confirm-modal.scss',
  'app-alerts-panel': 'pages/external-user/shared/alerts-panel/alerts-panel.scss',
  'app-help-panel': 'pages/external-user/shared/help-panel/help-panel.scss',
};

// sass won't allow @use inside a nested block, so paste the file in instead
function inlineUses(file) {
  const dir = path.dirname(file);
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/^@use\s+'([^']+)'[^;]*;/gm, (_, rel) => {
    let target = path.resolve(dir, rel);
    if (!/\.scss$/.test(target)) target += '.scss';
    if (!fs.existsSync(target)) { const p = path.join(path.dirname(target), '_' + path.basename(target)); if (fs.existsSync(p)) target = p; }
    return `/* inlined ${rel} */\n` + inlineUses(target);
  });
}
// sass adds @charset to every chunk, which breaks once they're joined - keep only one at the top.
// also drop the empty `tag { }` blocks left over from comment-only wrappers
const compile = (scss) =>
  sass.compileString(scss, { loadPaths: [SRC, path.join(IEG, 'node_modules')], logger: sass.Logger.silent }).css
    .replace(/^@charset "UTF-8";\n?/m, '')
    .replace(/(^|\n)[^{}\n][^{}]*\{\s*(\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/\s*)*\}\n?/g, '$1');

// copy of deriveThemeCssVariables() from ClientApp theme-tokens.model.ts
const hexToRgb = (hex) => ({ r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) });
const rgbToHex = (r, g, b) => '#' + [r, g, b].map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')).join('');
const mixHex = (base, target, w) => { const f = hexToRgb(base), t = hexToRgb(target), k = Math.max(0, Math.min(1, w)); return rgbToHex(f.r + (t.r - f.r) * k, f.g + (t.g - f.g) * k, f.b + (t.b - f.b) * k); };
const lighten = (h, a) => mixHex(h, '#ffffff', a), darken = (h, a) => mixHex(h, '#000000', a);
const rgba = (h, a) => { const { r, g, b } = hexToRgb(h); return `rgba(${r}, ${g}, ${b}, ${a})`; };
function deriveThemeCssVariables(t) {
  const primary = t.primaryColor, accent = t.accentColor, lightTint = t.lightTint, navActive = t.navActiveColor, onPrimary = t.buttonTextColor, loginTint = t.loginSurfaceTint;
  const chip = t.chipColor, checkbox = t.checkboxColor, radio = t.radioColor, toggle = t.toggleColor;
  const primary500 = lighten(primary, 0.12), primary400 = lighten(primary, 0.28), primary700 = darken(primary, 0.14), primary100 = mixHex(lightTint, primary, 0.18);
  const chipLight = lighten(chip, 0.12), chipDeep = darken(chip, 0.2), checkboxLight = lighten(checkbox, 0.12), checkboxDeep = darken(checkbox, 0.18), toggleDeep = darken(toggle, 0.18);
  return {
    '--color-primary-50': lightTint, '--color-primary-100': primary100, '--color-primary-400': primary400, '--color-primary-500': primary500, '--color-primary-600': primary, '--color-primary-700': primary700, '--color-indigo-600': accent,
    '--theme-nav-active': navActive, '--theme-on-primary': onPrimary, '--theme-surface-tint': lightTint, '--theme-login-tint': loginTint,
    '--theme-brand-gradient': `linear-gradient(to bottom right, ${primary500}, ${accent})`,
    '--theme-btn-gradient': `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
    '--theme-login-background': `linear-gradient(165deg, ${rgba(loginTint, 0.97)} 0%, rgba(248, 250, 252, 0.92) 55%, rgba(255, 255, 255, 0.88) 100%)`,
    '--theme-glow-shadow': `0 2px 4px ${rgba(primary, 0.08)}, 0 6px 16px ${rgba(primary, 0.16)}, 0 12px 32px ${rgba(accent, 0.12)}`,
    '--theme-glow-shadow-hover': `0 4px 8px ${rgba(primary, 0.12)}, 0 8px 24px ${rgba(primary, 0.22)}, 0 16px 40px ${rgba(accent, 0.16)}`,
    '--theme-input-focus-ring': rgba(primary, 0.12), '--theme-input-focus-border': primary500, '--theme-input-hover-border': lighten(primary, 0.45),
    '--theme-ambient-orb-1': lighten(primary, 0.42), '--theme-ambient-orb-2': lighten(accent, 0.38), '--theme-ambient-orb-3': mixHex(lightTint, primary, 0.35),
    '--theme-nav-hover-bg': rgba('#ffffff', 0.5), '--theme-link-color': primary, '--theme-link-hover-color': primary700,
    '--theme-chip-color': chip, '--theme-chip-gradient': `linear-gradient(135deg, ${chipLight} 0%, ${chipDeep} 100%)`, '--theme-chip-gradient-hover': `linear-gradient(135deg, ${chip} 0%, ${darken(chip, 0.28)} 100%)`,
    '--theme-chip-shadow': `0 2px 4px ${rgba(chip, 0.08)}, 0 6px 16px ${rgba(chip, 0.16)}, 0 12px 32px ${rgba(chipDeep, 0.12)}`, '--theme-chip-shadow-hover': `0 2px 4px ${rgba(chip, 0.1)}, 0 6px 16px ${rgba(chip, 0.2)}, 0 12px 32px ${rgba(chipDeep, 0.14)}`, '--theme-chip-focus-ring': rgba(chip, 0.35),
    '--theme-checkbox-color': checkbox, '--theme-checkbox-gradient': `linear-gradient(to bottom right, ${checkboxLight}, ${checkboxDeep})`, '--theme-checkbox-gradient-alt': `linear-gradient(135deg, ${checkbox} 0%, ${checkboxDeep} 100%)`,
    '--theme-checkbox-shadow': `0 2px 10px ${rgba(checkbox, 0.38)}, inset 0 1px 0 rgba(255, 255, 255, 0.22)`, '--theme-checkbox-shadow-indeterminate': `0 2px 8px ${rgba(checkbox, 0.32)}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`, '--theme-checkbox-ring': rgba(checkbox, 0.45), '--theme-checkbox-focus-ring': rgba(checkbox, 0.18), '--theme-checkbox-label': darken(checkbox, 0.35),
    '--theme-radio-color': radio, '--theme-radio-color-hover': darken(radio, 0.12), '--theme-radio-shadow': `0 2px 8px ${rgba(radio, 0.18)}`, '--theme-radio-shadow-hover': `0 2px 10px ${rgba(radio, 0.24)}`, '--theme-radio-focus-ring': rgba(radio, 0.14),
    '--theme-toggle-color': toggle, '--theme-toggle-gradient': `linear-gradient(135deg, ${toggle} 0%, ${toggleDeep} 100%)`, '--theme-toggle-gradient-hover': `linear-gradient(135deg, ${darken(toggle, 0.1)} 0%, ${darken(toggle, 0.28)} 100%)`,
    '--theme-toggle-shadow': `inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 6px 14px -8px ${rgba(toggle, 0.7)}`, '--theme-toggle-focus-ring': rgba(toggle, 0.22), '--theme-toggle-label': darken(toggle, 0.28),
  };
}
// pubs colours (from publications _tokens.scss / tailwind config)
const PUBS_THEME = {
  primaryColor: '#d44a15',   // --sci-color-orange
  accentColor: '#f05a1e',    // gradient end
  lightTint: '#fff7ed',      // header wash
  navActiveColor: '#f2643b', // sidebar active
  buttonTextColor: '#ffffff',
  loginSurfaceTint: '#fff7ed',
  chipColor: '#d44a15',
  checkboxColor: '#d44a15',  // checkbox
  radioColor: '#d44a15',     // radio
  toggleColor: '#0f75bc',    // toggles stay blue in pubs
};

(async () => {
  // tailwind - reuse ClientApp's entry file but also scan this folder
  const tmp = path.join(__dirname, '.tmp'); fs.mkdirSync(tmp, { recursive: true });
  const entry = fs.readFileSync(path.join(SRC, 'tailwind.css'), 'utf8')
    .replace('@import "tailwindcss";', `@import "${path.join(IEG, 'node_modules/tailwindcss/index.css')}";`) // no node_modules here
    .replace('@source "./**/*.{html,ts}";', `@source "${SRC}/**/*.{html,ts}";\n@source "${HERE}/*.html";\n@source "${HERE}/assets/*.js";`);
  const entryPath = path.join(tmp, 'tailwind.css'); fs.writeFileSync(entryPath, entry);
  const tw = await postcss([tailwind({ base: IEG })]).process(entry, { from: entryPath });

  // global styles (primeicons not used here)
  const global = compile(fs.readFileSync(path.join(SRC, 'styles.scss'), 'utf8').replace(/@import\s+'primeicons[^;]*;/, ''));

  // component styles - :host becomes the element tag
  const comps = Object.entries(COMPONENTS).map(([tag, file]) => {
    const src = inlineUses(path.join(SRC, 'app', file))
      .replace(/:host-context\((.*)\)/g, '$1 &')   
      .replace(/:host\(([^)]*)\)/g, '&$1')
      .replace(/:host/g, '&')
      .replace(/::ng-deep/g, '');
    try { return `/* ${file} */\n` + compile(`${tag} {\n${src}\n}`); }
    catch (e) { throw new Error(`${file}: ${e.message.split('\n').slice(0, 6).join('\n')}`); }
  });

  fs.writeFileSync(path.join(HERE, 'assets/ieg.css'), ['@charset "UTF-8";', tw.css, '/* ---- src/styles.scss ---- */', global, ...comps].join('\n'));
  const vars = deriveThemeCssVariables(PUBS_THEME);
  fs.writeFileSync(path.join(HERE, 'assets/pubs-theme.css'),
    '/* generated by build/build-css.js, don\'t edit */\n:root {\n' +
    Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n') + '\n}\n');
  fs.copyFileSync(path.join(IEG, 'node_modules/lucide/dist/umd/lucide.min.js'), path.join(HERE, 'assets/lucide.min.js'));
  fs.rmSync(tmp, { recursive: true, force: true });
  for (const f of ['ieg.css', 'pubs-theme.css', 'lucide.min.js']) console.log(f, Math.round(fs.statSync(path.join(HERE, 'assets', f)).size / 1024) + ' KB');
})().catch((e) => { console.error(e); process.exit(1); });
