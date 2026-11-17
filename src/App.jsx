import React, { useState, useEffect, useMemo } from 'react';
import './styles.css';

const KEY = 'acl-service-hours-v1';

const PROGRAMS = {
  ENV110: {
    code: 'ENV110',
    name: 'Campus Green Team',
    partner: 'University Facilities & Urban Forestry Collective',
    description:
      'Maintain campus pollinator gardens, audit recycling stations, and run weekend tree-planting drives with local conservationists.',
    teams: {
      '2024/25': {
        supervisors: ['Dr. Elena Rostova'],
        coordinators: ['Maya Lin', 'Devon Brooks'],
      },
      '2025/26': {
        supervisors: ['Dr. Elena Rostova', 'Prof. Marcus Vance'],
        coordinators: ['Jordan Taylor'],
      },
    },
  },
  EDU210: {
    code: 'EDU210',
    name: 'Peer Tutoring Circle',
    partner: 'Eastside Youth Learning Center',
    description:
      'Provide small-group homework coaching and reading workshops for middle-school students after classes.',
    teams: {
      '2024/25': {
        supervisors: ['Prof. Hannah Okafor'],
        coordinators: ['Samir Patel'],
      },
      '2025/26': {
        supervisors: ['Prof. Hannah Okafor'],
        coordinators: ['Chloe Kim', 'Lucas Meyer'],
      },
    },
  },
  HLT150: {
    code: 'HLT150',
    name: 'Blood Drive Crew',
    partner: 'Regional Red Cross Donor Services',
    description:
      'Support donor check-in, post-donation refreshment stations, and campus awareness booths during bi-monthly blood drives.',
    teams: {
      '2024/25': {
        supervisors: ['Dr. Aris Thorne'],
        coordinators: ['Nadia Al-Mansoor'],
      },
      '2025/26': {
        supervisors: ['Dr. Aris Thorne', 'Nurse Claire Bennett'],
        coordinators: ['Nadia Al-Mansoor', 'Ethan Cole'],
      },
    },
  },
  COM305: {
    code: 'COM305',
    name: 'Community Kitchen',
    partner: 'St. Jude Neighborhood Pantry',
    description:
      'Prep fresh ingredients, pack hot takeaway meals, and organize dry-goods boxes for local families.',
    teams: {
      '2024/25': {
        supervisors: ['Chef David Morales'],
        coordinators: ['Tessa Lindqvist', 'Omar Farooq'],
      },
      '2025/26': {
        supervisors: ['Chef David Morales'],
        coordinators: ['Tessa Lindqvist'],
      },
    },
  },
  TEC220: {
    code: 'TEC220',
    name: 'Digital Skills for Seniors',
    partner: 'Silver Oak Community Library',
    description:
      'Host patient 1-on-1 drop-in sessions helping older adults set up video calls, spot phishing messages, and manage smartphones.',
    teams: {
      '2024/25': {
        supervisors: ['Prof. Kenji Takahashi'],
        coordinators: ['Grace Hopper-Reid'],
      },
      '2025/26': {
        supervisors: ['Prof. Kenji Takahashi'],
        coordinators: ['Liam O’Connor', 'Priya Nair'],
      },
    },
  },
};

const seed = [
  {
    id: 'e1',
    programCode: 'ENV110',
    hours: 4,
    reflection:
      'Mulched the north quad beds and sorted 12 bins of lab plastics. Bring sturdy gloves—the tools are provided.',
    owner: 'other',
    name: 'Maya Lin',
    date: '2025-10-12',
  },
  {
    id: 'e2',
    programCode: 'EDU210',
    hours: 3,
    reflection:
      'Helped three 7th graders with fractions and science fair posters. Very rewarding and well-organized.',
    owner: 'other',
    name: 'Samir Patel',
    date: '2025-10-18',
  },
  {
    id: 'e3',
    programCode: 'COM305',
    hours: 5,
    reflection:
      'Fast-paced morning shift prepping 140 soup and bread kits. Time flies once the kitchen line gets moving.',
    owner: 'other',
    name: 'Tessa Lindqvist',
    date: '2025-10-24',
  },
  {
    id: 'e4',
    programCode: 'TEC220',
    hours: 2,
    reflection:
      'Spent two hours helping two patrons organize photos and set up two-factor authentication. Low stress, high impact.',
    owner: 'other',
    name: 'Priya Nair',
    date: '2025-11-02',
  },
  {
    id: 'e5',
    programCode: 'HLT150',
    hours: 6,
    reflection:
      'Full-day drive shift managing the recovery snack table and greeting first-time student donors.',
    owner: 'other',
    name: 'Ethan Cole',
    date: '2025-11-05',
  },
  {
    id: 'e6',
    programCode: 'EDU210',
    hours: 2,
    reflection:
      'Quiet afternoon reading session. Great option if you only have a 2-hour block free between lectures.',
    owner: 'other',
    name: 'Chloe Kim',
    date: '2025-11-09',
  },
  {
    id: 'e7',
    programCode: 'ENV110',
    hours: 3,
    reflection:
      'Planted native ferns along the creek trail. Coordinators briefed everyone clearly in the first 10 minutes.',
    owner: 'you',
    name: 'You',
    date: '2025-11-11',
  },
];

function readRoute() {
  const hash = window.location.hash || '';
  const match = hash.match(/^#\/programs\/([^/?#]+)/i);
  if (match) {
    return { view: 'program', code: decodeURIComponent(match[1]).toUpperCase() };
  }
  return { view: 'home', code: null };
}

function loadEntries() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seed;
  } catch {
    return seed;
  }
}

export default function App() {
  const [entries, setEntries] = useState(loadEntries);
  const [route, setRoute] = useState(readRoute);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [hourFilter, setHourFilter] = useState('ALL');
  const [checkCode, setCheckCode] = useState('EDU210');

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [programCode, setProgramCode] = useState('');
  const [hours, setHours] = useState('');
  const [reflection, setReflection] = useState('');
  const [formError, setFormError] = useState('');
  const [bannerMessage, setBannerMessage] = useState('');

  // Persist entries to localStorage
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(entries));
  }, [entries]);

  // Listen for hash changes
  useEffect(() => {
    const onHashChange = () => {
      setRoute(readRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const openProgram = (code) => {
    const clean = String(code || '').trim().toUpperCase();
    if (!clean) return;
    window.location.hash = `#/programs/${encodeURIComponent(clean)}`;
  };

  const goHome = () => {
    window.location.hash = '#/';
  };

  // Overview statistics
  const stats = useMemo(() => {
    const totalEntries = entries.length;
    const totalHours = entries.reduce((sum, e) => sum + Number(e.hours || 0), 0);
    const avgHours = totalEntries ? (totalHours / totalEntries).toFixed(1) : '0.0';
    const activePrograms = new Set(entries.map((e) => e.programCode.toUpperCase())).size;

    const distribution = [1, 2, 3, 4, 5, 6, 7, 8].map((h) => ({
      hour: h,
      count: entries.filter((e) => Number(e.hours) === h).length,
    }));
    const maxDistCount = Math.max(1, ...distribution.map((d) => d.count));

    return { totalEntries, totalHours, avgHours, activePrograms, distribution, maxDistCount };
  }, [entries]);

  // Program Check calculation
  const programCheckStats = useMemo(() => {
    const clean = checkCode.trim().toUpperCase();
    if (!clean) return null;
    const matched = entries.filter((e) => e.programCode.toUpperCase() === clean);
    const count = matched.length;
    const total = matched.reduce((sum, e) => sum + Number(e.hours || 0), 0);
    const avg = count ? (total / count).toFixed(1) : '0.0';
    return {
      code: clean,
      info: PROGRAMS[clean] || null,
      count,
      total,
      avg,
    };
  }, [checkCode, entries]);

  // Filtered entries for feed
  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesHour =
        hourFilter === 'ALL' || Number(entry.hours) === Number(hourFilter);
      const matchesSearch =
        !q ||
        entry.programCode.toLowerCase().includes(q) ||
        (entry.reflection || '').toLowerCase().includes(q) ||
        (entry.name || '').toLowerCase().includes(q);
      return matchesHour && matchesSearch;
    });
  }, [entries, searchQuery, hourFilter]);

  // Detect if user already has an entry for the typed programCode
  const yourExistingForTypedCode = useMemo(() => {
    const clean = programCode.trim().toUpperCase();
    if (!clean) return null;
    return entries.find(
      (e) => e.owner === 'you' && e.programCode.toUpperCase() === clean && e.id !== editingId
    );
  }, [entries, programCode, editingId]);

  const resetForm = () => {
    setEditingId(null);
    setProgramCode('');
    setHours('');
    setReflection('');
    setFormError('');
  };

  const startEdit = (entry) => {
    if (entry.owner !== 'you') return;
    setEditingId(entry.id);
    setProgramCode(entry.programCode);
    setHours(String(entry.hours));
    setReflection(entry.reflection || '');
    setFormError('');
    if (route.view !== 'home') {
      goHome();
    }
    setTimeout(() => {
      document.getElementById('log-form-panel')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const save = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanCode = programCode.trim().toUpperCase();
    if (!cleanCode) {
      setFormError('Program code is required (e.g., EDU210).');
      return;
    }

    const parsedHours = Number(hours);
    if (!Number.isInteger(parsedHours) || parsedHours < 1 || parsedHours > 8) {
      setFormError('Hours must be a whole number from 1 to 8.');
      return;
    }

    if (editingId) {
      const target = entries.find((item) => item.id === editingId);
      if (!target || target.owner !== 'you') {
        setFormError('You can only edit your own entries.');
        return;
      }

      const duplicate = entries.find(
        (item) =>
          item.owner === 'you' &&
          item.id !== editingId &&
          item.programCode.toUpperCase() === cleanCode
      );
      if (duplicate) {
        setFormError(
          `You already have an entry for ${cleanCode}. Only one entry per program is allowed.`
        );
        return;
      }

      setEntries((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                programCode: cleanCode,
                hours: parsedHours,
                reflection: reflection.trim(),
              }
            : item
        )
      );
      setBannerMessage(`Updated your ${cleanCode} entry (${parsedHours} hrs).`);
      resetForm();
    } else {
      const duplicate = entries.find(
        (item) => item.owner === 'you' && item.programCode.toUpperCase() === cleanCode
      );
      if (duplicate) {
        setFormError(
          `You already logged ${duplicate.hours} hrs for ${cleanCode}. Edit your existing entry instead.`
        );
        return;
      }

      const newEntry = {
        id: `entry-${Date.now()}`,
        programCode: cleanCode,
        hours: parsedHours,
        reflection: reflection.trim(),
        owner: 'you',
        name: 'You',
        date: new Date().toISOString().slice(0, 10),
      };

      setEntries((prev) => [newEntry, ...prev]);
      setBannerMessage(`Logged ${parsedHours} hrs for ${cleanCode}.`);
      resetForm();
    }
  };

  const handleResetData = () => {
    setEntries(seed);
    localStorage.setItem(KEY, JSON.stringify(seed));
    resetForm();
    setSearchQuery('');
    setHourFilter('ALL');
    setBannerMessage('Sample records restored.');
  };

  // Render Program Details View (#/programs/<CODE>)
  if (route.view === 'program' && route.code) {
    const code = route.code;
    const program = PROGRAMS[code];
    const programEntries = entries.filter((e) => e.programCode.toUpperCase() === code);
    const totalProgHours = programEntries.reduce((s, e) => s + Number(e.hours || 0), 0);
    const avgProgHours = programEntries.length
      ? (totalProgHours / programEntries.length).toFixed(1)
      : '0.0';
    const yourEntry = programEntries.find((e) => e.owner === 'you');

    return (
      <div className="app-shell">
        <header className="topbar">
          <div className="topbar-inner">
            <button type="button" className="btn-link" onClick={goHome}>
              ← Back to Service Hours Hub
            </button>
            <div className="topbar-actions">
              <span className="user-pill">Signed in as: You</span>
              <button type="button" className="btn-ghost" onClick={handleResetData}>
                Reset data
              </button>
            </div>
          </div>
        </header>

        <main className="container program-detail-layout">
          <section className="card program-hero">
            <div className="program-hero-header">
              <div>
                <span className="code-badge large">{code}</span>
                {program ? (
                  <>
                    <h1>{program.name}</h1>
                    <p className="partner-line">
                      <strong>Partner Organisation:</strong> {program.partner}
                    </p>
                  </>
                ) : (
                  <>
                    <h1>Program details not yet added</h1>
                    <p className="muted">
                      This program code is not in the official directory yet, but student activity
                      for <strong>{code}</strong> is tracked below.
                    </p>
                  </>
                )}
              </div>

              <div className="hero-cta">
                {yourEntry ? (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => startEdit(yourEntry)}
                  >
                    Edit your {code} entry ({yourEntry.hours}h)
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setProgramCode(code);
                      setEditingId(null);
                      goHome();
                    }}
                  >
                    + Log hours for {code}
                  </button>
                )}
              </div>
            </div>

            {program && <p className="program-desc">{program.description}</p>}

            <div className="mini-stats-row">
              <div className="mini-stat">
                <span className="mini-stat-value">{programEntries.length}</span>
                <span className="mini-stat-label">Logged Entries</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-value">{avgProgHours} hrs</span>
                <span className="mini-stat-label">Avg Time Commitment</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-value">{totalProgHours} hrs</span>
                <span className="mini-stat-label">Total Hours Logged</span>
              </div>
            </div>
          </section>

          {program && (
            <section className="card">
              <h2>Program Team History</h2>
              <div className="team-grid">
                {['2025/26', '2024/25'].map((year) => {
                  const team = program.teams[year];
                  return (
                    <div key={year} className="team-year-card">
                      <h3>Academic Year {year}</h3>
                      <p>
                        <strong>Faculty Supervisors:</strong>{' '}
                        {team?.supervisors?.join(', ') || 'TBA'}
                      </p>
                      <p>
                        <strong>Student Coordinators:</strong>{' '}
                        {team?.coordinators?.join(', ') || 'TBA'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section className="card">
            <h2>Volunteer Reflections &amp; Logged Hours ({programEntries.length})</h2>
            {programEntries.length === 0 ? (
              <p className="empty-state">
                No volunteer entries logged for {code} yet. Be the first to share your experience!
              </p>
            ) : (
              <div className="entry-list">
                {programEntries.map((entry) => (
                  <article
                    key={entry.id}
                    className={`entry-card ${entry.owner === 'you' ? 'is-you' : ''}`}
                  >
                    <div className="entry-top">
                      <div className="entry-meta">
                        <strong>{entry.name}</strong>
                        {entry.owner === 'you' && <span className="you-tag">You</span>}
                        <span className="dot">•</span>
                        <span className="muted">{entry.date}</span>
                      </div>
                      <div className="entry-right">
                        <span className="hours-pill">{entry.hours} hrs</span>
                        {entry.owner === 'you' && (
                          <button
                            type="button"
                            className="btn-small"
                            onClick={() => startEdit(entry)}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="entry-reflection">
                      {entry.reflection || <em className="muted">No reflection written.</em>}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  // Render Main Hub View
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <h1 className="app-title">Service Hours Hub</h1>
            <p className="app-subtitle">
              Compare student time commitments, read volunteer reflections, and log your hours
            </p>
          </div>
          <div className="topbar-actions">
            <span className="user-pill">Signed in as: You</span>
            <button type="button" className="btn-ghost" onClick={handleResetData}>
              Reset data
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        {bannerMessage && (
          <div className="banner-success" role="status">
            <span>{bannerMessage}</span>
            <button type="button" className="banner-close" onClick={() => setBannerMessage('')}>
              ×
            </button>
          </div>
        )}

        {/* Step 1: Compare Programs */}
        <section className="section-block">
          <div className="section-header">
            <h2>1. Explore Community Service Programs</h2>
            <span className="muted">
              Click any program to view full details, team contacts, and volunteer reviews
            </span>
          </div>

          <div className="program-cards-grid">
            {Object.values(PROGRAMS).map((prog) => {
              const progEntries = entries.filter(
                (e) => e.programCode.toUpperCase() === prog.code
              );
              const totalH = progEntries.reduce((s, e) => s + Number(e.hours || 0), 0);
              const avgH = progEntries.length ? (totalH / progEntries.length).toFixed(1) : '—';
              const youLogged = progEntries.find((e) => e.owner === 'you');

              return (
                <div key={prog.code} className="card program-summary-card">
                  <div className="prog-card-top">
                    <button
                      type="button"
                      className="code-badge clickable"
                      onClick={() => openProgram(prog.code)}
                    >
                      {prog.code} ↗
                    </button>
                    {youLogged ? (
                      <span className="status-logged">Logged ({youLogged.hours}h)</span>
                    ) : (
                      <span className="status-open">Available to log</span>
                    )}
                  </div>

                  <h3 className="prog-card-title">
                    <a
                      href={`#/programs/${prog.code}`}
                      onClick={(e) => {
                        e.preventDefault();
                        openProgram(prog.code);
                      }}
                    >
                      {prog.name}
                    </a>
                  </h3>
                  <p className="prog-partner">{prog.partner}</p>

                  <div className="prog-card-metrics">
                    <div>
                      <span className="metric-num">{avgH === '—' ? '—' : `${avgH}h`}</span>
                      <span className="metric-lbl">Avg / entry</span>
                    </div>
                    <div>
                      <span className="metric-num">{progEntries.length}</span>
                      <span className="metric-lbl">Volunteers</span>
                    </div>
                    <div>
                      <span className="metric-num">{totalH}h</span>
                      <span className="metric-lbl">Total</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Overview Stats + Program Check */}
        <section className="overview-grid">
          <div className="card">
            <h2>Community Overview &amp; Shift Length Distribution</h2>
            <div className="kpi-row">
              <div className="kpi-box">
                <span className="kpi-val">{stats.totalEntries}</span>
                <span className="kpi-lbl">Total Entries</span>
              </div>
              <div className="kpi-box">
                <span className="kpi-val">{stats.avgHours}h</span>
                <span className="kpi-lbl">Avg Hours / Entry</span>
              </div>
              <div className="kpi-box">
                <span className="kpi-val">{stats.activePrograms}</span>
                <span className="kpi-lbl">Active Programs</span>
              </div>
            </div>

            <div className="dist-wrapper">
              <div className="dist-header">
                <span className="dist-title">
                  Hours distribution (1–8 hrs) — click a bar to filter feed
                </span>
                {hourFilter !== 'ALL' && (
                  <button
                    type="button"
                    className="btn-link small"
                    onClick={() => setHourFilter('ALL')}
                  >
                    Clear {hourFilter}h filter
                  </button>
                )}
              </div>

              <div className="dist-bars">
                {stats.distribution.map((bucket) => {
                  const isSelected = String(hourFilter) === String(bucket.hour);
                  const heightPct = Math.round((bucket.count / stats.maxDistCount) * 100);
                  return (
                    <button
                      key={bucket.hour}
                      type="button"
                      className={`dist-bar-col ${isSelected ? 'selected' : ''}`}
                      onClick={() =>
                        setHourFilter(isSelected ? 'ALL' : String(bucket.hour))
                      }
                      title={`${bucket.count} entries with ${bucket.hour} hours`}
                    >
                      <span className="dist-count">{bucket.count}</span>
                      <div className="dist-track">
                        <div
                          className="dist-fill"
                          style={{ height: `${bucket.count === 0 ? 4 : Math.max(14, heightPct)}%` }}
                        />
                      </div>
                      <span className="dist-label">{bucket.hour}h</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Program Check Widget */}
          <div className="card">
            <h2>Quick Program Check</h2>
            <p className="muted">
              Enter any program code (listed or custom) to inspect its effort stats.
            </p>

            <div className="check-input-row">
              <input
                type="text"
                value={checkCode}
                onChange={(e) => setCheckCode(e.target.value.toUpperCase())}
                placeholder="e.g., EDU210"
                aria-label="Program code to check"
              />
              {programCheckStats?.code && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => openProgram(programCheckStats.code)}
                >
                  Open page ↗
                </button>
              )}
            </div>

            {programCheckStats && (
              <div className="check-result-box">
                <div className="check-result-title">
                  <strong>{programCheckStats.code}</strong>
                  <span>
                    {programCheckStats.info
                      ? ` — ${programCheckStats.info.name}`
                      : ' — Unlisted Program'}
                  </span>
                </div>
                <div className="check-metrics">
                  <div>
                    <strong>{programCheckStats.avg} hrs</strong>
                    <span>Avg per entry</span>
                  </div>
                  <div>
                    <strong>{programCheckStats.count}</strong>
                    <span>Entries</span>
                  </div>
                  <div>
                    <strong>{programCheckStats.total} hrs</strong>
                    <span>Total hours</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Step 2 & 3: Feed + Log/Edit Form */}
        <section className="workspace-grid">
          {/* Left Column: Searchable Reflections Feed */}
          <div className="card">
            <div className="feed-header">
              <h2>2. Volunteer Reflections &amp; Activity ({filteredEntries.length})</h2>

              <div className="filter-controls">
                <input
                  type="search"
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search program code, reflection, or volunteer..."
                  aria-label="Search entries"
                />

                <select
                  value={hourFilter}
                  onChange={(e) => setHourFilter(e.target.value)}
                  aria-label="Filter by hours"
                >
                  <option value="ALL">All hours (1–8)</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                    <option key={h} value={h}>
                      {h} {h === 1 ? 'hour' : 'hours'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredEntries.length === 0 ? (
              <div className="empty-state">
                <p>No entries match your current search or hour filter.</p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setHourFilter('ALL');
                  }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="entry-list">
                {filteredEntries.map((entry) => (
                  <article
                    key={entry.id}
                    className={`entry-card ${entry.owner === 'you' ? 'is-you' : ''}`}
                  >
                    <div className="entry-top">
                      <div className="entry-meta">
                        <a
                          href={`#/programs/${entry.programCode}`}
                          className="code-badge clickable"
                          onClick={(e) => {
                            e.preventDefault();
                            openProgram(entry.programCode);
                          }}
                          title={`Open ${entry.programCode} program page`}
                        >
                          {entry.programCode}
                        </a>
                        <strong>{entry.name}</strong>
                        {entry.owner === 'you' && <span className="you-tag">You</span>}
                        <span className="dot">•</span>
                        <span className="muted">{entry.date}</span>
                      </div>

                      <div className="entry-right">
                        <span className="hours-pill">{entry.hours} hrs</span>
                        {entry.owner === 'you' && (
                          <button
                            type="button"
                            className="btn-small"
                            onClick={() => startEdit(entry)}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="entry-reflection">
                      {entry.reflection || <em className="muted">No reflection provided.</em>}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Log / Edit Hours Form */}
          <aside id="log-form-panel" className="card form-panel">
            <h2>{editingId ? 'Edit Your Service Entry' : '3. Log Your Service Hours'}</h2>
            <p className="muted">
              {editingId
                ? 'Update the program code, hours (1–8), or reflection for your entry.'
                : 'Log 1 to 8 hours for a program. You may record one entry per program.'}
            </p>

            <form onSubmit={save} noValidate>
              <div className="form-group">
                <label htmlFor="programCodeInput">Program code *</label>
                <input
                  id="programCodeInput"
                  type="text"
                  value={programCode}
                  onChange={(e) => setProgramCode(e.target.value.toUpperCase())}
                  placeholder="e.g., EDU210"
                  required
                />
                <div className="quick-chips">
                  {Object.keys(PROGRAMS).map((code) => {
                    const alreadyLogged = entries.some(
                      (e) => e.owner === 'you' && e.programCode === code && e.id !== editingId
                    );
                    return (
                      <button
                        key={code}
                        type="button"
                        className={`chip ${programCode === code ? 'active' : ''}`}
                        onClick={() => setProgramCode(code)}
                        title={
                          alreadyLogged
                            ? `${code} already logged by you`
                            : `Select ${code}`
                        }
                      >
                        {code}
                        {alreadyLogged ? ' ✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {yourExistingForTypedCode && (
                <div className="inline-warning">
                  <span>
                    You already logged <strong>{yourExistingForTypedCode.hours} hrs</strong> for{' '}
                    <strong>{yourExistingForTypedCode.programCode}</strong>.
                  </span>
                  <button
                    type="button"
                    className="btn-small"
                    onClick={() => startEdit(yourExistingForTypedCode)}
                  >
                    Switch to Edit
                  </button>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="hoursInput">Hours (1–8) *</label>
                <input
                  id="hoursInput"
                  type="number"
                  min="1"
                  max="8"
                  step="1"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Whole number 1 to 8"
                  required
                />
                <div className="hour-picker-row">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                    <button
                      key={h}
                      type="button"
                      className={`hour-btn ${String(hours) === String(h) ? 'active' : ''}`}
                      onClick={() => setHours(String(h))}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reflectionInput">Reflection (optional)</label>
                <textarea
                  id="reflectionInput"
                  rows="4"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="What did you do, and what should future student volunteers expect?"
                />
              </div>

              {formError && (
                <div className="form-error" role="alert">
                  {formError}
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn-primary full-width">
                  {editingId ? 'Save Changes' : 'Submit Service Hours'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn-secondary full-width"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </aside>
        </section>
      </main>
    </div>
  );
}