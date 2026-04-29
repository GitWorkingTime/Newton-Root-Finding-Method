import * as math from "mathjs";
import { rootFinding, tangentLine } from "./newtons_method";
import {Chart, registerables} from 'chart.js'

// Points:
interface coords {
    x: number,
    y: number,
};

Chart.register(...registerables);
let chart: Chart | null = null;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

// Calculate Points
function calcPoints(min: number, max: number, step: number, points: coords[], expr: math.EvalFunction): void {
    for(let x = min; x <= max; x += step) {
        let y = expr.evaluate({x});
        if (typeof y === 'number' && isFinite(y)) {
            points.push({x, y});
        }
    }
}

function calcRoots(points: coords[], rootBuf: coords[]): void {
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        if (prev.y * curr.y < 0) {
            // Sign changed — interpolate to estimate where y = 0
            const t = -prev.y / (curr.y - prev.y);
            const xAtZero = prev.x + t * (curr.x - prev.x);
            rootBuf.push({ x: xAtZero, y: 0 });
        }
    }
}

function calcTangent(startingPoint: number, iterations: number, expr: math.MathNode) {
    let tangent: string = '';
    if (iterations <= 1) {
        tangent = tangentLine(startingPoint, expr);
    } else {
        const nextStartingPoint = rootFinding(startingPoint, iterations - 1, expr);
        tangent = tangentLine(nextStartingPoint, expr);
    }

    const expression = math.parse(tangent);
    return expression
}

function getInputs() {
    return {
        step: parseFloat((document.getElementById("step") as HTMLInputElement).value),
        minX: parseFloat((document.getElementById("minX") as HTMLInputElement).value),
        minY: parseFloat((document.getElementById("minY") as HTMLInputElement).value),
        maxX: parseFloat((document.getElementById("maxX") as HTMLInputElement).value),
        maxY: parseFloat((document.getElementById("maxY") as HTMLInputElement).value),
        iterations: parseFloat((document.getElementById("iterations") as HTMLInputElement).value),
        startingPoint: parseFloat((document.getElementById("startX") as HTMLInputElement).value),
        expr: math.parse((document.getElementById("expr") as HTMLInputElement).value)   
    }
}

function plot(){
    const errEl = document.getElementById("error") as HTMLDivElement;
    errEl.textContent = '';

    try {
        const {step, minX, minY, maxX, maxY, iterations, startingPoint, expr} = getInputs();

        // Validation:
        if (minX > maxX) throw new Error ("Min X must be less than Max X");
        if (minY > maxX) throw new Error ("Min Y must be less than Max Y");
        if (step <= 0) throw new Error ("Step must be positive and non-zero");
        if (iterations < 1) throw new Error ("Iterations must be at least 1");

        const compiledExpr = expr.compile();
    
        // Function:
        let points: coords[] = [];
        let roots: coords[] = [];
    
        calcPoints(minX, maxX, step, points, compiledExpr);
        calcRoots(points, roots);
    
        // Tangent Line:
        let tanPoints: coords[] = [];
        let tanRoots: coords[] = [];
    
        let tangent = calcTangent(startingPoint, iterations, expr);
        calcPoints(minX, maxX, step, tanPoints, tangent.compile());
        calcRoots(tanPoints, tanRoots);

        if (chart) chart.destroy();


        const axisGrid = {
            color: (ctx: any) => ctx.tick.value === 0 ? '#000000' : '#e0e0e0',
            lineWidth: (ctx: any) => ctx.tick.value === 0 ? 2 : 1
        };

        chart = new Chart(canvas, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'f(x)',
                    data: points,
                    borderColor: '#378ADD',
                    pointRadius: 0
                },
                {
                    label: 'tangent line',
                    data: tanPoints,
                    borderColor: '#dd3737',
                    pointRadius: 0
                },
                {
                    label: 'roots',
                    data: roots,
                    backgroundColor: '#c9d5f1',
                    borderColor: '#a5a7b1',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    showLine: false
                },
                {
                    label: 'tangent roots',
                    data: tanRoots,
                    backgroundColor: '#c9d5f1',
                    borderColor: '#a5a7b1',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    showLine: false
                },
            ]
            },
            options: {
                scales: {
                    x: { type: 'linear',
                        min: minX,
                        max: maxX,
                        grid: axisGrid },
                    y: { type: 'linear',
                        min: minY,
                        max: maxY,
                        grid: axisGrid }
                },
                maintainAspectRatio: true,
                aspectRatio: 2
            }
        });

    } catch (e) {
        errEl.textContent = 'Error: ' + (e instanceof Error ? e.message : String(e)); 
    }
}

document.getElementById('plot-btn')!.addEventListener('click', plot);
plot();