function subsetSum(array, sum) {
    var table = [];
    for(let i = 0; i <= sum; i++) {
        // no sums are possible with an empty array
        table[i] = [false];
    }
    for(let j = 0; j <= array.length; j++) {
        // all subsets can sum to 0
        table[0][j] = true;
    }
    // from 0 to 852.9421
    for(let i = 1; i <= sum; i++) {
        for(let j = 1; j <= array.length; j++) {
            // if it was possible to reach this sum without the new element,
            // then it's still possible with the new element.
            table[i][j] = table[i][j-1];
            if (i >= array[j-1]) {
                // if the new sum we are considering is greater than the new
                // element, we should check if it was possible to reach
                // sum (i - array[j-1]) without using the new element.
                // if so, this new sum is possible.
                table[i][j] = table[i][j] || table[i - array[j-1]][j-1];
            }
        }
    }
    return table[sum][array.length];
}
