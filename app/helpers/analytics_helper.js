let GoogleAnalytics;

if (window.location.hostname === 'mass-spec-solver.cfapps.io') {
  GoogleAnalytics = require('react-ga');
  GoogleAnalytics.initialize('UA-79749545-1');
}

const AnalyticsHelper = {
  pageview(page) {
    GoogleAnalytics && GoogleAnalytics.pageview(page);
  }
};

module.exports = AnalyticsHelper;