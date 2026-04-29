import { parse } from "mathjs";
import { rootFinding, xCoord } from "./newton's_method";

let expr = 'e^x - 2';
let f = parse(expr);

let val: xCoord = {x: 2};
console.log(rootFinding(val, 3, f));