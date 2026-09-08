/* ============================================================
   Planning Document Response Modal — behaviour
   No dependencies. Renders into #app.
   ============================================================ */

/* ---------- Options ---------------------------------------- */

const CONFIG = {
  contractorCount: 4,          // 1–8
  showExpected: true,          // show "Expected answer:" under each question
  initialView: 'list'          // 'list' | 'contractor'
};

/* ---------- Data ------------------------------------------- */

const CONTRACTORS = [
  { name: 'Kristi Kay Orbaugh', creds: 'RN, MSN, RNP, AOCN', initials: 'KO' },
  { name: 'Brad Bovette', creds: 'MBA, MPA, PA-C', initials: 'BB' },
  { name: 'Rontgene M Solante', creds: 'MD, FPCP, FPSMID, FIDSA, FACP', initials: 'RS' },
  { name: 'Sofia Miranda', creds: 'MSN, APRN, PNP-BC', initials: 'SM', pending: true },
  { name: 'James Okafor', creds: 'MD, FACC', initials: 'JO' },
  { name: 'Priya Nadeau', creds: 'PharmD, BCPS', initials: 'PN' },
  { name: 'Daniel Reyes', creds: 'MD, MPH', initials: 'DR' },
  { name: 'Helen Whitmore', creds: 'DNP, FNP-BC', initials: 'HW', pending: true }
];

const TIMES = [
  'Jan 14, 2026 at 9:12 AM', 'Jan 15, 2026 at 7:40 PM', 'Jan 12, 2026 at 4:05 PM',
  'Jan 15, 2026 at 11:23 AM', 'Jan 13, 2026 at 2:48 PM', 'Jan 15, 2026 at 8:30 AM',
  'Jan 11, 2026 at 5:17 PM', null
];

const ANSWERS = {
  q1: ['yes','yes','yes','yes','yes','yes','yes'],
  q2: ['yes','no','yes','yes','yes','yes','yes'],
  q3: ['yes','yes','yes','yes','yes','yes','yes'],
  q4: ['no','yes','no','no','no','no','no'],
  q5: ['yes','yes','yes','yes','no','yes','yes'],
  q6: ['no','no','no','no','no','yes','no'],
  q7: ['yes','yes','yes','yes','yes','yes','yes'],
  q8: ['no','no','no','no','no','no','no']
};

const COMMENTS = {
  '1-q2': 'Depth on pharmacokinetics may exceed what a general nursing audience needs — suggest adding a primer slide before the case discussion.',
  '1-q4': 'A phase III readout published last month could shift the first-line recommendation. Worth a content review before the materials are finalized.',
  '5-q6': 'Agenda time is tight; the cost-and-access barrier may only be partially addressed in the allotted segment.'
};

const SECTIONS = [
  { title: 'Educational Justification', questions: [
    { id: 'q1', text: 'Do the learning objectives sufficiently address the activity goals?', expected: 'yes' },
    { id: 'q2', text: 'Is the proposed content at a level appropriate for the intended audience?', expected: 'yes' },
    { id: 'q3', text: 'Will the proposed educational intervention result in changes in current knowledge, attitude and/or practice of the participant/learner?', expected: 'yes' },
    { id: 'q4', text: 'Are you aware of any new scientific developments that may require a change in the content in its proposed form?', expected: 'no' },
    { id: 'q5', text: 'Is the educational format appropriate for the setting, objectives and desired results?', expected: 'yes' },
    { id: 'q6', text: 'Are there identifiable barriers that are not addressed in the educational activity?', expected: 'no' }
  ]},
  { title: 'Potential for Bias', questions: [
    { id: 'q7', text: 'Are planning components of this activity free from commercial bias and not promoting a particular proprietary interest?', expected: 'yes' },
    { id: 'q8', text: 'Is it apparent, based on the planning components of this activity, what company supported this educational activity?', expected: 'no' }
  ]}
];

/* ---------- State ------------------------------------------ */

const state = {
  view: CONFIG.initialView,
  flaggedOnly: false,
  expanded: {},
  selected: 0
};

/* ---------- Helpers ---------------------------------------- */

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const icon = (n, size) => `<i class="mdi mdi-${n}"${size ? ` style="font-size:${size}px"` : ''}></i>`;

const roster = () => CONTRACTORS.slice(0, Math.max(1, Math.min(8, CONFIG.contractorCount)));

function answerFor(ci, q) {
  if (CONTRACTORS[ci].pending) return { answer: null, comment: null, updated: null };
  return { answer: ANSWERS[q.id][ci], comment: COMMENTS[ci + '-' + q.id] || null, updated: TIMES[ci] };
}

function questionStats(cs, q) {
  let flags = 0, comments = 0;
  cs.forEach((c, ci) => {
    const r = answerFor(ci, q);
    if (r.answer === null) return;
    if (r.answer !== q.expected) flags++;
    if (r.comment) comments++;
  });
  return { flags, comments };
}

function visibleIds(cs) {
  const ids = [];
  SECTIONS.forEach(sec => sec.questions.forEach(q => {
    const { flags, comments } = questionStats(cs, q);
    if (state.flaggedOnly && !(flags || comments)) return;
    ids.push(q.id);
  }));
  return ids;
}

const expectedLine = q =>
  CONFIG.showExpected
    ? `<div class="pdr-expected">Expected answer: ${q.expected === 'yes' ? 'Yes' : 'No'}</div>`
    : '';

/* ---------- Chrome ----------------------------------------- */

function chrome(inner) {
  return `
  <div class="app">
    <div class="sb">
      <div class="sb-mark"><span>PRIME</span><span class="aqua">ADMIN</span>${icon('chevron-left')}</div>
      <div class="sb-item sb-item--on">${icon('view-grid-outline')}<span>Program Management</span>${icon('chevron-up')}</div>
      <div class="sb-sub">Projects</div>
      <div class="sb-item">${icon('chart-line')}Reporting</div>
      <div class="sb-item">${icon('bullhorn-outline')}Marketing</div>
      <div class="sb-item">${icon('account-multiple-outline')}Faculty</div>
    </div>

    <div class="topbar">
      <div class="search">Search for [Project]${icon('magnify')}</div>
      ${icon('bell-outline').replace('class="mdi', 'class="bell mdi')}
      <div class="avatar">DB</div>
    </div>

    <div class="page">
      <div class="page-head">
        <div class="pa-page-title">Projects</div>
        <button class="pa-btn pa-btn--primary">Edit</button>
      </div>
      <div class="tabbar">
        <div>Overview</div><div>Details</div><div>Planning</div>
        <div class="on">Faculty</div><div>Files</div><div>Activities</div><div>Workflow</div>
      </div>
    </div>

    <div class="scrim"></div>
    ${inner}
  </div>`;
}

/* ---------- Modal ------------------------------------------ */

function modalHead() {
  return `
    <div class="modal-head">
      <div style="min-width:0">
        <h2 class="pa-modal-title" style="text-transform:uppercase">Planning Document Responses</h2>
        <div class="modal-sub">
          <span class="key" style="color:#8A8A8A">Project</span>
          <span class="id" style="font-family:var(--pa-font-sans)">13261</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:16px;flex:none">
        <div class="pdr-segwrap">
          <button class="pdr-seg ${state.view === 'list' ? 'pdr-seg--on' : ''}" data-act="view" data-view="list">Review list</button>
          <button class="pdr-seg ${state.view === 'contractor' ? 'pdr-seg--on' : ''}" data-act="view" data-view="contractor">By faculty</button>
        </div>
        <button class="pdr-icon" title="Close" data-act="close">${icon('close', 22)}</button>
      </div>
    </div>
    <div class="modal-divider"></div>`;
}

function toolbar(cs) {
  let submitted = 0, pending = 0, flags = 0, comments = 0;
  cs.forEach(c => c.pending ? pending++ : submitted++);
  SECTIONS.forEach(sec => sec.questions.forEach(q => {
    const s = questionStats(cs, q);
    flags += s.flags; comments += s.comments;
  }));

  const ids = visibleIds(cs);
  const allExpanded = ids.length > 0 && ids.every(id => !!state.expanded[id]);

  const tools = state.view !== 'list' ? '' : `
      <div style="display:flex;align-items:center;gap:10px">
        <button class="pdr-tool" data-act="toggle-all">
          ${allExpanded ? icon('unfold-less-horizontal', 16) + 'Collapse all' : icon('unfold-more-horizontal', 16) + 'Expand all'}
        </button>
        <button class="pdr-tool ${state.flaggedOnly ? 'pdr-tool--on' : ''}" data-act="flagged">
          ${icon('filter-variant', 16)}Flagged &amp; comments only
        </button>
      </div>`;

  return `
    <div class="pdr-toolbar">
      <div class="tags">
        <span class="pdr-meta">${icon('account-multiple-outline', 17)}${submitted} of ${cs.length} submitted</span>
        ${pending ? `<span class="pdr-meta pdr-meta--warn">${icon('clock-outline', 16)}${pending} not submitted</span>` : ''}
        ${flags ? `<span class="pdr-meta pdr-meta--warn">${icon('alert-outline', 16)}${flags} answer${flags === 1 ? '' : 's'} differ${flags === 1 ? 's' : ''} from expected</span>` : ''}
        ${comments ? `<span class="pdr-meta">${icon('comment-text-outline', 15)}${comments} comment${comments === 1 ? '' : 's'}</span>` : ''}
      </div>
      <div class="right">
        <div class="pdr-legend">
          <span><span class="sw sw--yes"></span>Yes</span>
          <span><span class="sw sw--no"></span>No</span>
          <span><span class="sw sw--flag"></span>Differs from expected</span>
        </div>
        ${tools}
      </div>
    </div>`;
}

/* ---------- Review list view ------------------------------- */

function listView(cs) {
  const sections = SECTIONS.map(sec => {
    const rows = sec.questions.map(q => {
      const { flags, comments } = questionStats(cs, q);
      if (state.flaggedOnly && !(flags || comments)) return '';
      const expanded = !!state.expanded[q.id];

      const chips = cs.map((c, ci) => {
        const r = answerFor(ci, q);
        const isPending = r.answer === null;
        const isFlag = !isPending && r.answer !== q.expected;
        const kind = isPending ? 'pending' : r.answer;
        return `<div class="pdr-chip pdr-chip--${kind}" title="${esc(c.name)} — ${isPending ? 'Pending' : cap(r.answer)}">${c.initials}${isFlag ? '<span class="pdr-flag"></span>' : ''}</div>`;
      }).join('');

      const panel = !expanded ? '' : `
        <div class="pdr-panel">
          ${cs.map((c, ci) => {
            const r = answerFor(ci, q);
            const isPending = r.answer === null;
            const isFlag = !isPending && r.answer !== q.expected;
            const kind = isPending ? 'pending' : r.answer;
            return `
            <div class="pdr-resp">
              <div class="pdr-resp-head">
                <div class="pdr-chip pdr-chip--${kind}" title="${esc(c.name)}">${c.initials}${isFlag ? '<span class="pdr-flag"></span>' : ''}</div>
                <div class="pdr-resp-id">
                  <div class="pdr-resp-name">${esc(c.name)}</div>
                  <div class="pdr-resp-creds">${esc(c.creds)}</div>
                </div>
                <span class="pdr-pill pdr-pill--${kind}">${isPending ? 'Not submitted' : cap(r.answer)}</span>
                ${isFlag ? `<span class="pdr-meta pdr-meta--warn pdr-meta--sm">${icon('alert-outline', 14)}Differs from expected</span>` : ''}
                <div style="flex:1"></div>
                <div class="pdr-resp-time">Updated ${r.updated || '—'}</div>
              </div>
              ${r.comment ? `<div class="pdr-comment">${icon('comment-text-outline')}<div>${esc(r.comment)}</div></div>` : ''}
            </div>`;
          }).join('')}
        </div>`;

      const accent = flags
        ? '<span class="pdr-row-accent" style="background:var(--pa-warning)"></span>'
        : (comments ? '<span class="pdr-row-accent" style="background:var(--pa-ink-7)"></span>' : '');

      return `
      <div class="pdr-row">
        ${accent}
        <div class="pdr-row-main">
          <div class="pdr-q">
            <div class="pdr-q-text">${esc(q.text)}</div>
            ${expectedLine(q)}
          </div>
          <div class="pdr-chips">${chips}</div>
          <div class="pdr-rowtags">
            ${flags ? `<span class="pdr-meta pdr-meta--warn pdr-meta--sm">${icon('alert-outline', 15)}${flags} flagged</span>` : ''}
            ${comments ? `<span class="pdr-meta pdr-meta--sm">${icon('comment-text-outline', 14)}${comments} comment${comments === 1 ? '' : 's'}</span>` : ''}
          </div>
          <button class="pdr-icon pdr-icon--bordered" title="Toggle responses" data-act="row" data-id="${q.id}">
            ${icon(expanded ? 'chevron-up' : 'chevron-down', 20)}
          </button>
        </div>
        ${panel}
      </div>`;
    }).join('');

    return rows.trim() ? `<div><div class="pdr-band">${esc(sec.title)}</div>${rows}</div>` : '';
  }).join('');

  if (!sections.trim()) {
    return `<div class="pdr-empty">
      ${icon('check-decagram-outline').replace('class="mdi', 'style="color:var(--pa-success)" class="mdi')}
      <div>No flagged answers or comments. Every response matches the expected answer.</div>
    </div>`;
  }
  return sections;
}

/* ---------- By faculty view -------------------------------- */

function facultyView(cs) {
  const sel = Math.min(state.selected, cs.length - 1);
  const selC = cs[sel];
  const selPending = !!selC.pending;

  const rail = cs.map((c, i) => `
    <button class="pdr-ctab ${i === sel ? 'pdr-ctab--on' : ''}" data-act="select" data-i="${i}">
      <div class="pdr-av ${i === sel ? 'pdr-av--on' : (c.pending ? 'pdr-av--pending' : '')}">${c.initials}</div>
      <div class="pdr-ctab-txt">
        <div class="pdr-ctab-name">${esc(c.name)}</div>
        <div class="pdr-ctab-creds">${esc(c.creds)}</div>
      </div>
      ${c.pending ? `<span class="pdr-ctab-flag" title="Not yet submitted">${icon('clock-outline', 16)}</span>` : ''}
    </button>`).join('');

  const detail = selPending
    ? `<div class="pdr-empty">
         ${icon('clock-outline').replace('class="mdi', 'style="color:var(--pa-warning)" class="mdi')}
         <div>This faculty member has not submitted their planning document responses yet.</div>
       </div>`
    : SECTIONS.map(sec => `
      <div>
        <div class="pdr-dsec">${esc(sec.title)}</div>
        ${sec.questions.map(q => {
          const r = answerFor(CONTRACTORS.indexOf(selC), q);
          const isFlag = r.answer !== q.expected;
          return `
          <div class="pdr-ditem">
            <div class="pdr-ditem-main">
              <div class="pdr-q">
                <div class="pdr-q-text">${esc(q.text)}</div>
                ${expectedLine(q)}
              </div>
              <div class="pdr-ditem-right">
                ${isFlag ? `<span class="pdr-meta pdr-meta--warn pdr-meta--sm">${icon('alert-outline', 14)}Differs from expected</span>` : ''}
                <span class="pdr-pill pdr-pill--${r.answer}">${cap(r.answer)}</span>
              </div>
            </div>
            ${r.comment ? `<div class="pdr-comment">${icon('comment-text-outline')}<div>${esc(r.comment)}</div></div>` : ''}
          </div>`;
        }).join('')}
      </div>`).join('');

  return `
    <div class="pdr-split">
      <div class="pdr-rail pdr-scroll">${rail}</div>
      <div class="pdr-detail pdr-scroll">
        <div class="pdr-dhead">
          <div class="pdr-av pdr-av--lg ${selPending ? 'pdr-av--pending' : ''}">${selC.initials}</div>
          <div style="flex:1">
            <div class="pdr-dhead-name">${esc(selC.name)}</div>
            <div class="pdr-dhead-creds">${esc(selC.creds)}</div>
          </div>
          ${selPending
            ? `<span class="pdr-meta pdr-meta--warn">${icon('clock-outline', 16)}Not yet submitted</span>`
            : `<span class="pdr-meta pdr-meta--ok">${icon('check-circle-outline', 16)}Submitted ${TIMES[CONTRACTORS.indexOf(selC)] || ''}</span>`}
        </div>
        ${detail}
      </div>
    </div>`;
}

/* ---------- Render ----------------------------------------- */

function render() {
  const cs = roster();
  const modal = `
    <div class="modal">
      ${modalHead()}
      ${toolbar(cs)}
      <div class="pdr-body pdr-scroll">${state.view === 'list' ? listView(cs) : facultyView(cs)}</div>
      <div class="modal-foot">
        <div class="note">Read-only · Responses captured from the faculty planning form</div>
        <button class="pa-btn pa-btn--secondary-grey" data-act="close">Close</button>
      </div>
    </div>`;
  document.getElementById('app').innerHTML = chrome(modal);
}

/* ---------- Events ----------------------------------------- */

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const cs = roster();

  switch (el.dataset.act) {
    case 'view':
      state.view = el.dataset.view;
      break;
    case 'row': {
      const id = el.dataset.id;
      state.expanded[id] = !state.expanded[id];
      break;
    }
    case 'toggle-all': {
      const ids = visibleIds(cs);
      const allExpanded = ids.length > 0 && ids.every(id => !!state.expanded[id]);
      state.expanded = {};
      if (!allExpanded) ids.forEach(id => { state.expanded[id] = true; });
      break;
    }
    case 'flagged':
      state.flaggedOnly = !state.flaggedOnly;
      break;
    case 'select':
      state.selected = Number(el.dataset.i);
      break;
    case 'close':
      return; // wire to your own dismiss
  }
  render();
});

render();
