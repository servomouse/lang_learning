from flask import Flask, jsonify, send_from_directory, request
import json

DICTIONARY_FILE = 'new_dict.json'

class LangDictionary:
    def __init__(self):
        with open(DICTIONARY_FILE, 'r', encoding='utf-8') as file:
            self.dictionary = json.load(file)
    
    def get_dictionary(self):
        return self.dictionary
    
    def add_item(self, new_item):
        pass

    def update_item(self, item):
        pass

    def save_dictionary(self):
        with open(DICTIONARY_FILE, 'w', encoding='utf-8') as file:
            json.dump(self.dictionary, file, ensure_ascii=False, indent=4)

app = Flask(__name__)
dict = LangDictionary()

@app.route('/api/dictionary', methods=['GET'])
def get_dictionary():
    dictionary = dict.get_dictionary()
    return jsonify(dictionary)

@app.route('/api/update_score', methods=['POST'])
def update_score():
    data = request.json
    # language = data.get('language')
    # word = data.get('word')
    # is_correct = data.get('is_correct')
    print(f"Received data: {data}")

@app.route('/')
def serve_index():
    return send_from_directory('', 'new_index.html')

if __name__ == '__main__':
    app.run(debug=True)