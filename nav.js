/* Injects the shared nav + footer into every page.
   Each page just needs: <div id="nav-slot"></div> and <div id="footer-slot"></div> */

function renderNav() {
  const slot = document.getElementById('nav-slot');
  if (!slot) return;
  slot.innerHTML = `
    <nav id="site-nav">
      <div class="nav-inner">
        <a href="index.html" class="nav-brand">CHUKA <span class="accent">PREMIER</span> LEAGUE</a>
        <div class="nav-links">
          <a href="league-a.html">League A</a>
          <a href="league-b.html">League B</a>
          <a href="news.html">News</a>
          <a href="equipment.html">Equipment</a>
          <a href="enquiries.html">Enquiries</a>
          <a href="login.html">Player Login</a>
        </div>
      </div>
    </nav>
  `;
  const here = window.location.pathname.split('/').pop();
  slot.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === here) a.classList.add('active');
  });
}

function renderFooter() {
  const slot = document.getElementById('footer-slot');
  if (!slot) return;
  slot.innerHTML = `
    <footer id="site-footer">
      <div class="wrap">
        <div class="foot-grid">
          <div>
            <h4>Chuka Premier League</h4>
            <p style="max-width:38ch;color:var(--ink-soft)">Two leagues, ${new Date().getFullYear()} season. Standings, fixtures and player records updated after every matchday.</p>
          </div>
          <div>
            <h4>League</h4>
            <a href="league-a.html">League A</a>
            <a href="league-b.html">League B</a>
            <a href="news.html">News</a>
          </div>
          <div>
            <h4>Players &amp; Admin</h4>
            <a href="signup.html">Player Signup</a>
            <a href="login.html">Player Login</a>
            <a href="enquiries.html">Contact Admin</a>
          </div>
        </div>
        <div class="foot-bottom">
          <span>&copy; ${new Date().getFullYear()} Chuka Premier League</span>
          <span>Built on Google Sheets &amp; GitHub Pages</span>
        </div>
      </div>
    </footer>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
});
