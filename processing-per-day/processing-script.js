document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("image-grid");
    const availableDays = 3;  // Number of posted days with images
    const totalDays = 20;     // Total number of days

    // Example data for posted days (titles and dates)
    const postDetails = {
        1: { title: "Day 1 - Signal Flags", date: "January 1, 2025" },
        2: { title: "Day 2 - Color Study", date: "January 2, 2025" },
        3: { title: "Day 3 - Geometric Flow", date: "January 3, 2025" }
    };

    for (let day = 1; day <= totalDays; day++) {
        const tile = document.createElement("div");
        tile.className = "grid-item";

        if (day <= availableDays) {
            const imagePath = `images/day-${day}.jpg`;
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
