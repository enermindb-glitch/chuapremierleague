/* Renders fixture/result lists and the scoreboard ticker. */

function renderFixtureList(rows, containerEl, opts = {}) {
  if (!rows || !rows.length) {
    containerEl.innerHTML = `<div class="empty-state">No fixtures scheduled yet.</div>`;
    return;
  }
  let list = [...rows];
  if (opts.team) list = list.filter(f => f.home === opts.team || f.away === opts.team);
  if (opts.status) list = list.filter(f => f.status === opts.status);
  list.sort((a, b) => new Date(b.date) - new Date(a.date));

  containerEl.innerHTML = list.map(f => {
    const played = f.status === 'played';
    const score = played ? `${f.homeGoals ?? f.homegoals ?? '–'} : ${f.awayGoals ?? f.awaygoals ?? '–'}` : 'vs';
    return `
      <div class="fixture">
        <span class="date">${formatDate(f.date)}</span>
        <span class="home">${linkTeam(f.home)}</span>
        <span class="vs">${score}</span>
        <span class="away">${linkTeam(f.away)}</span>
        <span class="muted" style="font-size:0.82rem">${f.venue || ''}</span>
        ${f.referee ? `<span class="ref">Referee: ${f.referee}</span>` : ''}
      </div>
    `;
  }).join('');
}

function renderTicker(fixturesA, fixturesB, containerEl) {
  const combined = [...(fixturesA || []), ...(fixturesB || [])]
    .filter(f => f.status === 'scheduled')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10);

  if (!combined.length) {
    containerEl.innerHTML = `<div class="ticker-inner"><span class="ticker-item">No upcoming fixtures scheduled yet</span></div>`;
    return;
  }

  containerEl.innerHTML = `<div class="ticker-inner">${combined.map(f => `
    <span class="ticker-item">
      <span class="tag">${formatDate(f.date)}</span>
      <span>${f.home}</span> <span class="score">v</span> <span>${f.away}</span>
    </span>
  `).join('')}</div>`;
}

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}
