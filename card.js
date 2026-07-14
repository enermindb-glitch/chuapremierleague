/* Renders a player's digital card and lets them download it as a PNG.
   Requires html2canvas + qrcode (loaded via CDN in player.html). */

function renderPlayerCard(player, containerEl) {
  containerEl.innerHTML = `
    <div id="player-card-template">
      <div class="pc-header">
        <span>Chuka Premier League</span>
        <span class="cpl">${player.cplNumber || 'CPL-PENDING'}</span>
      </div>
      <img class="pc-photo" src="${player.photoUrl || 'https://placehold.co/380x200/0F2E1D/F5F1E6?text=No+Photo'}" alt="${player.name}">
      <div class="pc-name">${player.name}</div>
      <div class="pc-meta">${player.team || ''} &middot; ${player.position || ''} &middot; Season ${CPL_CONFIG.season}</div>
      <div id="pc-qr-slot" class="pc-qr"></div>
    </div>
    <div style="margin-top:16px">
      <button class="btn btn-gold" id="download-card-btn" ${player.cplNumber ? '' : 'disabled'}>Download my player card</button>
      ${player.cplNumber ? '' : '<p class="form-note">Your card unlocks once your CPL number is assigned (after registration payment is confirmed).</p>'}
    </div>
  `;

  if (player.cplNumber && window.QRCode) {
    new QRCode(document.getElementById('pc-qr-slot'), {
      text: `${window.location.origin}${window.location.pathname.replace('player.html','verify.html')}?cpl=${player.cplNumber}`,
      width: 64, height: 64,
    });
  }

  const btn = document.getElementById('download-card-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      html2canvas(document.getElementById('player-card-template')).then(canvas => {
        const link = document.createElement('a');
        link.download = `${player.cplNumber || 'cpl-card'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    });
  }
}
