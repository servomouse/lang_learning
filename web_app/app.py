from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

# Load dictionary data from JSON file
def load_dictionary():
    try:
        with open('dict.json', 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print("Dictionary file not found.")
        return {}
    except json.JSONDecodeError:
        print("Error decoding JSON.")
        return {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_dictionary')
def get_dictionary():
    pair = request.args.get('pair', '')
    if not pair:
        return jsonify([])
    
    source_lang, target_lang = pair.split('-')
    dictionary = load_dictionary()
    
    # Filter and format the dictionary data based on the language pair
    result = []
    
    # Process each word in the source language
    for word, word_data in dictionary.get(source_lang, {}).get('words', {}).items():
        for example in word_data.get('examples', []):
            # Check if translation exists for the target language
            if target_lang in example.get('translations', {}):
                result.append({
                    'word': word,
                    'examples': [{
                        'example': {
                            'sentence': example['example']['sentence'],
                            'word': example['example']['word']
                        },
                        'translations': {
                            source_lang: word,
                            target_lang: example['translations'][target_lang]
                        }
                    }]
                })
    
    # Also process words in the target language that have translations in the source language
    for word, word_data in dictionary.get(target_lang, {}).get('words', {}).items():
        for example in word_data.get('examples', []):
            # Check if translation exists for the source language
            if source_lang in example.get('translations', {}):
                result.append({
                    'word': word,
                    'examples': [{
                        'example': {
                            'sentence': example['example']['sentence'],
                            'word': example['example']['word']
                        },
                        'translations': {
                            target_lang: word,
                            source_lang: example['translations'][source_lang]
                        }
                    }]
                })
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)