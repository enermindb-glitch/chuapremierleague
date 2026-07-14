/* Renders the /verify.html page: given a CPL number, shows only
   name, photo, team, and eligibility status — never payment details,
   contact info, or anything else private. */

async function loadVerification(cplNumber, containerEl) {
  if (!cplNumber) {
    containerEl.innerHTML = `<div class="empty-state">No CPL number provided. Scan a player's card QR code to verify them.</div>`;
    return;
  }

  containerEl.innerHTML = `<div class="empty-state loading-pulse">Checking registration status…</div>`;

  // In production this calls the Apps Script endpoint, which looks up
  // Player_Registrations by CPL number and returns only safe public fields.
  if (CPL_CONFIG.appsScriptUrl) {
    try {
      const res = await fetch(`${CPL_CONFIG.appsScriptUrl}?action=verify&cpl=${encodeURIComponent(cplNumber)}`);
      const result = await res.json();
      return renderVerifyResult(result, containerEl);
    } catch (e) {
      containerEl.innerHTML = `<div class="empty-state">Couldn't reach the verification service. Try again shortly.</div>`;
      return;
    }
  }

  // Sample fallback so the page is browsable before Apps Script is deployed
  const sample = {
    found: true, name: "Kevin Mutwiri", team: "Chuka Town FC", photoUrl: "",
    status: cplNumber.endsWith('1') ? 'active' : 'not_cleared',
  };
  renderVerifyResult(sample, containerEl);
}

function renderVerifyResult(r, containerEl) {
  if (!r || !r.found) {
    containerEl.innerHTML = `<div class="empty-state">No player found with that CPL number.</div>`;
    return;
  }
  const isActive = r.status === 'active';
  containerEl.innerHTML = `
    <div class="card center" style="max-width:380px;margin:0 auto">
      <img src="${r.photoUrl || 'https://placehold.co/160x160/0F2E1D/F5F1E6?text=' + encodeURIComponent(r.name[0])}"
           style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid var(--gold);margin-bottom:14px">
      <h3 class="mt-0">${r.name}</h3>
      <p class="muted">${r.team}</p>
      <span class="chip ${isActive ? 'chip-active' : 'chip-pending'}" style="font-size:0.9rem;padding:8px 18px">
        ${isActive ? '✅ Active / Cleared to Play' : '⚠️ Not Cleared'}
      </span>
    </div>
  `;
}
