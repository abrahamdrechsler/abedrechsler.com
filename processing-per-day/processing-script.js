document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("image-grid");

    // Manually set how many posts are available
    const availableDays = 1;  // Adjust this number as you create new posts
    const totalTiles = 20;    // Always show 20 tiles

    for (let day = 1; day <= totalTiles; day++) {
        const tile = document.createElement("div");
        tile.className = "grid-item";

        if (day <= availableDays) {
            const imagePath = `images/day-${day}.jpg`;
            const postPath = `posts/day-${day}.html`;

            tile.innerHTML = `
                <a href="${postPath}">
                    <img src="${imagePath}" alt="Day ${day}">
                </a>
            `;
        } else {
            // Show a placeholder tile with the day number
            tile.innerHTML = `
                <div class="placeholder">
                    <span>${day}</span>
                </div>
            `;
        }

        grid.appendChild(tile);
    }
});
