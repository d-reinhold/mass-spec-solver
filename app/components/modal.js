const React = require('react');
const PureComponent = require('./pure_component');
const {BaseModal, ModalBody, ModalFooter} = require('pui-react-modals');
const {DefaultButton} = require('pui-react-buttons');
const Actions = require('runtime/actions');

class Modal extends PureComponent {
  render() {
    return (
      <BaseModal title={this.props.title} show={this.props.open} onHide={Actions.closeModal}>
        <ModalBody>{this.props.body}</ModalBody>
        <ModalFooter>
          <DefaultButton onClick={Actions.closeModal}>Close</DefaultButton>
        </ModalFooter>
      </BaseModal>
    );
  }
}

module.exports = Modal;