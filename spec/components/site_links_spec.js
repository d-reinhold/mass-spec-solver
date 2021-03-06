require('../spec_helper');

let SiteLinks, Actions;

describe('SiteLinks', () => {
  beforeEach(() => {
    SiteLinks = require('components/site_links');
    Actions = require('runtime/actions');
    spyOn(Actions, 'navigate');
    spyOn(Actions, 'updateOffline');
    spyOn(Actions, 'updateAlgorithm');

    let props = {currentPage: 'About', strategy: {algorithm: 'simple', offline: false}};
    ReactDOM.render(<SiteLinks {...props}/>, root);
  });

  it('renders the current page as plain text', () => {
    expect('.site-links li:contains(About)').toExist();
    expect('.site-links a:contains(About)').not.toExist();
  });

  it('renders the other pages as links', () => {
    expect('.site-links a:contains(Solve)').toExist();
    expect('.site-links a:contains(Templates)').toExist();
    expect('.site-links a:contains(Code)').toExist();
  });

  describe('clicking a link', () => {
    it('calls the update function', () => {
      $('.site-links a:contains(Templates)').simulate('click');
      expect(Actions.navigate).toHaveBeenCalledWith('Templates', _, undefined);
    });
  });

  describe('the options dropdown', () => {
    beforeEach(() => {
      $('.site-links button:contains(Options)').click();
    });

    it('renders a checkbox with the current offline state', () => {
      expect('.site-links .dropdown-menu label:contains(Offline) input[type="checkbox"]').toHaveProp('checked', false);
    });

    it('renders a section of radio boxes indicating the current algorithm', () => {
      expect('.site-links .dropdown-menu label:contains(Simple recursive) input[type="radio"]').toHaveProp('checked', true);
      expect('.site-links .dropdown-menu label:contains(Meet in the Middle) input[type="radio"]').toHaveProp('checked', false);
      expect('.site-links .dropdown-menu label:contains(MitM with Binary Search) input[type="radio"]').toHaveProp('checked', false);
    });

    describe('clicking the "offline" checkbox', () => {
      it('calls the update function', () => {
        $('.site-links .dropdown-menu label:contains(Offline) input[type="checkbox"]').simulate('check');
        
        expect(Actions.updateOffline).toHaveBeenCalledWith(true, _);
      });
    });

    describe('selecting a different algorithm', () => {
      it('calls the update function', () => {
        $('.site-links .dropdown-menu label:contains(MitM with Binary Search) input[type="radio"]').simulate('change');
        
        expect(Actions.updateAlgorithm).toHaveBeenCalledWith('mitm_bs', _);
      });
    });
  });
});