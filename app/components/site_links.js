const React = require('react');
const PureComponent = require('./pure_component');
const {DropdownItem, LinkDropdown} = require('pui-react-dropdowns');
const Actions = require('runtime/actions');

class OptionsDropdown extends PureComponent {
  render() {
    const {strategy} = this.props;
    return (
      <LinkDropdown title="Options" closeOnMenuClick={false} pullRight={true} border>
        <DropdownItem href="javascript:void(0)">
          <label>
            Offline
            <input type="checkbox" checked={!!strategy.offline} onChange={Actions.updateOffline.bind(null, !strategy.offline)}/>
          </label>
        </DropdownItem>
        <DropdownItem href="javascript:void(0)">
          <h5>Select Algorithm:</h5>
          <ul className="list-unstyled">
            <li>
              <label>
                Simple recursive
                <input type="radio" checked={strategy.algorithm === 'simple'} onChange={Actions.updateAlgorithm.bind(null, 'simple')}/>
              </label>
            </li>
            <li>
              <label>
                Meet in the Middle (MitM)
                <input type="radio" checked={strategy.algorithm === 'mitm'} onChange={Actions.updateAlgorithm.bind(null, 'mitm')}/>
              </label>
            </li>
            <li>
              <label>
                MitM with Binary Search
                <input type="radio" checked={strategy.algorithm === 'mitm_bs'} onChange={Actions.updateAlgorithm.bind(null, 'mitm_bs')}/>
              </label>
            </li>
          </ul>
        </DropdownItem>
      </LinkDropdown>
    );
  }
};

class SiteLinks extends PureComponent {
  render() {
    const {currentPage, strategy, update} = this.props;
    let links = ['Solve', 'Examples', 'About'].map(page => {
      const link = page === currentPage ?
        <span className="current-page">{page}</span> :
        <a href="javascript:void(0)" onClick={Actions.navigate.bind(null, page)}>{page}</a>;
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