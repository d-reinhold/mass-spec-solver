const React = require('react');
const SolvePage = require('./solve_page');
const AboutPage = require('./about_page');
const ExamplesPage = require('./examples_page');
const SiteLinks = require('./site_links');
const SolveHelper = require('../helpers/solve_helper');
const AnalyticsHelper = require('../helpers/analytics_helper');
const rison = require('rison');

class Application extends React.Component {
  constructor(props, context) {
    super(props, context);
    const urlState = location.hash.slice(1).length ? rison.decode(location.hash.slice(1)) : {};
    const defaultState = {
      totalMass: 0,
      totalCharge: '',
      maxError: 0.01,
      rows: [SolveHelper.emptyRow()],
      page: 'Solve',
      strategy: {offline: false, algorithm: 'mitm_bs'},
      solutionRows: null,
      solutions: null,
      solving: false,
    };
    this.state = {...defaultState, ...urlState};
    AnalyticsHelper.pageview(this.state.page);
  }

  updateRoute = () => {
    const {totalMass, totalCharge, maxError, rows, page, strategy} = this.state;
    history.pushState(null, null, `#${rison.encode({totalMass, totalCharge, maxError, rows, page, strategy})}`);
  };

  update = (state) => {
    if (Object.keys(state).includes('page')) { AnalyticsHelper.pageview(state.page); }
    this.setState(state, this.updateRoute);
  }

  render() {
    const Pages = {Solve: SolvePage, Examples: ExamplesPage, About: AboutPage};
    const {page, strategy} = this.state;
    const Page = Pages[page];
    return (
      <div className="pvxl phxxxl mass-spec-solver">
        <SiteLinks currentPage={page} strategy={strategy} update={this.update}/>
        <h1>Mass Spec Solver</h1>
        <Page {...{...this.state, update: this.update}}/>
      </div>
    );
  }
}

module.exports = Application;
