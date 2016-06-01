const React = require('react');

class AboutPage extends React.Component {
  render() {
    return (
      <div>
        <h3>About</h3>
        <p>
          When performing Chemistry research, chemical reactions are often performed without the researcher knowing exactly what the result will be. The inputs are known: the various elements and molecules present during the reaction, as well as their proportions and masses. The output of a reaction can be analysed using a technique called Mass Spectrometry. This gives the researcher the exact masses of all the different molecules present in the output compound. The question is, given this information, how does one determine the elements present in a particular molecule in the output compound? What is its molecular formula?
          </p>
          <p>
            We can phrase the question in a more abstract way: given a list of numbers (the masses of the available elements), find all subsets that sum to a particular value (the weight of a molecule in the output). Formalized this way, we find this problem is a special case of a well known problem in Computer Science, the Subset Sum problem (which itself is a special case of the even more popular Knapsack problem).
          </p>
          <p>
            There are very simple algorithms for solving Knapsack problems; a basic recursive algorithm can be written in  less than 10 lines of code. However, such algorithms are exponential in complexity, meaning that as the size of the inputs grows linearly, the running time of the program grows exponentially. And unfortunately, both Knapsack and Subset Sum are NP-Complete problems, meaning it is very unlikely that polynomial-time algorithms exist which solve these problems exactly. However, there are a few techniques that may improve performance for large problem instances:
          </p>

          <p>
            First of all, we can try to run the computation on faster hardware. I have ported the simple recursive algorithm to AWS Lambda, which yielded a 2-4x speedup over running the solver on my laptop.
          </p>
          <p>
            We could try optimizing the recursive algorithm further, either by using domain specific heuristics or general techniques like balancing or partitioning.
          </p>
          <p>
            We could switch to a dynamic programming algorithm. This could result in a pseudo-polynomial time algorithm, if we can constrain our inputs sufficiently and handle an increased memory overhead.
          </p>
          <p>
            Finally, we could explore approximation algorithms: fully polynomial time algorithms which may not be determinisic or return all solutions.
          </p>
      </div>
    );
  }
}

module.exports = AboutPage;
