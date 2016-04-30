/**
 * Adapted from https://github.com/Khan/react-components/blob/master/js/timeout-transition-group.jsx
 */
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTransitionGroup = require('react-addons-transition-group');
const Velocity = require('velocity-animate');

var transitions = {
  // Forcefeeding: property order = [after, before]
  'slide-forward': {
    duration: 300,
    enter: {
      translateY: [ '0%', '-100%' ],
      opacity: [ '1', '0.01' ]
    },
    leave: {
      translateY: [ '-100%', '0%' ],
      opacity: [ '0.01', '1' ]
    }
  },
  'slide-back': {
    duration: 200,
    enter: {
      translateX: [ '0%', '-100%' ],
    },
    leave: {
      translateX: [ '100%', '0%' ],
    }
  },
  'slideover-forward': {
    duration: 200,
    enter: {
      translateX: [ '0%', '100%' ],
      zIndex: [ 1, 1 ]
    },
    leave: {
      // translateX: [ '0%', '0%' ],
      zIndex: [ 0, 0 ]
    }
  },
  'slideover-back': {
    duration: 200,
    enter: {
      // translateX: [ '0%', '0%' ],
      zIndex: [ 0, 0 ]
    },
    leave: {
      translateX: [ '100%', '0%' ],
      zIndex: [ 1, 1 ]
    }
  },
  default: {
    duration: 200,
    enter: {
      opacity: [ 1, 0 ],
    },
    leave: {
      opacity: [ 0, 1 ],
    }
  }
};

var VelocityTransitionGroupChild = React.createClass({
  propTypes: {
    transitionName: React.PropTypes.string.isRequired,
  },
  _getTransition: function() {
    if (!transitions[this.props.transitionName]) {
      console.warn('TransitionName ' + this.props.transitionName + ' wasn\'t found in VelocityTransitionGroupChild transitions.');
    }
    return transitions[this.props.transitionName] || transitions.default;
  },

  componentWillEnter: function(done) {
    var node = ReactDOM.findDOMNode(this);
    var transition = this._getTransition();
    Velocity(
      node,
      transition.enter,
      {
        duration: transition.duration,
        complete: done
      });
  },

  componentWillLeave: function(done) {
    var node = ReactDOM.findDOMNode(this);
    var transition = this._getTransition();
    Velocity(
      node,
      transition.leave,
      {
        duration: transition.duration,
        complete: done
      });
  },

  render: function() {
    return React.Children.only(this.props.children);
  }
});

var VelocityTransitionGroup = React.createClass({
  propTypes: {
    transitionName: React.PropTypes.string.isRequired,
  },

  _wrapChild: function(child) {
    return (
      <VelocityTransitionGroupChild
        transitionName={this.props.transitionName}
        >
        {child}
      </VelocityTransitionGroupChild>
    );
  },

  render: function() {
    return (
      <ReactTransitionGroup
        {...this.props}
        childFactory={this._wrapChild}
        />
    );
  }
});

module.exports = VelocityTransitionGroup;