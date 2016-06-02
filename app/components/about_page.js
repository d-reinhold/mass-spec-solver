const React = require('react');

class AboutPage extends React.Component {
  render() {
    return (
      <div>
        <h3>About</h3>
        <p>
          When performing chemistry research, chemical reactions are often performed without the researcher knowing exactly what the result will be. The inputs are known: the various elements and molecules present during the reaction, as well as their proportions and masses. The output of a reaction can be analysed using a technique called <a href="http://www2.chemistry.msu.edu/faculty/reusch/virttxtjml/spectrpy/massspec/masspec1.htm" target="_blank">Mass Spectrometry</a>. This gives the researcher the exact masses of the different molecules present in the output compound. The question is, given this information, how does one determine the proportions of the elements present in a particular molecule in the output compound? In other words, how can we determine the molecular formula of the result of a chemical reaction?
          </p>
          <p>
            We can phrase the question in a more abstract way: given a list of numbers (the masses of the available elements), find all subsets that sum to a particular value (the mass of the target molecule in the output). Formalized this way, we find this problem is a special case of a well known problem in Computer Science, the <a href="https://en.wikipedia.org/wiki/Subset_sum_problem" target="_blank">Subset Sum problem</a> (which itself is a special case of the even more popular <a href="https://en.wikipedia.org/wiki/Knapsack_problem" target="_blank">Knapsack problem</a>).
          </p>
          <p>
            There are very simple algorithms for solving Knapsack problems; a basic recursive algorithm can be written in  less than 10 lines of code. However, such algorithms are exponential in complexity, meaning that as the size of the inputs grows linearly, the running time of the program grows exponentially. And unfortunately, both Knapsack and Subset Sum are <a href="https://en.wikipedia.org/wiki/NP-completeness" target="_blank">NP-Complete</a> problems, meaning it is very unlikely that polynomial-time algorithms exist which solve these problems exactly. However, there are a few techniques that may improve performance for large problem instances:
          </p>

          <p>
            First of all, we can try to run the computation on faster hardware. I have ported the simple recursive algorithm to <a href="https://aws.amazon.com/lambda" target="_blank">AWS Lambda</a>, which yielded a 2-4x speedup over running the solver on my laptop.
          </p>
          <p>
            We could try optimizing the recursive algorithm further, either by using domain specific heuristics or general techniques like <a href="http://www.cise.ufl.edu/~sahni/papers/computingPartitions.pdf" target="_blank">partitioning</a> or <a href="http://www.diku.dk/~pisinger/95-6.ps" target="_blank">balancing</a>.
          </p>
          <p>
            We could switch to a dynamic programming algorithm. This could result in a pseudo-polynomial time algorithm, if we can constrain our inputs sufficiently and handle the increased memory overhead.
          </p>
          <p>
            Finally, we could explore <a href="http://www.sciencedirect.com/science/article/pii/S0022000003000060" target="_blank">approximation algorithms</a>: fully polynomial time algorithms which may be nondeterminisic or return solutions with small imprecisions.
          </p>
      </div>
    );
  }
}

module.exports = AboutPage;
