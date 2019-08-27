stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

layer = new Konva.Layer();
stage.add(layer);

// function to generate a list of "targets" (circles)
function generateTargets() {
    let number = 10;
    let result = [];
    while (result.length < number) {
        result.push({
            id: 'target-' + result.length,
            x: stage.width() * Math.random(),
            y: stage.height() * Math.random()
        });
    }
    return result;
}

targets = generateTargets();

// function to generate arrows between targets
function generateConnectors() {
    let number = 10;
    let result = [];
    while (result.length < number) {
        let from = 'target-' + Math.floor(Math.random() * targets.length);
        let to = 'target-' + Math.floor(Math.random() * targets.length);
        if (from === to) {
            continue;
        }
        result.push({
            id: 'connector-' + result.length,
            from: from,
            to: to
        });
    }
    return result;
}

function getConnectorPoints(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    let angle = Math.atan2(-dy, dx);

    const radius = 50;

    return [
        from.x + -radius * Math.cos(angle + Math.PI),
        from.y + radius * Math.sin(angle + Math.PI),
        to.x + -radius * Math.cos(angle),
        to.y + radius * Math.sin(angle)
    ];
}

connectors = generateConnectors();

// update all objects on the canvas from the state of the app
function updateObjects() {
    targets.forEach(target => {
        let node = layer.findOne('#' + target.id);
        node.x(target.x);
        node.y(target.y);
    });
    connectors.forEach(connect => {
        let line = layer.findOne('#' + connect.id);
        let fromNode = layer.findOne('#' + connect.from);
        let toNode = layer.findOne('#' + connect.to);

        const points = getConnectorPoints(
            fromNode.position(),
            toNode.position()
        );
        line.points(points);
    });
    layer.batchDraw();
}

// generate nodes for the app
connectors.forEach(connect => {
    let line = new Konva.Arrow({
        stroke: 'black',
        id: connect.id,
        fill: 'black'
    });
    layer.add(line);
});

targets.forEach(target => {
    let node = new Konva.Circle({
        id: target.id,
        fill: Konva.Util.getRandomColor(),
        radius: 20 + Math.random() * 20,
        shadowBlur: 10,
        draggable: true
    });
    layer.add(node);

    node.on('dragmove', () => {
        // mutate the state
        target.x = node.x();
        target.y = node.y();

        // update nodes from the new state
        updateObjects();
    });
});

updateObjects();
layer.draw();