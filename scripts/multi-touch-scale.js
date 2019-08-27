lastDist = 0;
startScale = 1;
activeShape = null;

function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
    draggable: true,
    x: width / 2,
    y: height / 2,
    offset: {
        x: width / 2,
        y: height / 2
    }
});

layer = new Konva.Layer();

triangle = new Konva.RegularPolygon({
    x: 290,
    y: stage.height() / 2,
    sides: 3,
    radius: 180,
    fill: '#9fcd00',
    draggable: true,
    name: 'triangle'
});

circle = new Konva.Circle({
    x: 680,
    y: stage.height() / 2,
    radius: 140,
    fill: 'lightcoral',
    draggable: true,
    name: 'circle'
});

stage.on('tap', function(evt) {
    // set active shape
    let shape = evt.target;
    activeShape =
        activeShape && activeShape.getName() === shape.getName()
            ? null
            : shape;

    // sync scene graph
    triangle.setAttrs({
        fill:
            activeShape && activeShape.getName() === triangle.getName()
                ? '#78E7FF'
                : 'green',
        stroke:
            activeShape && activeShape.getName() === triangle.getName()
                ? 'blue'
                : 'black'
    });

    circle.setAttrs({
        fill:
            activeShape && activeShape.getName() === circle.getName()
                ? '#78E7FF'
                : 'red',
        stroke:
            activeShape && activeShape.getName() === circle.getName()
                ? 'blue'
                : 'black'
    });

    layer.draw();
});

stage.getContent().addEventListener(
    'touchmove',
    function(evt) {
        let touch1 = evt.touches[0];
        let touch2 = evt.touches[1];

        if (touch1 && touch2 && activeShape) {
            let dist = getDistance(
                {
                    x: touch1.clientX,
                    y: touch1.clientY
                },
                {
                    x: touch2.clientX,
                    y: touch2.clientY
                }
            );

            if (!lastDist) {
                lastDist = dist;
            }

            let scale = (activeShape.scaleX() * dist) / lastDist;

            activeShape.scaleX(scale);
            activeShape.scaleY(scale);
            layer.draw();
            lastDist = dist;
        }
    },
    false
);

stage.getContent().addEventListener(
    'touchend',
    function() {
        lastDist = 0;
    },
    false
);

layer.add(triangle);
layer.add(circle);
stage.add(layer);