const React = require('react');
const {Input} = require('pui-react-inputs');
const Actions = require('runtime/actions');

module.exports = ({newTemplateName, activeTemplateName}) => (
  <div>
    <p>
      You can save your current form as a template for later use (accessible from the Templates page).
      These templates are for your eyes only (no data will be sent to a third party server).
      Note: the saved templates will only be accessible from the computer used to save the templates.
    </p>
    <Input label="Template Name" value={newTemplateName || activeTemplateName} onChange={Actions.updateNewTemplateName} autoFocus={true}/>
  </div>
);
