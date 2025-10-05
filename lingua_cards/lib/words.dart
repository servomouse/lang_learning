import 'package:flutter/material.dart';

List<String> _langs = ["en", "sp"];

String _selectedLanguage = "en";

Map<String, dynamic> _dictionary = {
  "en": {
    "sentences": [
      {
        "sentence": ["I", "eating an apple"],
        "hint": "to be",
        "answer": "am"
      }
    ]
  }
};

Row wordsGetTask() {
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

List<String> wordsGetLangs() {
  return _langs;
}

void wordsSetLang(String lang) {
  _selectedLanguage = lang;
}

String wordsGetLang() {
  return _selectedLanguage;
}