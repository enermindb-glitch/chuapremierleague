/* Powers player.html — reads ?id=NAME, finds the player's official
   stats from the Sheet, and (if configured) merges their editable
   Firestore profile (bio, photo, CPL number). If the logged-in user
   IS this player, shows an edit form. */

async function loadPlayerPage() {
  const params = new URLSearchParams(window.location.search);
  const playerName = params.get('id');
  const root = document.getElementById('player-root');
  if (!playerName) {
    root.innerHTML = `<div class="empty-state">No player specified.</div>`;
    return;
  }

  const [statsA, statsB] = await Promise.all([CPL_DATA.getPlayerStats('A'), CPL_DATA.getPlayerStats('B')]);
  const stats = [...statsA, ...statsB].find(p => p.name === playerName);

  if (!stats) {
    root.innerHTML = `<div class="empty-state">No player found with that name.</div>`;
    return;
  }

  // Placeholder profile fields until Firebase is configured / this player has an account
  let profile = { name: stats.name, team: stats.team, position: stats.position || '—', bio: '', photoUrl: '', cplNumber: '' };

  document.title = `${stats.name} — Chuka Premier League`;

  root.innerHTML = `
    <div class="wrap section">
      <div class="grid-2">
        <div class="card">
          <h2 class="mt-0">${stats.name}</h2>
          <p class="muted">${linkTeam(stats.team)} &middot; ${profile.position}</p>
          <div class="grid-3" style="margin-top:20px">
            <div class="card center"><div class="mono" style="font-size:1.6rem">${stats.goals || 0}</div><div class="muted" style="font-size:0.8rem">GOALS</div></div>
            <div class="card center"><div class="mono" style="font-size:1.6rem">${stats.assists || 0}</div><div class="muted" style="font-size:0.8rem">ASSISTS</div></div>
            <div class="card center"><div class="mono" style="font-size:1.6rem">${stats.yellow || 0}/${stats.red || 0}</div><div class="muted" style="font-size:0.8rem">CARDS</div></div>
          </div>
          <div id="player-bio" style="margin-top:20px"></div>
        </div>
        <div id="player-card-slot"></div>
      </div>
    </div>
  `;

  // If Firebase is configured, check whether the logged-in user IS this player,
  // and merge their real editable data (photo, bio, CPL number) before rendering the card
  if (CPL_CONFIG.firebase.apiKey) {
    const me = await getCurrentPlayerProfile();
    if (me && me.name === playerName) {
      profile = { ...profile, ...me };
      renderPlayerCard(profile, document.getElementById('player-card-slot'));
      renderEditableBio(me);
      return;
    } else {
      document.getElementById('player-bio').innerHTML = `<p class="muted">${profile.bio || 'No bio added yet.'}</p>`;
    }
  }

  renderPlayerCard(profile, document.getElementById('player-card-slot'));
}

function renderEditableBio(me) {
  const el = document.getElementById('player-bio');
  el.innerHTML = `
    <div class="field">
      <label>Your bio (visible on your public profile)</label>
      <textarea id="bio-input">${me.bio || ''}</textarea>
    </div>
    <button class="btn btn-primary" id="save-bio-btn">Save changes</button>
    <span id="bio-saved-msg" class="form-note" style="display:none">Saved.</span>
  `;
  document.getElementById('save-bio-btn').addEventListener('click', async () => {
    await updatePlayerProfile({ bio: document.getElementById('bio-input').value });
    document.getElementById('bio-saved-msg').style.display = 'inline';
  });
}
