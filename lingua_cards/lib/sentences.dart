import 'package:flutter/material.dart';

String _selectedLanguage = 'EN-SP';

List<String> _langPairs = ['EN-SP', 'EN-RU', 'SP-RU'];

int _direction = 0;

Map<String, dynamic> _dictionary = {
  "en": {
    "words": {
      "breakfast": {
        "conjugations": [],
        "forms": [],
        "definitions": [
          {
            "definition": "A meal eaten in the morning as the first meal of the day",
            "example": {
              "sentence": "She enjoyed a big breakfast before heading out to work",
              "word": "breakfast"
            },
            "translations": {
              "ru": {
                "value": "завтрак",
                "counter": 0
              },
              "sp": {
                "value": "el desayuno",
                "counter": 0
              }
            }
          }
        ]
      }
    }
  }
};

List<String> _getCurrentLang() {
  List<String> temp = _selectedLanguage.toLowerCase().split('-');
  if (_direction == 0) {
    return [temp[0], temp[1]];
  }
  return [temp[1], temp[0]];
}

Row sentencesGetTask() {
  return Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Text(
        'I ',
        style: TextStyle(fontSize: 24),
      ),
      SizedBox(
        width: 100,
        child: TextField(
          // controller: _controller,
          textAlign: TextAlign.center,
          decoration: InputDecoration(
            border: OutlineInputBorder(),
            hintText: '(to be)',
          ),
        ),
      ),
      Text(
        ' eating an apple.',
        style: TextStyle(fontSize: 24),
      ),
    ],
  );
}

List<String> sentencesGetLangs() {
  return _langPairs;
}

void sentencesSetLang(String lang) {
  _selectedLanguage = lang;
}

String sentencesGetLang() {
  return _selectedLanguage;
}
