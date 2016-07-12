const React = require('react');
const {Icon} = require('pui-react-iconography');
const {Tooltip} = require('pui-react-tooltip');
const {OverlayTrigger} = require('pui-react-overlay-trigger');
const Actions = require('runtime/actions');

class TemplatesPage extends React.Component {
  render() {
    return (
      <div className="templates-page">
        <h3>Templates</h3>
         <ul className="list-unstyled">
        {
          Object.entries(this.props.templates).map(([name, data]) => (
            <li key={name} className="row">
              <span className="col-md-22"><a onClick={Actions.resetState.bind(null, {...data, ...{page: 'Solve', activeTemplateName: name}})}>{name}</a></span>
              <a href="javascript:void(0)" className="action-icon col-xs-2" onClick={Actions.removeTemplate.bind(null, name)}>
                <OverlayTrigger placement="top" overlay={<Tooltip>Delete this Template</Tooltip>}>
                  <Icon name="close" size="h3"/>
                </OverlayTrigger>
              </a>
            </li>
          ))
        }
        </ul>
        <p>
          You can save mass spec problems as templates to reuse later.
          This allows you to solve similar problems without having to fill in the same fragments over and over.
          You can create templates by clicking 'save as template' on the <a onClick={Actions.resetState.bind(null, {page: 'Solve'})}>Solve</a> page and providing a descriptive name for your template.
        </p>
        <p>
          After saving, your new template will be listed on the <a onClick={Actions.resetState.bind(null, {page: 'Templates'})}>Templates</a> page.
          Click on a template to be taken back to the <a onClick={Actions.resetState.bind(null, {page: 'Solve'})}>Solve</a> page with the desired fragments filled in.
          From there, you can modify fields and properties to test out new ideas.
          To reset the form to its original values, return to the <a onClick={Actions.resetState.bind(null, {page: 'Templates'})}>Templates</a> page and click the template name.
          If you want to update the template with the new values, simply click 'save as template'.
        </p>
      </div>
    );
  }
}

module.exports = TemplatesPage;
