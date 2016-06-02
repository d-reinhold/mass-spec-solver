const React = require('react');

const SiteLinks = ({currentPage, update}) => {
  const updatePage = (page, e) => {
    e.preventDefault();
    update({page});
  };

  let links = ['Solve', 'Examples', 'About'].map(page => {
    const link = page === currentPage ? page : <a href="javascript:void(0)" onClick={updatePage.bind(null, page)}>{page}</a>;
    return <li className="phl" key={page}>{link}</li>;
  });

  links.push(
    <li className="phl" key={'Code'}>
      <a href="https://github.com/d-reinhold/mass-spec-solver" target="_blank">Code</a>
    </li>
  );

  return <ul className="site-links list-unstyled list-inline">{links}</ul>;
};

module.exports = SiteLinks;