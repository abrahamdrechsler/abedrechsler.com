function setup() {
    createCanvas(800, 800);
    noLoop();
}

function draw() {
    background(255);
    let colors = ['#FF5C4D', '#FF9636', '#FF5C4D', '#FF9636', '#FF5C4D'];
    let bandWidth = 40;  // Increased band width
    let numBands = Math.ceil(width / bandWidth) - 12;

    strokeCap(SQUARE);

    for (let i = 0; i < numBands; i++) {
        let xOffset = i * bandWidth * 1.7;
        let colorIndex = i % colors.length;
        stroke(colors[colorIndex]);

        // Increase stroke weight with noise variation
        let dynamicWeight = bandWidth * (0.8 + noise(i * 0.1) * 0.8);
        strokeWeight(dynamicWeight); 

        noFill();
        beginShape();
        let x = xOffset;

        // Make squiggles increase progressively from left to right
        let squiggleFactor = map(i, 0, numBands - 1, 0.1, 2.0);
        
        for (let y = i * 2 * i * 2; y <= height; y += 90) {
            let xNoise = noise(y * 0.01, i * 0.05) * 50 * squiggleFactor;
            curveVertex(x + xNoise, y);
        }
        endShape();
    }
}
