from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate_story():
    data = request.json
    initial_paragraph = data.get('paragraph')
    character = data.get('character')
    event = data.get('event')
    place = data.get('place')

    # We'll feed this data to our model to generate the story. Below is just a placeholder
    story = f"Once upon a time in {place}, there was a {character} who {event}. {initial_paragraph}"
    
    return jsonify({'story': story})

if __name__ == '__main__':
    app.run(debug=True)
