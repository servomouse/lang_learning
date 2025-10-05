import 'package:flutter/material.dart';

String _sentencesSelectedLanguage = 'EN-SP';

List<String> _sentencesLangPairs = ['EN-SP', 'EN-RU', 'SP-RU'];

int _sentencesDirection = 0;

Map<String, dynamic> _sentencesDictionary = {
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
  List<String> temp = _sentencesSelectedLanguage.toLowerCase().split('-');
  if (_sentencesDirection == 0) {
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
  return _sentencesLangPairs;
}

void sentencesSetLang(String lang) {
  _sentencesSelectedLanguage = lang;
}

String sentencesGetLang() {
  return _sentencesSelectedLanguage;
}
