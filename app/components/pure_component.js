const PureRenderMixin = require('react-addons-pure-render-mixin');
const React = require('react');

class PureComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
}

module.exports = PureComponent;
