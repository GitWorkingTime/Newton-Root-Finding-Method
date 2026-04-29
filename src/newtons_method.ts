import * as math from 'mathjs'
/* 
let f(x) be some continuous, differentiable function
Newton's method of Root finding is a recursive function that uses the following formula:

x_(n+1) = x_n - (f(x_n))/(f'(x_n))
*/
export function rootFinding(x: number, iterations: number, expr: math.MathNode): number {
    if (iterations <= 0) {
        return x;
    } else {
        let dexpr = math.derivative(expr, 'x');
        let numerator = expr.evaluate({x});
        let denominator = dexpr.evaluate({x});
        let root = x - (numerator/denominator);
        return rootFinding(root, iterations - 1, expr);
    }
}

function slope(x: number, expr: math.MathNode): number {
    let dexpr = math.derivative(expr, 'x');
    return dexpr.evaluate({x});
}

export function tangentLine(x: number, expr: math.MathNode): string {
    let compiled = expr.compile();
    let m = slope(x, expr);
    let b = compiled.evaluate({x});
    let tangentLine = `${m}(x - ${x}) + ${b}`;
    return tangentLine;
}