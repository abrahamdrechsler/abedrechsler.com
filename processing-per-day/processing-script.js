document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("image-grid");
    const availableDays = 4;  // Number of posted days with images
    const totalDays = 20;     // Total number of days

    // Example data for posted days (titles and dates)
    const postDetails = {
        1: { title: "Day 1 - Test", date: "January 19, 2025" },
        2: { title: "Day 2 - Fractals", date: "January 20, 2025" },
        3: { title: "Day 3 - Tracker", date: "January 21, 2025" },
        4: { title: "Day 4 - Squiggles", date: "January 24, 2025" }
    };

    for (let day = 1; day <= totalDays; day++) {
        const tile = document.createElement("div");
        tile.className = "grid-item";

        if (day <= availableDays) {
            const imagePath = `images/day-${day}.png`;
            const postPath = `posts/day-${day}.html`;
            const title = postDetails[day].title;
            const date = postDetails[day].date;

            tile.innerHTML = `
                <a href="${postPath}">
                    <div class="image-container">
                        <img src="${imagePath}" alt="${title}">
                    </div>
                </a>
                <div class="tile-text">
                    <p class="tile-title">${title}</p>
                    <p class="tile-date">${date}</p>
                </div>
            `;
        } else {
            // Render placeholder without text
            tile.innerHTML = `
                <div class="placeholder">
                    <span>${day}</span>
                </div>
            `;
        }

        grid.appendChild(tile);
    }
});
