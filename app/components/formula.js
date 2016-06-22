const React = require('react');

class Formula extends React.Component {
  render() {
    const {count, fragment} = this.props;
    if (count === 0) return null;
      const formula = fragment.split('').map((char, charIndex) => {
      return isFinite(char) ? <sub key={charIndex}>{char}</sub> : <span key={charIndex}>{char}</span>;
    });
    return <span className="mlxs">({formula})<sub>{count}</sub></span>;
  }
};

module.exports = Formula;
