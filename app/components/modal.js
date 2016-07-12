const React = require('react');
const PureComponent = require('./pure_component');
const {BaseModal, ModalBody, ModalFooter} = require('pui-react-modals');
const {DefaultButton, HighlightButton} = require('pui-react-buttons');
const Actions = require('runtime/actions');

class Modal extends PureComponent {
  render() {
    const {title, open, Body, confirmAction, confirmText, data} = this.props.modal;
    return (
      <BaseModal title={title} show={open} onHide={Actions.closeModal}>
        <ModalBody>{Body && <Body {...{...data, ...this.props}}/>}</ModalBody>
        <ModalFooter>
          <DefaultButton onClick={Actions.closeModal}>Close</DefaultButton>
          {confirmAction && <HighlightButton onClick={confirmAction}>{confirmText || 'Ok'}</HighlightButton>}
        </ModalFooter>
      </BaseModal>
    );
  }
}

module.exports = Modal;