require('../spec_helper');

let Modal, Actions, props;

describe('Modal', () => {
  beforeEach(() => {
    Modal = require('components/Modal');
    Actions = require('runtime/actions');
    spyOn(Actions, 'closeModal');
    props = {
      open: true,
      title: 'Check out this modal!',
      Body: () => <p>Fill this space with important text!</p>
    };
  });

  describe('when the modal is closed', () => {
    it('renders nothing', () => {
      props.open = false;
      ReactDOM.render(<Modal {...props}/>, root);

      expect(root).toContainText('');
    });
  });

  describe('when the modal is open', () => {
    beforeEach(() => {
      props.open = true;
      ReactDOM.render(<Modal {...props}/>, root);
    });
    
    it('renders the title in the modal-title', () => {
      expect('.modal-title').toContainText('Check out this modal!');
    });

    it('renders the body in the modal-body', () => {
      expect('.modal-body').toContainText('Fill this space with important text!');
    });

    describe('clicking Close', () => {
      it('calls the closeModal action', () => {
        $('.modal-footer button:contains(Close)').simulate('click');
        expect(Actions.closeModal).toHaveBeenCalled();
      });
    });
  });
});