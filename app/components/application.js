const React = require('react');
const SolvePage = require('./solve_page');
const AboutPage = require('./about_page');
const ExamplesPage = require('./examples_page');
const SiteLinks = require('./site_links');
const SolveHelper = require('../helpers/solve_helper');

class Application extends React.Component {
  constructor(props, context) {
    super(props, context);
    const urlParams = location.search.slice(1).split('&').map(val => val && JSON.parse(decodeURIComponent(val.split('=')[1]) || '""'));
    this.state = {
      totalMass: urlParams[0] || 0,
      totalCharge: urlParams[1] || '',
      maxError: urlParams[2] || 0.01,
      rows: urlParams[3] || [SolveHelper.emptyRow()],
      page: urlParams[4] || 'Solve',
      solutionRows: null,
      solutions: null,
      solving: false
    };
  }

  updateRoute = () => {
    const {totalMass, totalCharge, maxError, rows, page} = this.state;
    history.pushState(null, null, `?totalMass="${totalMass}"&totalCharge="${totalCharge}"&maxError="${maxError}"&rows=${JSON.stringify(rows)}&page="${page}"`);
  };

  update = (state) => {
    this.setState(state, this.updateRoute);
  }

  render() {
    const Pages = {Solve: SolvePage, Examples: ExamplesPage, About: AboutPage};
    const Page = Pages[this.state.page];
    return (
      <div className="pvxl phxxxl mass-spec-solver">
        <SiteLinks currentPage={this.state.page} update={this.update}/>
        <h1>Mass Spec Solver</h1>
        <Page {...{...this.state, update: this.update}}/>
      </div>
    );
  }
}

module.exports = Application;
