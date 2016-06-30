const React = require('react');
const {resetState} = require('runtime/actions');

class ExamplesPage extends React.Component {
  render() {
    return (
      <div>
        <h3>Examples</h3>
        <p>
          <a onClick={resetState.bind(null, {totalMass:'171.0473', totalCharge:'', maxError:'0.01', rows:[{id:134, coef:'N', range:{min:0, max:'3'}, charge:0, weight:'14.0030740'}, {id:725, coef:'O', range:{min:0, max:'10'}, charge:0, weight:'15.9949150'}, {id:832, coef:'H', range:{min:0, max:'10'}, charge:0, weight:'1.00782500'}, {id:16, coef:'C', range:{min:0, max:'15'}, charge:0, weight:'12.0000000'}], page:'Solve', strategy:{offline:false, algorithm:'mitm_bs'}, solutions:null, solving:false})}>(O)2(H)7(C)11</a>
        </p>
        <p>
          <a onClick={resetState.bind(null, {totalMass:'874.9324', totalCharge:'1', maxError:'0.02', rows:[{id:723, coef:'Cl', range:{min:0, max:'1'}, charge:-1, weight:'34.9694016'}, {id:40, coef:'NH4', range:{min:0, max:'2'}, charge:1, weight:'18.0338254'}, {id:896, coef:'OH2', range:{min:0, max:'2'}, charge:0, weight:'18.0105650'}, {id:228, coef:'CH3CN', range:{min:0, max:'2'}, charge:0, weight:'41.0265490'}, {id:474, coef:'Na', range:{min:0, max:'2'}, charge:1, weight:'22.9892214'}, {id:897, coef:'H', range:{min:0, max:'2'}, charge:1, weight:'1.00727640'}, {id:338, coef:'O', range:{min:0, max:5}, charge:-2, weight:'15.9960122'}, {id:503, coef:'OAc', range:{min:0, max:5}, charge:-1, weight:'59.0138486'}, {id:779, coef:'Co', range:{min:0, max:5}, charge:3, weight:'58.9315522'}, {id:16, coef:'Py', range:{min:0, max:5}, charge:0, weight:'79.0422000'}], page:'Solve', strategy:{offline:false, algorithm:'mitm_bs'}, solutions:null, solving:false})}>(Na)1(O)4(OAc)4(Co)4(Py)4</a>
        </p>
      </div>
    );
  }
}

module.exports = ExamplesPage;
