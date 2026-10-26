from flask import Flask, request, jsonify, render_template
from datetime import datetime
from collections import deque

app = Flask(__name__)

latest_data = {
    "distance": 0,
    "status": "WAITING",
    "danger_events": 0,
    "intrusion_duration": 0,
    "stable_count": 0,
    "timestamp": None
}

history = deque(maxlen=100)
@app.route("/")
def dashboard():
    return render_template("index.html")


@app.route("/api/update", methods=["POST"])
def update_data():

    global latest_data

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received"
        }), 400

    required_fields = [
        "distance",
        "status",
        "danger_events",
        "intrusion_duration"
    ]

    for field in required_fields:

        if field not in data:
            return jsonify({
                "success": False,
                "message": f"Missing field: {field}"
            }), 400

    timestamp = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    latest_data = {
        "distance": data["distance"],
        "status": data["status"],
        "danger_events": data["danger_events"],
        "intrusion_duration": data["intrusion_duration"],
        "stable_count": data.get("stable_count", 0),
        "timestamp": timestamp
    }

    history.append(latest_data.copy())

    return jsonify({
        "success": True,
        "message": "Data received"
    })


@app.route("/api/status", methods=["GET"])
def get_status():
    return jsonify(latest_data)


@app.route("/api/history", methods=["GET"])
def get_history():
    return jsonify(list(history))


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )