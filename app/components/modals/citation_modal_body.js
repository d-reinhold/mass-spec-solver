const React = require('react');

module.exports = () => (
  <div>
    <p>Thanks for using Mass Spec Solver! If these results contribute to a project that leads to a scientific publication, a citation would be appreciated:</p>
    <p>Reinhold, D. <i>Mass Spec Solver</i>. <a href="http://www.mass-spec-solver.com">http://www.mass-spec-solver.com</a>{` (accessed ${(new Date()).toDateString().split(' ').slice(1).join(' ')}).`}</p>
  </div>
);