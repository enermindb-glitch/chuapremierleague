/* ===========================================================
   CHUKA PREMIER LEAGUE — DATA LAYER
   Fetches each Google Sheet tab (published as CSV) and parses it.
   If a sheet URL isn't configured yet, falls back to sample data
   so the site is fully browsable before your real Sheet is wired up.
=========================================================== */

// ---------- Sample data (used until config.js has real Sheet URLs) ----------

const SAMPLE = {
  teams: {
    A: [
      { name: "Chuka Town FC", ground: "Chuka Stadium", coach: "J. Mwangi", color: "#0F2E1D", bio: "Reigning league A champions." },
      { name: "Igamba United", ground: "Igamba Grounds", coach: "P. Kirimi", color: "#C8102E", bio: "Known for a fast attacking style." },
      { name: "Karingani Rangers", ground: "Karingani Pitch", coach: "S. Njue", color: "#1D4A30", bio: "Community club, founded 2014." },
      { name: "Magutuni FC", ground: "Magutuni Grounds", coach: "D. Kobia", color: "#D4A017", bio: "Strong home record this season." },
    ],
    B: [
      { name: "Ndagani Stars", ground: "Ndagani Field", coach: "A. Muriithi", color: "#0F2E1D", bio: "Youth academy side." },
      { name: "Kathwana FC", ground: "Kathwana Grounds", coach: "L. Kinya", color: "#C8102E", bio: "Newly promoted this season." },
      { name: "Gaturi United", ground: "Gaturi Pitch", coach: "M. Njeru", color: "#1D4A30", bio: "Solid defensive record." },
      { name: "Mitheru Rovers", ground: "Mitheru Grounds", coach: "F. Kiogora", color: "#D4A017", bio: "Known for developing young talent." },
    ],
  },
  fixtures: {
    A: [
      { matchday: 5, date: "2026-07-19", home: "Chuka Town FC", away: "Igamba United", venue: "Chuka Stadium", referee: "R. Mutuma", status: "scheduled" },
      { matchday: 5, date: "2026-07-19", home: "Karingani Rangers", away: "Magutuni FC", venue: "Karingani Pitch", referee: "B. Kaburu", status: "scheduled" },
      { matchday: 4, date: "2026-07-12", home: "Igamba United", away: "Karingani Rangers", venue: "Igamba Grounds", referee: "R. Mutuma", status: "played", homeGoals: 2, awayGoals: 1 },
      { matchday: 4, date: "2026-07-12", home: "Magutuni FC", away: "Chuka Town FC", venue: "Magutuni Grounds", referee: "B. Kaburu", status: "played", homeGoals: 0, awayGoals: 3 },
    ],
    B: [
      { matchday: 5, date: "2026-07-20", home: "Ndagani Stars", away: "Kathwana FC", venue: "Ndagani Field", referee: "J. Gitonga", status: "scheduled" },
      { matchday: 5, date: "2026-07-20", home: "Gaturi United", away: "Mitheru Rovers", venue: "Gaturi Pitch", referee: "P. Muthomi", status: "scheduled" },
      { matchday: 4, date: "2026-07-13", home: "Kathwana FC", away: "Gaturi United", venue: "Kathwana Grounds", referee: "J. Gitonga", status: "played", homeGoals: 1, awayGoals: 1 },
      { matchday: 4, date: "2026-07-13", home: "Mitheru Rovers", away: "Ndagani Stars", venue: "Mitheru Grounds", referee: "P. Muthomi", status: "played", homeGoals: 2, awayGoals: 2 },
    ],
  },
  standings: {
    A: [
      { pos: 1, team: "Chuka Town FC", p: 4, w: 3, d: 1, l: 0, gf: 9, ga: 3, pts: 10 },
      { pos: 2, team: "Igamba United", p: 4, w: 3, d: 0, l: 1, gf: 8, ga: 4, pts: 9 },
      { pos: 3, team: "Magutuni FC", p: 4, w: 1, d: 1, l: 2, gf: 5, ga: 6, pts: 4 },
      { pos: 4, team: "Karingani Rangers", p: 4, w: 0, d: 1, l: 3, gf: 3, ga: 8, pts: 1 },
    ],
    B: [
      { pos: 1, team: "Gaturi United", p: 4, w: 2, d: 2, l: 0, gf: 6, ga: 3, pts: 8 },
      { pos: 2, team: "Ndagani Stars", p: 4, w: 2, d: 1, l: 1, gf: 7, ga: 5, pts: 7 },
      { pos: 3, team: "Mitheru Rovers", p: 4, w: 1, d: 2, l: 1, gf: 5, ga: 5, pts: 5 },
      { pos: 4, team: "Kathwana FC", p: 4, w: 0, d: 3, l: 1, gf: 4, ga: 6, pts: 3 },
    ],
  },
  playerStats: {
    A: [
      { name: "Kevin Mutwiri", team: "Chuka Town FC", goals: 5, assists: 2, yellow: 1, red: 0 },
      { name: "Brian Kaimenyi", team: "Igamba United", goals: 4, assists: 3, yellow: 0, red: 0 },
      { name: "Dennis Muthee", team: "Magutuni FC", goals: 3, assists: 1, yellow: 2, red: 0 },
    ],
    B: [
      { name: "Erick Mwenda", team: "Gaturi United", goals: 4, assists: 1, yellow: 0, red: 0 },
      { name: "Felix Kanyua", team: "Ndagani Stars", goals: 3, assists: 2, yellow: 1, red: 0 },
    ],
  },
  referees: [
    { name: "R. Mutuma", contact: "07xx xxx xxx", matches: 4 },
    { name: "B. Kaburu", contact: "07xx xxx xxx", matches: 4 },
    { name: "J. Gitonga", contact: "07xx xxx xxx", matches: 4 },
    { name: "P. Muthomi", contact: "07xx xxx xxx", matches: 4 },
  ],
  news: [
    { title: "Season 2026 kicks off across both leagues", date: "2026-06-01", body: "League A and League B fixtures for the new season have been released, with 12 teams competing in each. Matches run every weekend through the season.", image: "" },
    { title: "Registration closes for late team entries", date: "2026-06-15", body: "Teams wishing to join the 2026 season were required to complete registration and payment by mid-June. Player registration remains open on a rolling basis.", image: "" },
  ],
  equipment: [
    { item: "Match balls", category: "Balls", quantity: 12, condition: "Good", sponsor: "Chuka Sports Traders", show: true },
    { item: "Referee kits", category: "Kits", quantity: 4, condition: "New", sponsor: "CPL League Fund", show: true },
    { item: "First-aid kits", category: "Medical", quantity: 8, condition: "Good", sponsor: "", show: true },
    { item: "Corner flags", category: "Other", quantity: 24, condition: "Worn", sponsor: "", show: false },
  ],
};

// ---------- CSV fetch helper ----------

function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    if (!url) return reject(new Error('no url configured'));
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    });
  });
}

// ---------- Public data-fetching functions (Sheet first, sample fallback) ----------

const CPL_DATA = {
  async getTeams(league) {
    const url = CPL_CONFIG.sheets[league === 'A' ? 'teamsA' : 'teamsB'];
    try { return await fetchCSV(url); }
    catch { return SAMPLE.teams[league]; }
  },
  async getFixtures(league) {
    const url = CPL_CONFIG.sheets[league === 'A' ? 'fixturesA' : 'fixturesB'];
    try { return await fetchCSV(url); }
    catch { return SAMPLE.fixtures[league]; }
  },
  async getStandings(league) {
    const url = CPL_CONFIG.sheets[league === 'A' ? 'standingsA' : 'standingsB'];
    try { return await fetchCSV(url); }
    catch { return SAMPLE.standings[league]; }
  },
  async getPlayerStats(league) {
    const url = CPL_CONFIG.sheets[league === 'A' ? 'playerStatsA' : 'playerStatsB'];
    try { return await fetchCSV(url); }
    catch { return SAMPLE.playerStats[league]; }
  },
  async getReferees() {
    try { return await fetchCSV(CPL_CONFIG.sheets.referees); }
    catch { return SAMPLE.referees; }
  },
  async getNews() {
    try { return await fetchCSV(CPL_CONFIG.sheets.news); }
    catch { return SAMPLE.news; }
  },
  async getEquipment() {
    try {
      const rows = await fetchCSV(CPL_CONFIG.sheets.equipment);
      return rows.filter(r => String(r.show).toLowerCase() === 'yes' || String(r.show).toLowerCase() === 'true');
    } catch {
      return SAMPLE.equipment.filter(r => r.show);
    }
  },
};
