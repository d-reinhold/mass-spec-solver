const React = require('react');
const {DropdownItem, LinkDropdown} = require('pui-react-dropdowns');

class OptionsDropdown extends React.Component {
  updateAlgorithm = (algorithm) => () => {
    this.props.update({strategy: {...this.props.strategy, ...{algorithm}}});
  };

  toggleOffline = () => {
    this.props.update({strategy: {...this.props.strategy, ...{offline: !this.props.strategy.offline}}});
  };

  render() {
    const {strategy} = this.props;
    return (
      <LinkDropdown title="Options" closeOnMenuClick={false} pullRight={true} border>
        <DropdownItem href="#">
          <label>
            Offline
            <input type="checkbox" checked={!!strategy.offline} onChange={this.toggleOffline}/>
          </label>
        </DropdownItem>
        <DropdownItem href="#">
          <h5>Select Algorithm:</h5>
          <ul className="list-unstyled">
            <li>
              <label>
                Simple recursive
                <input type="radio" checked={strategy.algorithm === 'simple'} onChange={this.updateAlgorithm('simple')}/>
              </label>
            </li>
            <li>
              <label>
                Meet in the Middle (MitM)
                <input type="radio" checked={strategy.algorithm === 'mitm'} onChange={this.updateAlgorithm('mitm')}/>
              </label>
            </li>
            <li>
              <label>
                MitM with Binary Search
                <input type="radio" checked={strategy.algorithm === 'mitm_bs'} onChange={this.updateAlgorithm('mitm_bs')}/>
              </label>
            </li>
          </ul>
        </DropdownItem>
      </LinkDropdown>
    );
  }
};

class SiteLinks extends React.Component {
  updatePage = (page, e) => {
    e.preventDefault();
    this.props.update({page});
  };

  render() {
    const {currentPage, strategy, update} = this.props;
    let links = ['Solve', 'Examples', 'About'].map(page => {
      const link = page === currentPage ? page : <a href="javascript:void(0)" onClick={this.updatePage.bind(null, page)}>{page}</a>;
      return <li className="phl" key={page}>{link}</li>;
    });

    return (
      <ul className="site-links list-unstyled list-inline">
        {links}
        <li className="phl" key={'Code'}>
          <a href="https://github.com/d-reinhold/mass-spec-solver" target="_blank">Code</a>
        </li>
        <li className="phl" key={'Options'}>
          <OptionsDropdown {...{strategy, update}}/>
        </li>
      </ul>
    );
  }
};

module.exports = SiteLinks;