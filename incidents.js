/*
 * incidents.js — Fetches active incidents from the BECE Server API and displays
 * a banner at the top of the page. Included on every page of the static site.
 */
(function () {
  var API_URL = 'https://server.bulkeditcalendarevents.com/api/incidents/query?status=active';

  function createBanner(incidents) {
    if (!incidents || incidents.length === 0) 
      return;

    var banner = document.createElement('a');
    banner.href = 'incidents.html';
    banner.style.cssText = 'background-color:#c62828;display:block;text-align:center;color:white;padding:.5rem;text-decoration:none;font-size:14px;';

    if (incidents.length === 1) {
      banner.textContent = '\u26A0\uFE0F ' + incidents[0].title + ' \u2014 Click here for details';
    } 
    else {
      banner.textContent = '\u26A0\uFE0F There are ' + incidents.length + ' active incidents \u2014 Click here for details';
    }

    document.body.insertBefore(banner, document.body.firstChild);
  }

  try {
    fetch(API_URL)
      .then(function (res) { return res.json(); })
      .then(createBanner)
      .catch(function () { /* silently ignore — don't break the site */ });
  } 
  catch (e) {
    /* fetch not supported or other error — ignore */
  }
})();
