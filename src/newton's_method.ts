import {den, derivative, evaluate, MathNode, parse} from 'mathjs'
/* 
let f(x) be some continuous, differentiable function
Newton's method of Root finding is a recursive function that uses the following formula:

x_(n+1) = x_n - (f(x_n))/(f'(x_n))
*/
interface xCoord {
    x: number;
};

// For now, let's use a predefined polynomial
let expr: string = 'e^x - 2';
let f = parse(expr);

function rootFinding(x: xCoord, iterations: number, expr: MathNode): number {
    if (iterations <= 0) {
        return x.x;
    } else {
        let dexpr = derivative(expr, 'x');
        let numerator = expr.evaluate(x);
        let denominator = dexpr.evaluate(x);
        let root = x.x - (numerator/denominator);
        let newX: xCoord = {x: root};
        return rootFinding(newX, iterations - 1, expr);
    }
}

let val: xCoord = {x: 1};

console.log(rootFinding(val, 5, f));