from flask import Flask, jsonify, request, send_from_directory
import os

app = Flask(__name__, static_folder='.')

# Route to serve the main HTML page
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Route to serve static assets (CSS, JS)
@app.route('/<path:path>')
def send_static(path):
    return send_from_directory('.', path)

# The POST endpoint for content requests
@app.route('/get-content', methods=['POST'])
def get_content():
    data = request.get_json()
    
    # Debug print incoming payload as requested
    print("\n--- Incoming Backend Request Data ---")
    print(f"answer:          {data.get('answer')}")
    print(f"menu1_val:       {data.get('menu1_val')}")
    print(f"menu2_val:       {data.get('menu2_val')}")
    print(f"process_answer:  {data.get('process_answer')}")
    print("-------------------------------------\n")
    
    # Simulated database/processing response structure
    response_data = {
        "text": "This is a simple text field. If the text becomes exceptionally long, it will safely wrap down to the next line without breaking our beautifully centered layout framework.",
        "highlight": "exceptionally",
        "expected_answer": "exceptionally"
    }
    
    return jsonify(response_data)

if __name__ == '__main__':
    # Run the server locally
    app.run(debug=True, host='0.0.0.0', port=5000)