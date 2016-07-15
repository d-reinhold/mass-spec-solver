const React = require('react');
const {Icon} = require('pui-react-iconography');
const {Tooltip} = require('pui-react-tooltip');
const {OverlayTrigger} = require('pui-react-overlay-trigger');
const Actions = require('runtime/actions');

const exampleTemplates = {
  'example - (O)2(H)7(C)11': {page:'Solve', totalMass:'171.0473', totalCharge:'', maxError:'0.01', rows:[{id:134, coef:'N', range:{min:0, max:'3'}, charge:0, weight:'14.0030740'}, {id:725, coef:'O', range:{min:0, max:'10'}, charge:0, weight:'15.9949150'}, {id:832, coef:'H', range:{min:0, max:'10'}, charge:0, weight:'1.00782500'}, {id:16, coef:'C', range:{min:0, max:'15'}, charge:0, weight:'12.0000000'}]},
  'example - (Na)1(O)4(OAc)4(Co)4(Py)4': {page:'Solve', totalMass:'874.9324', totalCharge:'1', maxError:'0.02', rows:[{id:723, coef:'Cl', range:{min:0, max:'1'}, charge:-1, weight:'34.9694016'}, {id:40, coef:'NH4', range:{min:0, max:'2'}, charge:1, weight:'18.0338254'}, {id:896, coef:'OH2', range:{min:0, max:'2'}, charge:0, weight:'18.0105650'}, {id:228, coef:'CH3CN', range:{min:0, max:'2'}, charge:0, weight:'41.0265490'}, {id:474, coef:'Na', range:{min:0, max:'2'}, charge:1, weight:'22.9892214'}, {id:897, coef:'H', range:{min:0, max:'2'}, charge:1, weight:'1.00727640'}, {id:338, coef:'O', range:{min:0, max:5}, charge:-2, weight:'15.9960122'}, {id:503, coef:'OAc', range:{min:0, max:5}, charge:-1, weight:'59.0138486'}, {id:779, coef:'Co', range:{min:0, max:5}, charge:3, weight:'58.9315522'}, {id:16, coef:'Py', range:{min:0, max:5}, charge:0, weight:'79.0422000'}]}
};

class TemplatesPage extends React.Component {
  render() {
    return (
      <div className="templates-page">
        <h3>Templates</h3>
         <ul className="list-unstyled">
        {
          Object.entries(exampleTemplates).concat(Object.entries(this.props.templates)).map(([name, data]) => (
            <li key={name} className="row">
              <span className="col-md-22"><a onClick={Actions.resetState.bind(null, {...data, ...{page: 'Solve', activeTemplateName: name}})}>{name}</a></span>
              {!Object.keys(exampleTemplates).includes(name) &&
                <a href="javascript:void(0)" className="action-icon col-xs-2" onClick={Actions.removeTemplate.bind(null, name)}>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Delete this Template</Tooltip>}>
                    <Icon name="close" size="h3"/>
                  </OverlayTrigger>
                </a>
              }
            </li>
          ))
        }
        </ul>
        <p>
          You can save mass spec problems as templates to reuse later.
          This allows you to solve similar problems without having to fill in the same fragments over and over.
          You can create templates by clicking 'save as template' on the <a onClick={Actions.resetState.bind(null, {page: 'Solve'})}>Solve</a> page.
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
