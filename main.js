let width = window.innerWidth;
let height = window.innerHeight;
let tween;
let stage, layer, dragLayer, targets, connectors;
let quadLine, bezierLine;
let curveLayer, lineLayer, anchorLayer, quad, bezier, randomColor;
let GUIDELINE_OFFSET = 10;
let lastDist, startScale, activeShape, triangle, circle;
let textNode, tr;
let tooltipLayer, tooltip, data, colors, nodeCount, startLayer;

function menuItemClicked(src) {
    const lastScript = document.getElementById('script-artist');
    if (lastScript) lastScript.remove();
    let starsScript = document.createElement('script');
    starsScript.src = src;
    starsScript.id = 'script-artist';
    document.head.appendChild(starsScript);
}

document.getElementById("menu-1").addEventListener('click', function (e) {
    menuItemClicked('./scripts/stars.js');
});

document.getElementById("menu-2").addEventListener('click', function (e) {
    menuItemClicked('./scripts/snapping.js');
});

document.getElementById("menu-3").addEventListener('click', function (e) {
    menuItemClicked('./scripts/connected.js');
});

document.getElementById("menu-4").addEventListener('click', function (e) {
    menuItemClicked('./scripts/modify-curves-anchor.js');
});

document.getElementById("menu-5").addEventListener('click', function (e) {
    menuItemClicked('./scripts/collision-detection.js');
});

document.getElementById("menu-6").addEventListener('click', function (e) {
    menuItemClicked('./scripts/multi-touch-scale.js');
});

document.getElementById("menu-7").addEventListener('click', function (e) {
    menuItemClicked('./scripts/text.js');
});

document.getElementById("menu-8").addEventListener('click', function (e) {
    menuItemClicked('./scripts/20000nodes.js');
});