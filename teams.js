/* Powers team.html — reads ?team=NAME from the URL and assembles
   that team's header, standing, squad, fixtures and top scorer
   from the same data already used across the rest of the site. */

async function loadTeamPage() {
  const params = new URLSearchParams(window.location.search);
  const teamName = params.get('team');
  const root = document.getElementById('team-root');
  if (!teamName) {
    root.innerHTML = `<div class="empty-state">No team specified.</div>`;
    return;
  }

  // Search both leagues since the team name alone doesn't tell us which
  const [teamsA, teamsB] = await Promise.all([CPL_DATA.getTeams('A'), CPL_DATA.getTeams('B')]);
  let league = 'A', team = teamsA.find(t => t.name === teamName);
  if (!team) { team = teamsB.find(t => t.name === teamName); league = 'B'; }

  if (!team) {
    root.innerHTML = `<div class="empty-state">Team "${teamName}" not found.</div>`;
    return;
  }

  const [standings, fixtures, stats] = await Promise.all([
    CPL_DATA.getStandings(league),
    CPL_DATA.getFixtures(league),
    CPL_DATA.getPlayerStats(league),
  ]);

  const standingRow = standings.find(s => s.team === teamName);
  const teamStats = stats.filter(s => s.team === teamName).sort((a, b) => (+b.goals || 0) - (+a.goals || 0));

  document.title = `${team.name} — Chuka Premier League`;

  root.innerHTML = `
    <div class="hero" style="background: linear-gradient(160deg, ${team.color || 'var(--pitch)'} 0%, var(--pitch-light) 100%); padding: 56px 0;">
      <div class="wrap">
        <div class="eyebrow">LEAGUE ${league} &middot; ${team.ground || ''}</div>
        <h1>${team.name}</h1>
        <p class="lede">${team.bio || ''} ${team.coach ? `Coached by ${team.coach}.` : ''}</p>
        ${standingRow ? `<div class="chip chip-active" style="font-size:0.9rem">League position: #${standings.indexOf(standingRow) + 1} &middot; ${standingRow.pts} pts</div>` : ''}
      </div>
    </div>

    <div class="wrap section">
      <div class="grid-2">
        <div>
          <div class="section-head"><h2 class="mt-0">Squad</h2></div>
          ${teamStats.length ? teamStats.map(p => `
            <div class="fixture" style="grid-template-columns: 1fr auto;">
              <span><a href="player.html?id=${encodeURIComponent(p.name)}"><strong>${p.name}</strong></a></span>
              <span class="mono muted">${p.goals || 0} G &middot; ${p.assists || 0} A</span>
            </div>
          `).join('') : `<div class="empty-state">No squad records yet.</div>`}
        </div>
        <div>
          <div class="section-head"><h2 class="mt-0">Recent &amp; Upcoming</h2></div>
          <div id="team-fixtures"></div>
        </div>
      </div>
    </div>
  `;

  renderFixtureList(fixtures, document.getElementById('team-fixtures'), { team: teamName });
}
