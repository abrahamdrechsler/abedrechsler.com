let cols, rows;
let cellSize;
let overlapFactor = 0.2;  // Controls overlap between shapes
let minSize = 0.7;        // Minimum size scaling factor
let maxSize = 1.3;        // Maximum size scaling factor
let beerColor;

function setup() {
    createCanvas(800, 800);
    background(255);
    stroke(0);
    noFill();
    beerColor = color(255, 204, 0); // Beer-like yellow color

    cols = 8;  // Number of columns
    rows = 8;  // Number of rows
    cellSize = width / cols;

    drawMatrix();
}

function drawMatrix() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * cellSize + cellSize / 2 + random(-cellSize * overlapFactor, cellSize * overlapFactor);
            let y = j * cellSize + cellSize / 2 + random(-cellSize * overlapFactor, cellSize * overlapFactor);
            let sizeFactor = random(minSize, maxSize);

            drawGlassShape(x, y, cellSize * sizeFactor);
        }
    }
}

function drawGlassShape(x, y, size) {
    let topWidth = size * 0.6;      // Top opening of the glass
    let bottomWidth = size * 0.4;   // Bottom base width
    let height = size * 0.8;        // Height of the glass

    let inflectionFactor = random(-height * 0.2, height * 0.2);  // Random inflection variation

    // Determine fill height (partial fill between 30% to 50% of glass height)
    let fillHeight = height * random(0.3, 0.5);

    // Draw the beer fill inside the glass
    noStroke();
    fill(beerColor);
    beginShape();
    vertex(x - bottomWidth / 2, y + height / 2);
    bezierVertex(
        x - bottomWidth / 2, y + height / 3,
        x - topWidth / 2, y - height / 2 + fillHeight / 2,
        x - topWidth / 2, y - height / 2 + fillHeight
    );
    vertex(x + topWidth / 2, y - height / 2 + fillHeight);
    bezierVertex(
        x + topWidth / 2, y - height / 2 + fillHeight / 2,
        x + bottomWidth / 2, y + height / 3,
        x + bottomWidth / 2, y + height / 2
    );
    endShape(CLOSE);

    // Draw the glass outline
    noFill();
    stroke(0);
    beginShape();
    vertex(x - topWidth / 2, y - height / 2);
    bezierVertex(
        x - topWidth / 2, y,
        x - bottomWidth / 2, y + height / 3,
        x - bottomWidth / 2, y + height / 2 - inflectionFactor
    );

    bezierVertex(
        x - bottomWidth / 2, y + height / 2,
        x + bottomWidth / 2, y + height / 2,
        x + bottomWidth / 2, y + height / 2 - inflectionFactor
    );

    bezierVertex(
        x + bottomWidth / 2, y + height / 3,
        x + topWidth / 2, y,
        x + topWidth / 2, y - height / 2
    );
    endShape();
}
