async function updateStatus() {
    try {
        const response = await fetch('api/status');
        const data = await response.json();

        document.getElementById("distance").textContent =
            Number(data.distance).toFixed(1);

        const statusElement = document.getElementById("status");
        statusElement.textContent = data.status;
        statusElement.className = "";
        statusElement.classList.add("status-" + data.status.toLowerCase());

        document.getElementById("dangerEvents").textContent = data.danger_events;
        document.getElementById("intrusionDuration").textContent = data.intrusion_duration;

        document.getElementById("connection").textContent = "CONNECTED";

        updateGauge(Number(data.distance));
    } catch (error) {
        document.getElementById("connection").textContent = "DISCONNECTED";
    }
}

function updateGauge(distance) {
    let percentage = 100 - ((distance / 100) * 100);

    if (percentage < 0) {
        percentage = 0;
    }

    if (percentage > 100) {
        percentage = 100;
    }

    document.getElementById("gaugeFill").style.width = percentage + "%";
}

async function updateHistory() {
    try {
        const response = await fetch("/api/history");
        const data = await response.json();

        const table = document.getElementById("historyBody");
        table.innerHTML = "";

        data
            .slice()
            .reverse()
            .forEach(item => {
                const row = document.createElement("tr");
                const statusClass = "status-" + String(item.status).toLowerCase();

                row.innerHTML = `
                    <td>${item.timestamp}</td>
                    <td>${Number(item.distance).toFixed(1)} cm</td>
                    <td><span class="status-pill ${statusClass}">${item.status}</span></td>
                    <td>${item.danger_events}</td>
                    <td>${item.intrusion_duration} sec</td>
                `;

                table.appendChild(row);
            });
    } catch (error) {
        console.error("History error:", error);
    }
}

setInterval(updateStatus, 1000);
setInterval(updateHistory, 2000);

updateStatus();
updateHistory();
