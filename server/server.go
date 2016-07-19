package main

import (
    "encoding/json"
    "fmt"
    "math"
    "net/http"
    "os"
)

type Solution struct {
    Params []int
    Sum    float64
}

type Row struct {
    Min, Max int
    Weight   float64
}

type Request struct {
    DesiredSum float64
    MaxError   float64
    Rows       []Row
}

/*
curl -X POST -d '{"MaxError":0.01,"DesiredSum":171.0473,"Rows": [{"Min": 0, "Max": 3, "Weight": 14.0030740}, {"Min": 0, "Max": 10, "Weight": 15.994950}, {"Min": 0, "Max": 10, "Weight": 1.00782500}, {"Min": 0, "Max": 15, "Weight": 12.0000000}}' -H "Content-Type: application/json" http://localhost:3001/mass_spec_solver_simple
*/
func main() {
    http.HandleFunc("/mass_spec_solver_simple", solve)
    fmt.Println("listening...")
    err := http.ListenAndServe(":"+os.Getenv("PORT"), nil)
    if err != nil {
        panic(err)
    }
}

func solve(w http.ResponseWriter, r *http.Request) {
    decoder := json.NewDecoder(r.Body)
    var request Request
    err := decoder.Decode(&request)
    if err != nil {
        fmt.Println(err)
    }

    var params []int
    solutions := recursiveSolve(request.Rows, request.DesiredSum, 0, params, request.MaxError, request.MaxError+request.DesiredSum)

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(solutions)
}

func recursiveSolve(rows []Row, desiredSum float64, sum float64, params []int, maxError float64, maxSum float64) []Solution {
    var solutions []Solution
    if len(rows) == 0 {
        if math.Abs(sum-desiredSum) < maxError {
            solutions = append(solutions, Solution{params, sum})
        }
        return solutions
    } else if sum < maxSum {
        for param := rows[0].Min; param <= rows[0].Max; param++ {
            foo := append([]int(nil), params...)
            newSolutions := recursiveSolve(rows[1:], desiredSum, sum+float64(param)*rows[0].Weight, append(foo, param), maxError, maxSum)
            solutions = append(solutions, newSolutions...)
        }
    }
    return solutions
}