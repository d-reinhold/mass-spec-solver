const React = require('react');
const {DropdownItem, LinkDropdown} = require('pui-react-dropdowns');

const OptionsDropdown = ({strategy, update}) => {
  const updateAlgorithm = (algorithm) => () => {
    update({strategy: {...strategy, ...{algorithm}}});
  };
  const toggleOffline = () => {
    update({strategy: {...strategy, ...{offline: !strategy.offline}}});
  };

  return (
    <LinkDropdown title="Options" closeOnMenuClick={false} pullRight={true} border>
      <DropdownItem href="#">
        <label>
          Offline
          <input type="checkbox" checked={!!strategy.offline} onChange={toggleOffline}/>
        </label>
      </DropdownItem>
      <DropdownItem href="#">
        <h5>Algorithm</h5>
        <ul className="list-unstyled">
          <li>
            <label>
              Meet in the Middle
              <input type="radio" checked={strategy.algorithm === 'mitm'} onChange={updateAlgorithm('mitm')}/>
            </label>
          </li>
          <li>
            <label>
              Simple recursive
              <input type="radio" checked={strategy.algorithm === 'simple'} onChange={updateAlgorithm('simple')}/>
            </label>
          </li>
        </ul>
      </DropdownItem>
    </LinkDropdown>
  );
};

const SiteLinks = ({currentPage, strategy, update}) => {
  const updatePage = (page, e) => {
    e.preventDefault();
    update({page});
  };

  let links = ['Solve', 'Examples', 'About'].map(page => {
    const link = page === currentPage ? page : <a href="javascript:void(0)" onClick={updatePage.bind(null, page)}>{page}</a>;
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
};

module.exports = SiteLinks;