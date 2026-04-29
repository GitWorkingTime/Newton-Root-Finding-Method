import {derivative, evaluate, MathNode, parse} from 'mathjs'
/* 
let f(x) be some continuous, differentiable function
Newton's method of Root finding is a recursive function that uses the following formula:

x_(n+1) = x_n - (f(x_n))/(f'(x_n))
*/

// For now, let's use a predefined polynomial
let expr: string = 'x^2 + 2x - 8';
let f = parse(expr);

// We can find the derivative using the math.js library
let dfExpr = derivative(f, 'x').toString();
let df = parse(dfExpr);

console.log(`f: ${f}`);
console.log(`df: ${df}`);

let xCoord = {x: 1};
let numerator = f.evaluate(xCoord);
let denominator = df.evaluate(xCoord);
let root = xCoord.x - numerator/denominator;
console.log(root);