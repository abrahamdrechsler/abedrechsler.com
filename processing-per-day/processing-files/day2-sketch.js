function setup() {
    createCanvas(2000, 800);
    background(255);
    noLoop();

    let numTrees = 100;  // Number of fractal trees
    let baseY = height * 0.8;  // Approximate horizontal baseline for trees

    let currentX = 50;  // Starting position for first tree

    for (let i = 0; i < numTrees; i++) {
        let xPos = currentX + random(20, 100);  // Random spacing between trees
        let yOffset = random(-20, 20);  // Add undulation to the base y position
        let baseSize = random(120, 150);  // Randomize initial trunk length
        let branches = 3 + floor(random(-1, 2));  // Slight variation in branches
        let depth = 4 + floor(random(-1, 2));  // Slight variation in recursion depth

        drawFractalTree(xPos, baseY + yOffset, baseSize, -PI / 2, depth, branches, 5, color(80, 60, 40), color(255, 204, 0));

        currentX = xPos;  // Update currentX for next tree position
        if (currentX > width - 50) break;  // Stop if it goes beyond the canvas width
    }
}

function drawFractalTree(x, y, len, angle, depth, branches, weight, startColor, endColor) {
    if (depth === 0) {
        return;
    }

    // Calculate the interpolated color between start and end based on depth
    let interColor = lerpColor(startColor, endColor, map(depth, 4, 0, 0, 1));

    // Set stroke color and dynamic weight
    stroke(interColor);
    strokeWeight(weight);

    let endX = x + 10 + cos(angle) * len;
    let endY = y  + sin(angle) * len;

    line(x, y, endX, endY);

    let newBranches = branches + floor(random(-1, 2)); // Slight randomization in branching

    for (let i = 0; i < newBranches; i++) {
        // Narrowing branch angles to between -30 and 30 degrees
        let newAngle = angle + map(i, 0, newBranches - 1, radians(-10), radians(35));
        let newLen = len * random(0.5, 0.8); // Randomize length reduction
        let newWeight = max(weight * 0.7, 0.5);  // Reduce line weight gradually

        drawFractalTree(endX, endY, newLen, newAngle, depth - 1, branches, newWeight, startColor, endColor);
    }
}
