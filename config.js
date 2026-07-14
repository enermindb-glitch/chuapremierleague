/* ===========================================================
   CHUKA PREMIER LEAGUE — CONFIG
   Fill these in once your Google Sheet and Firebase project exist.
   Until then, every page falls back to SAMPLE DATA automatically
   so you can see the full site working right away.
=========================================================== */

const CPL_CONFIG = {

  // ---- Google Sheets (published-to-web CSV links) ----
  // In your Sheet: File > Share > Publish to web > select each tab > CSV.
  // Paste the resulting link for each tab below. Leave blank to use sample data.
  sheets: {
    teamsA:        "",
    teamsB:        "",
    fixturesA:     "",
    fixturesB:     "",
    resultsA:      "",
    resultsB:      "",
    standingsA:    "",
    standingsB:    "",
    playerStatsA:  "",
    playerStatsB:  "",
    referees:      "",
    news:          "",
    equipment:     "",
  },

  // ---- Apps Script Web App (deployed from Code.gs) ----
  // Used for: enquiry form submissions, CPL number lookups for /verify
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbwE2CJh_-XU7ztD-mmK8jCftYROqa0-JkNFZnvMLzOxxc0Am-vhDfCSvIA4aJ5ZWtoc/exec",

  // ---- Firebase project config ----
  // From Firebase Console > Project Settings > General > Your apps > SDK setup
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  },

  season: "2026",
};
