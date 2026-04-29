import * as math from "mathjs";
import { rootFinding, tangentLine } from "./newtons_method";
import {Chart, registerables} from 'chart.js'

// Axes:
const step = 0.1;
const minX = -Math.PI;
const maxX = Math.PI;
const minY = -3;
const maxY = 5;

// Function Expressions:
const expr = math.parse('cos(x)+sin(x)');

// String ver.
const tangent = tangentLine(3, expr);
const tangentExpr = math.parse(tangent);

// Compiled
const compiled = expr.compile();
const compiledTan = tangentExpr.compile();

// Points:
interface coords {
    x: number,
    y: number,
};

let points: coords[] = [];
let tanPoints: coords[] = [];
const roots: coords[] = [];
const tanRoots: coords[] = [];

// Calculate Points
function calcPoints(min: number, max: number, step: number, points: coords[], expr: math.EvalFunction): void {
    for(let x = min; x <= max; x += step) {
        let y = expr.evaluate({x});
        if (typeof y === 'number' && isFinite(y)) {
            points.push({x, y});
        }
    }
}

calcPoints(minX, maxX, step, points, compiled);
calcPoints(minX, maxX, step, tanPoints, compiledTan);

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

calcRoots(points, roots);
calcRoots(tanPoints, tanRoots);

Chart.register(...registerables);

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const axisGrid = {
    color: (ctx: any) => ctx.tick.value === 0 ? '#000000' : '#e0e0e0',
    lineWidth: (ctx: any) => ctx.tick.value === 0 ? 2 : 1
};

new Chart(canvas, {
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