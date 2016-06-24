const React = require('react');
const PureComponent = require('./pure_component');

class Formula extends PureComponent {
  render() {
    const {count, fragment} = this.props;
    if (count === 0) return null;
      const formula = fragment.split('').map((char, charIndex) => {
      return isFinite(char) ? <sub key={charIndex}>{char}</sub> : <span key={charIndex}>{char}</span>;
    });
    return <span className="formula mlxs">({formula})<sub>{count}</sub></span>;
  }
};

module.exports = Formula;
