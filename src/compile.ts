import * as math from "mathjs";
import { rootFinding, tangentLine } from "./newtons_method";
import {Chart, registerables} from 'chart.js'

const expr = math.parse('x^2-2');
const compiled = expr.compile();

const tangent = tangentLine(1, expr);
const tangentExpr = math.parse(tangent);
const compiledTan = tangentExpr.compile();

const step = 0.1;
const minX = -2;
const maxX = 2;
const minY = -3;
const maxY = 5;

let points: {x : number, y: number}[] = [];
let tanPoints: {x: number, y: number}[] = [];

for(let x = minX; x <= maxX; x += step) {
    let y = compiled.evaluate({x});
    let tanY = compiledTan.evaluate({x});
    if (typeof y === 'number' && isFinite(y)) {
        points.push({x, y});
    }
    if (typeof tanY === 'number' && isFinite(y)) {
        tanPoints.push({x, y: tanY});
    }
}

const roots: { x: number; y: number }[] = [];
const tanRoots: {x: number; y: number}[] = [];
for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    if (prev.y * curr.y < 0) {
        // Sign changed — interpolate to estimate where y = 0
        const t = -prev.y / (curr.y - prev.y);
        const xAtZero = prev.x + t * (curr.x - prev.x);
        roots.push({ x: xAtZero, y: 0 });
    }
}

for (let i = 1; i < tanPoints.length; i++) {
    const prev = tanPoints[i - 1];
    const curr = tanPoints[i];
    if (prev.y * curr.y < 0) {
        // Sign changed — interpolate to estimate where y = 0
        const t = -prev.y / (curr.y - prev.y);
        const xAtZero = prev.x + t * (curr.x - prev.x);
        tanRoots.push({ x: xAtZero, y: 0 });
    }
}

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