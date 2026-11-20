// Static version of the IEG My Tasks page.
// Markup/classes follow the Angular templates in ClientApp (internal-user/mytasks, main-layout)
// so ieg.css picks them up as-is. Colours come from pubs-theme.css + pubs-skin.css.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const icons = () => window.lucide && lucide.createIcons();
  const svgX = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m6 6 12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const USER = { name: 'Ananya Sharma', initials: 'AS' };

  // --- sample data (same fields as MyTaskRow / TaskItem) ---
  const PROGRAMS = [{ id: 'ist', label: 'Investigator Sponsored Trials' }, { id: 'grants', label: 'Grants' }, { id: 'eap', label: 'Expanded Access' }];
  const SHORT = { ist: 'IST', grants: 'Grants', eap: 'EAP' };
  const ROLES = [{ id: 'owner', label: 'Owner' }, { id: 'contributor', label: 'Contributor' }];
  const FILTERS = [{ id: 'open', label: 'Open' }, { id: 'closed', label: 'Closed' }, { id: 'cancelled', label: 'Cancelled' }];
  const PEOPLE = ['Dr. Rohit Verma', 'Dr. Priya Iyer', 'Dr. Robert Kim', 'Dr. Lisa Patel', 'Dr. Elena Vasquez', 'Dr. Arjun Mehta', 'Dr. Kavita Reddy'];
  const mail = (n) => n.replace(/^Dr\.\s*/, '').toLowerCase().replace(/\s+/g, '.') + '@demo-org.com';
  let seq = 0;
  const T = (program, role, code, title, type, app, end, status, myStatus = '', grantType = '', extra = {}) => ({
    id: String(++seq), program, role, code, title, type, applicationId: app, plannedEndDate: end, status, myStatus, grantType, hasPrivilege: true,
    owner: 'Ananya Sharma', description: `${type} of ${app} — ${title}.`, createdOn: '01-Nov-2026',
    documents: extra.documents || [{ name: 'Protocol_v3.docx', type: 'DOCX', done: status === 'Completed' }, { name: 'Budget_Summary.xlsx', type: 'XLSX', done: false }],
    users: extra.users || [
      { name: PEOPLE[0], status: 'Completed', start: '03-Nov-2026', end: '06-Nov-2026', approver: 'Approved', comments: 'Scientific merit is sound. Minor edits in section 4.2.' },
      { name: PEOPLE[1], status: 'InProgress', start: '04-Nov-2026', end: '', approver: 'Pending', comments: '' },
      { name: PEOPLE[2], status: 'Planned', start: '', end: '', approver: '', comments: '' },
    ],
    references: extra.references || [{ name: 'Review_Guidelines_2026.pdf' }],
  });
  const TASKS = [
    T('ist', 'owner', 'TSK-1041', 'Scientific Review — Oncology Outcomes', 'Review', 'DEMO-2026-008', '18-Nov-2026', 'InProgress'),
    T('ist', 'owner', 'TSK-1042', 'Medical Director Approval', 'Approval', 'IST-8843', '24-Nov-2026', 'Pending'),
    T('ist', 'owner', 'TSK-1043', 'Budget & Contract Review', 'Review', 'IST-8844', '20-Nov-2026', 'InProgress'),
    T('ist', 'owner', 'TSK-1044', 'Safety Committee Approval', 'Approval', 'IST-8851', '30-Nov-2026', 'Pending'),
    T('ist', 'owner', 'TSK-1045', 'Protocol Feasibility Review', 'Review', 'IST-8846', '20-Oct-2026', 'Completed'),
    T('ist', 'owner', 'TSK-1052', 'Site Qualification Approval', 'Approval', 'IST-8847', '28-Nov-2026', 'Pending'),
    T('ist', 'owner', 'TSK-1053', 'Statistical Analysis Plan Review', 'Review', 'IST-8848', '02-Dec-2026', 'InProgress'),
    T('ist', 'owner', 'TSK-1054', 'Publication Plan Review', 'Review', 'IST-8849', '05-Dec-2026', 'Pending'),
    T('ist', 'owner', 'TSK-1055', 'Data Sharing Approval', 'Approval', 'IST-8850', '08-Dec-2026', 'Completed'),
    T('ist', 'owner', 'TSK-1056', 'Investigator Brochure Review', 'Review', 'IST-8845', '10-Dec-2026', 'InProgress'),
    T('ist', 'owner', 'TSK-1057', 'Insurance Certificate Approval', 'Approval', 'IST-8842', '12-Dec-2026', 'Pending'),
    T('ist', 'owner', 'TSK-1058', 'Interim Report Review', 'Review', 'IST-8846', '15-Dec-2026', 'Pending'),
    T('ist', 'owner', 'TSK-1046', 'Legal Review', 'Review', 'IST-8850', '17-Oct-2026', 'Closed'),
    T('ist', 'owner', 'TSK-1049', 'Regulatory Approval', 'Approval', 'IST-8842', '15-Oct-2026', 'Cancelled'),
    T('ist', 'contributor', 'TSK-1047', 'Regional Medical Review', 'Review', 'IST-8842', '19-Nov-2026', 'InProgress', 'Planned'),
    T('ist', 'contributor', 'TSK-1048', 'Compliance Approval', 'Approval', 'IST-8847', '26-Nov-2026', 'InProgress', 'InProgress'),
    T('ist', 'contributor', 'TSK-1050', 'Site Evaluation Review', 'Review', 'IST-8851', '25-Oct-2026', 'Completed', 'Completed'),
    T('ist', 'contributor', 'TSK-1051', 'Feasibility Approval', 'Approval', 'IST-8844', '12-Oct-2026', 'Cancelled', 'Aborted'),
    T('grants', 'owner', 'TSK-2011', 'Grant Committee Review', 'Review', 'GRT-2026', '21-Nov-2026', 'InProgress', '', 'Continuing Medical Education'),
    T('grants', 'owner', 'TSK-2012', 'Finance Approval', 'Approval', 'GRT-2028', '27-Nov-2026', 'Pending', '', 'Sponsorship'),
    T('grants', 'owner', 'TSK-2013', 'Outcome Assessment Review', 'Review', 'GRT-2029', '29-Oct-2026', 'Completed', '', 'Charitable'),
    T('grants', 'owner', 'TSK-2015', 'Reconciliation Approval', 'Approval', 'GRT-2027', '05-Oct-2026', 'Closed', '', 'Continuing Medical Education'),
    T('grants', 'contributor', 'TSK-2014', 'Compliance Review', 'Review', 'GRT-2027', '22-Nov-2026', 'InProgress', 'InProgress', 'Continuing Medical Education'),
    T('eap', 'owner', 'TSK-3021', 'Medical Review — Rare Oncology Cohort', 'Review', 'EAP-9911', '17-Nov-2026', 'InProgress'),
    T('eap', 'owner', 'TSK-3022', 'Drug Supply Approval', 'Approval', 'EAP-9915', '28-Nov-2026', 'Pending'),
    T('eap', 'owner', 'TSK-3025', 'Treating Physician Approval', 'Approval', 'EAP-9913', '20-Oct-2026', 'Closed'),
    T('eap', 'contributor', 'TSK-3023', 'Regulatory Review', 'Review', 'EAP-9912', '23-Nov-2026', 'InProgress', 'Planned'),
    T('eap', 'contributor', 'TSK-3024', 'Ethics Committee Approval', 'Approval', 'EAP-9913', '25-Oct-2026', 'Completed', 'Completed'),
  ];
  const ALERTS = [
    { id: 1, kind: 'alerts', severity: 'warning', title: 'Task Overdue', applicationCode: 'IST-8843', applicationTitle: 'Hematology Phase 3 Extension Trial', eventName: 'Task Overdue', message: 'Planned end date has passed. Please update the task status.', timeLabel: '2 hours ago', read: false },
    { id: 2, kind: 'alerts', severity: 'warning', title: 'RFI Raised', applicationCode: 'DEMO-2026-008', applicationTitle: 'Systematic Review of Oncology Outcomes', eventName: 'RFI Raised', message: 'A request for information is awaiting your response.', timeLabel: 'Yesterday', read: false },
    { id: 3, kind: 'notifications', severity: 'info', title: 'New Message', applicationCode: 'EAP-9911', applicationTitle: 'Expanded Access: Rare Oncology Cohort', eventName: 'Correspondence', message: 'Dr. Ananya Sharma sent a new correspondence message.', timeLabel: 'Yesterday', read: false },
    { id: 4, kind: 'notifications', severity: 'success', title: 'Approval Completed', applicationCode: 'IST-8851', applicationTitle: 'Dermatology Psoriasis Registry Phase 1', eventName: 'Approval Completed', message: 'All approvers have completed their review.', timeLabel: '3 days ago', read: true },
  ];
  const HELP_LINKS = [
    { tone: 'ist', icon: 'flask-conical', title: 'IST Internal User Guide', subtitle: 'Investigator Sponsored Trials · reviews, approvals, milestones' },
    { tone: 'eap', icon: 'heart-pulse', title: 'EAP Internal User Guide', subtitle: 'Expanded Access Program · requests and study team' },
    { tone: 'grants', icon: 'hand-coins', title: 'Grants Internal User Guide', subtitle: 'CME, Sponsorship and Charitable grants' },
  ];

  // --- table columns, copied from my-tasks.model.ts ---
  const headerMin = (label) => Math.ceil(label.length * 7.5) + 44;
  const COLS = [
    { key: 'title', label: 'Task Title', cssClass: 'sticky-col-title', defaultWidth: 280, minWidth: 160 },
    { key: 'type', label: 'Task Type', defaultWidth: 120, minWidth: 100 },
    { key: 'applicationId', label: 'Application ID', defaultWidth: 160, minWidth: 130 },
    { key: 'grantType', label: 'GrantType', defaultWidth: 160, minWidth: 120 },
    { key: 'plannedEndDate', label: 'Planned End Date', defaultWidth: 150, minWidth: 130 },
    { key: 'status', label: 'Task Status', cssClass: 'col-status', defaultWidth: 158, minWidth: 148 },
    { key: 'myStatus', label: 'My Status', cssClass: 'col-status', defaultWidth: 140, minWidth: 120 },
    { key: 'details', label: 'Task Details', cssClass: 'col-center', defaultWidth: 110, minWidth: 100, sortable: false },
    { key: 'action', label: 'Actions', cssClass: 'sticky-col-action', defaultWidth: 100, minWidth: 88, resizeEdge: 'left', sortable: false },
  ].map((c) => ({ ...c, minWidth: Math.max(c.minWidth, headerMin(c.label)), defaultWidth: Math.max(c.defaultWidth, headerMin(c.label)) }));
  const widths = Object.fromEntries(COLS.map((c) => [c.key, c.defaultWidth]));
  const badgeCode = (s) => { s = (s || '').toLowerCase(); return s === 'pending' || s === 'planned' ? 'warning' : s === 'inprogress' ? 'info' : ['completed', 'complete', 'closed'].includes(s) ? 'success' : ['cancelled', 'deleted', 'aborted'].includes(s) ? 'neutral' : 'neutral'; };
  const badge = (label) => `<app-status-badge><span class="inline-flex shrink-0 whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-bold border pubs-chip--${badgeCode(label)}">${esc(label)}</span></app-status-badge>`;
  // same rules as getTaskActionMenuItems()
  function actionItems(t) {
    const noun = t.type === 'Approval' ? 'Approval' : 'Review';
    if (t.role === 'owner') {
      switch (t.status) {
        case 'Closed': case 'Cancelled': case 'Deleted': return [{ id: 'view', label: 'View' }];
        case 'Pending': return [{ id: 'change-owner', label: 'Change Owner' }, { id: 'start', label: `Start ${noun}` }, { id: 'edit', label: 'Edit' }, { id: 'delete', label: 'Delete' }, { id: 'view', label: 'View' }];
        case 'InProgress': return [{ id: 'change-owner', label: 'Change Owner' }, { id: 'edit', label: 'Edit' }, { id: 'cancel', label: 'Cancel' }, { id: 'view', label: 'View' }];
        case 'Completed': return [{ id: 'change-owner', label: 'Change Owner' }, { id: 'close', label: 'Close' }, { id: 'view', label: 'View' }];
        default: return [];
      }
    }
    let items = [];
    if (t.myStatus === 'Planned' && t.hasPrivilege) items = [{ id: 'view-application', label: 'View Application' }, { id: 'contributor-start', label: `Start ${noun}` }];
    if (t.myStatus === 'InProgress' && t.hasPrivilege) items = [{ id: 'view-application', label: 'View Application' }, { id: 'update', label: `Update ${noun}` }, { id: 'complete', label: `Complete ${noun}` }];
    if (t.myStatus === 'Completed' && t.hasPrivilege) items = [{ id: 'view', label: 'View' }];
    if (t.myStatus === 'Aborted' || t.status === 'Cancelled' || t.status === 'Closed' || !t.hasPrivilege) items = [{ id: 'view-application', label: 'View Application' }];
    return items;
  }
  const ACTION_SVG = {
    'change-owner': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    start: '<polygon points="6 3 20 12 6 21 6 3"/>', 'contributor-start': '<polygon points="6 3 20 12 6 21 6 3"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>', update: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    complete: '<path d="M20 6 9 17l-5-5"/>', close: '<path d="M20 6 9 17l-5-5"/>',
    delete: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
    cancel: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    'view-application': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/>',
    view: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  };

  const state = { program: 'ist', role: 'owner', filter: 'open', page: 1, pageSize: 10, sortKey: null, sortDir: null, loading: true, menu: null };
  const OPEN = ['Pending', 'InProgress', 'Completed'];
  const inFilter = (t, f) => (f === 'open' ? OPEN.includes(t.status) : f === 'closed' ? t.status === 'Closed' : ['Cancelled', 'Deleted'].includes(t.status));
  const scoped = () => TASKS.filter((t) => t.program === state.program && t.role === state.role);
  const columns = () => COLS.filter((c) => (c.key !== 'myStatus' || state.role === 'contributor') && (c.key !== 'grantType' || state.program === 'grants'));
  function rows() {
    let list = scoped().filter((t) => inFilter(t, state.filter));
    if (state.sortKey && state.sortDir) { const k = state.sortKey, d = state.sortDir === 'asc' ? 1 : -1; list = [...list].sort((a, b) => String(a[k]).localeCompare(String(b[k])) * d); }
    return list;
  }

  // --- toast ---
  const TOAST = { success: ['border-l-emerald-500', 'bg-emerald-50 text-emerald-500', 'check-circle-2'], warning: ['border-l-amber-500', 'bg-amber-50 text-amber-500', 'triangle-alert'], error: ['border-l-red-500', 'bg-red-50 text-red-500', 'circle-x'], info: ['border-l-primary-500', 'bg-primary-50 text-primary-500', 'info'] };
  function toast(type, title, message, ms = 4200) {
    const [border, tone, icon] = TOAST[type] || TOAST.info;
    const t = el(`
      <div class="toast glass-panel pointer-events-auto px-4 py-3.5 rounded-xl shadow-glass flex items-center gap-3 border-l-4 bg-white/90 ${border}">
        <div class="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tone}">
          <svg class="absolute inset-0 w-full h-full pointer-events-none p-0.5" viewBox="0 0 36 36" aria-hidden="true">
            <rect x="1" y="1" width="34" height="34" rx="11" ry="11" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.15"/>
            <rect class="toast-progress" x="1" y="1" width="34" height="34" rx="11" ry="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" pathLength="100" stroke-dasharray="100" style="animation-duration:${ms}ms"/>
          </svg>
          <i data-lucide="${icon}" class="relative z-10 w-5 h-5"></i>
        </div>
        <div class="flex-1 min-w-0 self-center">${title ? `<h4 class="text-sm font-black text-slate-900">${esc(title)}</h4>` : ''}<p class="text-sm text-slate-800 whitespace-pre-line ${title ? 'font-medium' : 'font-bold'}">${esc(message)}</p></div>
        <button type="button" class="shrink-0 self-center -mr-1.5 inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" aria-label="Dismiss toast"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      </div>`);
    const bar = $('.toast-progress', t), hide = () => { t.classList.add('hide'); setTimeout(() => t.remove(), 400); };
    t.onmouseenter = () => (bar.style.animationPlayState = 'paused'); t.onmouseleave = () => (bar.style.animationPlayState = 'running');
    bar.addEventListener('animationend', hide); $('button', t).onclick = hide;
    $('#toast-stack').append(t); icons();
  }
  const preview = (what) => toast('info', what, 'This screen is outside the design preview (My Tasks only).');

  // --- app-modal ---
  const modalHost = () => $('#modal-host');
  function appModal({ host = 'app-modal-host', size = 'lg', title = '', titleHtml = '', subtitleHtml = '', actionsHtml = '', bodyHtml = '', stacked = false, showClose = true, panelClass = '', closeOnBackdrop = true, onClose, parent }) {
    const wrap = document.createElement(host);
    wrap.innerHTML = `
      <app-modal><div class="app-modal-overlay ${stacked ? 'app-modal-overlay--stacked' : ''}">
        <div class="app-modal-backdrop"></div>
        <div class="app-modal-panel app-modal-panel--${size} ${panelClass}" role="dialog" aria-modal="true">
          <div class="app-modal-header">
            <div class="app-modal-header-text">${titleHtml}${title ? `<h2 class="app-modal-title">${esc(title)}</h2>` : ''}${subtitleHtml}</div>
            <div class="app-modal-header-actions">${actionsHtml}${showClose ? `<button type="button" class="app-modal-btn app-modal-btn--icon" aria-label="Close" data-modal-close>${svgX}</button>` : ''}</div>
          </div>
          <div class="app-modal-body">${bodyHtml}</div>
        </div>
      </div></app-modal>`;
    (parent || modalHost()).append(wrap);
    const overlay = $('.app-modal-overlay', wrap), panel = $('.app-modal-panel', wrap);
    requestAnimationFrame(() => requestAnimationFrame(() => { overlay.classList.add('app-modal-overlay--in'); panel.classList.add('app-modal-panel--in'); }));
    let closed = false;
    const close = () => { if (closed) return; closed = true; overlay.classList.add('app-modal-overlay--out'); panel.classList.add('app-modal-panel--out'); setTimeout(() => wrap.remove(), 320); document.removeEventListener('keydown', key); onClose && onClose(); };
    const key = (e) => { if (e.key === 'Escape' && closeOnBackdrop) close(); };
    document.addEventListener('keydown', key);
    $('.app-modal-backdrop', wrap).onclick = () => closeOnBackdrop && close();
    $$('[data-modal-close]', wrap).forEach((b) => (b.onclick = close));
    icons();
    return { el: wrap, panel, close };
  }
  // the few modals that build their own shell instead of using app-modal
  function motionModal(host, panelClasses, headerHtml, bodyHtml, { maxWidth = 'max-w-4xl', z = 'z-[4100]' } = {}) {
    const wrap = document.createElement(host);
    wrap.innerHTML = `
      <div class="fixed inset-0 ${z} flex items-end md:items-center justify-center modal-shell--motion">
        <div class="absolute inset-0 modal-overlay" data-backdrop></div>
        <div class="${panelClasses} relative modal-panel modal-panel--motion rounded-t-3xl md:rounded-[2rem] w-full ${maxWidth} md:mx-4 shadow-glass-lg" role="dialog" aria-modal="true">
          ${headerHtml}${bodyHtml}
        </div>
      </div>`;
    modalHost().append(wrap);
    const shell = wrap.firstElementChild, panel = $('.modal-panel', wrap);
    requestAnimationFrame(() => requestAnimationFrame(() => { shell.classList.add('modal-shell--in'); panel.classList.add('modal-panel--in'); }));
    const close = () => { shell.classList.remove('modal-shell--in'); shell.classList.add('modal-shell--out'); panel.classList.add('modal-panel--out'); setTimeout(() => wrap.remove(), 320); document.removeEventListener('keydown', key); };
    const key = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', key);
    $('[data-backdrop]', wrap).onclick = close;
    $$('[data-modal-close]', wrap).forEach((b) => (b.onclick = close));
    icons();
    return { el: wrap, panel, close };
  }
  const closeIconBtn = '<button type="button" class="app-modal-btn app-modal-btn--icon cursor-pointer" aria-label="Close" data-modal-close>' + svgX + '</button>';

  // resolves true/false
  const confirmDialog = ({ heading = 'Confirmation', message, proceedLabel = 'Confirm', terminateLabel = 'Cancel' }) => new Promise((resolve) => {
    const m = appModal({ host: 'app-task-confirm-modal', size: 'sm', stacked: true, showClose: false, closeOnBackdrop: false, title: heading,
      actionsHtml: `<div class="flex items-center gap-2"><button type="button" class="app-modal-btn app-modal-btn--primary cursor-pointer" data-ok>${esc(proceedLabel)}</button><button type="button" class="app-modal-btn cursor-pointer" data-no>${esc(terminateLabel)}</button></div>`,
      bodyHtml: `<p class="text-sm font-medium text-slate-600 leading-relaxed">${esc(message)}</p>` });
    $('[data-ok]', m.el).onclick = () => { m.close(); resolve(true); };
    $('[data-no]', m.el).onclick = () => { m.close(); resolve(false); };
  });
  // validation popup
  function validation(messages) {
    appModal({ host: 'app-validation-message-modal', size: 'sm', stacked: true, showClose: false, panelClass: 'validation-modal',
      titleHtml: `<span class="validation-modal__title"><span class="validation-modal__icon" aria-hidden="true"><i data-lucide="triangle-alert"></i></span><span>Validation Message(s)</span></span>`,
      actionsHtml: `<button type="button" class="btn-gradient rounded-xl px-5 py-2.5 text-sm font-bold shadow-glow-primary" data-modal-close>Ok</button>`,
      bodyHtml: `<div class="validation-modal__body" role="alert">${messages.length > 1 ? `<ul class="validation-modal__list">${messages.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>` : `<p class="validation-modal__single">${esc(messages[0])}</p>`}</div>` });
  }
  // delete confirm
  const deleteConfirm = ({ title, message, itemName, confirmLabel = 'Delete' }) => new Promise((resolve) => {
    const wrap = el(`<app-delete-confirm-modal><div class="delete-modal-overlay" role="dialog" aria-modal="true"><div class="delete-modal-card">
        <div class="delete-modal-header">
          <div class="delete-icon-badge" aria-hidden="true"><svg class="delete-trash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></div>
          <h2 class="delete-modal-title">${esc(title)}</h2>
          <button type="button" class="delete-modal-close" aria-label="Close" data-no>${svgX}</button>
        </div>
        <div class="delete-modal-body"><p class="delete-modal-subtitle">${esc(message)}</p>${itemName ? `<div class="delete-item-chip-wrapper"><span class="delete-item-chip">${esc(itemName)}</span></div>` : ''}</div>
        <footer class="delete-modal-footer"><button type="button" class="delete-btn-confirm" data-ok><span>${esc(confirmLabel)}</span></button></footer>
      </div></div></app-delete-confirm-modal>`);
    modalHost().append(wrap);
    const done = (v) => { wrap.remove(); resolve(v); };
    $('[data-ok]', wrap).onclick = () => done(true); $('[data-no]', wrap).onclick = () => done(false);
    $('.delete-modal-overlay', wrap).onclick = (e) => { if (e.target === e.currentTarget) done(false); };
  });

  // --- form controls ---
  const uiCheckbox = (checked, attrs = '') => `<app-ui-checkbox><span class="ui-checkbox ${checked ? 'ui-checkbox--checked' : ''}"><input type="checkbox" class="ui-checkbox__input" ${checked ? 'checked' : ''} ${attrs}/><span class="ui-checkbox__mark" aria-hidden="true"><span class="ui-checkbox__ring"></span><span class="ui-checkbox__box"><svg class="ui-checkbox__check" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path class="ui-checkbox__check-path" d="M2.5 6.5 4.8 8.8 9.5 3.2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="ui-checkbox__dash"></span></span></span></span></app-ui-checkbox>`;
  document.addEventListener('change', (e) => { if (e.target.matches('.ui-checkbox__input')) e.target.closest('.ui-checkbox').classList.toggle('ui-checkbox--checked', e.target.checked); });
  // single select only, multi isn't needed on this page
  const selectControl = (name, options, value, { placeholder = 'Select', disabled = false } = {}) => `
    <app-select-control><div class="select-control select-control-full ${disabled ? 'select-control-disabled' : ''}" data-select="${name}" data-value="${esc(value || '')}">
      <button type="button" class="select-control-trigger" ${disabled ? 'disabled' : ''} aria-haspopup="listbox" aria-expanded="false">
        <span class="select-control-value ${value ? '' : 'select-control-placeholder'}">${esc(value || placeholder)}</span>
        <i data-lucide="chevron-down" class="select-control-chevron"></i>
      </button>
      <template>${options.map((o) => `<button type="button" class="select-control-option" role="option" data-value="${esc(o)}"><span class="select-control-option-label">${esc(o)}</span></button>`).join('')}</template>
    </div></app-select-control>`;
  let openPanel = null;
  const closePanel = () => { if (!openPanel) return; openPanel.panel.remove(); openPanel.root.classList.remove('select-control-open', 'ui-datepicker--open'); openPanel = null; };
  document.addEventListener('mousedown', (e) => { if (openPanel && !openPanel.panel.contains(e.target) && !openPanel.root.contains(e.target)) closePanel(); });
  document.addEventListener('click', (e) => {
    const trig = e.target.closest('.select-control-trigger');
    if (trig && !trig.disabled) {
      const root = trig.closest('.select-control');
      if (openPanel?.root === root) return closePanel();
      closePanel();
      const r = trig.getBoundingClientRect();
      const panel = el(`<app-select-control><div class="select-control-panel select-control-panel-floating" role="listbox" style="position:fixed;top:${r.bottom + 6}px;left:${r.left}px;width:${r.width}px;z-index:12050"><div class="select-control-options">${root.querySelector('template').innerHTML}</div></div></app-select-control>`);
      document.body.append(panel);
      $$('.select-control-option', panel).forEach((o) => o.classList.toggle('select-control-option-active', o.dataset.value === root.dataset.value));
      panel.onclick = (ev) => { const o = ev.target.closest('.select-control-option'); if (!o) return; root.dataset.value = o.dataset.value; const v = $('.select-control-value', root); v.textContent = o.dataset.value; v.classList.remove('select-control-placeholder'); closePanel(); root.dispatchEvent(new CustomEvent('change', { bubbles: true })); };
      root.classList.add('select-control-open'); openPanel = { root, panel };
      return;
    }
    const dt = e.target.closest('.ui-datepicker__trigger');
    if (dt && !dt.disabled) {
      const root = dt.closest('.ui-datepicker');
      if (openPanel?.root === root) return closePanel();
      closePanel();
      const r = dt.getBoundingClientRect();
      const panel = el(`<app-ui-datepicker><div class="ui-datepicker__popup" style="position:fixed;top:${r.bottom + 6}px;left:${r.left}px;z-index:12050"></div></app-ui-datepicker>`);
      document.body.append(panel);
      let [y, mo] = (root.dataset.value || '2026-11-24').split('-').map(Number); mo -= 1;
      const draw = () => {
        const first = new Date(y, mo, 1), days = new Date(y, mo + 1, 0).getDate(), lead = (first.getDay() + 6) % 7, sel = root.dataset.value, today = '2026-11-14';
        const cell = (d) => { const iso = `${y}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`; return `<button type="button" class="ui-datepicker__cell ${iso === sel ? 'ui-datepicker__cell--selected' : iso === today ? 'ui-datepicker__cell--today' : 'ui-datepicker__cell--available'}" data-iso="${iso}">${d}</button>`; };
        $('.ui-datepicker__popup', panel).innerHTML = `
          <div class="ui-datepicker__header"><button type="button" class="ui-datepicker__nav" data-nav="-1"><i data-lucide="chevron-left" class="w-4 h-4"></i></button><div class="ui-datepicker__title">${first.toLocaleString('en', { month: 'long' })} ${y}</div><button type="button" class="ui-datepicker__nav" data-nav="1"><i data-lucide="chevron-right" class="w-4 h-4"></i></button></div>
          <div class="ui-datepicker__body"><div class="ui-datepicker__weekdays">${['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => `<span>${d}</span>`).join('')}</div>
          <div class="ui-datepicker__grid">${'<span class="ui-datepicker__cell ui-datepicker__cell--empty"></span>'.repeat(lead)}${Array.from({ length: days }, (_, i) => cell(i + 1)).join('')}</div></div>`;
        icons();
      };
      panel.onclick = (ev) => {
        const n = ev.target.closest('[data-nav]'); if (n) { mo += +n.dataset.nav; if (mo < 0) { mo = 11; y--; } if (mo > 11) { mo = 0; y++; } return draw(); }
        const c = ev.target.closest('[data-iso]'); if (!c) return;
        root.dataset.value = c.dataset.iso; const d = new Date(c.dataset.iso);
        $('.ui-datepicker__trigger span', root).textContent = `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en', { month: 'short' })}-${d.getFullYear()}`;
        $('.ui-datepicker__trigger span', root).classList.remove('ui-datepicker__placeholder'); closePanel();
      };
      draw(); root.classList.add('ui-datepicker--open'); openPanel = { root, panel };
    }
  });
  const datepicker = (name, value, { disabled = false } = {}) => `<app-ui-datepicker><div class="app-ui-datepicker"><div class="ui-datepicker ${disabled ? 'ui-datepicker--disabled' : ''}" data-datepicker="${name}" data-value="${value || ''}"><div class="ui-datepicker__control"><button type="button" class="ui-datepicker__trigger" ${disabled ? 'disabled' : ''}><span class="${value ? '' : 'ui-datepicker__placeholder'}">${value ? fmt(value) : 'Select date'}</span><i data-lucide="calendar" class="ui-datepicker__icon"></i></button></div></div></div></app-ui-datepicker>`;
  const fmt = (iso) => { const d = new Date(iso); return `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en', { month: 'short' })}-${d.getFullYear()}`; };
  const toIso = (s) => { const d = new Date(s.replace(/-/g, ' ')); return isNaN(d) ? '' : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

  // --- pickers ---
  const svgSearch = '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>';
  const markHtml = (p) => `<span class="${p}-mark" aria-hidden="true"><span class="${p}-mark-ring"></span><span class="${p}-mark-box"><svg class="${p}-check" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path class="${p}-check-path" d="M2.5 6.5 4.8 8.8 9.5 3.2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="${p}-dash"></span></span></span>`;
  // approvers + documents pickers have the same markup, only the class prefix changes
  function picker({ host, prefix, heading, items, selected = [], emptyTitle, onConfirm, requireSelection = true }) {
    const sel = new Set(selected); let q = '';
    const m = motionModal(host, `${prefix}-panel`, `
      <div class="${prefix}-header modal-panel-header px-5 md:px-6 py-4 md:py-5"><div class="flex items-center justify-between gap-3">
        <h2 class="text-lg md:text-xl font-extrabold text-slate-800 tracking-tight">${esc(heading)}</h2>
        <div class="flex items-center gap-2 shrink-0"><button type="button" class="btn-gradient px-4 py-2 rounded-xl text-sm font-bold shadow-glow-primary cursor-pointer" data-ok>Ok</button>${closeIconBtn}</div>
      </div></div>
      <div class="${prefix}-body modal-scroll-body p-4 md:p-5">
        <div class="${prefix}-toolbar">
          <button type="button" class="${prefix}-select-all" data-all>${markHtml(prefix)}<span class="${prefix}-select-all-label">Select all</span></button>
          <div class="${prefix}-search"><svg class="${prefix}-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svgSearch}</svg><input type="text" class="${prefix}-search-input" placeholder="Search..." data-q/></div>
        </div>
        <div class="${prefix}-list" data-list></div>
      </div>`, '', { maxWidth: 'max-w-md' });
    const draw = () => {
      const list = items.filter((i) => i.toLowerCase().includes(q.toLowerCase()));
      $('[data-list]', m.el).innerHTML = list.map((i) => `<label class="${prefix}-option">${uiCheckbox(sel.has(i), `data-item="${esc(i)}"`)}<span class="${prefix}-label">${esc(i)}</span></label>`).join('') ||
        `<div class="${prefix}-empty"><div class="${prefix}-empty__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path></svg></div><h3 class="${prefix}-empty__title">${esc(emptyTitle)}</h3><p class="${prefix}-empty__text">Try a different keyword or clear the search field.</p></div>`;
      const all = list.length && list.every((i) => sel.has(i)), some = list.some((i) => sel.has(i));
      const mark = $('[data-all] .' + prefix + '-mark', m.el); mark.classList.toggle(prefix + '-mark-on', !!all); mark.classList.toggle(prefix + '-mark-indeterminate', some && !all);
      $('[data-all]', m.el).classList.toggle(prefix + '-select-all-on', !!all);
      $('[data-ok]', m.el).disabled = requireSelection && !sel.size; $('[data-ok]', m.el).classList.toggle('opacity-50', requireSelection && !sel.size);
    };
    $('[data-q]', m.el).oninput = (e) => { q = e.target.value; draw(); };
    $('[data-all]', m.el).onclick = () => { const list = items.filter((i) => i.toLowerCase().includes(q.toLowerCase())); const all = list.every((i) => sel.has(i)); list.forEach((i) => (all ? sel.delete(i) : sel.add(i))); draw(); };
    m.el.addEventListener('change', (e) => { const i = e.target.dataset.item; if (i) { e.target.checked ? sel.add(i) : sel.delete(i); draw(); } });
    $('[data-ok]', m.el).onclick = () => { m.close(); onConfirm([...sel]); };
    draw();
  }

  // --- task modals ---
  // task details
  function openDetails(t) {
    const isApproval = t.type === 'Approval', noun = isApproval ? 'Approval' : 'Review', people = isApproval ? 'Approvers' : 'Reviewers';
    const mailIcon = (email) => `<span class="approval-user-mail" title="${esc(email)}" aria-hidden="true"><svg class="approval-inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span>`;
    const contributor = t.role === 'contributor';
    const peopleSection = contributor ? `
      <section class="approval-section"><h3 class="approval-section-title">My ${noun} Details</h3><div class="approval-table-wrap"><table class="approval-table approval-table--contributor-mine">
        <thead><tr><th class="approval-th">Document</th><th class="approval-th">My Status</th><th class="approval-th">Actual Start Date</th><th class="approval-th">Actual End Date</th></tr></thead>
        <tbody>${t.documents.map((d) => `<tr><td class="approval-td"><span class="approval-user" title="${esc(d.name)}">${esc(d.name)}</span></td><td class="approval-td approval-td-status">${esc(t.myStatus)}</td><td class="approval-td">${t.myStatus === 'Planned' ? '' : '04-Nov-2026'}</td><td class="approval-td">${t.myStatus === 'Completed' ? '09-Nov-2026' : ''}</td></tr>`).join('')}</tbody>
      </table></div></section>` : `
      <section class="approval-section"><h3 class="approval-section-title">${people}</h3><div class="approval-table-wrap"><table class="approval-table">
        <thead><tr><th class="approval-th">User Name</th><th class="approval-th approval-th-status">Status</th><th class="approval-th approval-th-actions"><span class="sr-only">Actions</span></th></tr></thead>
        <tbody>${t.users.map((u, i) => `<tr><td class="approval-td"><span class="approval-user">${esc(u.name)}</span>${mailIcon(mail(u.name))}</td><td class="approval-td approval-td-status">${esc(u.status)}</td>
          <td class="approval-td approval-td-actions">${u.status !== 'Completed' && OPEN.includes(t.status) ? `<div class="approval-action-menu-root"><button type="button" class="approval-icon-btn approval-action-trigger cursor-pointer" aria-label="${people} actions" data-user-menu="${i}"><svg class="approval-action-trigger-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="6" r="1.75"/><circle cx="12" cy="12" r="1.75"/><circle cx="12" cy="18" r="1.75"/></svg></button></div>` : ''}</td></tr>`).join('')}</tbody>
      </table></div></section>`;
    const docSections = t.documents.map((d, di) => `
      <section class="approval-section">
        <div class="flex items-center justify-between gap-3"><h3 class="approval-doc-title">${esc(d.name)}</h3><div class="flex items-center gap-1 shrink-0">
          <button type="button" class="approval-icon-btn cursor-pointer" aria-label="Preview Document" title="Preview Document" data-preview="${esc(d.name)}"><svg class="approval-inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg></button>
          <button type="button" class="approval-icon-btn cursor-pointer" aria-label="Download document" title="Download" data-download="${esc(d.name)}"><svg class="approval-inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path></svg></button>
        </div></div>
        <div class="approval-table-wrap ${isApproval ? 'approval-table-wrap-wide' : ''}"><table class="approval-table ${isApproval ? 'approval-table-wide' : ''}">
          <thead><tr><th class="approval-th">User Name</th><th class="approval-th approval-th-status">Status</th><th class="approval-th">Actual Start Date</th><th class="approval-th">Actual End Date</th>${isApproval ? '<th class="approval-th">Approver Status</th><th class="approval-th approval-th-comments">Comments</th>' : ''}</tr></thead>
          <tbody>${t.users.map((u, ui) => `<tr><td class="approval-td"><span class="approval-user">${esc(u.name)}</span>${mailIcon(mail(u.name))}</td><td class="approval-td approval-td-status">${esc(u.status)}</td><td class="approval-td">${esc(u.start)}</td><td class="approval-td">${esc(u.end)}</td>
            ${isApproval ? `<td class="approval-td">${esc(u.approver || '—')}</td><td class="approval-td approval-td-comments"><button type="button" class="approval-icon-btn approval-comment-btn cursor-pointer ${u.comments ? 'approval-comment-btn-active' : ''}" aria-label="View Comments" title="View Comments" data-comment="${di}:${ui}"><svg class="approval-inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></button></td>` : ''}</tr>`).join('')}</tbody>
        </table></div>
      </section>`).join('');
    const m = motionModal('app-approval-details-modal', 'approval-modal-dialog', `
      <div class="approval-modal-header modal-panel-header px-6 md:px-8 py-5 md:py-6"><div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 class="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">${noun} Details — ${esc(t.code)}</h2>
        <div class="flex items-center gap-3 shrink-0">${!contributor && OPEN.includes(t.status) ? '<button type="button" class="btn-gradient px-5 py-2.5 rounded-xl text-sm font-bold shadow-glow-primary cursor-pointer" data-save>Save</button>' : ''}${closeIconBtn}</div>
      </div></div>`, `<div class="approval-modal-body modal-scroll-body p-6 md:p-8">${peopleSection}${docSections}</div>`);
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.save !== undefined) { m.close(); toast('success', 'Details saved', `${t.code} updated.`); }
      else if (b.dataset.preview) preview(`Preview: ${b.dataset.preview}`);
      else if (b.dataset.download) toast('info', 'Download started', b.dataset.download);
      else if (b.dataset.userMenu) openApproverMenu(b, t, +b.dataset.userMenu, () => { m.close(); openDetails(t); });
      else if (b.dataset.comment) { const [di, ui] = b.dataset.comment.split(':').map(Number); openComment(m.el, t, t.documents[di], t.users[ui]); }
    });
  }
  function openApproverMenu(anchor, t, idx, refresh) {
    $('.approval-action-panel', anchor.closest('tr'))?.remove();
    const panel = el(`<div class="approval-action-panel" role="menu"><button type="button" class="approval-action-item cursor-pointer" role="menuitem">Abort</button></div>`);
    anchor.classList.add('approval-action-trigger-active'); anchor.parentElement.append(panel);
    const off = (e) => { if (!panel.contains(e.target) && e.target !== anchor) { panel.remove(); anchor.classList.remove('approval-action-trigger-active'); document.removeEventListener('mousedown', off, true); } };
    setTimeout(() => document.addEventListener('mousedown', off, true));
    $('button', panel).onclick = async () => { panel.remove(); document.removeEventListener('mousedown', off, true); if (await confirmDialog({ message: `Abort ${t.users[idx].name}'s ${t.type.toLowerCase()} on ${t.code}?`, proceedLabel: 'Abort' })) { t.users[idx].status = 'Aborted'; toast('warning', 'Approver aborted', `${t.users[idx].name} was removed from ${t.code}.`); refresh(); } };
  }
  function openComment(root, t, doc, user) {
    const pop = el(`<div class="approval-comment-overlay" role="presentation"><button type="button" class="approval-comment-backdrop cursor-pointer" aria-label="Close comments" data-x></button>
      <div class="approval-comment-popup" role="dialog" aria-modal="true">
        <div class="approval-comment-header"><div class="approval-comment-header-top"><div class="min-w-0"><p class="approval-comment-kicker">${t.type} comments</p><h3 class="approval-comment-title">${esc(user.name)}</h3></div>
          <div class="approval-comment-actions"><button type="button" class="approval-comment-copy cursor-pointer ${user.comments ? 'approval-comment-copy-active' : 'approval-comment-copy-idle'}" aria-label="Copy comment" data-copy><svg class="approval-comment-copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button><button type="button" class="approval-comment-close cursor-pointer" aria-label="Close" data-x>${svgX}</button></div></div>
          <p class="approval-comment-subtitle">${esc(doc.name)}</p></div>
        <div class="approval-comment-body">${user.comments ? `<p class="approval-comment-text">${esc(user.comments)}</p>` : `<p class="approval-comment-empty">No ${t.type.toLowerCase()} comments available.</p>`}</div>
      </div></div>`);
    root.append(pop);
    $$('[data-x]', pop).forEach((b) => (b.onclick = () => pop.remove()));
    $('[data-copy]', pop).onclick = (e) => { if (!user.comments) return; navigator.clipboard?.writeText(user.comments); e.currentTarget.classList.add('approval-comment-copy-success'); toast('success', 'Copied', 'Comment copied to clipboard.'); };
  }

  // edit / view / change owner all use the setup modal
  function openSetup(t, mode) {
    const noun = t.type === 'Approval' ? 'Approval' : 'Review', people = t.type === 'Approval' ? 'Approvers' : 'Reviewers';
    const view = mode === 'view', ownerOnly = mode === 'change-owner', locked = view || ownerOnly;
    const heading = { edit: `Edit ${noun}`, view: `View ${noun}`, 'change-owner': 'Change Owner' }[mode];
    const draft = { title: t.title, owner: t.owner, end: toIso(t.plannedEndDate), description: t.description, docs: t.documents.map((d) => d.name), refs: t.references.map((r) => r.name), users: t.users.map((u) => ({ ...u })) };
    const iconBtn = (cls, label, svg) => `<button type="button" class="setup-approval-doc-icon-btn ${cls} cursor-pointer" aria-label="${label}" data-ui-tip="${label}" data-act="${cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svg}</svg></button>`;
    const chip = (name, ref) => `<div class="setup-doc-chip"><div class="setup-doc-chip__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path></svg></div>
      <div class="setup-doc-chip__content"><span class="setup-doc-chip__name" title="${esc(name)}">${esc(name)}</span></div><span class="setup-doc-chip__type">${esc(name.split('.').pop().toUpperCase())}</span>
      <div class="setup-doc-chip__actions"><button type="button" class="setup-doc-chip__action cursor-pointer" aria-label="Preview Document" data-ui-tip="Preview Document" data-preview="${esc(name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg></button>
        <button type="button" class="setup-doc-chip__action cursor-pointer" aria-label="Download document" data-ui-tip="Download" data-download="${esc(name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path></svg></button>
        ${locked ? '' : `<button type="button" class="setup-doc-chip__remove cursor-pointer" aria-label="Remove ${esc(name)}" data-remove="${ref ? 'ref' : 'doc'}:${esc(name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button>`}</div></div>`;
    const body = () => `
      <div class="setup-review-modal-body edit-approval-body">
        <div class="edit-approval-grid">
          <div class="edit-approval-field"><label class="edit-approval-label">${noun} Title<span class="edit-approval-required">*</span></label>${selectControl('reviewType', [t.title, 'Scientific Review', 'Medical Director Approval', 'Budget & Contract Review', 'Other'], draft.title, { disabled: locked })}</div>
        </div>
        <div class="edit-approval-field"><div class="edit-approval-inline-label-row"><label class="edit-approval-label">Select Documents<span class="edit-approval-required">*</span></label>${locked ? '' : iconBtn('setup-approval-doc-icon-btn--select', 'Select documents', '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M12 11v6"></path><path d="M9 14h6"></path>')}</div>
          ${draft.docs.length ? `<div class="setup-doc-list">${draft.docs.map((d) => chip(d, false)).join('')}</div>` : ''}</div>
        <div class="edit-approval-grid edit-approval-grid-three">
          <div class="edit-approval-field"><label class="edit-approval-label">Planned end date<span class="edit-approval-required">*</span></label>${datepicker('end', draft.end, { disabled: locked })}</div>
          <div class="edit-approval-field"><label class="edit-approval-label">${noun} Owner<span class="edit-approval-required">*</span></label>${selectControl('owner', [USER.name, ...PEOPLE], draft.owner, { disabled: view })}</div>
          <div class="edit-approval-field"><label class="edit-approval-label">${noun} Status<span class="edit-approval-required">*</span></label><input type="text" class="edit-approval-input edit-approval-input-readonly w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600" value="${esc(t.status)}" readonly/></div>
        </div>
        <div class="edit-approval-field"><label class="edit-approval-label">${noun} Description</label><textarea rows="6" class="edit-approval-textarea glass-input w-full px-4 py-3 rounded-lg text-sm font-medium text-slate-800 placeholder-slate-400 resize-y min-h-[96px] ${locked ? 'edit-approval-input-readonly' : ''}" ${locked ? 'readonly' : ''} data-field="description">${esc(draft.description)}</textarea></div>
        <div class="edit-approval-field"><div class="edit-approval-inline-label-row"><label class="edit-approval-label">Reference Documents</label>${locked ? '' : `<div class="edit-approval-inline-actions setup-approval-doc-actions">${iconBtn('setup-approval-doc-icon-btn--upload', 'Upload file', '<path d="M12 3v12"></path><path d="m7 8 5-5 5 5"></path><path d="M5 21h14"></path>')}${iconBtn('setup-approval-doc-icon-btn--application', 'Add from Application', '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path><path d="M12 10v6"></path><path d="M9 13h6"></path>')}</div>`}</div>
          ${draft.refs.length ? `<div class="setup-doc-list">${draft.refs.map((d) => chip(d, true)).join('')}</div>` : ''}</div>
        <section class="edit-approval-section setup-schedule-section">
          <div class="edit-approval-section-heading"><h3 class="edit-approval-section-title">${people}<span class="edit-approval-required">*</span></h3>${locked ? '' : iconBtn('setup-approval-doc-icon-btn--approver', `Add ${people.slice(0, -1).toLowerCase()}`, '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M19 8v6"></path><path d="M22 11h-6"></path>')}</div>
          <div class="setup-schedule-table-wrap glass-panel applications-table-panel rounded-2xl"><table class="setup-schedule-table w-full text-left text-sm whitespace-nowrap">
            <thead class="border-b border-white/50"><tr><th class="setup-schedule-th px-4 py-3 font-bold text-slate-500 text-xs uppercase tracking-wider"><span class="setup-schedule-th__label">User Name</span></th><th class="setup-schedule-th setup-schedule-th-status px-4 py-3 font-bold text-slate-500 text-xs uppercase tracking-wider"><span class="setup-schedule-th__label">Status</span></th></tr></thead>
            <tbody>${draft.users.map((u) => `<tr><td class="setup-schedule-td px-4 py-3.5"><div class="setup-participant-cell"><span class="setup-participant-name">${esc(u.name)}</span><span class="setup-table-mail-btn" title="${esc(mail(u.name))}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span></div></td>
              <td class="setup-schedule-td setup-schedule-td-status px-4 py-3.5"><div class="setup-review-status-cell"><span class="setup-status-badge pubs-chip--${badgeCode(u.status)}">${esc(u.status)}</span>${locked || u.status !== 'Planned' ? '' : `<button type="button" class="setup-table-delete-btn cursor-pointer" aria-label="Remove ${esc(u.name)}" data-remove-user="${esc(u.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>`}</div></td></tr>`).join('') ||
              `<tr class="setup-schedule-table__empty-row"><td class="setup-schedule-td setup-schedule-table__empty-cell" colspan="2"><div class="setup-schedule-table__empty"><p class="setup-schedule-table__empty-title">No ${people.toLowerCase()} added</p></div></td></tr>`}</tbody>
          </table></div>
        </section>
      </div>`;
    const m = appModal({ host: 'app-setup-review-modal', size: 'xl', closeOnBackdrop: false, title: heading,
      actionsHtml: view ? '' : '<div class="setup-review-modal__actions"><button type="button" class="app-modal-btn app-modal-btn--primary cursor-pointer" data-save>Save</button></div>', bodyHtml: body() });
    const redraw = () => { const b = $('.app-modal-body', m.el); b.innerHTML = body(); icons(); };
    m.el.addEventListener('input', (e) => { if (e.target.dataset.field) draft[e.target.dataset.field] = e.target.value; });
    m.el.addEventListener('change', (e) => { const s = e.target.closest?.('[data-select]'); if (s) draft[s.dataset.select === 'owner' ? 'owner' : 'title'] = s.dataset.value; });
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const act = b.dataset.act;
      if (b.dataset.save !== undefined) {
        const end = $('[data-datepicker=end]', m.el)?.dataset.value, errors = [];
        if (!draft.title) errors.push(`${noun} Title is required.`); if (!draft.docs.length) errors.push('Select at least one document.');
        if (!end) errors.push('Planned end date is required.'); if (!draft.owner) errors.push(`${noun} Owner is required.`); if (!draft.users.length) errors.push(`Add at least one ${people.slice(0, -1).toLowerCase()}.`);
        if (errors.length) return validation(errors);
        Object.assign(t, { title: draft.title, owner: draft.owner, plannedEndDate: fmt(end), description: draft.description, documents: draft.docs.map((n) => t.documents.find((d) => d.name === n) || { name: n, type: n.split('.').pop().toUpperCase(), done: false }), references: draft.refs.map((n) => ({ name: n })), users: draft.users });
        m.close(); render(); toast('success', ownerOnly ? 'Owner changed' : `${noun} saved`, `${t.code} updated.`);
      } else if (act === 'setup-approval-doc-icon-btn--select') picker({ host: 'app-select-documents-picker-modal', prefix: 'select-documents-picker', heading: 'Select Documents', items: ['Protocol_v3.docx', 'Budget_Summary.xlsx', 'Informed_Consent_Form.pdf', 'Investigator_CV.pdf', 'Site_Feasibility_Questionnaire.docx', 'Statistical_Analysis_Plan.docx'], selected: draft.docs, emptyTitle: 'No documents match your search.', onConfirm: (v) => { draft.docs = v; redraw(); } });
      else if (act === 'setup-approval-doc-icon-btn--application') picker({ host: 'app-reference-documents-picker-modal', prefix: 'select-documents-picker', heading: 'Reference Documents', items: ['Review_Guidelines_2026.pdf', 'Application_Form.pdf', 'Prior_Correspondence.pdf', 'Debarment_Check.pdf'], selected: draft.refs, emptyTitle: 'No documents match your search.', onConfirm: (v) => { draft.refs = v; redraw(); } });
      else if (act === 'setup-approval-doc-icon-btn--upload') { const n = `Upload_${Date.now() % 1000}.pdf`; draft.refs.push(n); redraw(); toast('success', 'File uploaded', n); }
      else if (act === 'setup-approval-doc-icon-btn--approver') picker({ host: 'app-approvers-picker-modal', prefix: 'approvers-picker', heading: people, items: PEOPLE, selected: draft.users.map((u) => u.name), emptyTitle: `No ${people.toLowerCase()} match your search.`, onConfirm: (v) => { draft.users = v.map((n) => draft.users.find((u) => u.name === n) || { name: n, status: 'Planned', start: '', end: '', approver: '', comments: '' }); redraw(); } });
      else if (b.dataset.remove) { const [k, n] = b.dataset.remove.split(':'); draft[k === 'ref' ? 'refs' : 'docs'] = draft[k === 'ref' ? 'refs' : 'docs'].filter((x) => x !== n); redraw(); }
      else if (b.dataset.removeUser) { draft.users = draft.users.filter((u) => u.name !== b.dataset.removeUser); redraw(); }
      else if (b.dataset.preview) preview(`Preview: ${b.dataset.preview}`);
      else if (b.dataset.download) toast('info', 'Download started', b.dataset.download);
    });
  }

  // start / update / complete docs
  function openDocumentWork(t, heading) {
    const noun = t.type === 'Approval' ? 'Approval' : 'Review', m = appModal({ host: 'app-start-approval-modal', size: 'md', closeOnBackdrop: false, panelClass: 'start-approval-modal-panel', title: `${heading} ${noun}`, bodyHtml: '' });
    const draw = () => {
      $('.app-modal-body', m.el).innerHTML = `<div class="start-approval-body"><div class="start-approval-table-wrap"><table class="start-approval-table" aria-label="Documents">
        <thead><tr><th class="start-approval-th start-approval-th--name">Document Name</th><th class="start-approval-th start-approval-th--type">Type</th><th class="start-approval-th start-approval-th--action"><span class="sr-only">Action</span></th></tr></thead>
        <tbody>${t.documents.map((d, i) => `<tr class="start-approval-row"><td class="start-approval-td start-approval-td--name"><div class="start-approval-doc"><span class="start-approval-doc-icon" aria-hidden="true"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path></svg></span><div class="start-approval-doc-text"><span class="start-approval-doc-name" title="${esc(d.name)}">${esc(d.name)}</span></div></div></td>
          <td class="start-approval-td start-approval-td--type"><span class="start-approval-doc-type">${esc(d.type)}</span></td>
          <td class="start-approval-td start-approval-td--action">${d.done ? '<span class="start-approval-started">Completed</span>' : `<button type="button" class="start-approval-start-btn cursor-pointer" data-doc="${i}">${heading === 'Complete' ? 'Complete' : d.started ? 'Update' : 'Start'}</button>`}</td></tr>`).join('')}</tbody>
      </table></div></div>`;
    };
    m.el.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-doc]'); if (!b) return;
      const d = t.documents[+b.dataset.doc];
      if (heading === 'Complete') { if (!(await confirmDialog({ message: `Are you sure you want to complete your ${noun.toLowerCase()} of ${d.name}?`, proceedLabel: 'Complete' }))) return; d.done = true; if (t.documents.every((x) => x.done)) { t.myStatus = 'Completed'; m.close(); render(); } else draw(); return toast('success', `${noun} completed`, d.name); }
      d.started = true; if (t.role === 'contributor') t.myStatus = 'InProgress'; else t.status = 'InProgress';
      render(); draw(); toast('info', 'Document opened', `${d.name} opens in the online editor in the real application.`);
    });
    draw();
  }
  // task completion
  function openCompletion(t) {
    const review = t.type !== 'Approval', m = appModal({ host: 'app-complete-review-modal', size: 'md', closeOnBackdrop: false, title: 'Task Completion', bodyHtml: '' });
    const draw = () => { $('.app-modal-body', m.el).innerHTML = `<div class="complete-review-body">${t.documents.map((d, i) => `<div class="complete-review-row"><span class="complete-review-row__name" title="${esc(d.name)}">${esc(d.name)}</span><div class="complete-review-row__actions">${d.closed ? '<span class="complete-review-row__done">Completed</span>' : `${review ? `<button type="button" class="app-modal-btn cursor-pointer" data-resolve="${i}">Resolve Comments</button>` : ''}<button type="button" class="app-modal-btn app-modal-btn--primary cursor-pointer" data-close-doc="${i}">Close</button>`}</div></div>`).join('') || '<p class="complete-review-empty">No documents to complete.</p>'}</div>`; };
    m.el.addEventListener('click', async (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.resolve) return toast('info', 'Resolve comments', 'The online editor opens in the real application.');
      if (b.dataset.closeDoc === undefined) return;
      const d = t.documents[+b.dataset.closeDoc];
      if (!(await confirmDialog({ message: `Are you sure you want to close ${d.name}? This marks the ${t.type.toLowerCase()} of this document as complete.`, proceedLabel: 'Confirm' }))) return;
      d.closed = true; draw();
      if (t.documents.every((x) => x.closed)) { t.status = 'Closed'; m.close(); render(); toast('success', 'Task closed', `${t.code} moved to Closed.`); }
    });
    draw();
  }

  async function onAction(t, id) {
    const noun = t.type === 'Approval' ? 'Approval' : 'Review';
    switch (id) {
      case 'change-owner': case 'edit': case 'view': return openSetup(t, id);
      case 'start': return openDocumentWork(t, 'Start');
      case 'contributor-start': return openDocumentWork(t, 'Start');
      case 'update': return openDocumentWork(t, 'Update');
      case 'complete': return openDocumentWork(t, 'Complete');
      case 'close': return openCompletion(t);
      case 'view-application': return preview(`Application ${t.applicationId}`);
      case 'cancel': if (await confirmDialog({ message: `Are you sure you want to cancel this ${noun.toLowerCase()}? It will move to the Cancelled state.`, proceedLabel: 'Cancel Task', terminateLabel: 'Keep' })) { t.status = 'Cancelled'; render(); toast('warning', 'Task cancelled', `${t.code} moved to Cancelled.`); } return;
      case 'delete': if (await deleteConfirm({ title: `Delete ${noun}`, message: `This ${noun.toLowerCase()} and its schedule will be removed permanently.`, itemName: `${t.code} · ${t.title}` })) { TASKS.splice(TASKS.indexOf(t), 1); render(); toast('success', 'Task deleted', `${t.code} was deleted.`); } return;
    }
  }

  // --- page ---
  const programLabel = () => PROGRAMS.find((p) => p.id === state.program).label;
  function render() {
    const cols = columns(), all = rows(), total = Math.max(1, Math.ceil(all.length / state.pageSize));
    state.page = Math.min(state.page, total);
    const paged = all.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
    const counts = Object.fromEntries(FILTERS.map((f) => [f.id, scoped().filter((t) => inFilter(t, f.id)).length]));
    const stickyTitle = widths.title, stickyAction = widths.action, minWidth = cols.reduce((s, c) => s + widths[c.key], 0);
    const sortIcon = (dir) => `<svg class="table-header-sort-icon ${dir === 'desc' ? 'table-header-sort-icon-desc' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${dir === 'asc' ? '<path d="M12 19V5"></path><path d="m5 12 7-7 7 7"></path>' : '<path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>'}</svg>`;
    const cell = (t, c) => {
      switch (c.key) {
        case 'title': return `<div class="text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-primary-600 transition-colors">${esc(t.title)}</div>`;
        case 'type': return `<span class="text-sm font-bold text-slate-600">${esc(t.type)}</span>`;
        case 'applicationId': return `<span class="text-sm font-mono font-bold text-slate-500">${esc(t.applicationId)}</span>`;
        case 'grantType': case 'plannedEndDate': return `<span class="text-sm font-medium text-slate-500">${esc(t[c.key])}</span>`;
        case 'status': return badge(t.status);
        case 'myStatus': return t.myStatus ? badge(t.myStatus) : '<span class="text-sm font-bold text-slate-400">—</span>';
        case 'details': return `<div class="action-cell-content"><button type="button" class="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors cursor-pointer" aria-label="View task details" data-details><i data-lucide="file-text" class="w-4 h-4"></i></button></div>`;
        case 'action': return `<div class="action-cell-content">${actionItems(t).length ? `<button type="button" data-action-trigger class="action-menu-trigger cursor-pointer ${state.menu?.id === t.id ? 'action-menu-trigger-active' : ''}" aria-label="Actions" aria-haspopup="true"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="6" r="1.75"/><circle cx="12" cy="12" r="1.75"/><circle cx="12" cy="18" r="1.75"/></svg></button>` : ''}</div>`;
      }
    };
    const pagerItems = () => { if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1); if (state.page <= 3) return [1, 2, 3, 4, '…', total]; if (state.page >= total - 2) return [1, '…', total - 3, total - 2, total - 1, total]; return [1, '…', state.page - 1, state.page, state.page + 1, '…', total]; };
    const label = FILTERS.find((f) => f.id === state.filter).label;
    $('#page').innerHTML = `
      <div class="view-section active flex-1 flex-col h-full min-h-0 overflow-hidden p-4 md:p-0 relative">
        <div class="tasks-page-header mb-3 shrink-0 flex flex-row justify-between items-start gap-3">
          <div class="tasks-page-heading min-w-0">
            <h2 class="text-heading tasks-page-title">My Tasks</h2>
            <p class="text-body mt-1 text-slate-500 tasks-page-subtitle tasks-page-subtitle--compact">${SHORT[state.program]} · ${state.role === 'owner' ? 'Manage your assigned tasks and approvals' : 'Browse tasks you contribute to'}</p>
            <p class="text-body mt-1 text-slate-500 tasks-page-subtitle tasks-page-subtitle--full">${programLabel()} · ${state.role === 'owner' ? 'Manage your assigned tasks and approvals' : 'Browse tasks you contribute to'}</p>
          </div>
          <div class="tasks-page-header-end"><app-mobile-section-nav>
            <div class="mobile-section-nav md:hidden"><button type="button" class="mobile-section-nav__trigger" aria-haspopup="menu" aria-label="Open section menu" data-section-nav><i data-lucide="menu" class="mobile-section-nav__icon"></i></button>
              <div class="mobile-section-nav__menu" role="menu" hidden>${[['layout-dashboard', 'Dashboard'], ['clipboard-list', 'Tasks', true], ['bell', 'Notifications'], ['help-circle', 'Help'], ['settings', 'Administration']].map(([i, l, a]) => `${l === 'Administration' ? '<div class="mobile-section-nav__divider" aria-hidden="true"></div>' : ''}<button type="button" class="mobile-section-nav__item ${a ? 'mobile-section-nav__item--active' : ''}" role="menuitem" data-nav="${l}"><i data-lucide="${i}" class="mobile-section-nav__item-icon"></i><span>${l}</span>${a ? '<svg class="mobile-section-nav__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>' : ''}</button>`).join('')}</div>
            </div></app-mobile-section-nav></div>
        </div>
        <div class="tasks-view flex flex-col flex-1 min-h-0 gap-3 md:mb-0">
          <div class="tasks-tabs-section shrink-0"><div class="tasks-tabs-row">
            <app-application-tabs class="program-tabs tabs-sliding-mode"><div class="tabs-root"><div class="tabs-scroll scrollbar-hide pb-1 md:pb-0">
              <div class="glass-panel tabs-bar p-1.5 rounded-xl inline-flex whitespace-nowrap min-w-max border border-white/60 shadow-glass-sm tabs-bar-sliding" style="position:relative">
                <span class="tabs-sliding-indicator" aria-hidden="true"></span>
                ${PROGRAMS.map((p) => `<button type="button" class="tab-trigger px-5 md:px-6 py-2.5 text-sm rounded-lg ${p.id === state.program ? 'tab-trigger-active' : ''}" data-program="${p.id}" data-label="${esc(p.label)}" aria-label="${esc(p.label)}"><span class="tab-trigger-label">${esc(p.label)}</span></button>`).join('')}
              </div></div></div></app-application-tabs>
            <div class="role-switch"><div class="role-switch-track" role="group" aria-label="Task role">
              <span class="role-switch-indicator" style="transform:translateX(${state.role === 'contributor' ? 100 : 0}%)" aria-hidden="true"></span>
              ${ROLES.map((r) => `<button type="button" class="role-switch-option cursor-pointer ${state.role === r.id ? 'role-switch-option-active' : ''}" aria-pressed="${state.role === r.id}" aria-label="${r.label}" data-role="${r.id}"><i data-lucide="${r.id === 'owner' ? 'user' : 'users'}" class="role-switch-icon"></i><span class="role-switch-label">${r.label}</span></button>`).join('')}
            </div></div>
          </div></div>
          <div class="glass-panel applications-table-panel rounded-2xl flex flex-col flex-1 overflow-hidden shadow-glass border border-white/80 min-h-0">
            <div class="applications-table-toolbar flex flex-col md:flex-row justify-between items-start md:items-center px-5 py-1.5 md:py-2 border-b border-white/50 bg-white/30 gap-2 md:gap-3">
              <div class="applications-toolbar-start"><div class="applications-results-summary"><p class="applications-results-text">${all.length ? `Showing ${(state.page - 1) * state.pageSize + 1}–${(state.page - 1) * state.pageSize + paged.length} of ${all.length} ${label.toLowerCase()} tasks` : `No ${label.toLowerCase()} tasks`}</p></div></div>
              <div class="filter-tabs-root">
                <div class="filter-tabs-scroll scrollbar-hide"><div class="glass-panel filter-tabs-bar p-1 rounded-xl inline-flex whitespace-nowrap min-w-max border border-white/60 shadow-glass-sm">
                  ${FILTERS.map((f) => `<button type="button" class="filter-tab-trigger px-4 md:px-5 py-2 rounded-lg cursor-pointer ${state.filter === f.id ? 'filter-tab-trigger-active' : ''}" data-filter="${f.id}" data-label="${f.label} (${counts[f.id]})" aria-pressed="${state.filter === f.id}">${f.label} (${counts[f.id]})</button>`).join('')}
                </div></div>
                <app-table-pager><nav class="pager" aria-label="Tasks pagination">
                  <button type="button" class="pager-btn pager-btn--nav" ${state.page <= 1 ? 'disabled' : ''} data-page="${state.page - 1}" aria-label="Previous page"><svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M7.5 2.5 4 6l3.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                  ${pagerItems().map((p) => (p === '…' ? '<span class="pager-ellipsis" aria-hidden="true">…</span>' : `<button type="button" class="pager-btn ${p === state.page ? 'is-active' : ''}" data-page="${p}" aria-label="Page ${p}">${p}</button>`)).join('')}
                  <button type="button" class="pager-btn pager-btn--nav" ${state.page >= total ? 'disabled' : ''} data-page="${state.page + 1}" aria-label="Next page"><svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M4.5 2.5 8 6 4.5 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                </nav></app-table-pager>
              </div>
            </div>
            <div class="flex-1 overflow-auto w-full applications-table-wrap min-h-0 ${state.loading ? 'applications-table-wrap--loading' : ''}" id="table-wrap">
              ${state.loading ? `
                <div class="applications-table-shimmer" aria-busy="true" aria-label="Loading tasks">
                  <div class="applications-table-shimmer__header" aria-hidden="true">${'<span class="applications-table-shimmer__header-cell"></span>'.repeat(8)}</div>
                  <div class="applications-table-shimmer__body">${Array.from({ length: 10 }, (_, r) => `<div class="applications-table-shimmer__row" style="--shimmer-delay:${r * 70}ms">${['id', 'md', 'lg', 'md', 'badge', 'md', 'sm', 'actions'].map((s) => `<span class="applications-table-shimmer__cell applications-table-shimmer__cell--${s}"></span>`).join('')}</div>`).join('')}</div>
                </div>` : paged.length ? `
                <table class="applications-table w-full text-left text-sm whitespace-nowrap" draggable="false" style="min-width:${minWidth}px;--sticky-col-title-width:${stickyTitle}px;--sticky-col-action-width:${stickyAction}px">
                  <thead class="border-b border-white/50"><tr>${cols.map((c) => `
                    <th draggable="false" class="table-header-cell px-4 py-3 font-bold text-slate-500 text-xs uppercase tracking-wider border-b border-white/50 ${c.cssClass || ''} ${c.sortable !== false ? 'table-header-cell-sortable' : ''} ${c.sortable !== false && state.sortKey === c.key && state.sortDir ? 'table-header-sort-active' : ''}" style="width:${widths[c.key]}px;min-width:${widths[c.key]}px;max-width:${widths[c.key]}px" data-col="${c.key}">
                      <div class="table-header-sort-trigger"><span class="table-header-label">${c.label}</span>${c.sortable !== false && state.sortKey === c.key && state.sortDir ? sortIcon(state.sortDir) : ''}</div>
                      <div class="col-resize-handle ${c.resizeEdge === 'left' ? 'col-resize-handle-left' : ''}" aria-hidden="true" data-resize="${c.key}"><span class="col-resize-grip" aria-hidden="true">${'<span class="col-resize-dot"></span>'.repeat(6)}</span></div>
                    </th>`).join('')}</tr></thead>
                  <tbody>${paged.map((t) => `<tr class="application-row cursor-pointer transition-colors group" data-row-id="${t.id}">${cols.map((c) => `<td class="px-4 py-3.5 ${c.cssClass || ''}" style="width:${widths[c.key]}px;min-width:${widths[c.key]}px;max-width:${widths[c.key]}px"><div class="sort-cell-inner">${cell(t, c)}</div></td>`).join('')}</tr>`).join('')}</tbody>
                </table>` : `
                <div class="flex flex-1 flex-col items-center justify-center min-h-full px-6 py-16 text-center animate-[fadeIn_0.4s_ease_forwards]">
                  <div class="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 border border-primary-100"><i data-lucide="clipboard-list" class="w-7 h-7"></i></div>
                  <h3 class="text-lg font-extrabold text-slate-800 tracking-tight">No tasks found</h3>
                  <p class="text-slate-500 text-sm mt-2 max-w-md font-medium">There are no ${label.toLowerCase()} tasks for this program and role.</p>
                </div>`}
            </div>
          </div>
        </div>
      </div>`;
    icons();
    // move the tab highlight under the active program
    const bar = $('.tabs-bar', $('#page')), active = $('.tab-trigger-active', bar), ind = $('.tabs-sliding-indicator', bar);
    if (active) { const b = bar.getBoundingClientRect(), a = active.getBoundingClientRect(); ind.style.width = a.width + 'px'; ind.style.transform = `translate3d(${a.left - b.left}px,0,0)`; ind.classList.add('tabs-sliding-indicator-ready'); requestAnimationFrame(() => ind.classList.add('tabs-sliding-indicator-animate')); }
  }
  function reload(change) { change?.(); state.loading = true; state.page = 1; state.menu = null; render(); setTimeout(() => { state.loading = false; render(); }, 650); }

  // row "..." menu, appended outside the table so it isn't clipped
  function openActionMenu(t, trigger) {
    closeActionMenu();
    const r = trigger.getBoundingClientRect(), items = actionItems(t), width = 180;
    const portal = el(`<div data-action-portal><button type="button" class="action-menu-overlay cursor-pointer" aria-label="Close actions menu"></button>
      <div class="action-menu-panel" role="menu" style="top:${r.bottom + 6}px;left:${Math.max(8, r.right - width)}px">${items.map((i) => `<button type="button" class="action-menu-item cursor-pointer ${i.id === 'cancel' || i.id === 'delete' ? 'action-menu-item--danger' : ''}" role="menuitem" data-item="${i.id}"><span class="action-menu-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ACTION_SVG[i.id]}</svg></span><span class="action-menu-item-label">${esc(i.label)}</span></button>`).join('')}</div></div>`);
    $('#page').append(portal);
    const panel = $('.action-menu-panel', portal);
    if (panel.getBoundingClientRect().bottom > innerHeight - 8) panel.style.top = r.top - panel.offsetHeight - 6 + 'px';
    state.menu = { id: t.id }; trigger.classList.add('action-menu-trigger-active');
    $('.action-menu-overlay', portal).onclick = closeActionMenu;
    panel.onclick = (e) => { const b = e.target.closest('[data-item]'); if (!b) return; closeActionMenu(); onAction(t, b.dataset.item); };
  }
  function closeActionMenu() { $('[data-action-portal]')?.remove(); $('.action-menu-trigger-active')?.classList.remove('action-menu-trigger-active'); state.menu = null; }

  // --- side panels ---
  function openAlerts() {
    let tab = 'all';
    const host = $('#alerts-host');
    const draw = () => {
      const feed = ALERTS.filter((a) => tab === 'all' || a.kind === tab), unread = ALERTS.filter((a) => !a.read).length, count = (k) => ALERTS.filter((a) => k === 'all' || a.kind === k).length;
      const tone = { warning: 'bg-amber-50 text-amber-600 border-amber-100', success: 'bg-emerald-50 text-emerald-600 border-emerald-100', info: 'bg-primary-50 text-primary-600 border-primary-100' }, icon = { warning: 'triangle-alert', success: 'check-circle-2', info: 'bell' };
      host.innerHTML = `<div class="alerts-panel-overlay"><div class="alerts-panel-backdrop absolute inset-0 bg-slate-900/25 backdrop-blur-[3px]" data-x></div>
        <aside class="alerts-panel relative w-full max-w-md flex flex-col" role="dialog" aria-label="Alerts and notifications">
          <div class="alerts-panel__header px-5 py-4 flex items-center justify-between gap-3 shrink-0"><div><h2 class="text-lg font-extrabold text-slate-800 tracking-tight">Notifications</h2><p class="text-xs font-semibold text-slate-500 mt-0.5">${unread} unread notification${unread === 1 ? '' : 's'}</p></div>
            <div class="flex items-center gap-2">${feed.some((a) => !a.read) ? '<button type="button" class="px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-primary-50 hover:text-primary-700" data-read-all>Mark all read</button>' : ''}<button type="button" class="alerts-close-btn" aria-label="Close alerts" data-x>${svgX}</button></div></div>
          <div class="alerts-panel__tabs px-4 shrink-0" role="tablist">${[['all', 'All'], ['alerts', 'Alerts'], ['notifications', 'Notifications']].map(([id, l]) => `<button type="button" role="tab" class="alerts-panel__tab ${tab === id ? 'alerts-panel__tab--active' : ''}" aria-selected="${tab === id}" data-tab="${id}">${l} <span class="alerts-panel__tab-count">(${count(id)})</span>${id !== 'all' && tab !== id && ALERTS.some((a) => a.kind === id && !a.read) ? '<span class="alerts-panel__tab-dot" aria-hidden="true"></span>' : ''}</button>`).join('')}</div>
          <div class="flex-1 overflow-y-auto p-4 space-y-3">${feed.map((a) => `
            <div class="alert-card alert-card--static ${a.read ? 'alert-card--read' : 'alert-card--unread'}"><div class="flex items-start gap-3">
              <div class="alert-card__icon-wrap ${tone[a.severity]}"><i data-lucide="${icon[a.severity]}" class="w-5 h-5"></i></div>
              <div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-2"><h3 class="alert-card__title">${esc(a.title)}</h3><div class="flex items-center gap-1.5 shrink-0">${a.read ? '' : '<span class="alert-card__dot"></span>'}<button type="button" class="alert-card__dismiss" aria-label="Dismiss" title="Dismiss" data-dismiss="${a.id}">${svgX}</button></div></div>
                <p class="alert-card__message"><span class="alert-card__label">Application ID:</span> ${esc(a.applicationCode)}</p><p class="alert-card__message"><span class="alert-card__label">Title of Study:</span> ${esc(a.applicationTitle)}</p><p class="alert-card__message"><span class="alert-card__label">Event Type:</span> ${esc(a.eventName)}</p><p class="alert-card__message"><span class="alert-card__label">Description:</span> ${esc(a.message)}</p><p class="alert-card__time">${esc(a.timeLabel)}</p></div>
            </div></div>`).join('') || '<div class="rounded-2xl border border-dashed border-slate-200 bg-white/40 px-4 py-10 text-center"><i data-lucide="bell-off" class="w-8 h-8 text-slate-300 mx-auto mb-3"></i><p class="text-sm font-bold text-slate-500">No notifications</p></div>'}</div>
        </aside></div>`;
      icons(); badgeDot();
    };
    draw();
    const ov = $('.alerts-panel-overlay', host), aside = $('.alerts-panel', host);
    requestAnimationFrame(() => requestAnimationFrame(() => { ov.classList.add('alerts-panel-overlay--in'); aside.classList.add('alerts-panel--in'); }));
    host.onclick = (e) => {
      const b = e.target.closest('[data-x],[data-tab],[data-read-all],[data-dismiss]'); if (!b) return;
      if (b.dataset.x !== undefined) { $('.alerts-panel-overlay', host).classList.remove('alerts-panel-overlay--in'); $('.alerts-panel', host).classList.remove('alerts-panel--in'); setTimeout(() => (host.innerHTML = ''), 260); return; }
      if (b.dataset.tab) tab = b.dataset.tab; else if (b.dataset.readAll !== undefined) ALERTS.forEach((a) => (a.read = true)); else if (b.dataset.dismiss) { const i = ALERTS.findIndex((a) => a.id === +b.dataset.dismiss); if (i > -1) ALERTS.splice(i, 1); }
      const was = $('.alerts-panel-overlay', host); draw(); $('.alerts-panel-overlay', host).classList.add('alerts-panel-overlay--in'); $('.alerts-panel', host).classList.add('alerts-panel--in');
    };
  }
  function openHelp() {
    const host = $('#help-host');
    host.innerHTML = `<div class="help-panel-overlay fixed inset-0 z-[4100] flex items-center justify-center p-4"><div class="help-panel-backdrop absolute inset-0"></div>
      <aside class="help-panel relative w-full bg-white flex flex-col" role="dialog" aria-label="Help" aria-modal="true">
        <div class="help-panel__header"><div class="help-panel__header-text"><h2 class="help-panel__title">Help &amp; Resources</h2><p class="help-panel__subtitle">Find guides and resources to help you navigate the platform.</p></div><button type="button" class="header-close-btn" aria-label="Close help panel" data-x>${svgX}</button></div>
        <div class="help-panel__body"><div class="help-panel__section-label">RESOURCES</div><div class="help-panel__resources-list">${HELP_LINKS.map((l) => `<a class="help-panel__resource-card" href="#" title="${esc(l.title)}" data-guide="${esc(l.title)}"><div class="help-panel__icon-box help-panel__icon-box--${l.tone}"><i data-lucide="${l.icon}" class="w-[18px] h-[18px]" aria-hidden="true"></i></div><div class="help-panel__resource-content"><span class="help-panel__resource-title">${esc(l.title)}</span><span class="help-panel__resource-subtitle">${esc(l.subtitle)}</span></div><div class="help-panel__arrow-box"><i data-lucide="arrow-right" class="w-[16px] h-[16px]" aria-hidden="true"></i></div></a>`).join('')}</div></div>
      </aside></div>`;
    icons();
    requestAnimationFrame(() => requestAnimationFrame(() => { $('.help-panel-overlay', host).classList.add('help-panel-overlay--in'); $('.help-panel', host).classList.add('help-panel--in'); }));
    host.onclick = (e) => { const g = e.target.closest('[data-guide]'); if (g) { e.preventDefault(); toast('info', 'Opening guide', g.dataset.guide); } if (e.target.closest('[data-x]')) { $('.help-panel', host).classList.remove('help-panel--in'); $('.help-panel-overlay', host).classList.remove('help-panel-overlay--in'); setTimeout(() => (host.innerHTML = ''), 240); } };
  }
  function openLogout(parentHost) {
    const m = appModal({ host: 'app-logout-host', parent: parentHost, size: 'sm', title: 'Sign out?',
      actionsHtml: '<div class="flex items-center gap-3"><button type="button" class="utility-logout-confirm-btn" data-ok>Sign out</button></div>',
      bodyHtml: '<div class="utility-logout-confirm"><p class="utility-logout-confirm__message">Are you sure you want to sign out of your account?</p></div>' });
    $('[data-ok]', m.el).onclick = () => { m.close(); toast('success', 'Signed out', 'Session ended (design preview).'); };
  }
  const badgeDot = () => { const unread = ALERTS.some((a) => !a.read); $$('[data-alert-badge]').forEach((b) => (b.hidden = !unread)); const c = $('[data-alert-count]'); if (c) { c.textContent = ALERTS.filter((a) => !a.read).length; c.hidden = !unread; } };

  // --- events ---
  const side = $('app-sidebar'), expanded = localStorage.getItem('ieg.sidebar') !== 'collapsed';
  const setSidebar = (open) => { side.classList.toggle('sidebar-expanded', open); side.classList.toggle('sidebar-collapsed', !open); clearTimeout(side._t); if (open) side._t = setTimeout(() => side.classList.add('sidebar-labels-open'), 120); else side.classList.remove('sidebar-labels-open'); $('.sidebar-brand-svg', side).src = open ? 'assets/ieg-logo.svg' : 'assets/favicon.svg'; try { localStorage.setItem('ieg.sidebar', open ? 'expanded' : 'collapsed'); } catch {} };
  setSidebar(expanded);
  $('.sidebar-brand', side).onclick = () => setSidebar(!side.classList.contains('sidebar-expanded'));
  side.addEventListener('click', (e) => { const a = e.target.closest('[data-nav]'); if (!a) return; e.preventDefault(); if (a.dataset.nav === 'alerts') openAlerts(); else if (a.dataset.nav !== 'tasks') preview(a.dataset.nav === 'dashboard' ? 'Dashboard' : a.dataset.nav); });
  const bar = $('app-header-utility-bar');
  bar.addEventListener('click', (e) => { const b = e.target.closest('[data-util]'); if (!b) return; const u = b.dataset.util; if (u === 'alerts') openAlerts(); else if (u === 'help') openHelp(); else if (u === 'logout') openLogout(bar); else preview({ faq: 'FAQ', admin: 'Administration', dashboard: 'Dashboard', profile: 'Profile' }[u]); });
  badgeDot();

  const page = $('#page');
  page.addEventListener('click', (e) => {
    const t = (s) => e.target.closest(s);
    let b;
    if ((b = t('[data-program]'))) return reload(() => (state.program = b.dataset.program));
    if ((b = t('[data-role]'))) return reload(() => (state.role = b.dataset.role));
    if ((b = t('[data-filter]'))) { state.filter = b.dataset.filter; state.page = 1; return render(); }
    if ((b = t('[data-page]'))) { if (b.disabled) return; state.page = +b.dataset.page; render(); return ($('#table-wrap').scrollTop = 0); }
    if ((b = t('[data-section-nav]'))) { const m = $('.mobile-section-nav__menu', page); m.hidden = !m.hidden; b.closest('.mobile-section-nav').classList.toggle('mobile-section-nav--open', !m.hidden); return; }
    if ((b = t('[data-nav]'))) { $('.mobile-section-nav__menu', page).hidden = true; return b.dataset.nav === 'Notifications' ? openAlerts() : b.dataset.nav === 'Help' ? openHelp() : b.dataset.nav !== 'Tasks' && preview(b.dataset.nav); }
    if (t('.col-resize-handle')) return;
    if ((b = t('th[data-col]'))) { const c = COLS.find((x) => x.key === b.dataset.col); if (c.sortable === false) return; state.sortDir = state.sortKey === c.key ? (state.sortDir === 'asc' ? 'desc' : state.sortDir === 'desc' ? null : 'asc') : 'asc'; state.sortKey = state.sortDir ? c.key : null; return render(); }
    const row = t('tr[data-row-id]'); if (!row) return;
    const task = TASKS.find((x) => x.id === row.dataset.rowId);
    if (t('[data-details]')) return openDetails(task);
    if ((b = t('[data-action-trigger]'))) return state.menu?.id === task.id ? closeActionMenu() : openActionMenu(task, b);
    if (!t('.action-cell-content')) openDetails(task);
  });
  // column resize
  page.addEventListener('pointerdown', (e) => {
    const h = e.target.closest('[data-resize]'); if (!h) return;
    const key = h.dataset.resize, col = COLS.find((c) => c.key === key), startX = e.clientX, startW = widths[key], left = col.resizeEdge === 'left', th = h.closest('th'), table = th.closest('table');
    table.classList.add('is-column-resizing'); th.classList.add('table-header-cell-active'); h.classList.add('col-resize-handle-active'); document.body.classList.add('column-resizing'); h.setPointerCapture(e.pointerId);
    const move = (ev) => { widths[key] = Math.max(col.minWidth, startW + (ev.clientX - startX) * (left ? -1 : 1)); $$(`[data-col="${key}"], td.${col.cssClass || 'no-such'}`, table).forEach((c) => (c.style.width = c.style.minWidth = c.style.maxWidth = widths[key] + 'px')); const idx = [...th.parentElement.children].indexOf(th); $$('tbody tr', table).forEach((r) => { const td = r.children[idx]; td.style.width = td.style.minWidth = td.style.maxWidth = widths[key] + 'px'; }); if (key === 'title') table.style.setProperty('--sticky-col-title-width', widths[key] + 'px'); if (key === 'action') table.style.setProperty('--sticky-col-action-width', widths[key] + 'px'); };
    const up = () => { h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); document.body.classList.remove('column-resizing'); render(); };
    h.addEventListener('pointermove', move); h.addEventListener('pointerup', up);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeActionMenu(); });
  window.addEventListener('resize', () => { if (!state.loading) render(); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.mobile-section-nav')) { const m = $('.mobile-section-nav__menu', page); if (m && !m.hidden) { m.hidden = true; $('.mobile-section-nav', page).classList.remove('mobile-section-nav--open'); } } });

  window.IEG = { toast, preview, openDetails, openSetup, openDocumentWork, openCompletion, openAlerts, openHelp, openLogout, confirmDialog, validation, deleteConfirm, state, TASKS, render };
  reload();
})();
