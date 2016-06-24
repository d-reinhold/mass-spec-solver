const React = require('react');
const PureComponent = require('./pure_component');
let GoogleAnalytics;

if (window.location.hostname === 'mass-spec-solver.cfapps.io') {
  GoogleAnalytics = require('react-ga');
  GoogleAnalytics.initialize('UA-79749545-1');
}

class Analytics extends PureComponent {
  render() {
    GoogleAnalytics && GoogleAnalytics.pageview(this.props.page);
    return null;
  }
}

module.exports = Analytics;
