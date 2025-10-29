import 'package:flutter/material.dart';
import 'dart:math';

List<String> _langs = ["en", "sp"];

String _selectedLanguage = "en";

String _correctAnswer = "";

Map<String, dynamic> _dictionary = {
  "en": {
    "sentences": [
      {
        "sentence": "I ___ eating an apple.",
        "hint": "to be",
        "time": "present simple",
        "answer": "am"
      },
      {
        "sentence": "She ___ eating an apple.",
        "hint": "to be",
        "time": "present simple",
        "answer": "is"
      }
    ]
  },
  "sp": {
    "sentences": [
      {
        "sentence": "___ comiendo una manzana.",
        "hint": "(estar, yo)",
        "answer": "estoy"
      }
    ]
  }
};

Row conjugationsGetTask(TextEditingController text_controller, String? lang) {
  int idx = Random().nextInt(_dictionary[_selectedLanguage]["sentences"].length);
  _correctAnswer = _dictionary[_selectedLanguage]["sentences"][idx]["answer"];
  List<String> text = _dictionary[_selectedLanguage]["sentences"][idx]["sentence"].split('___');
  return Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Text(
        text[0],
        style: TextStyle(fontSize: 24),
      ),
      SizedBox(
        width: 100,
        child: TextField(
          controller: text_controller,
          textAlign: TextAlign.center,
          decoration: InputDecoration(
            border: OutlineInputBorder(),
            hintText: _dictionary[_selectedLanguage]["sentences"][idx]["hint"],
          ),
        ),
      ),
      Text(
        '${text[1]} [${_dictionary[_selectedLanguage]["sentences"][idx]["time"]}]',
        style: TextStyle(fontSize: 24),
      ),
    ],
  );
}

List<String> conjugationsGetLangs() {
  return _langs;
}

void conjugationsSetLang(String lang) {
  _selectedLanguage = lang;
}

String conjugationsGetLang() {
  return _selectedLanguage;
}

String conjugationsGetAnswer() {
  return _correctAnswer;
}