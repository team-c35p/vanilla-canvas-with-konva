stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
    draggable: true
});

layer = new Konva.Layer();
stage.add(layer);

// first generate random rectangles
if (snapping == null) {
    for (let i = 0; i < 5; i++) {
        let rect = new Konva.Rect({
            x: Math.random() * stage.width(),
            y: Math.random() * stage.height(),
            width: 150 + Math.random() * 50,
            height: 150 + Math.random() * 50,
            fill: Konva.Util.getRandomColor(),
            draggable: true,
            name: 'object'
        })
        layer.add(rect);
    }
    snapping = layer;
} else {
    stage.add(snapping);
}

document.getElementById("create").addEventListener("click", function () {
    createStatus = true;
    document.getElementById("top-menu").classList.add("selected");
});

stage.on("click", function (e) {
    if (createStatus) {
        layer.add(
            new Konva.Rect({
                x: e.evt.clientX,
                y: e.evt.clientY,
                width: 222,
                height: 222,
                fill: Konva.Util.getRandomColor(),
                draggable: true,
                name: 'object'
            })
        );
        layer.draw();
    }
    createStatus = false;
    document.getElementById("top-menu").classList.remove("selected");
});

// were can we snap our objects?
function getLineGuideStops(skipShape) {
    // we can snap to stage borders and the center of the stage
    let vertical = [0, stage.width() / 2, stage.width()];
    let horizontal = [0, stage.height() / 2, stage.height()];

    // and we snap over edges and center of each object on the canvas
    stage.find('.object').forEach(guideItem => {
        if (guideItem === skipShape) {
            return;
        }
        let box = guideItem.getClientRect();
        // and we can snap to all edges of shapes
        vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
        horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
    });
    return {
        vertical: vertical.flat(),
        horizontal: horizontal.flat()
    };
}

// what points of the object will trigger to snapping?
// it can be just center of the object
// but we will enable all edges and center
function getObjectSnappingEdges(node) {
    let box = node.getClientRect();
    return {
        vertical: [
            {
                guide: Math.round(box.x),
                offset: Math.round(node.x() - box.x),
                snap: 'start'
            },
            {
                guide: Math.round(box.x + box.width / 2),
                offset: Math.round(node.x() - box.x - box.width / 2),
                snap: 'center'
            },
            {
                guide: Math.round(box.x + box.width),
                offset: Math.round(node.x() - box.x - box.width),
                snap: 'end'
            }
        ],
        horizontal: [
            {
                guide: Math.round(box.y),
                offset: Math.round(node.y() - box.y),
                snap: 'start'
            },
            {
                guide: Math.round(box.y + box.height / 2),
                offset: Math.round(node.y() - box.y - box.height / 2),
                snap: 'center'
            },
            {
                guide: Math.round(box.y + box.height),
                offset: Math.round(node.y() - box.y - box.height),
                snap: 'end'
            }
        ]
    };
}

// find all snapping possibilities
function getGuides(lineGuideStops, itemBounds) {
    let resultV = [];
    let resultH = [];

    lineGuideStops.vertical.forEach(lineGuide => {
        itemBounds.vertical.forEach(itemBound => {
            let diff = Math.abs(lineGuide - itemBound.guide);
            // if the distance between guild line and object snap point is close we can consider this for snapping
            if (diff < GUIDELINE_OFFSET) {
                resultV.push({
                    lineGuide: lineGuide,
                    diff: diff,
                    snap: itemBound.snap,
                    offset: itemBound.offset
                });
            }
        });
    });

    lineGuideStops.horizontal.forEach(lineGuide => {
        itemBounds.horizontal.forEach(itemBound => {
            let diff = Math.abs(lineGuide - itemBound.guide);
            if (diff < GUIDELINE_OFFSET) {
                resultH.push({
                    lineGuide: lineGuide,
                    diff: diff,
                    snap: itemBound.snap,
                    offset: itemBound.offset
                });
            }
        });
    });

    let guides = [];

    // find closest snap
    let minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    let minH = resultH.sort((a, b) => a.diff - b.diff)[0];
    if (minV) {
        guides.push({
            lineGuide: minV.lineGuide,
            offset: minV.offset,
            orientation: 'V',
            snap: minV.snap
        });
    }
    if (minH) {
        guides.push({
            lineGuide: minH.lineGuide,
            offset: minH.offset,
            orientation: 'H',
            snap: minH.snap
        });
    }
    return guides;
}

function drawGuides(guides) {
    guides.forEach(lg => {
        if (lg.orientation === 'H') {
            let line = new Konva.Line({
                points: [-6000, lg.lineGuide, 6000, lg.lineGuide],
                stroke: 'rgb(0, 161, 255)',
                strokeWidth: 1,
                name: 'guid-line',
                dash: [4, 6]
            });
            layer.add(line);
            layer.batchDraw();
        } else if (lg.orientation === 'V') {
            let line = new Konva.Line({
                points: [lg.lineGuide, -6000, lg.lineGuide, 6000],
                stroke: 'rgb(0, 161, 255)',
                strokeWidth: 1,
                name: 'guid-line',
                dash: [4, 6]
            });
            layer.add(line);
            layer.batchDraw();
        }
    });
}

layer.on('dragmove', function(e) {
    // clear all previous lines on the screen
    layer.find('.guid-line').destroy();

    // find possible snapping lines
    let lineGuideStops = getLineGuideStops(e.target);
    // find snapping points of current object
    let itemBounds = getObjectSnappingEdges(e.target);

    // now find where can we snap current object
    let guides = getGuides(lineGuideStops, itemBounds);

    // do nothing of no snapping
    if (!guides.length) {
        return;
    }

    drawGuides(guides);

    // now force object position
    guides.forEach(lg => {
        switch (lg.snap) {
            case 'start': {
                switch (lg.orientation) {
                    case 'V': {
                        e.target.x(lg.lineGuide + lg.offset);
                        break;
                    }
                    case 'H': {
                        e.target.y(lg.lineGuide + lg.offset);
                        break;
                    }
                }
                break;
            }
            case 'center': {
                switch (lg.orientation) {
                    case 'V': {
                        e.target.x(lg.lineGuide + lg.offset);
                        break;
                    }
                    case 'H': {
                        e.target.y(lg.lineGuide + lg.offset);
                        break;
                    }
                }
                break;
            }
            case 'end': {
                switch (lg.orientation) {
                    case 'V': {
                        e.target.x(lg.lineGuide + lg.offset);
                        break;
                    }
                    case 'H': {
                        e.target.y(lg.lineGuide + lg.offset);
                        break;
                    }
                }
                break;
            }
        }
    });
});

layer.on('dragend', function(e) {
    // clear all previous lines on the screen
    layer.find('.guid-line').destroy();
    layer.batchDraw();
});

layer.draw();