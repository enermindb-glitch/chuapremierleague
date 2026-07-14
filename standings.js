/* Renders a standings table into a container element. */

function renderStandingsTable(rows, containerEl, opts = {}) {
  if (!rows || !rows.length) {
    containerEl.innerHTML = `<div class="empty-state">No standings yet — check back after the first matchday.</div>`;
    return;
  }
  const sorted = [...rows].sort((a, b) => (+b.pts || 0) - (+a.pts || 0));
  const qualifySpots = opts.qualifySpots || 0;

  const rowsHtml = sorted.map((r, i) => `
    <tr class="team-row ${i < qualifySpots ? 'qualify' : ''}">
      <td class="pos">${i + 1}</td>
      <td class="club">${linkTeam(r.team)}</td>
      <td>${r.p ?? ''}</td>
      <td>${r.w ?? ''}</td>
      <td>${r.d ?? ''}</td>
      <td>${r.l ?? ''}</td>
      <td>${r.gf ?? ''}</td>
      <td>${r.ga ?? ''}</td>
      <td>${(+r.gf || 0) - (+r.ga || 0)}</td>
      <td class="pts">${r.pts ?? ''}</td>
    </tr>
  `).join('');

  containerEl.innerHTML = `
    <table class="standings">
      <thead>
        <tr>
          <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  `;
}

function linkTeam(name) {
  if (!name) return '';
  return `<a href="team.html?team=${encodeURIComponent(name)}">${name}</a>`;
}

function renderTopScorers(rows, containerEl, limit = 5) {
  if (!rows || !rows.length) {
    containerEl.innerHTML = `<div class="empty-state">No stats recorded yet.</div>`;
    return;
  }
  const sorted = [...rows].sort((a, b) => (+b.goals || 0) - (+a.goals || 0)).slice(0, limit);
  containerEl.innerHTML = sorted.map((p, i) => `
    <div class="fixture" style="grid-template-columns: 40px 1fr auto;">
      <span class="mono muted">${i + 1}</span>
      <span><strong>${p.name}</strong><br><span class="muted" style="font-size:0.85rem">${linkTeam(p.team)}</span></span>
      <span class="badge-num">${p.goals} G</span>
    </div>
  `).join('');
}
