const React = require('react');
const PureComponent = require('./pure_component');
const CitationModalBody = require('./modals/citation_modal_body');
const FeedbackModalBody = require('./modals/feedback_modal_body');
const Actions = require('runtime/actions');

class Footer extends PureComponent {
  render() {
    return (
      <footer>
        <ul className="list-inline-divider mbn mtxl">
          <li>© 2016 Dominick Reinhold</li>
          <li><a href="https://github.com/d-reinhold/mass-spec-solver/blob/master/LICENSE" target="_blank">MIT License</a></li>
          <li><a onClick={Actions.openModal.bind(null, {title: 'Cite Mass Spec Solver', Body: CitationModalBody})} href="javascript:void(0)">Cite</a></li>
          <li><a onClick={Actions.openModal.bind(null, {title: 'Leave Feedback', Body: FeedbackModalBody})} href="javascript:void(0)">Feedback</a></li>
        </ul>
      </footer>
    );
  }
}

module.exports = Footer;