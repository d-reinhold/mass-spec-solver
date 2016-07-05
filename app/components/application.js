const React = require('react');
const Analytics = require('./analytics');
const SolvePage = require('./solve_page');
const AboutPage = require('./about_page');
const ExamplesPage = require('./examples_page');
const Modal = require('./modal');
const Footer = require('./footer');
const SiteLinks = require('./site_links');

class Application extends React.Component {
  render() {
    const Pages = {Solve: SolvePage, Examples: ExamplesPage, About: AboutPage};
    const {page, strategy} = this.props;
    const Page = Pages[page];
    return (
      <div className="ptxl pbm phxxxl mass-spec-solver">
        <div className="content">
          <Analytics page={page}/>
          <SiteLinks currentPage={page} strategy={strategy}/>
          <h1>Mass Spec Solver</h1>
          <Page {...this.props}/>
          <Modal {...this.props.modal}/>
        </div>
        <Footer/>
      </div>
    );
  }
}

module.exports = Application;
