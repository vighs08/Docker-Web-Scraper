
from flask import Flask, jsonify
import json

app = Flask(__name__)

# JSON file containing scraped website information
DATA_FILE = "scraped_data.json"


@app.route("/")
def home():
    try:
        # Open and read the JSON file
        with open(DATA_FILE, "r", encoding="utf-8") as file:
            scraped_data = json.load(file)

        # Return scraped information as JSON
        return jsonify(scraped_data)

    except FileNotFoundError:
        return jsonify({
            "error": "Scraped data file not found"
        }), 404

    except json.JSONDecodeError:
        return jsonify({
            "error": "Invalid JSON data"
        }), 500


# Health check endpoint
@app.route("/health")
def health():
    return jsonify({
        "status": "running",
        "message": "Flask server is working"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
